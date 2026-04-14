#!/usr/bin/env python3
"""
Generates the PWA/app icon set for the E² Teaching Framework.
Run: python3 scripts/generate-icons.py
Output: icons/icon-{size}.png + apple-touch-icon.png + favicon.ico + maskable.png
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, sys

TERRA = (193, 105, 79)     # #C1694F
CLAY  = (183, 85, 59)      # #B7553B
ROSE  = (201, 145, 143)    # #C9918F
CREAM = (255, 248, 240)    # #FFF8F0
GOLD  = (212, 168, 67)     # #D4A843
BROWN = (61, 43, 31)       # #3D2B1F

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "icons")
os.makedirs(OUT, exist_ok=True)

SIZES = [48, 72, 96, 128, 144, 152, 167, 180, 192, 256, 384, 512, 1024]


def gradient(size, c1, c2):
    """Diagonal gradient from c1 (top-left) to c2 (bottom-right)."""
    img = Image.new("RGB", (size, size), c1)
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1)) if size > 1 else 0
            px[x, y] = (
                int(c1[0] + (c2[0] - c1[0]) * t),
                int(c1[1] + (c2[1] - c1[1]) * t),
                int(c1[2] + (c2[2] - c1[2]) * t),
            )
    return img


def rounded_mask(size, radius):
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=radius, fill=255)
    return mask


def draw_e2(size, maskable=False):
    """Main icon: rounded square with gradient + stylized E² mark."""
    # Larger canvas for anti-aliasing then downscale
    SS = 4
    big = size * SS
    img = gradient(big, TERRA, CLAY)
    d = ImageDraw.Draw(img, "RGBA")

    # Soft glow in top-left
    glow = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse(
        [(-big * 0.3, -big * 0.3), (big * 0.5, big * 0.5)],
        fill=(255, 248, 240, 55),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(radius=big // 20))
    img = Image.alpha_composite(img.convert("RGBA"), glow)
    d = ImageDraw.Draw(img, "RGBA")

    # Inner frame (decorative)
    pad = big * 0.12
    d.rounded_rectangle(
        [(pad, pad), (big - pad, big - pad)],
        radius=int(big * 0.08),
        outline=(255, 248, 240, 120),
        width=max(2, int(big * 0.008)),
    )

    # "E²" mark — use default font scaled up
    label = "E\u00b2"
    # Try a bundled truetype if available, else default
    font = None
    for candidate in [
        "/usr/share/fonts/truetype/dejavu/DejaVu-Serif-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
    ]:
        if os.path.exists(candidate):
            try:
                font = ImageFont.truetype(candidate, size=int(big * 0.55))
                break
            except Exception:
                continue
    if font is None:
        font = ImageFont.load_default()

    bbox = d.textbbox((0, 0), label, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (big - tw) / 2 - bbox[0]
    ty = (big - th) / 2 - bbox[1] - big * 0.03

    # Soft shadow
    shadow = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.text((tx + big * 0.01, ty + big * 0.01), label, font=font, fill=(0, 0, 0, 90))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=big // 80))
    img = Image.alpha_composite(img, shadow)
    d = ImageDraw.Draw(img, "RGBA")

    d.text((tx, ty), label, font=font, fill=CREAM)

    # Tiny gold accent line beneath
    underline_y = ty + th + big * 0.02
    line_w = tw * 0.42
    d.rounded_rectangle(
        [
            ((big - line_w) / 2, underline_y),
            ((big + line_w) / 2, underline_y + big * 0.012),
        ],
        radius=int(big * 0.006),
        fill=GOLD,
    )

    # Apply rounded corner mask (unless maskable — maskable needs full-bleed)
    if not maskable:
        mask = rounded_mask(big, int(big * 0.2))
        out = Image.new("RGBA", (big, big), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        img = out

    img = img.resize((size, size), Image.LANCZOS)
    return img


def main():
    for s in SIZES:
        img = draw_e2(s)
        img.save(os.path.join(OUT, f"icon-{s}.png"), "PNG")
        print(f"  icons/icon-{s}.png")

    # Maskable icon (Android adaptive): safe zone is inner 80%
    maskable = draw_e2(512, maskable=True)
    maskable.save(os.path.join(OUT, "maskable-512.png"), "PNG")
    print("  icons/maskable-512.png")

    # Apple touch icon
    draw_e2(180).save(os.path.join(OUT, "apple-touch-icon.png"), "PNG")
    print("  icons/apple-touch-icon.png")

    # Favicon (multi-size ico)
    favicon_sizes = [(16, 16), (32, 32), (48, 48)]
    favicons = [draw_e2(sz[0]) for sz in favicon_sizes]
    favicons[0].save(
        os.path.join(OUT, "favicon.ico"),
        format="ICO",
        sizes=favicon_sizes,
        append_images=favicons[1:],
    )
    print("  icons/favicon.ico")

    # Social / OG share image (1200x630)
    og = gradient(1200, TERRA, CLAY)
    d = ImageDraw.Draw(og)
    try:
        title_font = ImageFont.truetype(
            "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 72
        )
        sub_font = ImageFont.truetype(
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36
        )
    except Exception:
        title_font = ImageFont.load_default()
        sub_font = ImageFont.load_default()
    d.text((80, 200), "E\u00b2 Teaching Framework", font=title_font, fill=CREAM)
    d.text(
        (80, 310),
        "Every Student Has the Right to Understand",
        font=sub_font,
        fill=(255, 248, 240, 220),
    )
    og_path = os.path.join(OUT, "og-image.png")
    # strip alpha for png compat
    og.convert("RGB").resize((1200, 630), Image.LANCZOS).save(og_path, "PNG")
    print("  icons/og-image.png")


if __name__ == "__main__":
    print("Generating E² icon set…")
    main()
    print("Done.")
