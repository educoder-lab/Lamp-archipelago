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
Start-LessonTest "講座 06　浮動小数点と誤差"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '5cef871c82f07e5b6a5d92c7f4821ebf8b747c996812cad5e0d22e2bf3e050fa' '桁落ち=引き算で有効桁↓'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-foundation/06-float' -NextLesson 'island-foundation/07-char' -CourseNo 6 -ClearLine '泡が一つ割れ、正しい丸さだけが残った。' -TitleAwards '')
