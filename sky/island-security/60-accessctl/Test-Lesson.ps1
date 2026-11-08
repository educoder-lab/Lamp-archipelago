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
Start-LessonTest "講座 60　アクセス制御と認証技術"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '67b61bc35308745a16ad3310d939d0711e850f57f8cb26a95214b65071a8e0d7' 'RBAC=ロール基準,SSO=1回認証で複数利用'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-security/60-accessctl' -NextLesson 'island-security/61-incident' -CourseNo 60 -ClearLine '盾商会の盾壁と鍵が一つ光り、灯が 60 番目に繋がった。' -TitleAward '')
