if (-not (Get-Command Start-LessonTest -ErrorAction SilentlyContinue)) {
  $dir = $PSScriptRoot
  $repoRoot = $null
  while ($dir) {
    if (Test-Path (Join-Path $dir '_grading\Invoke-LessonAssert.ps1')) { $repoRoot = $dir; break }
    $parent = Split-Path $dir -Parent
    if (-not $parent -or $parent -eq $dir) { break }
    $dir = $parent
  }
  if (-not $repoRoot) { Write-Error 'リポジトリルートが見つかりません。'; exit 1 }
  . (Join-Path $repoRoot '_grading\Resolve-Lesson.ps1')
  $rel = Get-LessonRelativePath -LessonDir $PSScriptRoot
  $realm = Get-RealmFromPath -Path $PSScriptRoot
  & (Join-Path $repoRoot 'Test-Lesson.ps1') -Lesson $rel -Realm $realm
  exit $LASTEXITCODE
}
Start-LessonTest "講座 42　SQL SELECT文"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '67b61bc35308745a16ad3310d939d0711e850f57f8cb26a95214b65071a8e0d7' 'LIKE "田%"=田で始まる,DISTINCT=重複除外'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-database/42-sql-select' -NextLesson 'island-database/43-sql-join' -CourseNo 42 -ClearLine '灯がひとつ、静かに灯った。' -TitleAward '')
