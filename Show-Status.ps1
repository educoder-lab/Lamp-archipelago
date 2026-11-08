param(
  [string]$Name
)

$repoRoot = $PSScriptRoot
. (Join-Path $repoRoot '_grading\Invoke-AdventureSave.ps1')
. (Join-Path $repoRoot '_tools\LessonData.ps1')

if ($Name) {
  Set-AdventurePlayerName -Name $Name
  Write-Host "名前を登録しました: $Name" -ForegroundColor Green
}

$save = Get-AdventureSave
$lessons = @(Get-LampLessonCatalog)
$total = $lessons.Count
$cleared = @($save.clearedNos).Count

$next = $lessons | Where-Object { $save.clearedNos -notcontains $_.CourseNo } | Select-Object -First 1
if (-not $next) {
  $next = $lessons[-1]
}

Write-Host ""
Write-Host "=== ランプ・アーキペラゴ / 冒険状況 ===" -ForegroundColor Yellow
Write-Host "旅人: $($save.displayName)"
Write-Host "灯（クリア）: $cleared / $total"
if ($save.titles -and $save.titles.Count -gt 0) {
  Write-Host "称号: $($save.titles -join ' / ')"
}

Write-Host ""
Write-Host "次の推奨クエスト" -ForegroundColor Cyan
Write-Host "  $($next.TestTitle)"
Write-Host "  cd $($next.Path)"
Write-Host "  .\Test-Lesson.ps1"

if ($next.CourseNo -ge 90 -and ($save.clearedNos -notcontains 89)) {
  Write-Host ""
  Write-Host "（ヒント）空の関門 #89 まで済むと、地下の物語がつながりやすいです。" -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "リンク: WORLD.md / CURRICULUM.md"
