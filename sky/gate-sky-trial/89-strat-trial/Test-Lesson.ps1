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
Start-LessonTest "講座 89　空の関門：ストラテジ総合"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'a78626d08291908e3d76d43988a05c65bf35935b4208f6103237fba6d8ca19d9' 'ストラテジ全域の午前問題レベル'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/gate-sky-trial/89-strat-trial' -NextLesson 'fortress-algorithm/90-trace-basic' -CourseNo 89 -ClearLine '三扉すべてが開き、雲の下に帝国の尖塔が見えた。' -TitleAward '雲裂き・略')
