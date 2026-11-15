Add-Type -AssemblyName System.Drawing
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$hero = [System.Drawing.Bitmap]::FromFile((Join-Path $root 'docs\assets\common\hero-hold-bare.png'))
$shield = [System.Drawing.Bitmap]::FromFile((Join-Path $root 'docs\assets\common\equip\slot-shield-05.png'))
$sword = [System.Drawing.Bitmap]::FromFile((Join-Path $root 'docs\assets\common\equip\slot-sword-03.png'))
$W = 440
$H = [int]($W * 1.35)
$out = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($out)
$g.Clear([System.Drawing.Color]::FromArgb(255, 20, 16, 40))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$cx = $W / 2.0
$cy = $H * 0.48

function Draw-Child([System.Drawing.Bitmap]$img, [double]$lx, [double]$ly, [double]$ww, [double]$hh, [double]$rot, [double]$ax, [double]$ay) {
  $ux = $script:W / 100.0
  $uy = $script:H / 100.0
  $dw = $ww * $ux
  $dh = $hh * $uy
  $state = $script:g.Save()
  $script:g.TranslateTransform([single]($script:cx + $lx * $ux), [single]($script:cy + $ly * $uy))
  $script:g.RotateTransform([single]($rot * 180.0 / [Math]::PI))
  $script:g.DrawImage($img, [single](-$dw * $ax), [single](-$dh * $ay), [single]$dw, [single]$dh)
  $script:g.Restore($state)
}

# 本番と同じ: 体→盾→剣
$g.DrawImage($hero, 0, 0, $W, $H)
Draw-Child $shield -19.0 -11.0 30.0 34.0 -0.02 0.50 0.48
Draw-Child $sword 14.0 2.0 14.0 38.0 0.03 0.5 0.30

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Lime), 2
$g.DrawEllipse($pen, [single]($cx - 19 * $W / 100 - 4), [single]($cy - 11 * $H / 100 - 4), 8, 8)
$g.DrawEllipse($pen, [single]($cx + 14 * $W / 100 - 4), [single]($cy + 2 * $H / 100 - 4), 8, 8)

$outPath = Join-Path $root 'docs\assets\common\_preview-equip.png'
$out.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $out.Dispose(); $hero.Dispose(); $shield.Dispose(); $sword.Dispose()
Write-Host "wrote $outPath"
