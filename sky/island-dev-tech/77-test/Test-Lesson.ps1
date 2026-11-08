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
Start-LessonTest "講座 77　テスト技法"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '17cdd7d65744855608fb82b79828b10a93cdc1b4eca904f30a6bcf13c1c324f4' '単体→結合→システム,WB=内部,BB=仕様'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-dev-tech/77-test' -NextLesson 'island-dev-tech/78-review' -CourseNo 77 -ClearLine '開発工房の型と試作が一つ光り、灯が 77 番目に繋がった。' -TitleAward '')
