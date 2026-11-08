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
Start-LessonTest "講座 79　運用・保守とDevOps"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '94f0768be88d2e4ad9bee724cc2ac3215764e4866b90f07266cb1c8be220e2b8' 'DevOps=開発+運用,CI=継続的統合'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-dev-tech/79-devops' -NextLesson 'island-project/80-pmbok')
