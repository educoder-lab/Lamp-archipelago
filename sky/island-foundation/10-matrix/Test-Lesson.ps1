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
Start-LessonTest "講座 10　行列と線形代数"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '0a072f5b9123f736072fceaf43c61f1546fab6c3f1e0200867a444a1beaf67a9' '単位行列×A=A,逆行列×A=E'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-foundation/10-matrix' -NextLesson 'island-foundation/11-bigo')
