# 剣付き後ろ姿ヒーロー PNG 化 + たすき角度の背中盾プレート生成
# StrapAngleDeg: clockwise degrees from upright (draw code does not rotate)
param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [int]$Threshold = 22,
  [double]$StrapAngleDeg = 20
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

# --- hero-sword-01..07 ---
1..7 | ForEach-Object {
  $n = '{0:D2}' -f $_
  $candidates = @(
    (Join-Path $staging "hero-sword-$n.jpg"),
    (Join-Path $staging "hero-sword-$n.png"),
    (Join-Path $common "hero-sword-$n.jpg")
  )
  $srcPath = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
  if (-not $srcPath) { Write-Warning "missing hero-sword-$n"; return }
  $src = [System.Drawing.Bitmap]::FromFile($srcPath)
  try {
    $png = Convert-BlackToAlpha $src $Threshold
    try {
      Save-Png $png (Join-Path $common "hero-sword-$n.png")
      Write-Host "OK hero-sword-$n.png"
    } finally { $png.Dispose() }
  } finally { $src.Dispose() }
}

# --- back-shield-01..18 : growth face, tilted to baldric (upper-right → lower-left) ---
1..18 | ForEach-Object {
  $n = '{0:D2}' -f $_
  $srcPath = Join-Path $growth "shield-$n.jpg"
  if (-not (Test-Path $srcPath)) { Write-Warning "skip $srcPath"; return }
  $src = [System.Drawing.Bitmap]::FromFile($srcPath)
  try {
    $size = 1024
    $canvas = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.Clear([System.Drawing.Color]::Black)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TranslateTransform($size / 2, $size / 2)
    # たすき: 右上→左下。盾表を見せつつ同じ傾き
    $g.RotateTransform([single]$StrapAngleDeg)
    $fit = [Math]::Min($size / [double]$src.Width, $size / [double]$src.Height) * 0.78
    $dw = $src.Width * $fit
    $dh = $src.Height * $fit
    $g.DrawImage($src, [single](-$dw / 2), [single](-$dh / 2), [single]$dw, [single]$dh)
    $g.Dispose()
    $png = Convert-BlackToAlpha $canvas $Threshold
    $canvas.Dispose()
    try {
      Save-Png $png (Join-Path $equip "back-shield-$n.png")
      Write-Host "OK back-shield-$n.png"
    } finally { $png.Dispose() }
  } finally { $src.Dispose() }
}

Write-Host 'Done Build-BackEquip'
