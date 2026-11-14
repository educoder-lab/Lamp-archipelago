# 称号マスタ（Phase 3）— Build が Test-Lesson / TITLES.md に反映

function Get-LampMilestoneTitles {
  return @{
    1   = 'ビットの灯'
    12  = '灯台の証'
    20  = '塔の見習い'
    21  = 'グラフの渡り手'
    87  = '雲裂き・技'
    88  = '雲裂き・管'
    89  = '雲裂き・略'
    90  = '地下入り'
    93  = 'トレースの証'
    113 = '深層の読者'
    121 = '諸島の旅人'
  }
}

function Get-LampDomainClearTitles {
  return @{
    'island-foundation'  = '基礎理論の灯守'
    'island-algorithm'   = '時計塔の通行手形'
    'island-hardware'    = '工房の認定'
    'island-system'      = '系譜の印'
    'island-software'    = '書庫の鍵'
    'island-database'    = '水晶の守人'
    'island-network'     = '航路の墨'
    'island-security'    = '盾の紋章'
    'island-media'       = '絵師の落款'
    'island-corporate'   = '港の公印'
    'island-business'    = '羅針盤の印'
    'island-system-plan' = '企画港の許可'
    'island-dev-tech'    = '棟梁の証'
    'island-project'     = '吊橋の通行証'
    'island-service'     = '灯火番の誓'
    'island-audit'       = '記録官の朱'
    'gate-sky-trial'     = '空裂きの誓約'
    'fortress-algorithm' = '石版の鑑定士'
    'fortress-program'   = '擬似言語工の章'
    'fortress-database'  = '地下水晶庫の鍵'
    'fortress-network'   = '伏線要塞の印'
    'fortress-security'  = '盾壁団の楯'
    'fortress-deep'      = '深層の解読者'
    'plateau-mock-am'    = '科目A演習章'
    'plateau-mock-pm'    = '科目B軍議章'
    'plateau-final'      = '大陸の征戦者'
  }
}

function Get-LampTitleAwardsForLesson {
  param($Lesson, [string]$PrimaryTitleAward, [hashtable]$DomainLastCourseNo)
  $titles = [System.Collections.Generic.List[string]]::new()
  if ($PrimaryTitleAward) { $titles.Add($PrimaryTitleAward) }
  $milestones = Get-LampMilestoneTitles
  if ($milestones.ContainsKey($Lesson.CourseNo)) {
    $m = $milestones[$Lesson.CourseNo]
    if ($titles -notcontains $m) { $titles.Add($m) }
  }
  $domainTitles = Get-LampDomainClearTitles
  $lastNo = $DomainLastCourseNo[$Lesson.Domain]
  if ($lastNo -eq $Lesson.CourseNo -and $domainTitles.ContainsKey($Lesson.Domain)) {
    $d = $domainTitles[$Lesson.Domain]
    if ($titles -notcontains $d) { $titles.Add($d) }
  }
  return @($titles | Select-Object -Unique)
}

function Write-TitlesReferenceFile {
  param([string]$RepoRoot, $Lessons, [hashtable]$DomainLastCourseNo)
  . $PSScriptRoot\Story-Entries.ps1
  $milestones = Get-LampMilestoneTitles
  $domainTitles = Get-LampDomainClearTitles

  $milestoneRows = foreach ($no in ($milestones.Keys | Sort-Object)) {
    $l = $Lessons | Where-Object { $_.CourseNo -eq $no } | Select-Object -First 1
    $label = if ($l) { $l.Blurb } else { '—' }
    "| $($no.ToString('00')) | $($milestones[$no]) | $label |"
  }

  $domainRows = foreach ($d in ($domainTitles.Keys | Sort-Object)) {
    $last = $DomainLastCourseNo[$d]
    $l = $Lessons | Where-Object { $_.Domain -eq $d } | Select-Object -First 1
    $name = if ($l) { $l.DomainTitle } else { $d }
    "| $name (#$($last.ToString('00'))完) | $($domainTitles[$d]) |"
  }

  $content = @"
# 称号一覧（自動生成）

[冒険状況](./Show-Status.ps1) · [WORLD](./WORLD.md)

ビルド: ``Build-AllLessons.ps1``。重複はセーブ時に弾かれます。

## マイルストーン（講座#）

| 講座# | 称号 | ねらい |
|-------|------|--------|
$($milestoneRows -join "`n")

## 島・砦・台地クリア（そのドメイン最終講座）

| エリア完走 | 称号 |
|------------|------|
$($domainRows -join "`n")
"@
  Set-Content -LiteralPath (Join-Path $RepoRoot 'TITLES.md') -Value $content -Encoding UTF8
}
