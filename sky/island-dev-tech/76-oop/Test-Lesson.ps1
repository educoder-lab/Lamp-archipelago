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
Start-LessonTest "講座 76　オブジェクト指向"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '6a234d6c78b3b3b5b51ee2abc6495b26b69ceaeadd9e54f70fc7778398c878af' 'カプセル化=隠蔽,継承=引継ぎ,多態性=同名異動作'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-dev-tech/76-oop' -NextLesson 'island-dev-tech/77-test')
