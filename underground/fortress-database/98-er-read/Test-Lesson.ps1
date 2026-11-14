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
Start-LessonTest "講座 98　科目B E-R図の読解"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '7e5ac5cad8225318f1b0b6d8ec32942a81b9cdb9d5b459caae08ce100f76bcb5' 'M:N解消=連関エンティティ,菱形=関連'
exit (Complete-LessonTest -Results @($r) -LessonId 'underground/fortress-database/98-er-read' -NextLesson 'fortress-database/99-sql-pm' -CourseNo 98 -ClearLine '石版の一角が白く染まり、地下の灯が 98 番目を刻んだ。' -TitleAwards '')
