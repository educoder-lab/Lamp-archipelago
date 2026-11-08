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
Start-LessonTest "講座 80　プロジェクト管理の基礎"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '8a460792e539172521bf1d2d781e251e27208ef2b99eb64a43350ef7517cfb44' 'WBS=作業分解,ガントチャート=棒グラフ'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-project/80-pmbok' -NextLesson 'island-project/81-schedule' -CourseNo 80 -ClearLine '吊橋の工程表と矢石が一つ光り、灯が 80 番目に繋がった。' -TitleAwards '')
