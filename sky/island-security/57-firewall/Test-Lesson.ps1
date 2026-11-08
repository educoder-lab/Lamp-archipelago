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
Start-LessonTest "講座 57　ファイアウォールとDMZ"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '7238a2509048888d2027269b403b0c570081c36683b08cc34648c4c018498448' 'WAF=Web攻撃防御,DMZ=公開サーバ用'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-security/57-firewall' -NextLesson 'island-security/58-webattack' -CourseNo 57 -ClearLine '盾商会の盾壁と鍵が一つ光り、灯が 57 番目に繋がった。' -TitleAward '')
