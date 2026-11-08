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
Start-LessonTest "講座 117　午後模試 第1回"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '0a072f5b9123f736072fceaf43c61f1546fab6c3f1e0200867a444a1beaf67a9' '午後模試：読解+知識の応用'
exit (Complete-LessonTest -Results @($r) -LessonId 'land/plateau-mock-pm/117-mock-pm-1' -NextLesson 'plateau-mock-pm/118-mock-pm-2' -CourseNo 117 -ClearLine '台地の旗が一瞬だけ高く上がり、講座 117 の灯が炎に加わった。' -TitleAwards '')
