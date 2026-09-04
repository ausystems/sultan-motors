#!/usr/bin/env python3
"""Prepare the site's imagery for Core Web Vitals.

Three jobs, all idempotent:

1. Build responsive variants of the homepage hero, which shipped as a single
   3840px 524 KB file and was the LCP element on every mobile visit.
2. Re-encode any photo heavier than the budget below, keeping the new file only
   when it is meaningfully smaller than the original. As of the last run every
   photo declined the swap: the shop photography is high-texture and already
   sits near its rate-distortion floor, so a re-encode trades visible
   generational artefacts for well under the threshold in bytes.
3. Render the Open Graph share card the site had no image for.

Run with: python3 scripts/optimize_images.py
"""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "src" / "assets"
PHOTOS = ASSETS / "photos"
PUBLIC = ROOT / "public"

# Above this, a photo costs more in load time than it returns in fidelity.
SIZE_BUDGET = 200 * 1024
WEBP_QUALITY = 80
# Keep a re-encode only if it saves at least this share of the original bytes.
MIN_SAVING = 0.12

HERO_SRC = ASSETS / "sultan-motors-brampton-auto-repair-shop.webp"
HERO_WIDTHS = (960, 1600, 2400)
# 16:9 crop, matching the hero's object-cover framing.
HERO_RATIO = 9 / 16

BRAND_YELLOW = (230, 255, 61)
FONT_BOLD = "/System/Library/Fonts/HelveticaNeue.ttc"


def kb(n: int) -> str:
    return f"{n / 1024:.0f} KB"


# Face indices within HelveticaNeue.ttc. Index 8 is Light *Italic*, which is
# what an earlier version of this script picked up by mistake.
FACE_BOLD = 1
FACE_MEDIUM = 10


def load_font(size: int, index: int = FACE_BOLD) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(FONT_BOLD, size, index=index)
    except Exception:
        return ImageFont.load_default(size)


def build_hero_variants() -> None:
    print("\n== Homepage hero variants ==")
    if not HERO_SRC.exists():
        print(f"  skipped, {HERO_SRC.name} not found")
        return

    src = Image.open(HERO_SRC).convert("RGB")
    for width in HERO_WIDTHS:
        out = ASSETS / f"{HERO_SRC.stem}-{width}.webp"
        height = round(width * HERO_RATIO)

        # Cover-crop to 16:9 before downscaling so the variant matches what
        # object-cover renders, instead of letterboxing.
        target_ratio = height / width
        w, h = src.size
        if h / w > target_ratio:
            crop_h = round(w * target_ratio)
            top = (h - crop_h) // 2
            frame = src.crop((0, top, w, top + crop_h))
        else:
            crop_w = round(h / target_ratio)
            left = (w - crop_w) // 2
            frame = src.crop((left, 0, left + crop_w, h))

        frame.resize((width, height), Image.LANCZOS).save(
            out, "WEBP", quality=WEBP_QUALITY, method=6
        )
        print(f"  {out.name:<58} {width}x{height}  {kb(out.stat().st_size)}")


def compress_oversized() -> None:
    print("\n== Re-encoding photos over the size budget ==")
    targets = sorted(
        (p for p in PHOTOS.glob("*.webp") if p.stat().st_size > SIZE_BUDGET),
        key=lambda p: -p.stat().st_size,
    )
    if not targets:
        print("  nothing over budget")
        return

    saved_total = 0
    for path in targets:
        before = path.stat().st_size
        tmp = path.with_suffix(".tmp.webp")
        Image.open(path).convert("RGB").save(
            tmp, "WEBP", quality=WEBP_QUALITY, method=6
        )
        after = tmp.stat().st_size

        if after < before * (1 - MIN_SAVING):
            shutil.move(tmp, path)
            saved_total += before - after
            pct = (before - after) / before * 100
            print(f"  {path.name:<58} {kb(before)} -> {kb(after)}  (-{pct:.0f}%)")
        else:
            tmp.unlink()
            print(f"  {path.name:<58} {kb(before)}  kept, already efficient")

    print(f"  total saved: {kb(saved_total)}")


