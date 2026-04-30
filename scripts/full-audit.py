"""Postman UI audit - captures screen via OCR, extracts all visible text."""
import ctypes
import ctypes.wintypes as wintypes
import json
import re
import struct
import sys
import time
from pathlib import Path
from PIL import Image
from rapidocr_onnxruntime import RapidOCR

user32 = ctypes.windll.user32
gdi32 = ctypes.windll.gdi32
PW_RENDERFULLCONTENT = 0x00000002

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

def click_abs(x, y):
    user32.SetCursorPos(x, y)
    time.sleep(0.1)
    user32.mouse_event(0x0002, 0, 0, 0, 0)
    time.sleep(0.05)
    user32.mouse_event(0x0004, 0, 0, 0, 0)

def find_and_click_text(hwnd, ocr_engine, image_path, target):
    """OCR the screen, find target text, click its center. Returns True if found."""
    capture_window(hwnd, image_path)
    result, _ = ocr_engine(image_path)
    if not result:
        return False
    for bbox, text, score in result:
        if target in text.strip():
            cx = int(sum(p[0] for p in bbox) / 4)
            cy = int(sum(p[1] for p in bbox) / 4)
            rect = RECT()
            user32.GetWindowRect(hwnd, ctypes.byref(rect))
            click_abs(rect.left + cx, rect.top + cy)
            return True
    return False

def main():
    report_dir = Path("f:/codex/postman-cn/https-github-com-hlmd-postman-cn/reports")
    report_dir.mkdir(exist_ok=True)
    ts = int(time.time())
    audit_dir = report_dir / f"full-audit-{ts}"
    audit_dir.mkdir(exist_ok=True)

    windows = find_postman_window()
    if not windows:
        print("ERROR: No Postman window found", file=sys.stderr)
        sys.exit(1)

    hwnd, title = windows[0]
    print(f"Postman: {title}", file=sys.stderr)
    user32.SetForegroundWindow(hwnd)
    time.sleep(0.5)

    ocr = RapidOCR()
    print("OCR ready", file=sys.stderr)

    all_english = set()
    all_items_by_page = []

    def do_capture(label):
        img = str(audit_dir / f"{label}.png")
        capture_window(hwnd, img)
        result, _ = ocr(img)
        items = []
        if result:
            for bbox, text, score in result:
                cx = int(sum(p[0] for p in bbox) / 4)
                cy = int(sum(p[1] for p in bbox) / 4)
                items.append({"text": text.strip(), "cx": cx, "cy": cy, "score": round(score, 3)})
        # Save items
        with open(audit_dir / f"{label}-items.json", 'w', encoding='utf-8') as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
        # Extract english
        english = []
        for it in items:
            t = it["text"]
            if len(t) < 2 or len(t) > 200:
                continue
            if not re.search(r'[A-Za-z]', t):
                continue
            if re.match(r'^\d+\.\d+', t):
                continue
            if re.match(r'^https?://', t):
                continue
            if re.match(r'^[A-Z]{2,8}$', t):
                continue
            english.append(t)
        for e in english:
            all_english.add(e)
        all_items_by_page.append({"page": label, "items": items, "english": english})
        # Write OCR text
        with open(audit_dir / f"{label}-ocr.txt", 'w', encoding='utf-8') as f:
            f.write("\n".join(it["text"] for it in items))
        return items, english

    def click_text(target, find_img):
        found = find_and_click_text(hwnd, ocr, str(audit_dir / find_img), target)
        if found:
            time.sleep(1.5)
        return found

    # 1. Home
    print("1/12 Home", file=sys.stderr)
    do_capture("01-home")

    # 2. Click 集合
    print("2/12 Collections", file=sys.stderr)
    if click_text("集合", "02-find.png"):
        do_capture("02-collections")

    # 3. Click 环境
    print("3/12 Environments", file=sys.stderr)
    if click_text("环境", "03-find.png"):
        do_capture("03-environments")

    # 4. Click 历史
    print("4/12 History", file=sys.stderr)
    if click_text("历史", "04-find.png"):
        do_capture("04-history")

    # 5. Click on request (POST tab)
    print("5/12 Request", file=sys.stderr)
    if click_text("POST", "05-find.png"):
        do_capture("05-request")

    # 6. Click 授权 tab
    print("6/12 Authorization", file=sys.stderr)
    if click_text("授权", "06-find.png"):
        do_capture("06-authorization")

    # 7. Click 请求头 tab
    print("7/12 Headers", file=sys.stderr)
    if click_text("请求头", "07-find.png"):
        do_capture("07-headers")

    # 8. Click 正文 tab
    print("8/12 Body", file=sys.stderr)
    if click_text("正文", "08-find.png"):
        do_capture("08-body")

    # 9. Click 脚本 tab
    print("9/12 Scripts", file=sys.stderr)
    if click_text("脚本", "09-find.png"):
        do_capture("09-scripts")

    # 10. Click 设置 tab
    print("10/12 Settings tab", file=sys.stderr)
    if click_text("设置", "10-find.png"):
        do_capture("10-settings-tab")

    # 11. Click 规范
    print("11/12 Spec", file=sys.stderr)
    if click_text("规范", "11-find.png"):
        do_capture("11-spec")

    # 12. Click 流程
    print("12/12 Flow", file=sys.stderr)
    if click_text("流程", "12-find.png"):
        do_capture("12-flow")

    # Load dictionary
    dict_path = "f:/codex/postman-cn/https-github-com-hlmd-postman-cn/dictionaries/local-core.zh-CN.json"
    with open(dict_path, 'r', encoding='utf-8') as f:
        dictionary = json.load(f)
    known = {e['source'] for e in dictionary['entries']}

    sorted_english = sorted(all_english)
    untranslated = [t for t in sorted_english if t not in known]

    with open(audit_dir / "all-english.txt", 'w', encoding='utf-8') as f:
        for line in sorted_english:
            f.write(line + '\n')

    with open(audit_dir / "untranslated.txt", 'w', encoding='utf-8') as f:
        for line in untranslated:
            f.write(line + '\n')

    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "auditDir": str(audit_dir),
        "totalEnglish": len(sorted_english),
        "untranslatedCount": len(untranslated),
        "untranslated": untranslated[:300],
        "pages": [{"page": p["page"], "englishCount": len(p["english"]), "english": p["english"]} for p in all_items_by_page]
    }
    with open(audit_dir / "report.json", 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"\nDone. Dir: {audit_dir}", file=sys.stderr)
    print(f"English: {len(sorted_english)}, Untranslated: {len(untranslated)}", file=sys.stderr)
    print(json.dumps(report, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
