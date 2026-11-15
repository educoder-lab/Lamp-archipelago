Add-Type -AssemblyName System.Drawing
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$hero = [System.Drawing.Bitmap]::FromFile((Join-Path $root 'docs\assets\common\hero-sword-03.png'))
$shield = [System.Drawing.Bitmap]::FromFile((Join-Path $root 'docs\assets\common\equip\back-shield-05.png'))
$W = 440
$H = [int]($W * 1.35)
$out = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($out)
$g.Clear([System.Drawing.Color]::FromArgb(255, 20, 16, 40))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($hero, 0, 0, $W, $H)
$cx = $W / 2.0
$cy = $H * 0.48
$lx = -2.0; $ly = -14.0; $ww = 34.0; $hh = 38.0
$dw = $ww * $W / 100.0
$dh = $hh * $H / 100.0
$state = $g.Save()
$g.TranslateTransform([single]($cx + $lx * $W / 100.0), [single]($cy + $ly * $H / 100.0))
$g.DrawImage($shield, [single](-$dw * 0.5), [single](-$dh * 0.5), [single]$dw, [single]$dh)
$g.Restore($state)
$path = Join-Path $root 'docs\assets\common\_preview-back.png'
$out.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $out.Dispose(); $hero.Dispose(); $shield.Dispose()
Write-Host "wrote $path"
