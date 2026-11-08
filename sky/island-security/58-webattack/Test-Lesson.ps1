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
Start-LessonTest "講座 58　Webセキュリティ"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '67b61bc35308745a16ad3310d939d0711e850f57f8cb26a95214b65071a8e0d7' 'SQLi=SQL挿入,XSS=スクリプト埋込み'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-security/58-webattack' -NextLesson 'island-security/59-policy' -CourseNo 58 -ClearLine '盾商会の盾壁と鍵が一つ光り、灯が 58 番目に繋がった。' -TitleAward '')
