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
Start-LessonTest "講座 41　正規化"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '1e755a5a06793c7baf6695f320300d7dcbf22b846dc7bd6d236fb67e964c070b' '1NF=繰返し除去,2NF=部分従属除去,3NF=推移従属除去'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-database/41-normal' -NextLesson 'island-database/42-sql-select' -CourseNo 41 -ClearLine '水晶の泉の表と鍵が一つ光り、灯が 41 番目に繋がった。' -TitleAward '')
