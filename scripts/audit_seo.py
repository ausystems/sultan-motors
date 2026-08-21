#!/usr/bin/env python3
"""On-page SEO audit of the prerendered build.

Checks every file in dist/ against the on-page checklist: title and description
length, exactly one H1, heading order, canonical correctness, Open Graph
completeness, JSON-LD validity, image alt coverage, and internal link targets.

Exits non-zero if any check fails, so it can gate a deploy.

Run with: python3 scripts/audit_seo.py
"""

from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"

TITLE_MAX = 60
TITLE_MIN = 25
DESC_MAX = 160
DESC_MIN = 110

failures: list[str] = []
warnings: list[str] = []

# Preview and branch deploys ship noindex site-wide on purpose (see
# resolveNoindex in vite.config.ts). Detected from the built homepage so the
# audit does not report the intended state as a failure.
SITE_WIDE_NOINDEX = (
    (DIST / "index.html").exists()
    and 'name="robots" content="noindex' in (DIST / "index.html").read_text(encoding="utf-8")
)


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title = ""
        self._in_title = False
        self.metas: list[dict[str, str]] = []
        self.links: list[dict[str, str]] = []
        self.landmarks: list[str] = []
        self.main_id = ""
        self.labels: list[dict[str, str]] = []
        self.controls: list[dict[str, str]] = []
        self.forms = 0
        self._in_head = True
        self.head_links: list[dict[str, str]] = []
        self.body_links: list[dict[str, str]] = []
        self.headings: list[tuple[str, str]] = []
        self._heading: str | None = None
        self._heading_text: list[str] = []
        self.images: list[dict[str, str]] = []
        self.anchors: list[dict[str, str]] = []
        self.jsonld: list[str] = []
        self._in_jsonld = False
        self._jsonld_buf: list[str] = []
        self.lang = ""
        self.iframes: list[dict[str, str]] = []

    def handle_starttag(self, tag, attrs):
        a = {k: (v or "") for k, v in attrs}
        if tag == "html":
            self.lang = a.get("lang", "")
        elif tag == "title":
            self._in_title = True
        elif tag == "meta":
            self.metas.append(a)
        elif tag == "link":
            self.links.append(a)
            (self.head_links if self._in_head else self.body_links).append(a)
        elif tag == "body":
            self._in_head = False
        elif tag in ("main", "nav", "header", "footer"):
            self.landmarks.append(tag)
            if tag == "main" and a.get("id"):
                self.main_id = a["id"]
        elif tag == "form":
            self.forms += 1
        elif tag == "label":
            self.labels.append(a)
        elif tag in ("input", "textarea", "select"):
            if a.get("type") not in ("hidden", "submit", "button", "image"):
                self.controls.append({**a, "_tag": tag})
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._heading = tag
            self._heading_text = []
        elif tag == "img":
            self.images.append(a)
        elif tag == "a":
            self.anchors.append(a)
        elif tag == "iframe":
            self.iframes.append(a)
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in_jsonld = True
            self._jsonld_buf = []

    def handle_endtag(self, tag):
        if tag == "head":
            self._in_head = False
        if tag == "title":
            self._in_title = False
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6") and self._heading == tag:
            self.headings.append((tag, " ".join("".join(self._heading_text).split())))
            self._heading = None
        elif tag == "script" and self._in_jsonld:
            self.jsonld.append("".join(self._jsonld_buf))
            self._in_jsonld = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._heading is not None:
            self._heading_text.append(data)
        if self._in_jsonld:
            self._jsonld_buf.append(data)

    def meta(self, key: str) -> str | None:
        for m in self.metas:
            if m.get("name") == key or m.get("property") == key:
                return m.get("content", "")
        return None

    def meta_count(self, key: str) -> int:
        return sum(1 for m in self.metas if m.get("name") == key or m.get("property") == key)

    def link_href(self, rel: str) -> str | None:
        for link in self.links:
            if link.get("rel") == rel:
                return link.get("href")
        return None


