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
Start-LessonTest "講座 81　スケジュールと工数"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '964daa0b69ca2fd54b360f8342dc4735bf0fa88828e256508d562d49ab94e9cb' 'FP=機能数ベース,COCOMO=コード行数ベース'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-project/81-schedule' -NextLesson 'island-project/82-risk' -CourseNo 81 -ClearLine '吊橋の工程表と矢石が一つ光り、灯が 81 番目に繋がった。' -TitleAwards '')
