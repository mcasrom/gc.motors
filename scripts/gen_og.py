#!/usr/bin/env python3
"""gen_og_gcmotors.py — Tarjeta OpenGraph 1200x630 para gcmotors-workshop.com.
Uso: python3 gen_og_gcmotors.py /ruta/salida/og.png
"""
import sys
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
FONT_DIR = "/home/deploy/.local/lib/python3.12/site-packages/matplotlib/mpl-data/fonts/ttf"
BOLD = FONT_DIR + "/DejaVuSans-Bold.ttf"
REG = FONT_DIR + "/DejaVuSans.ttf"

SLATE_950 = (2, 6, 23)
SLATE_900 = (15, 23, 42)
SLATE_700 = (51, 65, 85)
SLATE_300 = (203, 213, 225)
SLATE_400 = (148, 163, 184)
TEAL_700 = (15, 118, 110)
AMBER_500 = (245, 158, 11)
AMBER_400 = (251, 191, 36)
WHITE = (255, 255, 255)

def font(path, size):
    return ImageFont.truetype(path, size)

def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "og.png"
    img = Image.new("RGB", (W, H), SLATE_900)
    d = ImageDraw.Draw(img)

    # fondo con degradado vertical sutil (slate-900 -> slate-950)
    for y in range(H):
        t = y / (H - 1)
        r = int(SLATE_900[0] + (SLATE_950[0] - SLATE_900[0]) * t)
        g = int(SLATE_900[1] + (SLATE_950[1] - SLATE_900[1]) * t)
        b = int(SLATE_900[2] + (SLATE_950[2] - SLATE_900[2]) * t)
        d.line([(0, y), (W, y)], fill=(r, g, b))

    # banda teal diagonal a la derecha (acento)
    d.polygon([(W - 200, H), (W, H), (W, 120), (W - 40, 120)], fill=TEAL_700)

    # barras superior (amber) e inferior (teal)
    d.rectangle([0, 0, W, 14], fill=AMBER_500)
    d.rectangle([0, H - 12, W, H], fill=TEAL_700)

    # logo arriba a la izquierda (recortado a cuadrado por su relación vertical)
    try:
        logo = Image.open("/home/deploy/gcmotors-workshop/public/logo.png").convert("RGBA")
        lh = 100
        lw = int(logo.width * lh / logo.height)
        logo = logo.resize((lw, lh), Image.LANCZOS)
        img.paste(logo, (70, 58), logo)
        brand_x = 70 + lw + 26
    except Exception as e:
        print("logo omitido:", e, file=sys.stderr)
        brand_x = 70

    d.text((brand_x, 62), "GCMotors Workshop", font=font(BOLD, 46), fill=WHITE)
    d.text((brand_x, 118), "Gold Coast  ·  QLD  ·  Australia", font=font(REG, 24), fill=SLATE_400)

    # titular
    d.text((72, 262), "Mobile Pre-Purchase Inspections", font=font(BOLD, 54), fill=WHITE)
    d.text((72, 340), "Car Rentals  ·  Diagnostics & Repairs", font=font(BOLD, 40), fill=AMBER_400)

    # pie
    d.text((72, H - 84), "gcmotors-workshop.com", font=font(BOLD, 30), fill=WHITE)
    txt = "  ·  +61 481 268 633"
    wt = d.textlength("gcmotors-workshop.com", font=font(BOLD, 30))
    d.text((72 + wt, H - 84), txt, font=font(REG, 30), fill=SLATE_300)

    img.save(out, "PNG", optimize=True)
    print("OK", out, img.size)

if __name__ == "__main__":
    main()
