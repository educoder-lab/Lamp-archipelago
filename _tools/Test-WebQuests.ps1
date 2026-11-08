# quests.json と Test-Lesson.ps1 / Manifest の採点ハッシュが一致するか検証（Phase W4）
param(
  [string]$QuestsPath,
  [string]$RepoRoot
)

$ErrorActionPreference = 'Stop'
if (-not $RepoRoot) { $RepoRoot = Split-Path $PSScriptRoot -Parent }
if (-not $QuestsPath) {
  $QuestsPath = Join-Path $RepoRoot 'docs/data/quests.json'
}

. (Join-Path $RepoRoot '_grading\Invoke-LessonAssert.ps1')
. (Join-Path $PSScriptRoot 'LessonData.ps1')

if (-not (Test-Path -LiteralPath $QuestsPath)) {
  Write-Error "quests.json がありません: $QuestsPath（先に Build-AllLessons または Write-Quests.ps1）"
}

$raw = Get-Content -LiteralPath $QuestsPath -Raw -Encoding UTF8 | ConvertFrom-Json
$lessons = @(Get-LampLessonCatalog)
$byNo = @{}
foreach ($L in $lessons) { $byNo[$L.CourseNo] = $L }

function Get-AssertAnswerHashFromTest {
  param([string]$Body)
  foreach ($line in (($Body -replace "`r`n", "`n") -split "`n")) {
    if ($line -notmatch 'Assert-AnswerHash') { continue }
    $m = [regex]::Match($line, "'([0-9a-f]{64})'")
    if ($m.Success) { return $m.Groups[1].Value }
  }
  return $null
}

$fail = 0
$checked = 0

foreach ($q in $raw.lessons) {
  $checked++
  $L = $byNo[[int]$q.courseNo]
  if (-not $L) {
    Write-Host "NG  courseNo $($q.courseNo): Manifest に講座がありません" -ForegroundColor Red
    $fail++
    continue
  }

  $expected = Get-NormalizedHash -Text ($L.Answers -join "`n")
  if ($q.answerHash -ne $expected) {
    Write-Host "NG  #$($q.courseNo) quests.json answerHash != Manifest" -ForegroundColor Red
    $fail++
  }

  $testPath = Join-Path $RepoRoot (Join-Path $L.Path 'Test-Lesson.ps1')
  if (Test-Path -LiteralPath $testPath) {
    $testBody = Get-Content -LiteralPath $testPath -Raw -Encoding UTF8
    $inTest = Get-AssertAnswerHashFromTest -Body $testBody
    if (-not $inTest) {
      Write-Host "WARN #$($q.courseNo) Test-Lesson に採点ハッシュが見つかりません（スタブのみ？）" -ForegroundColor Yellow
    } elseif ($inTest -ne $q.answerHash) {
      Write-Host "NG  #$($q.courseNo) Test-Lesson.ps1 hash != quests.json" -ForegroundColor Red
      $fail++
    }
  }

  $qCount = @($q.questions).Count
  $aCount = @($L.Answers).Count
  $ready = ($qCount -gt 0 -and $qCount -eq $aCount)
  if ([bool]$q.webReady -ne $ready) {
    Write-Host "NG  #$($q.courseNo) webReady=$($q.webReady) expected $ready (questions=$qCount answers=$aCount)" -ForegroundColor Red
    $fail++
  }
}

foreach ($pwa in @('manifest.webmanifest', 'sw.js', 'lamp-pwa.js', 'icon.svg')) {
  if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot "docs/$pwa"))) {
    Write-Host "NG  docs/$pwa がありません（W5 PWA）" -ForegroundColor Red
    $fail++
  }
}

$refsPath = Join-Path $RepoRoot 'docs/data/refs.json'
if (-not (Test-Path -LiteralPath $refsPath)) {
  Write-Host "NG  docs/data/refs.json がありません" -ForegroundColor Red
  $fail++
} else {
  $refs = Get-Content -LiteralPath $refsPath -Raw -Encoding UTF8 | ConvertFrom-Json
  foreach ($key in @('world', 'glossary', 'curriculum', 'titles')) {
    if (-not $refs.pages.$key.markdown) {
      Write-Host "NG  refs.json pages.$key が空です" -ForegroundColor Red
      $fail++
    }
  }
}

Write-Host ""
if ($fail -gt 0) {
  Write-Host "未合格: $fail 件の不整合（$checked 講座を検査）" -ForegroundColor Red
  exit 1
}
Write-Host "合格: Web クエスト $checked 講座 + refs.json（ハッシュ・webReady 整合）" -ForegroundColor Green
exit 0
