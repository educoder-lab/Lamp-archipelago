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
Start-LessonTest "講座 12　オートマトンと形式言語"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '7efcf5f8293e86a25da9a8a6ec7128b008002040030883d87c0b29d98ab35a9b' 'a*=0回以上,逆ポーランドはスタック'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-foundation/12-automata' -NextLesson 'island-algorithm/13-array' -CourseNo 12 -ClearLine '灯台の最上階まで、灯が一気に繋がった。' -TitleAward '灯台の証')
