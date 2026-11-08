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
Start-LessonTest "講座 102　サブネット計算"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '1513c97cc5d7d04ce1b72fa377e0a57adb9abd839fcfdaf744ec1484d8300823' '/24→ホスト8bit→2^8-2=254'
exit (Complete-LessonTest -Results @($r) -LessonId 'underground/fortress-network/102-subnet-calc' -NextLesson 'fortress-network/103-vlan' -CourseNo 102 -ClearLine '石版の一角が白く染まり、地下の灯が 102 番目を刻んだ。' -TitleAwards '')