def fail(page: str, message: str) -> None:
    failures.append(f"{page}: {message}")


def warn(page: str, message: str) -> None:
    warnings.append(f"{page}: {message}")


def route_for(path: Path) -> str:
    rel = path.relative_to(DIST)
    if rel.name != "index.html":
        return "/" + str(rel)
    parent = str(rel.parent)
    return "/" if parent == "." else "/" + parent


def audit_page(path: Path, known_routes: set[str], origin: str) -> None:
    route = route_for(path)
    page = PageParser()
    page.feed(path.read_text(encoding="utf-8"))

    is_404 = route in ("/404", "/404.html")
    robots = page.meta("robots") or ""

    # --- lang -------------------------------------------------------------
    if not page.lang:
        fail(route, "<html> has no lang attribute")

    # --- title ------------------------------------------------------------
    title = page.title.strip()
    if not title:
        fail(route, "missing <title>")
    elif len(title) > TITLE_MAX:
        fail(route, f"title is {len(title)} chars, over {TITLE_MAX} (will truncate in SERPs)")
    elif len(title) < TITLE_MIN:
        warn(route, f"title is only {len(title)} chars")

    # --- description ------------------------------------------------------
    desc = (page.meta("description") or "").strip()
    if not desc:
        fail(route, "missing meta description")
    elif len(desc) > DESC_MAX:
        fail(route, f"description is {len(desc)} chars, over {DESC_MAX}")
    elif len(desc) < DESC_MIN:
        warn(route, f"description is only {len(desc)} chars")

    if page.meta_count("description") > 1:
        fail(route, "duplicate meta description")

    # --- robots -----------------------------------------------------------
    if is_404 and "noindex" not in robots:
        fail(route, "404 page is indexable")
    if not is_404 and "noindex" in robots and not SITE_WIDE_NOINDEX:
        fail(route, "indexable page is marked noindex")

    # --- H1 ---------------------------------------------------------------
    h1s = [text for tag, text in page.headings if tag == "h1"]
    if len(h1s) == 0:
        fail(route, "no H1")
    elif len(h1s) > 1:
        fail(route, f"{len(h1s)} H1s: {h1s}")
    else:
        h1 = h1s[0]
        if not h1.strip():
            fail(route, "H1 is empty")
        # A heading whose words were concatenated (no spaces) reads as one
        # nonsense token to a crawler. Catch any run of 25+ letters.
        if re.search(r"[A-Za-z]{25,}", h1):
            fail(route, f"H1 has no word breaks: {h1[:70]!r}")

    # --- heading order ----------------------------------------------------
    prev = 0
    for tag, text in page.headings:
        level = int(tag[1])
        if prev and level > prev + 1:
            fail(route, f"heading jumps H{prev} -> H{level} at {text[:45]!r}")
        prev = level
        if not text.strip():
            fail(route, f"empty {tag.upper()}")

    # --- canonical --------------------------------------------------------
    canonical = page.link_href("canonical")
    if not canonical:
        fail(route, "missing canonical")
    else:
        if not canonical.startswith("https://"):
            fail(route, f"canonical is not absolute https: {canonical}")
        if urlparse(canonical).netloc != urlparse(origin).netloc:
            fail(route, f"canonical points off-domain: {canonical}")
        expected = origin + ("/" if route == "/" else route)
        if not is_404 and canonical != expected:
            fail(route, f"canonical {canonical} != expected {expected}")
        if sum(1 for link in page.links if link.get("rel") == "canonical") > 1:
            fail(route, "multiple canonical tags")

    # --- Open Graph / Twitter --------------------------------------------
    for key in (
        "og:title",
        "og:description",
        "og:url",
        "og:image",
        "og:type",
        "og:site_name",
        "og:locale",
        "twitter:card",
        "twitter:title",
        "twitter:description",
        "twitter:image",
    ):
        if not page.meta(key):
            fail(route, f"missing {key}")
        if page.meta_count(key) > 1:
            fail(route, f"duplicate {key}")

    og_url = page.meta("og:url")
    if og_url and canonical and og_url != canonical:
        fail(route, f"og:url {og_url} != canonical {canonical}")
    og_image = page.meta("og:image") or ""
    if og_image and not og_image.startswith("https://"):
        fail(route, f"og:image is not an absolute URL: {og_image}")

    # --- landmarks and skip link -----------------------------------------
    if "main" not in page.landmarks:
        fail(route, "no <main> landmark — the primary content region is unmarked")
    if page.landmarks.count("main") > 1:
        fail(route, "more than one <main> landmark")
    # The skip link is identified by pointing at the <main> element's id, not
    # by its wording.
    if not page.main_id:
        fail(route, "<main> has no id, so nothing can target it as a skip link")
    elif not any(a.get("href") == f"#{page.main_id}" for a in page.anchors):
        fail(route, f"no skip link targeting #{page.main_id}")

    # --- resource hints ---------------------------------------------------
    # A preload emitted into <body> is discovered after the stylesheet, which
    # defeats the point of preloading the LCP image.
    for link in page.body_links:
        if link.get("rel") in ("preload", "preconnect", "dns-prefetch", "modulepreload"):
            fail(
                route,
                f"<link rel=\"{link['rel']}\"> is in <body>, not <head>: "
                f"{(link.get('href') or link.get('imagesrcset') or '')[:60]}",
            )

    # --- form controls ----------------------------------------------------
    if page.controls:
        if not page.forms:
            fail(route, f"{len(page.controls)} form controls but no <form> element")
        labelled = {lbl.get("for") for lbl in page.labels if lbl.get("for")}
        for control in page.controls:
            cid = control.get("id")
            has_label = (
                (cid and cid in labelled)
                or control.get("aria-label")
                or control.get("aria-labelledby")
            )
            if not has_label:
                fail(
                    route,
                    f"<{control['_tag']}> has no label "
                    f"(placeholder={control.get('placeholder', '?')!r})",
                )
            if not control.get("name"):
                warn(route, f"<{control['_tag']} id={cid}> has no name attribute")

    # --- structured data --------------------------------------------------
    if not page.jsonld:
        fail(route, "no JSON-LD")
    seen_ids: set[str] = set()
    for raw in page.jsonld:
        try:
            data = json.loads(raw.replace("\\u003c", "<"))
        except json.JSONDecodeError as exc:
            fail(route, f"JSON-LD does not parse: {exc}")
            continue
        if "@context" not in data:
            fail(route, "JSON-LD has no @context")
        nodes = data.get("@graph", [data])
        for node in nodes:
            if "@type" not in node:
                fail(route, f"JSON-LD node has no @type: {list(node)[:4]}")
            nid = node.get("@id")
            if not nid:
                # Every top-level node needs an @id so other nodes can point at
                # it; without one it dangles unreferenced in the graph.
                fail(route, f"JSON-LD top-level node has no @id: {node.get('@type')}")
            else:
                if nid in seen_ids:
                    fail(route, f"duplicate JSON-LD @id: {nid}")
                seen_ids.add(nid)

            image = node.get("primaryImageOfPage")
            if image is not None and not isinstance(image, dict):
                fail(
                    route,
                    "primaryImageOfPage must be an ImageObject, not a bare "
                    f"{type(image).__name__}",
                )
        types = {
            t
            for node in nodes
            for t in (
                node.get("@type", [])
                if isinstance(node.get("@type"), list)
                else [node.get("@type")]
            )
        }
        if not is_404 and "WebPage" not in types:
            warn(route, "no WebPage node in JSON-LD")

    # --- images -----------------------------------------------------------
    for img in page.images:
        src = img.get("src", "?")
        if "alt" not in img:
            fail(route, f"<img> with no alt attribute: {src[:60]}")
        elif not img["alt"].strip():
            warn(route, f"<img> with empty alt (decorative?): {src[:60]}")
        if not img.get("width") or not img.get("height"):
            fail(route, f"<img> without width/height (causes CLS): {src[:60]}")

    # --- iframes ----------------------------------------------------------
    for frame in page.iframes:
        if not frame.get("title"):
            fail(route, "<iframe> without a title attribute")
        if frame.get("loading") != "lazy":
            warn(route, "<iframe> is not lazy-loaded")

    # --- links ------------------------------------------------------------
    for a in page.anchors:
        href = a.get("href", "")
        text = (a.get("aria-label") or "").strip()
        if href in ("#", ""):
            fail(route, f"dead link href={href!r}")
        if href.startswith("/") and not href.startswith("//"):
            target = href.split("#")[0].split("?")[0].rstrip("/") or "/"
            if target not in known_routes and not target.startswith("/assets"):
                fail(route, f"internal link to unknown route: {href}")
        if href.startswith("http") and a.get("target") == "_blank":
            rel = a.get("rel", "")
            if "noopener" not in rel:
                fail(route, f"target=_blank without rel=noopener: {href}")
        del text


