# hero-hold-bare と slot-shield / slot-sword を揃える（黒背景→透過 PNG）
# 盾: growth の表デザインを少し傾けて左手持ち用プレートに
# 剣: 既存 tip-down slot を再キー、なければ growth を 180° 回転
param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [int]$Threshold = 22
)

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

function Convert-BlackToAlpha([System.Drawing.Bitmap]$src, [int]$thr) {
  $w = $src.Width; $h = $src.Height
  $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
  $work = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($work)
  $g.DrawImage($src, $rect)
  $g.Dispose()
  $bd = $work.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $stride = $bd.Stride
  $bytes = [Math]::Abs($stride) * $h
  $buf = New-Object byte[] $bytes
  [Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $buf, 0, $bytes)
  $soft = 18
  for ($i = 0; $i -lt $bytes; $i += 4) {
    $b = $buf[$i]; $gg = $buf[$i + 1]; $r = $buf[$i + 2]
    $mx = [Math]::Max($r, [Math]::Max($gg, $b))
    if ($mx -le $thr) {
      $buf[$i + 3] = 0
    } elseif ($mx -le ($thr + $soft) -and $r -le ($thr + $soft) -and $gg -le ($thr + $soft) -and $b -le ($thr + $soft)) {
      $a = [int](255.0 * (($mx - $thr) / [double]$soft))
      if ($a -lt 0) { $a = 0 }
      if ($a -gt 255) { $a = 255 }
      $buf[$i + 3] = [byte]$a
    } else {
      $buf[$i + 3] = 255
    }
  }
  [Runtime.InteropServices.Marshal]::Copy($buf, 0, $bd.Scan0, $bytes)
  $work.UnlockBits($bd)
  return $work
}

function Save-Png([System.Drawing.Bitmap]$bmp, [string]$path) {
  $dir = Split-Path $path -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
}

$common = Join-Path $RepoRoot 'docs\assets\common'
$equip = Join-Path $common 'equip'
$growth = Join-Path $common 'growth'
$staging = 'C:\Users\yuuda\.cursor\projects\c-Users-yuuda-OneDrive-Lamp-archipelago\assets'

# --- bare hero ---
$bareSrc = Join-Path $staging 'hero-hold-bare-new.jpg'
if (-not (Test-Path $bareSrc)) { throw "missing $bareSrc" }
$bareBmp = [System.Drawing.Bitmap]::FromFile($bareSrc)
try {
  $bareOut = Convert-BlackToAlpha $bareBmp $Threshold
  try {
    Save-Png $bareOut (Join-Path $common 'hero-hold-bare.png')
    # JPG も更新（フォールバック）
    $bareBmp.Save((Join-Path $common 'hero-hold-bare.jpg'), [System.Drawing.Imaging.ImageFormat]::Jpeg)
    Write-Host 'OK hero-hold-bare.png (empty hands)'
  } finally { $bareOut.Dispose() }
} finally { $bareBmp.Dispose() }

# --- shields from growth (face visible, slight held angle) ---
1..18 | ForEach-Object {
  $n = '{0:D2}' -f $_
  $srcPath = Join-Path $growth "shield-$n.jpg"
  if (-not (Test-Path $srcPath)) { Write-Warning "skip missing $srcPath"; return }
  $src = [System.Drawing.Bitmap]::FromFile($srcPath)
  try {
    $size = 1024
    $canvas = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.Clear([System.Drawing.Color]::Black)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TranslateTransform($size / 2, $size / 2)
    # 後ろ姿左手：表を見せつつ少し傾ける
    $g.RotateTransform(-18)
    $g.ScaleTransform(0.92, 1.0)
    $draw = [Math]::Min($src.Width, $src.Height) * 0.85
    $scale = ($size * 0.78) / $draw
    $dw = $src.Width * $scale
    $dh = $src.Height * $scale
    $g.DrawImage($src, [float](-$dw / 2), [float](-$dh / 2), [float]$dw, [float]$dh)
    $g.Dispose()
    $png = Convert-BlackToAlpha $canvas $Threshold
    $canvas.Dispose()
    try {
      Save-Png $png (Join-Path $equip "slot-shield-$n.png")
      Write-Host "OK slot-shield-$n.png"
    } finally { $png.Dispose() }
  } finally { $src.Dispose() }
}

# --- swords: prefer tip-down slot JPG/PNG staging, else rotate growth ---
1..7 | ForEach-Object {
  $n = '{0:D2}' -f $_
  $outPath = Join-Path $equip "slot-sword-$n.png"
  $existingPng = $outPath
  $existingJpg = Join-Path $equip "slot-sword-$n.jpg"
  $stagingNew = Join-Path $staging "slot-sword-$n-new.jpg"
  $srcPath = $null
  $rotate180 = $false
  if ((Test-Path $stagingNew) -and $_ -eq 1) {
    $srcPath = $stagingNew
  } elseif (Test-Path $existingJpg) {
    $srcPath = $existingJpg
  } elseif (Test-Path $existingPng) {
    # 再キーのみ
    $src = [System.Drawing.Bitmap]::FromFile($existingPng)
    try {
      # 既に PNG ならアルファ維持してコピー確定
      Save-Png $src $outPath
      Write-Host "OK slot-sword-$n.png (kept)"
    } finally { $src.Dispose() }
    return
  } else {
    $srcPath = Join-Path $growth "sword-$n.jpg"
    $rotate180 = $true
  }
  if (-not (Test-Path $srcPath)) { Write-Warning "skip sword $n"; return }
  $src = [System.Drawing.Bitmap]::FromFile($srcPath)
  try {
    $sizeW = 768
    $sizeH = 1024
    $canvas = New-Object System.Drawing.Bitmap $sizeW, $sizeH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.Clear([System.Drawing.Color]::Black)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TranslateTransform($sizeW / 2, $sizeH / 2)
    if ($rotate180) { $g.RotateTransform(180) }
    # グリップをやや上（右手付近）に寄せるため全体を上へ
    $fit = [Math]::Min($sizeW / [double]$src.Width, $sizeH / [double]$src.Height) * 0.88
    $dw = $src.Width * $fit
    $dh = $src.Height * $fit
    $g.DrawImage($src, [float](-$dw / 2), [float](-$dh / 2 - $sizeH * 0.04), [float]$dw, [float]$dh)
    $g.Dispose()
    $png = Convert-BlackToAlpha $canvas $Threshold
    $canvas.Dispose()
    try {
      Save-Png $png $outPath
      Write-Host "OK slot-sword-$n.png"
    } finally { $png.Dispose() }
  } finally { $src.Dispose() }
}

Write-Host 'Done Build-EquipSlots'
