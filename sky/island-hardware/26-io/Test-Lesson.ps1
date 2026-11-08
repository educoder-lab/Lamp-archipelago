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
Start-LessonTest "講座 26　入出力インタフェース"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '253c6c4bd961bb44e8ef9513812a367d4e1ab47016413b8462025f28068600e0' 'DMA=CPU介さず転送,USB=ホットプラグ'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-hardware/26-io' -NextLesson 'island-hardware/27-display')
