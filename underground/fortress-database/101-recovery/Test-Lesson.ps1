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
Start-LessonTest "講座 101　障害回復と性能"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'bca9f4a15ee2934d65d78fca043389c0b0c922508fa5f57c10c68883ce22e5aa' 'ロールフォワード=ログで復元,B木=インデックス'
exit (Complete-LessonTest -Results @($r) -LessonId 'underground/fortress-database/101-recovery' -NextLesson 'fortress-network/102-subnet-calc' -CourseNo 101 -ClearLine '石版の一角が白く染まり、地下の灯が 101 番目を刻んだ。' -TitleAward '')
