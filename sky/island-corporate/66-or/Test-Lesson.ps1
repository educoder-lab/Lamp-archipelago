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
Start-LessonTest "講座 66　OR・在庫管理"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '23a803c885af77de69d73c9efffe48288578ff745dc6e2c6cb7ab994e021a325' 'LP=制約+目的関数,クリティカルパス=最長経路'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-corporate/66-or' -NextLesson 'island-corporate/67-analysis' -CourseNo 66 -ClearLine '港の帳場の帳簿と印が一つ光り、灯が 66 番目に繋がった。' -TitleAwards '')
