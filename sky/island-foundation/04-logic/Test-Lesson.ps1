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
Start-LessonTest "講座 04　論理演算"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'e208c39bc67357f734b8f7418d6a27b69c5ce54bc1e7b123cccb5d72cadcf477' 'AND=両方1,OR=どちらか1,XOR=異なれば1'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-foundation/04-logic' -NextLesson 'island-foundation/05-shift' -CourseNo 4 -ClearLine '雲門がすっと開き、霧の向こうに三つの路が見えた。' -TitleAward '')
