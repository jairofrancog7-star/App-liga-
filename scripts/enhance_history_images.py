#!/usr/bin/env python3
"""
V326 — Mejora de fotografías históricas sin borrar originales.

- Lee assets/history/**.{jpg,jpeg,png,webp}
- NUNCA modifica ni elimina el archivo original.
- Escribe una copia mejorada en assets/history/enhanced-v326/<misma ruta>.
- Usa FSRCNN x4 (super-resolución por IA) cuando el modelo está disponible.
- Si el modelo no carga, usa Lanczos + enfoque suave como fallback.
- Las fotos que ya son grandes se copian byte por byte para no degradarlas.
"""
from __future__ import annotations

import os
import shutil
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "history"
DST = SRC / "enhanced-v326"
MODEL_DIR = ROOT / ".cache" / "superres"
MODEL_PATH = MODEL_DIR / "FSRCNN_x4.pb"
MODEL_URL = "https://github.com/Saafke/FSRCNN_Tensorflow/raw/master/models/FSRCNN_x4.pb"

LOW_RES_LONG_SIDE = 1200
TARGET_LONG_SIDE = 1800
VALID = {".jpg", ".jpeg", ".png", ".webp"}

def load_sr():
    try:
        import cv2
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        if not MODEL_PATH.exists():
            print("Descargando modelo FSRCNN x4...")
            urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        sr = cv2.dnn_superres.DnnSuperResImpl_create()
        sr.readModel(str(MODEL_PATH))
        sr.setModel("fsrcnn", 4)
        return cv2, sr
    except Exception as exc:
        print(f"[WARN] IA FSRCNN no disponible: {exc}. Se usará Lanczos.")
        return None, None

def save_image(img: Image.Image, dst: Path, suffix: str):
    dst.parent.mkdir(parents=True, exist_ok=True)
    suffix = suffix.lower()
    if suffix in {".jpg", ".jpeg"}:
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        img.save(dst, format="JPEG", quality=95, subsampling=0, optimize=True)
    elif suffix == ".webp":
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
        img.save(dst, format="WEBP", quality=95, method=6)
    elif suffix == ".png":
        img.save(dst, format="PNG", optimize=True)
    else:
        img.save(dst)

def lanczos_enhance(img: Image.Image, target_long: int) -> Image.Image:
    w, h = img.size
    scale = max(1.0, target_long / max(w, h))
    nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
    out = img.resize((nw, nh), Image.Resampling.LANCZOS)
    # Enfoque moderado: mejora bordes sin crear halos fuertes.
    if out.mode in ("RGB", "RGBA", "L"):
        out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=115, threshold=3))
    return out

def ai_enhance(img: Image.Image, cv2, sr) -> Image.Image:
    import numpy as np

    had_alpha = img.mode == "RGBA"
    alpha = img.getchannel("A") if had_alpha else None
    rgb = img.convert("RGB")
    arr = np.array(rgb)
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
    up = sr.upsample(bgr)
    rgb_up = cv2.cvtColor(up, cv2.COLOR_BGR2RGB)
    out = Image.fromarray(rgb_up)

    # Evita archivos absurdamente grandes: máximo 1800 px en el lado largo.
    if max(out.size) > TARGET_LONG_SIDE:
        scale = TARGET_LONG_SIDE / max(out.size)
        out = out.resize((round(out.width * scale), round(out.height * scale)), Image.Resampling.LANCZOS)

    out = out.filter(ImageFilter.UnsharpMask(radius=1.0, percent=105, threshold=3))

    if had_alpha and alpha is not None:
        a = alpha.resize(out.size, Image.Resampling.LANCZOS)
        out = out.convert("RGBA")
        out.putalpha(a)
    return out

def main():
    cv2, sr = load_sr()
    originals = [
        p for p in SRC.rglob("*")
        if p.is_file()
        and p.suffix.lower() in VALID
        and DST not in p.parents
    ]

    enhanced = 0
    copied = 0
    failed = 0

    for src in sorted(originals):
        rel = src.relative_to(SRC)
        dst = DST / rel
        try:
            with Image.open(src) as im0:
                im0.load()
                im = ImageOps.exif_transpose(im0)
                w, h = im.size

                # Archivos suficientemente grandes: se preservan exactamente.
                if max(w, h) >= LOW_RES_LONG_SIDE:
                    dst.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(src, dst)
                    copied += 1
                    print(f"COPY {rel} {w}x{h}")
                    continue

                if sr is not None and cv2 is not None and min(w, h) >= 32:
                    out = ai_enhance(im, cv2, sr)
                    mode = "AI"
                else:
                    out = lanczos_enhance(im, TARGET_LONG_SIDE)
                    mode = "LANCZOS"

                save_image(out, dst, src.suffix)
                enhanced += 1
                print(f"{mode} {rel} {w}x{h} -> {out.width}x{out.height}")
        except Exception as exc:
            failed += 1
            print(f"[WARN] No se pudo mejorar {rel}: {exc}", file=sys.stderr)
            # Nunca borres el fondo: si falla la mejora, copia el original.
            try:
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
            except Exception:
                pass

    print(f"Resumen: {enhanced} mejoradas, {copied} preservadas, {failed} con fallback.")

if __name__ == "__main__":
    main()
