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
Start-LessonTest "講座 116　科目A模試 第3回"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '8d0133d1123b707c25a3badb6f4f3dc5f516040911dc121ddb9e57250a684910' '科目A模試：最終確認5問'
exit (Complete-LessonTest -Results @($r) -LessonId 'land/plateau-mock-am/116-mock-am-3' -NextLesson 'plateau-mock-pm/117-mock-pm-1' -CourseNo 116 -ClearLine '台地の旗が一瞬だけ高く上がり、講座 116 の灯が炎に加わった。' -TitleAwards '科目A演習章')
