Add-Type -AssemblyName System.Drawing
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$p = [System.Drawing.Bitmap]::FromFile((Join-Path $root 'docs\assets\common\_preview-equip.png'))
$hero = [System.Drawing.Bitmap]::FromFile((Join-Path $root 'docs\assets\common\hero-hold-bare.png'))
$W = $p.Width
$H = $p.Height
$cx = $W / 2.0
$cy = $H * 0.48

$lgx = 0.0; $lgy = 0.0; $ln = 0
$rgx = 0.0; $rgy = 0.0; $rn = 0
for ($y = 0; $y -lt $H; $y++) {
  for ($x = 0; $x -lt $W; $x++) {
    $c = $p.GetPixel($x, $y)
    if ($c.G -gt 220 -and $c.R -lt 60 -and $c.B -lt 60) {
      if ($x -lt ($W / 2)) { $lgx += $x; $lgy += $y; $ln++ }
      else { $rgx += $x; $rgy += $y; $rn++ }
    }
  }
}
$lgx /= [Math]::Max(1, $ln); $lgy /= [Math]::Max(1, $ln)
$rgx /= [Math]::Max(1, $rn); $rgy /= [Math]::Max(1, $rn)

# known hand centers in hero image
$lhX = 269.0 / $hero.Width * $W
$lhY = 426.0 / $hero.Height * $H
$rhX = 550.0 / $hero.Width * $W
$rhY = 577.0 / $hero.Height * $H

Write-Host ("preview {0}x{1} center {2:n1},{3:n1}" -f $W, $H, $cx, $cy)
Write-Host ("Lgreen {0:n1},{1:n1}  Lhand {2:n1},{3:n1}" -f $lgx, $lgy, $lhX, $lhY)
Write-Host ("Rgreen {0:n1},{1:n1}  Rhand {2:n1},{3:n1}" -f $rgx, $rgy, $rhX, $rhY)
Write-Host ("shield move lx {0:n2} ly {1:n2}" -f (($lhX - $lgx) / $W * 100), (($lhY - $lgy) / $H * 100))
Write-Host ("sword  move lx {0:n2} ly {1:n2}" -f (($rhX - $rgx) / $W * 100), (($rhY - $rgy) / $H * 100))
Write-Host ("target shield lx {0:n1} ly {1:n1}" -f (($lhX - $cx) / $W * 100), (($lhY - $cy) / $H * 100))
Write-Host ("target sword  lx {0:n1} ly {1:n1}" -f (($rhX - $cx) / $W * 100), (($rhY - $cy) / $H * 100))

$p.Dispose()
$hero.Dispose()
