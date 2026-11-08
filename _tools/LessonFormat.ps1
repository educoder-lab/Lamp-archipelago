function Get-RelativePathBetween {
  param([string]$FromDir, [string]$ToDir, [string]$File = 'README.md')
  $from = ($FromDir -replace '\\', '/').TrimEnd('/')
  $to = (($ToDir -replace '\\', '/').TrimEnd('/') + '/' + $File)
  $fa = @($from -split '/')
  $ta = @($to -split '/')
  $i = 0
  while ($i -lt $fa.Count -and $i -lt $ta.Count -and $fa[$i] -eq $ta[$i]) { $i++ }
  $up = $fa.Count - $i
  $down = $ta[$i..($ta.Count - 1)]
  $upParts = if ($up -gt 0) { 1..$up | ForEach-Object { '..' } } else { @() }
  $rel = @($upParts + $down)
  return ($rel -join '/')
}

function Get-WorldRelPath {
  param([string]$LessonPath)
  $depth = ($LessonPath -split '\\').Count
  if ($depth -eq 3) { return '../../../WORLD.md' }
  return ('../' * ($depth + 1)).TrimEnd('/') + '/WORLD.md'
}

function Get-LampTravelAdvisory {
  param($Lesson)
  $lines = [System.Collections.Generic.List[string]]::new()
  if ($Lesson.Realm -eq 'underground') {
    $lines.Add('**冒険メモ（ソフトロック）**: 地下は **#90** 以降が本編。空 **#87〜89 関門** を先に越えると物語がつながりやすいです。進行の強制はありません。')
  }
  if ($Lesson.Realm -eq 'land') {
    $lines.Add('**冒険メモ（ソフトロック）**: 台地は **#114** 以降推奨。地下 **#110〜113** まで済ませると安心です。強制はありません。')
  }
  if ($Lesson.CourseNo -eq 90) {
    $lines.Add('ここから **地下帝国** エリアに入ります。')
  }
  if ($Lesson.CourseNo -eq 114) {
    $lines.Add('ここから **大陸の台地** エリアに入ります。')
  }
  if ($lines.Count -eq 0) { return '' }
  return "## 冒険メモ`n`n$($lines -join "`n`n")`n"
}

function Format-LessonNav {
  param(
    $Lesson,
    $Prev,
    $Next,
    [string]$RepoRoot
  )
  $depth = ($Lesson.Path -split '\\').Count
  $curRoot = Join-Path $RepoRoot $Lesson.Path
  $curriculumRel = if ($depth -eq 3) { '../../../CURRICULUM.md' } else { ('../' * ($depth + 1)).TrimEnd('/') + '/CURRICULUM.md' }
  $worldRel = Get-WorldRelPath -LessonPath $Lesson.Path
  $glossaryRel = if ($depth -eq 3) { '../../../GLOSSARY.md' } else { ('../' * ($depth + 1)).TrimEnd('/') + '/GLOSSARY.md' }
  $titlesRel = if ($depth -eq 3) { '../../../TITLES.md' } else { ('../' * ($depth + 1)).TrimEnd('/') + '/TITLES.md' }
  $mapRel = if ($depth -eq 3) { '../../../docs/map.html' } else { ('../' * ($depth + 1)).TrimEnd('/') + '/docs/map.html' }
  $islandRel = '../README.md'
  $advisory = Get-LampTravelAdvisory -Lesson $Lesson
  $prevLine = '—'
  if ($Prev) {
    $p = Get-RelativePathBetween -FromDir $curRoot -ToDir (Join-Path $RepoRoot $Prev.Path) -File 'README.md'
    $prevLine = "[講座 $($Prev.CourseNo.ToString('00'))　$($Prev.Blurb)]($p)"
  }
  $nextProb = '—'
  $nextRead = '—'
  if ($Next) {
    $np = Get-RelativePathBetween -FromDir $curRoot -ToDir (Join-Path $RepoRoot $Next.Path) -File 'PROBLEMS.md'
    $nr = Get-RelativePathBetween -FromDir $curRoot -ToDir (Join-Path $RepoRoot $Next.Path) -File 'README.md'
    $nextProb = "[講座 $($Next.CourseNo.ToString('00'))　$($Next.Blurb)（問題）]($np)"
    $nextRead = "[講座 $($Next.CourseNo.ToString('00'))　$($Next.Blurb)（用語）]($nr)"
  }
  return @"
$advisory
## ナビ

| | リンク |
|---|--------|
| 前の講座 | $prevLine |
| 次の講座 | $nextProb |
| 次（用語） | $nextRead |
| この島・砦 | [$($Lesson.DomainTitle)]($islandRel) |
| 全体一覧 | [カリキュラム（全講座）]($curriculumRel) |
| 世界 | [WORLD.md]($worldRel) |
| 用語図鑑 | [GLOSSARY.md]($glossaryRel) |
| 称号 | [TITLES.md]($titlesRel) |
| ワールドマップ | [docs/map.html]($mapRel)（``.\Show-Map.ps1`` で記録つき） |
"@
}

function Format-LessonReadme {
  param($L, [string]$Nav, $Story)
  $head = "# $($L.TestTitle)"
  $loreBlock = if ($Story.ReadmeLore) { "## 物語`n`n$($Story.ReadmeLore.Trim())`n`n" } else { '' }
  $body = if ($L.ReadmeBody) { $L.ReadmeBody.Trim() } else { '' }
  if ($body) {
    $body = @"
$loreBlock## 分野

$($L.ExamField)

$body

## クエストへ

[PROBLEMS.md](./PROBLEMS.md) で演習 → ``.\Test-Lesson.ps1`` で採点。
"@
  } else {
    $body = @"
## 今日のねらい

$($L.Blurb)（$($L.ExamField)）

## クエストへ

[PROBLEMS.md](./PROBLEMS.md)
"@
  }
  return ($head + "`n`n" + $body + "`n" + $Nav)
}

function Format-LessonProblems {
  param($L, [string]$Nav, [int]$QuestionCount, $Story)
  $qblock = $L.ProblemBody.Trim()
  $req = if ($Story.Request) { "## 依頼`n`n$($Story.Request.Trim())`n`n" } else { '' }
  return @"
# $($L.TestTitle)

## できた状態

- フォルダ ``演習結果`` がある
- ``演習結果\answers.txt`` に **$QuestionCount 問**（``1:B`` 形式）

$req## 封印の問い

$qblock

## 採点

``````powershell
.\Test-Lesson.ps1
``````
$Nav
"@
}

function Write-CurriculumFile {
  param([string]$RepoRoot, $Lessons)
  $rows = foreach ($l in $Lessons) {
    $p = ($l.Path -replace '\\', '/')
    "| $($l.CourseNo.ToString('00')) | [$($l.TestTitle)]($p/README.md) | [$p/PROBLEMS.md]($p/PROBLEMS.md) |"
  }
  $n = $Lessons.Count
  $content = @"
# カリキュラム（全 $($n) 講座）

基本情報技術者試験の **出題範囲を小さく刻んだ網羅コース** です。  
最短合格用の割り切りではなく、**知識を積み上げる順** に並んでいます。

| 講座# | 用語（README） | 問題（PROBLEMS） |
|-------|----------------|------------------|
$($rows -join "`n")

## はじめ方

``````powershell
cd $($Lessons[0].Path -replace '/', '\')
.\Test-Lesson.ps1
``````

各講座の末尾 **ナビ** にも「次へ」があります。
"@
  Set-Content -LiteralPath (Join-Path $RepoRoot 'CURRICULUM.md') -Value $content -Encoding UTF8
}
