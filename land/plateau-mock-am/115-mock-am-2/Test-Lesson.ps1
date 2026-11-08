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
Start-LessonTest "講座 115　午前模試 第2回"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'd57e8d97f75e3a23bc804c6a89f1dc6d2b4cdb3475ac25ad90aa44fd0d0ac338' '直列稼働率=0.8×0.8,2^10=1024'
exit (Complete-LessonTest -Results @($r) -LessonId 'land/plateau-mock-am/115-mock-am-2' -NextLesson 'plateau-mock-am/116-mock-am-3' -CourseNo 115 -ClearLine '台地の旗が一瞬だけ高く上がり、講座 115 の灯が炎に加わった。' -TitleAward '')
