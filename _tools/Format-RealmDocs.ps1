function Format-LessonAsciiMap {
  param([object[]]$Lessons)
  $nums = $Lessons | Sort-Object CourseNo | ForEach-Object { $_.CourseNo.ToString('00') }
  $line = ($nums -join ' ─ ')
  $path = $Lessons | Sort-Object CourseNo | ForEach-Object { $_.Slug } | Select-Object -First 8
  $pathLine = if ($path.Count -gt 0) { ($path -join '  ') + $(if ($Lessons.Count -gt 8) { '  …' } else { '' }) } else { '' }
  return @"

## マップ（講座番号）

``````
$line
$pathLine
``````
"@
}

function Write-RealmChapterReadmes {
  param([string]$RepoRoot, $Lessons)
  . (Join-Path $RepoRoot '_tools\Story-Entries.ps1')
  $prologues = Get-LampRealmPrologues
  $realmDirs = @{
    sky         = '空 — 雲上の諸島'
    underground = '地下帝国'
    land        = '陸地 — 大陸の台地'
  }
  foreach ($realm in $realmDirs.Keys) {
    $prologue = $prologues[$realm]
    $content = @"
# $($realmDirs[$realm])

[世界設定（WORLD）](../WORLD.md) · [冒険状況](../Show-Status.ps1) · [カリキュラム](../CURRICULUM.md)

## 章扉

$prologue

## エリア内の島・砦・台地

$( switch ($realm) {
    'sky' { '下の **島** フォルダを、カリキュラム順に巡ってください。' }
    'underground' { '**砦** ごとに科目B型の訓練があります。' }
    'land' { '**台地** で模擬試験に挑みます。' }
  } )
"@
    Set-Content -LiteralPath (Join-Path $RepoRoot (Join-Path $realm 'README.md')) -Value $content -Encoding UTF8
  }
}
