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
Start-LessonTest "講座 20　ハッシュ法"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '253c6c4bd961bb44e8ef9513812a367d4e1ab47016413b8462025f28068600e0' 'ハッシュ=O(1),衝突=コリジョン'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-algorithm/20-hash' -NextLesson 'island-algorithm/21-graph' -CourseNo 20 -ClearLine '灯がひとつ、静かに灯った。' -TitleAward '')
