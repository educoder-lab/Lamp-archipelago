# 黒背景の装備 JPG → アルファ付き PNG（LockBits 高速版）
param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [int]$Threshold = 26
)

Add-Type -AssemblyName System.Drawing

$dir = Join-Path $RepoRoot 'docs\assets\common\equip'
if (-not (Test-Path -LiteralPath $dir)) {
  Write-Error "missing $dir"
  exit 1
}

$files = @(Get-ChildItem -LiteralPath $dir -File | Where-Object { $_.Extension -match '\.jpe?g$' })
$n = 0
foreach ($f in $files) {
  $src = [System.Drawing.Bitmap]::FromFile($f.FullName)
  try {
    $w = $src.Width
    $h = $src.Height
    $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    # 作業用 32bpp
    $work = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($work)
    $g.DrawImage($src, $rect)
    $g.Dispose()

    $bd = $work.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $stride = $bd.Stride
    $bytes = [Math]::Abs($stride) * $h
    $buf = New-Object byte[] $bytes
    [Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $buf, 0, $bytes)
    for ($i = 0; $i -lt $bytes; $i += 4) {
      $b = $buf[$i]
      $gg = $buf[$i + 1]
      $r = $buf[$i + 2]
      if ($r -le $Threshold -and $gg -le $Threshold -and $b -le $Threshold) {
        $buf[$i + 3] = 0
      } else {
        $lum = $r
        if ($gg -lt $lum) { $lum = $gg }
        if ($b -lt $lum) { $lum = $b }
        if ($lum -le ($Threshold + 36)) {
          $a = [int](255.0 * (($lum - $Threshold) / 36.0))
          if ($a -lt 0) { $a = 0 }
          if ($a -gt 255) { $a = 255 }
          $buf[$i + 3] = [byte]$a
        } else {
          $buf[$i + 3] = 255
        }
      }
    }
    [Runtime.InteropServices.Marshal]::Copy($buf, 0, $bd.Scan0, $bytes)
    $work.UnlockBits($bd)

    $out = Join-Path $dir ($f.BaseName + '.png')
    $work.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $work.Dispose()
    $n++
    Write-Host "OK $($f.Name) -> $(Split-Path $out -Leaf)"
  } finally {
    $src.Dispose()
  }
}
Write-Host "converted $n files (threshold=$Threshold)"
