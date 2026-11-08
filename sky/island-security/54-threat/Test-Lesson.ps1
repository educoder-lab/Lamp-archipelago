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
Start-LessonTest "講座 54　脅威と攻撃手法"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '150d54c95cb7f1a74ddbd7bf5d9a192c507c0edbd2bf1a5cb22937de7b358c07' 'フィッシング=偽サイト,ランサム=身代金'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-security/54-threat' -NextLesson 'island-security/55-crypto' -CourseNo 54 -ClearLine '盾商会の盾壁と鍵が一つ光り、灯が 54 番目に繋がった。' -TitleAwards '')
