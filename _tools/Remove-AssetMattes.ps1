# スプライト JPG → 透過 PNG（絵柄はそのまま、マット除去）
# 用法: .\_tools\Remove-AssetMattes.ps1 [-Force]
param(
  [switch]$Force
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $PSScriptRoot
if (-not (Test-Path 'node_modules\@imgly\background-removal-node')) {
  npm install --no-fund --no-audit
}
$argsList = @('remove-asset-mattes.mjs')
if ($Force) { $argsList += '--force' }
node @argsList
Set-Location $root
