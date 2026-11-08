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
Start-LessonTest "講座 96　制御構造の組合せ"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'a2a81bd9440c32d5de7e3493206e57e197d1b99528d908befe0491906222714c' '基本3構造=順次・選択・繰返し'
exit (Complete-LessonTest -Results @($r) -LessonId 'underground/fortress-program/96-structure' -NextLesson 'fortress-program/97-debug' -CourseNo 96 -ClearLine '石版の一角が白く染まり、地下の灯が 96 番目を刻んだ。' -TitleAwards '')
