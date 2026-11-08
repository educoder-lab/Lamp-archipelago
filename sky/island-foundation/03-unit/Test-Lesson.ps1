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
Start-LessonTest "講座 03　情報量の単位"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '81bb104751cd519abf8d78e5c73b0aedd3da24dc6f086e081d078a9cde80efed' 'K→M→G→T で約1000倍ずつ'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-foundation/03-unit' -NextLesson 'island-foundation/04-logic' -CourseNo 3 -ClearLine '風車の影が、はじめて「大きさ」の意味を教えてくれた。' -TitleAward '')
