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
Start-LessonTest "講座 56　認証と証明書"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '81bb104751cd519abf8d78e5c73b0aedd3da24dc6f086e081d078a9cde80efed' 'CA=証明書発行,MFA=2要素以上'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-security/56-cert' -NextLesson 'island-security/57-firewall' -CourseNo 56 -ClearLine '盾商会の盾壁と鍵が一つ光り、灯が 56 番目に繋がった。' -TitleAwards '')
