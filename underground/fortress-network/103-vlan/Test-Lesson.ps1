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
Start-LessonTest "講座 103　VLANとVPN"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'bca9f4a15ee2934d65d78fca043389c0b0c922508fa5f57c10c68883ce22e5aa' 'VLAN=論理分割,IPsec=IP層暗号化'
exit (Complete-LessonTest -Results @($r) -LessonId 'underground/fortress-network/103-vlan' -NextLesson 'fortress-network/104-packet' -CourseNo 103 -ClearLine '石版の一角が白く染まり、地下の灯が 103 番目を刻んだ。' -TitleAwards '')
