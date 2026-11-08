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
Start-LessonTest "講座 120　最終模試：午前"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '8a7f3f05993aaf0a8cd6e547acdc28e4259a9e5256754c0cfaa148a052914231' '最終模試午前：2^8-1=255'
exit (Complete-LessonTest -Results @($r) -LessonId 'land/plateau-final/120-final-am' -NextLesson 'plateau-final/121-final-pm')
