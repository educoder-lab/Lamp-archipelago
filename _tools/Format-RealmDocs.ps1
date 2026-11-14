function Format-LessonAsciiMap {
  param([object[]]$Lessons)
  $nums = $Lessons | Sort-Object CourseNo | ForEach-Object { $_.CourseNo.ToString("00") }
  $line = ($nums -join " - ")
  $path = $Lessons | Sort-Object CourseNo | ForEach-Object { $_.Slug } | Select-Object -First 8
  $pathLine = if ($path.Count -gt 0) { ($path -join "  ") + $(if ($Lessons.Count -gt 8) { "  ..." } else { "" }) } else { "" }
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
  . (Join-Path $RepoRoot "_tools\Story-Entries.ps1")
  $prologues = Get-LampRealmPrologues
  $realmDirs = [ordered]@{
    sky         = "左の道 — 盾（科目A）"
    underground = "右の道 — 剣（科目B）"
    land        = "大扉の奥 — 精神"
  }
  $realmHints = @{
    sky         = "下の **間** フォルダを、カリキュラム順に巡ってください。分野クリアで盾が成長します。"
    underground = "**剣房** ごとに科目B型の訓練があります。分野クリアで剣が成長します。"
    land        = "**精神の間** で模擬試験に挑みます。分野クリアで精神が成長します。"
  }
  foreach ($realm in $realmDirs.Keys) {
    $prologue = $prologues[$realm]
    $titleJa = $realmDirs[$realm]
    $hint = $realmHints[$realm]
    $content = @"
# $titleJa

[世界設定（WORLD）](../WORLD.md) · [冒険状況](../Show-Status.ps1) · [カリキュラム](../CURRICULUM.md)

## 章扉

$prologue

## この道の分野

$hint
"@
    $outPath = Join-Path $RepoRoot (Join-Path $realm "README.md")
    $utf8bom = New-Object System.Text.UTF8Encoding $true
    try { [System.IO.File]::WriteAllText($outPath, $content, $utf8bom) } catch { Write-Warning ("skip " + $outPath + ": " + $_.Exception.Message) }
  }
}