def build_og_image() -> None:
    """1200x630 share card. Referenced by OG_IMAGE in src/data/site.ts."""
    print("\n== Open Graph share card ==")
    source = PHOTOS / "shop-exterior-brampton-2400.webp"
    if not source.exists():
        print(f"  skipped, {source.name} not found")
        return

    W, H = 1200, 630
    base = Image.open(source).convert("RGB")

    scale = max(W / base.width, H / base.height)
    resized = base.resize(
        (round(base.width * scale), round(base.height * scale)), Image.LANCZOS
    )
    left = (resized.width - W) // 2
    top = (resized.height - H) // 2
    card = resized.crop((left, top, left + W, top + H))

    # Darken left-to-right so the type stays legible over the photograph, while
    # leaving enough of the shop visible on the right to read as a real place.
    shade = Image.new("L", (W, H))
    px = shade.load()
    for x in range(W):
        column = int(242 - (x / W) * 112)
        for y in range(H):
            px[x, y] = column
    card = Image.composite(Image.new("RGB", (W, H), (10, 11, 13)), card, shade)

    draw = ImageDraw.Draw(card)
    draw.rectangle([0, H - 12, W, H], fill=BRAND_YELLOW)

    draw.text((72, 96), "SULTAN MOTORS", font=load_font(34), fill=BRAND_YELLOW)
    draw.text((72, 176), "AUTO REPAIR &", font=load_font(84), fill=(255, 255, 255))
    draw.text((72, 268), "COLLISION SHOP", font=load_font(84), fill=(255, 255, 255))
    draw.text((72, 372), "IN BRAMPTON, ONTARIO", font=load_font(44), fill=BRAND_YELLOW)
    draw.text(
        (72, 486),
        "5 Melanie Dr Unit 2  ·  (905) 799-1331",
        font=load_font(30, index=FACE_MEDIUM),
        fill=(236, 238, 240),
    )

    PUBLIC.mkdir(exist_ok=True)
    out = PUBLIC / "og-image.jpg"
    card.save(out, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"  {out.name:<58} {W}x{H}  {kb(out.stat().st_size)}")


# Per-service social cards. Each service page shares its own hero rather than a
# generic shot of the building, so a link to "brake repair" previews brake work.
#
# These are JPEG on purpose: the source photography is WebP, but WebP support in
# link-preview scrapers is still uneven, and a share card that fails to render
# on one platform is worse than a slightly larger file.
SERVICE_CARDS = [
    ("auto-repair-brampton", "auto-repair-hero-shop-2000.webp", "AUTO REPAIR"),
    ("car-diagnostics-brampton", "diagnostics-hero-scan-bay-2000.webp", "CAR DIAGNOSTICS"),
    ("engine-repair-brampton", "engine-hero-hood-up-lift-2000.webp", "ENGINE REPAIR"),
    ("brake-repair-brampton", "brake-hero-wheel-off-rotor-2000.webp", "BRAKE REPAIR"),
    ("car-maintenance-brampton", "maintenance-hero-oil-drain-2000.webp", "CAR MAINTENANCE"),
    (
        "transmission-repair-brampton",
        "transmission-hero-frame-driveline-2000.webp",
        "TRANSMISSION REPAIR",
    ),
    ("suspension-repair-brampton", "suspension-hero-strut-arm-2000.webp", "SUSPENSION REPAIR"),
    (
        "auto-electrical-repair-brampton",
        "electrical-hero-front-clip-2000.webp",
        "AUTO ELECTRICAL",
    ),
    ("collision-repair-brampton", "collision-hero-frame-anchor-2000.webp", "COLLISION REPAIR"),
    ("auto-body-repair-brampton", "autobody-hero-primer-coupe-2000.webp", "AUTO BODY REPAIR"),
    ("car-painting-brampton", "paint-hero-booth-spray-2000.webp", "CAR PAINTING"),
    (
        "safety-standards-certificate-brampton",
        "safety-hero-vehicle-on-hoist-2000.webp",
        "SAFETY CERTIFICATE",
    ),
]


def _card_base(source: Path, W: int = 1200, H: int = 630) -> Image.Image:
    base = Image.open(source).convert("RGB")
    scale = max(W / base.width, H / base.height)
    resized = base.resize(
        (round(base.width * scale), round(base.height * scale)), Image.LANCZOS
    )
    left = (resized.width - W) // 2
    top = (resized.height - H) // 2
    card = resized.crop((left, top, left + W, top + H))

    shade = Image.new("L", (W, H))
    px = shade.load()
    for x in range(W):
        column = int(242 - (x / W) * 112)
        for y in range(H):
            px[x, y] = column
    return Image.composite(Image.new("RGB", (W, H), (10, 11, 13)), card, shade)


def _fit_font(draw, text: str, max_width: int, start: int) -> ImageFont.FreeTypeFont:
    """Shrinks the headline until it fits the card's text column."""
    size = start
    while size > 34:
        font = load_font(size)
        if draw.textlength(text, font=font) <= max_width:
            return font
        size -= 4
    return load_font(34)


def build_service_cards() -> None:
    print("\n== Per-service social cards ==")
    out_dir = PUBLIC / "og"
    out_dir.mkdir(parents=True, exist_ok=True)

    for slug, photo_name, headline in SERVICE_CARDS:
        source = PHOTOS / photo_name
        if not source.exists():
            print(f"  {slug:<44} SKIPPED, {photo_name} not found")
            continue

        card = _card_base(source)
        draw = ImageDraw.Draw(card)
        draw.rectangle([0, 630 - 12, 1200, 630], fill=BRAND_YELLOW)

        draw.text((72, 118), "SULTAN MOTORS", font=load_font(32), fill=BRAND_YELLOW)
        headline_font = _fit_font(draw, headline, 1000, 92)
        draw.text((72, 214), headline, font=headline_font, fill=(255, 255, 255))
        draw.text((72, 330), "BRAMPTON, ONTARIO", font=load_font(48), fill=BRAND_YELLOW)
        draw.text(
            (72, 486),
            "5 Melanie Dr Unit 2  ·  (905) 799-1331",
            font=load_font(30, index=FACE_MEDIUM),
            fill=(236, 238, 240),
        )

        out = out_dir / f"{slug}.jpg"
        card.save(out, "JPEG", quality=86, optimize=True, progressive=True)
        print(f"  og/{out.name:<48} {kb(out.stat().st_size)}")


