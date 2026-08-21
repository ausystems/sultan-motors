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


if __name__ == "__main__":
    build_hero_variants()
    compress_oversized()
    build_og_image()
    build_service_cards()
    print("\nDone.")
