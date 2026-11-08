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
Start-LessonTest "講座 121　最終模試：午後"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '8d0133d1123b707c25a3badb6f4f3dc5f516040911dc121ddb9e57250a684910' '最終模試午後：BCP=事業継続,EV>PV=前倒し'
exit (Complete-LessonTest -Results @($r) -LessonId 'land/plateau-final/121-final-pm' -NextLesson '（コース修了）' -CourseNo 121 -ClearLine '台地の旗が一瞬だけ高く上がり、講座 121 の灯が炎に加わった。' -TitleAwards '諸島の旅人|大陸の征戦者')
