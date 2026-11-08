# 講座一括生成
param([switch]$Force)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
. (Join-Path $repoRoot '_grading\Invoke-LessonAssert.ps1')
. (Join-Path $PSScriptRoot 'LessonTestTemplate.ps1')
. (Join-Path $PSScriptRoot 'LessonFormat.ps1')
. (Join-Path $PSScriptRoot 'Format-RealmDocs.ps1')
. (Join-Path $PSScriptRoot 'LessonData.ps1')
. (Join-Path $PSScriptRoot 'Story-Entries.ps1')

$bootstrap = Get-LessonTestBootstrap
$lessons = @(Get-LampLessonCatalog)
$domainStories = Get-LampDomainStories

function Escape-ForPsSingleQuotedString {
  param([string]$Text)
  if (-not $Text) { return '' }
  return ($Text -replace "'", "''")
}

for ($i = 0; $i -lt $lessons.Count; $i++) {
  $L = $lessons[$i]
  $prev = if ($i -gt 0) { $lessons[$i - 1] } else { $null }
  $next = if ($i -lt $lessons.Count - 1) { $lessons[$i + 1] } else { $null }
  $story = Get-LampStoryForLesson -Lesson $L
  $nav = Format-LessonNav -Lesson $L -Prev $prev -Next $next -RepoRoot $repoRoot

  $lessonDir = Join-Path $repoRoot $L.Path
  New-Item -ItemType Directory -Path $lessonDir -Force | Out-Null

  $readme = Format-LessonReadme -L $L -Nav $nav -Story $story
  $prob = Format-LessonProblems -L $L -Nav $nav -QuestionCount $L.Answers.Count -Story $story

  $readme | Set-Content -LiteralPath (Join-Path $lessonDir 'README.md') -Encoding UTF8
  $prob | Set-Content -LiteralPath (Join-Path $lessonDir 'PROBLEMS.md') -Encoding UTF8

  $hash = (Get-NormalizedHash -Text ($L.Answers -join "`n"))
  $lessonId = "$($L.Realm)/$($L.Domain)/$($L.Slug)"
  $nextLabel = if ($next) { "$($next.Domain)/$($next.Slug)" } else { $L.Next }
  $clearEsc = Escape-ForPsSingleQuotedString $story.ClearLine
  $titleEsc = Escape-ForPsSingleQuotedString ($story.TitleAward)
  $testBody = @"
$bootstrap
Start-LessonTest "$($L.TestTitle)"
`$r = Assert-AnswerHash (Join-Path `$PSScriptRoot '演習結果\answers.txt') '$hash' '$($L.Hint)'
exit (Complete-LessonTest -Results @(`$r) -LessonId '$lessonId' -NextLesson '$nextLabel' -CourseNo $($L.CourseNo) -ClearLine '$clearEsc' -TitleAward '$titleEsc')
"@
  Set-Content -LiteralPath (Join-Path $lessonDir 'Test-Lesson.ps1') -Value $testBody -Encoding UTF8
  Write-Host "Lesson $($L.CourseNo.ToString('00')): $($L.Path)"
}

$grouped = $lessons | Group-Object { "$($_.Realm)|$($_.Domain)" }
foreach ($g in $grouped) {
  $parts = $g.Name -split '\|'
  $realm, $domain = $parts[0], $parts[1]
  $title = ($g.Group | Select-Object -First 1).DomainTitle
  $sorted = @($g.Group | Sort-Object CourseNo)
  $ds = $domainStories[$domain]
  $synopsis = if ($ds) { $ds.Synopsis } else { '' }
  $npc = if ($ds) { $ds.Npc } else { '案内人' }
  $map = Format-LessonAsciiMap -Lessons $sorted
  $rows = foreach ($l in $sorted) {
    $np = if ($l.CourseNo -lt $lessons.Count) {
      $nx = $lessons[$l.CourseNo]
      "[次: 講座 $($nx.CourseNo.ToString('00'))](../$($nx.Slug)/README.md)"
    } else { '—' }
    "| $($l.CourseNo.ToString('00')) | [$($l.Slug)](./$($l.Slug)/README.md) | $($l.Blurb) | $np |"
  }
  $first = $sorted[0]
  $domainDir = Join-Path $repoRoot (Join-Path $realm $domain)
  $worldRel = if ($realm -eq 'sky') { '../../WORLD.md' } else { '../../WORLD.md' }
  $content = @"
# $title

[カリキュラム全体](../../CURRICULUM.md) · [WORLD](../../WORLD.md) · [冒険状況](../../Show-Status.ps1)

## あらすじ

**$npc** — $synopsis

$map

## 講座

| 講座# | フォルダ | ねらい | 次へ |
|-------|----------|--------|------|
$($rows -join "`n")

``````powershell
cd $realm\$domain\$($first.Slug)
.\Test-Lesson.ps1
``````
"@
  Set-Content -LiteralPath (Join-Path $domainDir 'README.md') -Value $content -Encoding UTF8
}

Write-CurriculumFile -RepoRoot $repoRoot -Lessons $lessons
Write-RealmChapterReadmes -RepoRoot $repoRoot -Lessons $lessons
Write-Host "Done. $($lessons.Count) lessons."
