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
Start-LessonTest "講座 49　TCP/UDPとポート"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '81bb104751cd519abf8d78e5c73b0aedd3da24dc6f086e081d078a9cde80efed' 'TCP=信頼性あり,HTTP=ポート80'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-network/49-tcpudp' -NextLesson 'island-network/50-dns' -CourseNo 49 -ClearLine '灯がひとつ、静かに灯った。' -TitleAward '')
