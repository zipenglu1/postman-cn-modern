param(
    [string]$OutputDir = "f:\codex\postman-cn\https-github-com-hlmd-postman-cn\reports\ocr-capture"
)

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Runtime.InteropServices

Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WinAPI {
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
    [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr hWnd, IntPtr hdcBlt, uint nFlags);
    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left, Top, Right, Bottom; }
}
"@

if (-not (Test-Path $OutputDir)) { New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null }

# Find Postman window
$proc = Get-Process Postman -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero } | Select-Object -First 1
if (-not $proc) {
    Write-Host "ERROR: No Postman window found"
    exit 1
}

$hwnd = $proc.MainWindowHandle
Write-Host "Postman window: PID=$($proc.Id) Title='$($proc.MainWindowTitle)'"

# Bring to foreground
[WinAPI]::SetForegroundWindow($hwnd) | Out-Null
Start-Sleep -Milliseconds 500

# Get window rect
$rect = New-Object WinAPI+RECT
[WinAPI]::GetWindowRect($hwnd, [ref]$rect) | Out-Null
$width = $rect.Right - $rect.Left
$height = $rect.Bottom - $rect.Top
Write-Host "Window size: ${width}x${height}"

# Capture screenshot using PrintWindow
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.CopyFromScreen($rect.Left, $rect.Top, 0, 0, [System.Drawing.Size]::new($width, $height))

$screenshotPath = Join-Path $OutputDir "postman-capture.png"
$bmp.Save($screenshotPath, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bmp.Dispose()
Write-Host "Screenshot saved: $screenshotPath"

# Use Windows OCR to extract text
try {
    Add-Type -AssemblyName "Windows.Graphics.Ocr, Version=10.0.19041.0, Culture=neutral, PublicKeyToken=null, ContentType=WindowsRuntime" -ErrorAction Stop

    $bitmap = [Windows.Graphics.Imaging.SoftwareBitmap]::CreateCopy($screenshotPath)
    $ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("en-US"))
    $ocrResult = $ocrEngine.RecognizeAsync($bitmap).GetAwaiter().GetResult()

    $fullText = $ocrResult.Text
    $lines = $fullText -split "`n" | Where-Object { $_.Trim().Length -gt 0 }

    $ocrPath = Join-Path $OutputDir "ocr-text.txt"
    $fullText | Out-File -FilePath $ocrPath -Encoding UTF8
    Write-Host "`nOCR text saved: $ocrPath"
    Write-Host "`n--- Extracted text lines ---"
    $i = 0
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed.Length -gt 1) {
            Write-Host "[$i] $trimmed"
            $i++
        }
    }
    Write-Host "`nTotal lines: $i"
} catch {
    Write-Host "OCR not available: $($_.Exception.Message)"
    Write-Host "Screenshot saved at: $screenshotPath"
}
