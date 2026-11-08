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
Start-LessonTest "講座 62　画像と音声のデータ"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '6a234d6c78b3b3b5b51ee2abc6495b26b69ceaeadd9e54f70fc7778398c878af' 'ベクタ=拡大OK,標本化→量子化→符号化'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-media/62-image' -NextLesson 'island-media/63-ux' -CourseNo 62 -ClearLine '絵師の亭の色と音が一つ光り、灯が 62 番目に繋がった。' -TitleAward '')
