param(
  [int]$CourseNo,
  [switch]$Undo
)

$repoRoot = $PSScriptRoot
. (Join-Path $repoRoot '_grading\Invoke-AdventureSave.ps1')
. (Join-Path $repoRoot '_tools\LessonData.ps1')

$lessons = @(Get-LampLessonCatalog)
$save = Get-AdventureSave

if (-not $CourseNo) {
  $cur = $lessons | Where-Object { $save.clearedNos -notcontains $_.CourseNo -and $save.skippedNos -notcontains $_.CourseNo } | Select-Object -First 1
  if (-not $cur) {
    Write-Host "迂回できる講座はありません。" -ForegroundColor Yellow
    exit 0
  }
  $CourseNo = $cur.CourseNo
}

$lesson = $lessons | Where-Object { $_.CourseNo -eq $CourseNo } | Select-Object -First 1
if (-not $lesson) {
  Write-Host "講座 #$CourseNo は見つかりません。" -ForegroundColor Red
  exit 1
}

if ($Undo) {
  Unregister-LessonSkip -CourseNo $CourseNo
  Write-Host "迂回を取り消しました: $($lesson.TestTitle)" -ForegroundColor Green
  exit 0
}

if (-not (Register-LessonSkip -CourseNo $CourseNo)) {
  Write-Host "$($lesson.TestTitle) はクリア済みです。" -ForegroundColor Yellow
  exit 0
}

Write-Host "迂回しました: $($lesson.TestTitle)" -ForegroundColor Magenta
Write-Host "灯はまだ点いていません。あとで戻れば、ここで灯せます。"

$save = Get-AdventureSave
$next = $lessons | Where-Object { $save.clearedNos -notcontains $_.CourseNo -and $save.skippedNos -notcontains $_.CourseNo } | Select-Object -First 1
if ($next) {
  Write-Host ""
  Write-Host "次の推奨クエスト" -ForegroundColor Cyan
  Write-Host "  $($next.TestTitle)"
  Write-Host "  cd $($next.Path)"
}