def audit_uniqueness(pages: list[Path]) -> None:
    """Two pages sharing a title or description compete for the same query."""
    titles: dict[str, list[str]] = {}
    descs: dict[str, list[str]] = {}
    h1s: dict[str, list[str]] = {}

    for path in pages:
        route = route_for(path)
        if route in ("/404", "/404.html"):
            continue
        page = PageParser()
        page.feed(path.read_text(encoding="utf-8"))
        titles.setdefault(page.title.strip(), []).append(route)
        descs.setdefault((page.meta("description") or "").strip(), []).append(route)
        for tag, text in page.headings:
            if tag == "h1":
                h1s.setdefault(text, []).append(route)

    for label, groups in (("title", titles), ("description", descs), ("H1", h1s)):
        for value, routes in groups.items():
            if len(routes) > 1:
                fail(
                    "duplicate content",
                    f"{len(routes)} pages share a {label} ({value[:45]!r}): {', '.join(routes)}",
                )
    print(
        f"  uniqueness        {len(titles)} distinct titles, "
        f"{len(descs)} descriptions, {len(h1s)} H1s"
    )


def audit_images_sitewide(pages: list[Path]) -> None:
    """Two different photos sharing alt text describe one of them wrongly."""
    by_alt: dict[str, set[str]] = {}
    for path in pages:
        page = PageParser()
        page.feed(path.read_text(encoding="utf-8"))
        for img in page.images:
            alt = (img.get("alt") or "").strip()
            if not alt:
                continue
            # Compare by base filename so responsive variants of one photo and
            # the same photo reused across pages are not counted as clashes.
            src = (img.get("src") or "").split("/")[-1]
            base = re.sub(r"-\d+-[A-Za-z0-9_-]+\.\w+$", "", src)
            by_alt.setdefault(alt, set()).add(base)

    clashes = {alt: files for alt, files in by_alt.items() if len(files) > 1}
    for alt, files in clashes.items():
        fail(
            "duplicate alt",
            f"{len(files)} different images share alt {alt[:50]!r}: {', '.join(sorted(files))}",
        )
    print(f"  image alt         {len(by_alt)} distinct alt strings, {len(clashes)} clashes")


