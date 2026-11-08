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
Start-LessonTest "講座 14　二分探索"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '3a7e04c7465c234ea708a172cdf5ca1fe043bd95f4427b0d6c722504fca5bfc0' '二分探索=ソート済み前提,O(log n)'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-algorithm/14-bsearch' -NextLesson 'island-algorithm/15-bubble' -CourseNo 14 -ClearLine '灯がひとつ、静かに灯った。' -TitleAward '')
