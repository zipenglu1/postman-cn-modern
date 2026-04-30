"""Postman UI audit via RapidOCR - extracts visible English text from screenshots."""
import ctypes
import ctypes.wintypes as wintypes
import json
import os
import re
import struct
import sys
import time
from pathlib import Path
from PIL import Image
from rapidocr_onnxruntime import RapidOCR

PW_RENDERFULLCONTENT = 0x00000002
user32 = ctypes.windll.user32
gdi32 = ctypes.windll.gdi32

class RECT(ctypes.Structure):
    _fields_ = [("left", ctypes.c_long), ("top", ctypes.c_long),
                 ("right", ctypes.c_long), ("bottom", ctypes.c_long)]

_found_windows = []

def find_postman_window():
    global _found_windows
    _found_windows = []
    def callback(hwnd, lparam):
        if user32.IsWindowVisible(hwnd):
            length = user32.GetWindowTextLengthW(hwnd)
            if length > 0:
                buf = ctypes.create_unicode_buffer(length + 1)
                user32.GetWindowTextW(hwnd, buf, length + 1)
                title = buf.value
                if "postman" in title.lower() or "workspace" in title.lower():
                    _found_windows.append((hwnd, title))
        return True
    WNDENUMPROC = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)
    user32.EnumWindows(WNDENUMPROC(callback), 0)
    return _found_windows

def capture_window(hwnd, output_path):
    rect = RECT()
    user32.GetWindowRect(hwnd, ctypes.byref(rect))
    width = rect.right - rect.left
    height = rect.bottom - rect.top
    if width <= 0 or height <= 0:
        return False

    hdc_window = user32.GetDC(hwnd)
    hdc_mem = gdi32.CreateCompatibleDC(hdc_window)
    hbitmap = gdi32.CreateCompatibleBitmap(hdc_window, width, height)
    gdi32.SelectObject(hdc_mem, hbitmap)

    if not user32.PrintWindow(hwnd, hdc_mem, PW_RENDERFULLCONTENT):
        gdi32.BitBlt(hdc_mem, 0, 0, width, height, hdc_window, 0, 0, 0x00CC0020)

    bmi = struct.pack('IiiHHIIiiII', 40, width, -height, 1, 32, 0, 0, 0, 0, 0, 0)
    bits = ctypes.create_string_buffer(width * height * 4)
    gdi32.GetDIBits(hdc_mem, hbitmap, 0, height, bits, bmi, 0)
    img = Image.frombuffer('RGBA', (width, height), bits, 'raw', 'BGRA', 0, 1)
    img.convert('RGB').save(output_path, 'PNG')

    gdi32.DeleteObject(hbitmap)
    gdi32.DeleteDC(hdc_mem)
    user32.ReleaseDC(hwnd, hdc_window)
    return True

def click_at(hwnd, x, y):
    """Simulate mouse click at window-relative coordinates."""
    rect = RECT()
    user32.GetWindowRect(hwnd, ctypes.byref(rect))
    abs_x = rect.left + x
    abs_y = rect.top + y
    user32.SetForegroundWindow(hwnd)
    time.sleep(0.3)
    # mouse_event: MOUSEEVENTF_LEFTDOWN=0x0002, MOUSEEVENTF_LEFTUP=0x0004
    user32.SetCursorPos(abs_x, abs_y)
    time.sleep(0.1)
    ctypes.windll.user32.mouse_event(0x0002, 0, 0, 0, 0)
    time.sleep(0.05)
    ctypes.windll.user32.mouse_event(0x0004, 0, 0, 0, 0)

def ocr_image(ocr_engine, image_path):
    """Run OCR on image and return full text."""
    result, _ = ocr_engine(image_path)
    if not result:
        return ""
    # result is list of [bbox, text, score]
    lines = [item[1] for item in result]
    return "\n".join(lines)

def extract_english_lines(text):
    lines = text.split('\n')
    english = []
    for line in lines:
        line = line.strip()
        if len(line) < 2 or len(line) > 200:
            continue
        if not re.search(r'[A-Za-z]', line):
            continue
        if re.match(r'^\d+\.\d+', line):
            continue
        if re.match(r'^https?://', line):
            continue
        if re.match(r'^[A-Z]{2,8}$', line):
            continue
        english.append(line)
    return english

def main():
    report_dir = Path("f:/codex/postman-cn/https-github-com-hlmd-postman-cn/reports")
    report_dir.mkdir(exist_ok=True)
    ts = int(time.time())
    audit_dir = report_dir / f"ocr-audit-{ts}"
    audit_dir.mkdir(exist_ok=True)

    windows = find_postman_window()
    if not windows:
        print("ERROR: No Postman window found", file=sys.stderr)
        sys.exit(1)

    hwnd, title = windows[0]
    print(f"Postman: {title}", file=sys.stderr)

    # Initialize OCR
    print("Initializing OCR engine...", file=sys.stderr)
    ocr_engine = RapidOCR()

    # Define pages to audit - we'll click through sidebar items
    # We need to find button positions by OCR-ing the initial screenshot first
    # Then click sidebar items: 集合, 环境, 历史, etc.
    # And click into sub-pages: request tab params, authorization, headers, body, etc.
    pages = [
        ("01-home", None, None),
    ]

    all_english = set()
    results = []

    for page_name, click_x, click_y in pages:
        print(f"\n=== {page_name} ===", file=sys.stderr)

        img_path = str(audit_dir / f"{page_name}.png")
        if not capture_window(hwnd, img_path):
            print(f"  Capture failed", file=sys.stderr)
            continue

        text = ocr_image(ocr_engine, img_path)
        with open(audit_dir / f"{page_name}-ocr.txt", 'w', encoding='utf-8') as f:
            f.write(text)

        english = extract_english_lines(text)
        for line in english:
            all_english.add(line)

        print(f"  OCR lines: {len(text.splitlines())}, English: {len(english)}", file=sys.stderr)
        results.append({"page": page_name, "englishCount": len(english), "english": english[:50]})

    # Save results
    sorted_english = sorted(all_english)
    with open(audit_dir / "all-english.txt", 'w', encoding='utf-8') as f:
        for line in sorted_english:
            f.write(line + '\n')

    # Compare with dictionary
    dict_path = "f:/codex/postman-cn/https-github-com-hlmd-postman-cn/dictionaries/local-core.zh-CN.json"
    with open(dict_path, 'r', encoding='utf-8') as f:
        dictionary = json.load(f)

    known = {e['source'] for e in dictionary['entries']}
    untranslated = [t for t in sorted_english if t not in known]

    with open(audit_dir / "untranslated.txt", 'w', encoding='utf-8') as f:
        for line in untranslated:
            f.write(line + '\n')

    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "auditDir": str(audit_dir),
        "totalEnglish": len(sorted_english),
        "untranslatedCount": len(untranslated),
        "untranslated": untranslated[:200],
        "pages": results
    }
    with open(audit_dir / "report.json", 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"\n=== Audit Complete ===", file=sys.stderr)
    print(f"Dir: {audit_dir}", file=sys.stderr)
    print(f"Total English: {len(sorted_english)}", file=sys.stderr)
    print(f"Untranslated: {len(untranslated)}", file=sys.stderr)

    print(json.dumps(report, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