def audit_soft_404() -> None:
    """`/404` must not exist as its own crawlable, 200-answering URL."""
    if (DIST / "404" / "index.html").exists():
        fail(
            "soft 404",
            "dist/404/index.html exists, so /404 is a crawlable URL that "
            "answers 200 — only 404.html should be emitted",
        )
    if not (DIST / "404.html").exists():
        fail("404", "dist/404.html is missing; hosts have nothing to serve on 404")
    else:
        print("  404               404.html only, no crawlable /404 route")


def audit_sitemap(known_routes: set[str], origin: str) -> None:
    path = DIST / "sitemap.xml"
    if not path.exists():
        fail("sitemap.xml", "missing")
        return
    text = path.read_text(encoding="utf-8")
    if 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' not in text:
        fail("sitemap.xml", "wrong or missing sitemap namespace")

    locs = re.findall(r"<loc>([^<]+)</loc>", text)
    if not locs:
        fail("sitemap.xml", "contains no <loc> entries")
    for loc in locs:
        if urlparse(loc).netloc != urlparse(origin).netloc:
            fail("sitemap.xml", f"off-domain URL: {loc}")
        route = urlparse(loc).path.rstrip("/") or "/"
        if route not in known_routes:
            fail("sitemap.xml", f"lists a route that does not exist: {loc}")
        page = DIST / ("index.html" if route == "/" else f"{route.lstrip('/')}/index.html")
        if page.exists() and not SITE_WIDE_NOINDEX:
            body = page.read_text(encoding="utf-8")
            if "noindex" in body:
                fail("sitemap.xml", f"lists a noindex page: {loc}")
    if len(locs) != len(set(locs)):
        fail("sitemap.xml", "contains duplicate URLs")

    # Anything indexable but absent from the sitemap is an orphan.
    listed = {urlparse(loc).path.rstrip("/") or "/" for loc in locs}
    for route in sorted(known_routes):
        if route in ("/404",):
            continue
        if route not in listed:
            fail("sitemap.xml", f"indexable route missing from sitemap: {route}")
    print(f"  sitemap.xml       {len(locs)} URLs, all resolve")


