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
Start-LessonTest "講座 88　空の関門：マネジメント総合"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '65322709d0fef1ce700fa3b900133b41b81408cbf07fa1e7120afd0d387a59f8' 'マネジメント全域の午前問題レベル'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/gate-sky-trial/88-mgmt-trial' -NextLesson 'gate-sky-trial/89-strat-trial')
