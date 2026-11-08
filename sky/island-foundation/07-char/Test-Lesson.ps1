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
Start-LessonTest "講座 07　文字コードと符号化"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '964daa0b69ca2fd54b360f8342dc4735bf0fa88828e256508d562d49ab94e9cb' 'ASCII=128種,UTF-8は可変長'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-foundation/07-char' -NextLesson 'island-foundation/08-set' -CourseNo 7 -ClearLine '巻物の文字が、ようやく一つの声になった。' -TitleAward '')
