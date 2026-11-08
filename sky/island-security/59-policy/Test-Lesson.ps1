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
Start-LessonTest "講座 59　情報セキュリティ管理"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'b6190caa2bd4e87e943d3e4ebf140774cad9255ac7eaddeedc42b96789147821' 'CIA=機密性・完全性・可用性'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-security/59-policy' -NextLesson 'island-security/60-accessctl' -CourseNo 59 -ClearLine '灯がひとつ、静かに灯った。' -TitleAward '')
