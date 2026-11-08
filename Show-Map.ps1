param(
  [switch]$NoOpen
)

$repoRoot = $PSScriptRoot
. (Join-Path $repoRoot '_grading\Invoke-AdventureSave.ps1')

$map = Join-Path $repoRoot 'docs\map.html'
if (-not (Test-Path -LiteralPath $map)) {
  Write-Host "docs\map.html がありません。先に .\_tools\Build-AllLessons.ps1 を実行してください。" -ForegroundColor Red
  exit 1
}

Write-AdventureMapData -Save (Get-AdventureSave)
Write-Host "ワールドマップに冒険の記録を同期しました: docs\save-data.js" -ForegroundColor Green
Write-Host "ブラウザ公開: https://educoder-lab.github.io/Lamp-archipelago/map.html" -ForegroundColor DarkCyan
Write-Host "（Pages は進捗を見られません。ローカルで Show-Map すると自分の灯が付きます）"

if (-not $NoOpen) {
  Start-Process $map
}
