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
Start-LessonTest "講座 95　コーディングと変数"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '0a072f5b9123f736072fceaf43c61f1546fab6c3f1e0200867a444a1beaf67a9' '局所変数=関数内のみ有効'
exit (Complete-LessonTest -Results @($r) -LessonId 'underground/fortress-program/95-coding' -NextLesson 'fortress-program/96-structure' -CourseNo 95 -ClearLine '石版の一角が白く染まり、地下の灯が 95 番目を刻んだ。' -TitleAwards '')