# --------------------------------------------------------------------------- #
# App icons                                                                     #
# --------------------------------------------------------------------------- #

# The brand mark is a single "S" — the shop's initial — in near-black on the
# brand yellow, matching the site's primary CTA (yellow field, black text).
#
# One letter, not "SM": at 16x16 in a browser tab a two-letter monogram
# collapses into an unreadable smudge, which is exactly what the previous icon
# did. A single glyph can be set far larger and heavier and still read.
INK = (13, 14, 16)
# Cap height as a share of the icon box. Tuned so the S fills the tile without
# crowding the corner radius.
GLYPH_FILL = 0.60
# iOS-style continuous-corner approximation.
CORNER_RATIO = 0.22
# Everything is drawn at this multiple and downsampled, so edges and the corner
# radius stay clean at 16px.
SS = 8


def _draw_mark(px: int, *, rounded: bool, glyph_fill: float = GLYPH_FILL) -> Image.Image:
    """Renders the S mark at `px`, supersampled then reduced."""
    big = px * SS
    tile = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(tile)

    if rounded:
        draw.rounded_rectangle(
            [0, 0, big - 1, big - 1],
            radius=int(big * CORNER_RATIO),
            fill=BRAND_YELLOW + (255,),
        )
    else:
        draw.rectangle([0, 0, big - 1, big - 1], fill=BRAND_YELLOW + (255,))

    # Size the glyph by its rendered cap height rather than font metrics, which
    # include ascender/descender space the letter S does not use.
    target = big * glyph_fill
    size = int(target * 1.4)
    for _ in range(24):
        font = load_font(size)
        box = draw.textbbox((0, 0), "S", font=font)
        h = box[3] - box[1]
        if h <= 0:
            break
        if abs(h - target) <= max(1, big * 0.004):
            break
        size = max(1, int(size * target / h))
    font = load_font(size)

    # Centre on the glyph's ink, not on the text origin.
    box = draw.textbbox((0, 0), "S", font=font)
    draw.text(
        ((big - (box[2] - box[0])) / 2 - box[0], (big - (box[3] - box[1])) / 2 - box[1]),
        "S",
        font=font,
        fill=INK,
    )
    return tile.resize((px, px), Image.LANCZOS)


def build_icons() -> None:
    print("\n== App icons ==")

    # Browser tab / PWA icons: rounded tile, transparent outside the corners.
    for px, name in ((192, "icon-192.png"), (512, "icon-512.png")):
        out = PUBLIC / name
        _draw_mark(px, rounded=True).save(out, "PNG", optimize=True)
        print(f"  {name:<34} {px}x{px}  {kb(out.stat().st_size)}")

    # Android maskable: the launcher crops to its own shape, so the glyph has to
    # sit inside the safe zone (centre 80%) and the field must be full bleed.
    out = PUBLIC / "icon-maskable-512.png"
    _draw_mark(512, rounded=False, glyph_fill=GLYPH_FILL * 0.8).save(out, "PNG", optimize=True)
    print(f"  {out.name:<34} 512x512  {kb(out.stat().st_size)}  (safe-zone padded)")

    # Apple touch icon: iOS applies its own mask and ignores transparency, so
    # this one is a full-bleed opaque square.
    out = PUBLIC / "apple-touch-icon.png"
    Image.alpha_composite(
        Image.new("RGBA", (180, 180), BRAND_YELLOW + (255,)),
        _draw_mark(180, rounded=False),
    ).convert("RGB").save(out, "PNG", optimize=True)
    print(f"  {out.name:<34} 180x180  {kb(out.stat().st_size)}  (opaque, full bleed)")

    # Multi-resolution .ico. Each size is rendered independently rather than
    # letting Pillow downscale one bitmap, so the 16px entry stays legible.
    ico = PUBLIC / "favicon.ico"
    sizes = (16, 32, 48, 64, 128, 256)
    frames = {px: _draw_mark(px, rounded=True) for px in sizes}
    # The base image must be the LARGEST frame: Pillow clamps the requested
    # sizes to the base image's dimensions, so saving the 16px frame as the base
    # silently produces a single-entry 16x16 .ico.
    frames[max(sizes)].save(
        ico,
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=[frames[s] for s in sizes if s != max(sizes)],
    )
    print(f"  {ico.name:<34} {'/'.join(str(s) for s in sizes)}  {kb(ico.stat().st_size)}")


if __name__ == "__main__":
    build_hero_variants()
    compress_oversized()
    build_og_image()
    build_service_cards()
    build_icons()
    print("\nDone.")
