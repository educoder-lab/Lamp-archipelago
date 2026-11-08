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
Start-LessonTest "講座 25　補助記憶と入出力"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '03fb144609f6ea9866f4f9596430ad625cd2f6a12b3592e18132d46052a10f4a' 'RAID1=ミラーリング,SSD=ヘッド不要'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-hardware/25-disk' -NextLesson 'island-hardware/26-io' -CourseNo 25 -ClearLine '工房の蒸気と基板が一つ光り、灯が 25 番目に繋がった。' -TitleAward '')
