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
Start-LessonTest "講座 72　システム企画と要件定義"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '0a072f5b9123f736072fceaf43c61f1546fab6c3f1e0200867a444a1beaf67a9' '機能要件=何をする,非機能要件=どのくらいの品質'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-system-plan/72-plan' -NextLesson 'island-system-plan/73-eval' -CourseNo 72 -ClearLine '企画港の設計図と錨が一つ光り、灯が 72 番目に繋がった。' -TitleAward '')
