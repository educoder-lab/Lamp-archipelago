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
Start-LessonTest "講座 48　IPアドレスとサブネット"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '7e5ac5cad8225318f1b0b6d8ec32942a81b9cdb9d5b459caae08ce100f76bcb5' 'IPv4=32bit,サブネット/24=先頭24bitがNW部'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-network/48-ip' -NextLesson 'island-network/49-tcpudp' -CourseNo 48 -ClearLine '航路台の風路と灯標が一つ光り、灯が 48 番目に繋がった。' -TitleAward '')
