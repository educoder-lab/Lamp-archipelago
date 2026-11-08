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
Start-LessonTest "講座 15　バブルソートと選択ソート"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '9fe0f1a3dbf7432866342b9cfb1a38ed0d5789e20d2dd09dbe84bccdefe6f020' 'バブル・選択ともO(n²),バブルは安定'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-algorithm/15-bubble' -NextLesson 'island-algorithm/16-merge' -CourseNo 15 -ClearLine '泡が一つ消え、整列の音が塔に響いた。' -TitleAwards '')
