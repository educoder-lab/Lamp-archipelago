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
Start-LessonTest "講座 18　リスト構造"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '76c1c8a017f9b5b4f46c369fda5316523765a831a24c1186b2564b92d0035d1b' 'リスト=ポインタで連結,ランダムアクセスは苦手'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-algorithm/18-list' -NextLesson 'island-algorithm/19-tree' -CourseNo 18 -ClearLine '鎖の一环が光り、ポインタの道が見えた。' -TitleAwards '')
