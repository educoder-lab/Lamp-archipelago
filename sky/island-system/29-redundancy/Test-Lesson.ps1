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
Start-LessonTest "講座 29　冗長化と多重化"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'bca9f4a15ee2934d65d78fca043389c0b0c922508fa5f57c10c68883ce22e5aa' '並列稼働率=1-(1-A)×(1-B)'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-system/29-redundancy' -NextLesson 'island-system/30-perf' -CourseNo 29 -ClearLine '系譜の館の冗長の梁が一つ光り、灯が 29 番目に繋がった。' -TitleAwards '')
