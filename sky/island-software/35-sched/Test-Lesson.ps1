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
Start-LessonTest "講座 35　スケジューリングと排他"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '99adc96456554066b093d2a5ae358b44ec28dd24670315cccd53939e4e88c0b6' 'デッドロック=相互待ち,セマフォ=排他制御'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-software/35-sched' -NextLesson 'island-software/36-vmem' -CourseNo 35 -ClearLine '書庫の層と扉が一つ光り、灯が 35 番目に繋がった。' -TitleAwards '')
