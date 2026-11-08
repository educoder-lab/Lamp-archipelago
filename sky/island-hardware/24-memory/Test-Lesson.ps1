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
Start-LessonTest "講座 24　記憶装置の階層"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') 'a950bf259e8bac8926558d986edad9095289787cdfaba01d64a469edaa0d4c10' '実効=ヒット率×キャッシュ+(1-ヒット率)×主記憶'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-hardware/24-memory' -NextLesson 'island-hardware/25-disk' -CourseNo 24 -ClearLine '工房の蒸気と基板が一つ光り、灯が 24 番目に繋がった。' -TitleAwards '')
