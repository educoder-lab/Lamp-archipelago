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

$next = $lessons | Where-Object { $save.clearedNos -notcontains $_.CourseNo -and $save.skippedNos -notcontains $_.CourseNo } | Select-Object -First 1
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

$skyLessons = @($lessons | Where-Object { $_.Realm -eq 'sky' })
$ugLessons = @($lessons | Where-Object { $_.Realm -eq 'underground' })
$landLessons = @($lessons | Where-Object { $_.Realm -eq 'land' })
$skyC = @($skyLessons | Where-Object { $save.clearedNos -contains $_.CourseNo }).Count
$ugC = @($ugLessons | Where-Object { $save.clearedNos -contains $_.CourseNo }).Count
$landC = @($landLessons | Where-Object { $save.clearedNos -contains $_.CourseNo }).Count

Write-Host ""
Write-Host "エリア進行（推奨順・強制なし）" -ForegroundColor DarkCyan
Write-Host "  空 sky:            $skyC / $($skyLessons.Count)"
Write-Host "  地下 underground: $ugC / $($ugLessons.Count)"
Write-Host "  陸 land:           $landC / $($landLessons.Count)"

if ($next.Realm -eq 'underground' -and ($save.clearedNos -notcontains 89)) {
  Write-Host ""
  Write-Host "（ソフトロック）空の関門 #87〜89 を先に済ませると、地下の物語がつながりやすいです。" -ForegroundColor DarkYellow
}
if ($next.Realm -eq 'land' -and ($save.clearedNos -notcontains 113)) {
  Write-Host ""
  Write-Host "（ソフトロック）台地 #114 以降は、地下 #110〜113 深層まで済ませるのがおすすめです。" -ForegroundColor DarkYellow
}

$skippedOpen = @($save.skippedNos | Where-Object { $save.clearedNos -notcontains $_ })
if ($skippedOpen.Count -gt 0) {
  Write-Host ""
  Write-Host "迂回中（あとで戻る）: $(($skippedOpen | ForEach-Object { '#' + $_.ToString('00') }) -join ' ')" -ForegroundColor Magenta
}

Write-Host ""
Write-Host "ワールドマップ: .\Show-Map.ps1　／　詰まったら: .\Skip-Lesson.ps1"
Write-Host "リンク: WORLD.md / CURRICULUM.md / GLOSSARY.md / TITLES.md"
