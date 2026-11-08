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
Start-LessonTest "講座 39　OSSとライセンス"
$r = Assert-AnswerHash (Join-Path $PSScriptRoot '演習結果\answers.txt') '5222d0e0bf6520225789fd6f898e53a5271fc1c59352f645ff09c75592ce41a6' 'GPL=コピーレフト,OSS=有償販売も可'
exit (Complete-LessonTest -Results @($r) -LessonId 'sky/island-software/39-oss' -NextLesson 'island-database/40-rdb' -CourseNo 39 -ClearLine '灯がひとつ、静かに灯った。' -TitleAward '')
