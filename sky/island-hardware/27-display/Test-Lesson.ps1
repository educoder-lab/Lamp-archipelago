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
Start-LessonTest "講座 27　表示装置と解像度"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'bcfa238a9fa9e2b4fabfbae592c8c635d32fdba63bf75e75649ba11ea4213e57' 'VRAM=解像度×色ビット数÷8'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-hardware/27-display' -NextLesson 'island-system/28-reliability' -CourseNo 27 -ClearLine '工房の蒸気と基板が一つ光り、灯が 27 番目に繋がった。' -TitleAward '')
