"""Remove the white background from character art and export web-ready WebP.

Usage: python3 scripts/cutout-characters.py [name-filter]
Reads  art/characters/*.png   (original, white background)
Writes public/characters/<name>.webp (transparent, max 720px)
Needs Pillow (pip install pillow).
"""
import sys
from collections import deque
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'art' / 'characters'
OUT = ROOT / 'public' / 'characters'
MAX = 720


def is_bg(p):
    r, g, b = p[:3]
    return min(r, g, b) > 228 and max(r, g, b) - min(r, g, b) < 20


def cutout(path: Path):
    im = Image.open(path).convert('RGB')
    # work at a smaller size for speed; flood fill from every border pixel
    scale = min(1, 1400 / max(im.size))
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    W, H = im.size
    px = im.load()
    mask = bytearray(W * H)  # 1 = background
    q = deque()
    for x in range(W):
        q.append((x, 0)); q.append((x, H - 1))
    for y in range(H):
        q.append((0, y)); q.append((W - 1, y))
    while q:
        x, y = q.popleft()
        i = y * W + x
        if mask[i] or not is_bg(px[x, y]):
            continue
        mask[i] = 1
        if x > 0: q.append((x - 1, y))
        if x < W - 1: q.append((x + 1, y))
        if y > 0: q.append((x, y - 1))
        if y < H - 1: q.append((x, y + 1))
    alpha = Image.frombytes('L', (W, H), bytes(0 if m else 255 for m in mask))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.7))
    rgba = im.convert('RGBA')
    rgba.putalpha(alpha)
    bbox = alpha.point(lambda v: 255 if v > 10 else 0).getbbox()
    pad = 6
    bbox = (max(bbox[0] - pad, 0), max(bbox[1] - pad, 0), min(bbox[2] + pad, W), min(bbox[3] + pad, H))
    out = rgba.crop(bbox)
    if max(out.size) > MAX:
        s = MAX / max(out.size)
        out = out.resize((round(out.width * s), round(out.height * s)), Image.LANCZOS)
    return out


def main():
    flt = sys.argv[1] if len(sys.argv) > 1 else ''
    OUT.mkdir(parents=True, exist_ok=True)
    for f in sorted(SRC.glob('*.png')):
        if flt not in f.stem:
            continue
        img = cutout(f)
        dest = OUT / f'{f.stem}.webp'
        img.save(dest, 'WEBP', quality=86, method=6)
        print(f'{f.name:32s} -> {dest.relative_to(ROOT)} {img.size} {dest.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