def audit_robots(origin: str) -> None:
    path = DIST / "robots.txt"
    if not path.exists():
        fail("robots.txt", "missing")
        return
    text = path.read_text(encoding="utf-8")
    if "User-agent:" not in text:
        fail("robots.txt", "no User-agent directive")

    blocks_all = bool(re.search(r"^Disallow:\s*/\s*$", text, re.MULTILINE))

    if SITE_WIDE_NOINDEX:
        # A preview deploy should block crawling outright; the pages already
        # carry noindex, and robots.txt is the belt to that braces.
        if not blocks_all:
            fail("robots.txt", "preview build does not Disallow: / — previews must not be crawled")
        else:
            print("  robots.txt        preview build, crawling disallowed as intended")
        return

    if blocks_all:
        fail("robots.txt", "Disallow: / blocks the entire site")
    if f"Sitemap: {origin}/sitemap.xml" not in text:
        fail("robots.txt", "does not reference the sitemap at the canonical origin")
    print("  robots.txt        valid, references sitemap")


def main() -> int:
    if not DIST.exists():
        print("dist/ not found — run `npm run build` first.")
        return 1

    pages = sorted(DIST.rglob("index.html")) + [DIST / "404.html"]
    pages = [p for p in pages if p.exists()]

    known_routes = {route_for(p) for p in pages if p.name == "index.html"}

    first = PageParser()
    first.feed((DIST / "index.html").read_text(encoding="utf-8"))
    origin = (first.link_href("canonical") or "https://example.com").rstrip("/")

    print(f"\n  Auditing {len(pages)} pages against origin {origin}\n")

    for path in pages:
        audit_page(path, known_routes, origin)

    audit_uniqueness([p for p in pages if p.name == "index.html"])
    audit_images_sitewide(pages)
    audit_soft_404()
    audit_sitemap(known_routes, origin)
    audit_robots(origin)

    if warnings:
        print(f"\n  {len(warnings)} warning(s):")
        for w in warnings:
            print(f"    ~ {w}")

    if failures:
        print(f"\n  {len(failures)} FAILURE(S):")
        for f in failures:
            print(f"    x {f}")
        print()
        return 1

    print(f"\n  All checks passed across {len(pages)} pages.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
