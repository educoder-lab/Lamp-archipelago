# 黒背景 JPG → アルファ付き PNG（任意フォルダ）
param(
  [Parameter(Mandatory = $true)][string]$Dir,
  [string]$Filter = '*.jpg',
  [int]$Threshold = 26
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -LiteralPath $Dir)) {
  Write-Error "missing $Dir"
  exit 1
}

$files = @(Get-ChildItem -LiteralPath $Dir -File -Filter $Filter | Where-Object { $_.Extension -match '\.jpe?g$' })
$n = 0
foreach ($f in $files) {
  $src = [System.Drawing.Bitmap]::FromFile($f.FullName)
  try {
    $w = $src.Width
    $h = $src.Height
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
    # 真の黒背景だけ透過。暗い服（紺コート等）は max が高いので残す
    $soft = 18
    for ($i = 0; $i -lt $bytes; $i += 4) {
      $b = $buf[$i]
      $gg = $buf[$i + 1]
      $r = $buf[$i + 2]
      $mx = $r
      if ($gg -gt $mx) { $mx = $gg }
      if ($b -gt $mx) { $mx = $b }
      if ($mx -le $Threshold) {
        $buf[$i + 3] = 0
      } elseif ($mx -le ($Threshold + $soft) -and $r -le ($Threshold + $soft) -and $gg -le ($Threshold + $soft) -and $b -le ($Threshold + $soft)) {
        $a = [int](255.0 * (($mx - $Threshold) / [double]$soft))
        if ($a -lt 0) { $a = 0 }
        if ($a -gt 255) { $a = 255 }
        $buf[$i + 3] = [byte]$a
      } else {
        $buf[$i + 3] = 255
      }
    }
    [Runtime.InteropServices.Marshal]::Copy($buf, 0, $bd.Scan0, $bytes)
    $work.UnlockBits($bd)

    $out = Join-Path $Dir ($f.BaseName + '.png')
    $work.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $work.Dispose()
    $n++
    Write-Host "OK $($f.Name) -> $(Split-Path $out -Leaf)"
  } finally {
    $src.Dispose()
  }
}
Write-Host "converted $n files in $Dir"
