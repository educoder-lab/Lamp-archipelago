# 講座一括生成
param([switch]$Force)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
. (Join-Path $repoRoot '_grading\Invoke-LessonAssert.ps1')
. (Join-Path $PSScriptRoot 'LessonTestTemplate.ps1')
. (Join-Path $PSScriptRoot 'LessonFormat.ps1')
. (Join-Path $PSScriptRoot 'LessonData.ps1')

$bootstrap = Get-LessonTestBootstrap
$lessons = @(Get-LampLessonCatalog)

function New-AnswerHash {
  param([string[]]$Lines)
  return (Get-NormalizedHash -Text ($Lines -join "`n"))
}

for ($i = 0; $i -lt $lessons.Count; $i++) {
  $L = $lessons[$i]
  $prev = if ($i -gt 0) { $lessons[$i - 1] } else { $null }
  $next = if ($i -lt $lessons.Count - 1) { $lessons[$i + 1] } else { $null }
  $nav = Format-LessonNav -Lesson $L -Prev $prev -Next $next -RepoRoot $repoRoot

  $lessonDir = Join-Path $repoRoot $L.Path
  New-Item -ItemType Directory -Path $lessonDir -Force | Out-Null

  $readme = Format-LessonReadme -L $L -Nav $nav
  $prob = Format-LessonProblems -L $L -Nav $nav -QuestionCount $L.Answers.Count

  $readme | Set-Content -LiteralPath (Join-Path $lessonDir 'README.md') -Encoding UTF8
  $prob | Set-Content -LiteralPath (Join-Path $lessonDir 'PROBLEMS.md') -Encoding UTF8

  $hash = New-AnswerHash -Lines $L.Answers
  $lessonId = "$($L.Realm)/$($L.Domain)/$($L.Slug)"
  $nextLabel = if ($next) { "$($next.Domain)/$($next.Slug)" } else { $L.Next }
  $testBody = @"
$bootstrap
Start-LessonTest "$($L.TestTitle)"
`$r = Assert-AnswerHash (Join-Path `$PSScriptRoot '演習結果\answers.txt') '$hash' '$($L.Hint)'
exit (Complete-LessonTest -Results @(`$r) -LessonId '$lessonId' -NextLesson '$nextLabel')
"@
  Set-Content -LiteralPath (Join-Path $lessonDir 'Test-Lesson.ps1') -Value $testBody -Encoding UTF8
  Write-Host "Lesson $($L.CourseNo.ToString('00')): $($L.Path)"
}

$grouped = $lessons | Group-Object { "$($_.Realm)|$($_.Domain)" }
foreach ($g in $grouped) {
  $parts = $g.Name -split '\|'
  $realm, $domain = $parts[0], $parts[1]
  $title = ($g.Group | Select-Object -First 1).DomainTitle
  $rows = foreach ($l in ($g.Group | Sort-Object CourseNo)) {
    $np = if ($l.CourseNo -lt $lessons.Count) {
      $nx = $lessons[$l.CourseNo] # CourseNo is 1-based, index = CourseNo
      "[次: 講座 $($nx.CourseNo.ToString('00'))](../$($nx.Slug)/README.md)"
    } else { '—' }
    "| $($l.CourseNo.ToString('00')) | [$($l.Slug)](./$($l.Slug)/README.md) | $($l.Blurb) | $np |"
  }
  $first = ($g.Group | Sort-Object CourseNo | Select-Object -First 1)
  $domainDir = Join-Path $repoRoot (Join-Path $realm $domain)
  $content = @"
# $title

[カリキュラム全体](../../CURRICULUM.md)

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
Write-Host "Done. $($lessons.Count) lessons."
