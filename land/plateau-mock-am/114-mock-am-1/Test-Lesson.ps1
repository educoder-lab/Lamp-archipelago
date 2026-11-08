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
Start-LessonTest "講座 114　午前模試 第1回"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '27c06bfccdca16f5682651b50a222cfe7f9a4311f710eb02714081a6b87d8d19' '午前模試：全分野横断5問'
exit (Complete-LessonTest -Results @($r) -LessonId 'land/plateau-mock-am/114-mock-am-1' -NextLesson 'plateau-mock-am/115-mock-am-2' -CourseNo 114 -ClearLine '台地の旗が一瞬だけ高く上がり、講座 114 の灯が炎に加わった。' -TitleAward '')
