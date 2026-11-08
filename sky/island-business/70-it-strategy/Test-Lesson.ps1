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
Start-LessonTest "講座 70　IT戦略とガバナンス"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '897f4dcab6616dff296ca2d9124bbd3568bdb3323dcee6d182b2636e75461b0f' 'ERP=統合基幹,BPR=業務再設計'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-business/70-it-strategy' -NextLesson 'island-business/71-contract' -CourseNo 70 -ClearLine '灯がひとつ、静かに灯った。' -TitleAward '')
