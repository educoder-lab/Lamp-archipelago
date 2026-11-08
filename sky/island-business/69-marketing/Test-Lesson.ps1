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
Start-LessonTest "講座 69　マーケティングとe-Biz"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'a2a81bd9440c32d5de7e3493206e57e197d1b99528d908befe0491906222714c' '4P=Product/Price/Place/Promotion'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-business/69-marketing' -NextLesson 'island-business/70-it-strategy')
