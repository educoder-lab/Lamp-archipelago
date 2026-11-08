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
Start-LessonTest "講座 93　午後トレース：再帰と応用"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'dafcb0a6550099f8af3a9b3707c0fbb9c368b4bdc75ceef5159bd8516498e616' 'f(4)=4×3×2×1=24,再帰はスタックで管理'
exit (Complete-LessonTest -Results @($r) -LessonId 'underground/fortress-algorithm/93-trace-recurse' -NextLesson 'fortress-program/94-pseudo' -CourseNo 93 -ClearLine '式の呼び木が静かに収まり、衛兵が頷いた。' -TitleAward '')
