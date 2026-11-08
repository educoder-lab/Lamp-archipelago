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
Start-LessonTest "講座 32　クラスタと負荷分散"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '17cdd7d65744855608fb82b79828b10a93cdc1b4eca904f30a6bcf13c1c324f4' 'スケールアウト=台数増,スケールアップ=性能増'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-system/32-cluster' -NextLesson 'island-system/33-embed' -CourseNo 32 -ClearLine '灯がひとつ、静かに灯った。' -TitleAward '')
