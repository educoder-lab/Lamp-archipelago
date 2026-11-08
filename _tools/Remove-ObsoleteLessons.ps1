# 島ごとに 01- から始まっていた旧フォルダを削除（通し番号移行後）
$repoRoot = Split-Path $PSScriptRoot -Parent
. (Join-Path $PSScriptRoot 'LessonData.ps1')
$current = @(Get-LampLessonCatalog | ForEach-Object { Join-Path $repoRoot $_.Path })
$obsolete = @(
  '01-order','01-cpu','01-os','01-license','01-key','01-tcpip','01-cia','01-ui',
  '01-entity','01-mgmt','01-sitemap','01-model','01-wbs','01-incident','01-log','01-mix',
  '01-trace','01-output','01-sql','01-mask','01-risk','01-combo','01-set'
)
Get-ChildItem -LiteralPath (Join-Path $repoRoot 'sky'), (Join-Path $repoRoot 'underground'), (Join-Path $repoRoot 'land') -Recurse -Directory |
  Where-Object { $obsolete -contains $_.Name } |
  ForEach-Object {
    $full = $_.FullName
    if ($current -notcontains $full) {
      Write-Host "Remove $($_.FullName)"
      Remove-Item -LiteralPath $full -Recurse -Force
    }
  }
