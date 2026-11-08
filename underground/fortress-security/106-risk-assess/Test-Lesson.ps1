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
Start-LessonTest "講座 106　リスクアセスメント演習"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '8dae8c578450fa6d84884de209169946770227d35d4e057d7b887c210e062878' 'リスク値=脅威×脆弱性×資産価値'
exit (Complete-LessonTest -Results @($r) -LessonId 'underground/fortress-security/106-risk-assess' -NextLesson 'fortress-security/107-crypto-pm' -CourseNo 106 -ClearLine '石版の一角が白く染まり、地下の灯が 106 番目を刻んだ。' -TitleAward '')
