function Write-LessonResult {
  param([string]$Message, [ValidateSet('Pass', 'Fail', 'Info', 'Warn')]$Kind = 'Info')
  $color = switch ($Kind) { 'Pass' { 'Green' } 'Fail' { 'Red' } 'Warn' { 'Yellow' } default { 'Cyan' } }
  Write-Host $Message -ForegroundColor $color
}

function Get-NormalizedHash {
  param([string]$Text, [switch]$SortLines)
  if ($null -eq $Text) { $Text = '' }
  $lines = @(($Text -replace "`r`n", "`n" -split "`n") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' })
  if ($SortLines) { $lines = @($lines | Sort-Object) }
  $norm = ($lines -join "`n")
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($norm)
  $sha = [System.Security.Cryptography.SHA256]::Create()
  try {
    return (-join ($sha.ComputeHash($bytes) | ForEach-Object { $_.ToString('x2') }))
  } finally {
    $sha.Dispose()
  }
}

function Assert-AnswerHash {
  param([string]$Path, [string]$ExpectedHash, [string]$Hint, [switch]$SortLines)
  if (-not (Test-Path -LiteralPath $Path)) {
    Write-LessonResult "  NG  まだありません: $Path" Fail
    if ($Hint) { Write-LessonResult "      $Hint" Info }
    return $false
  }
  $raw = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
  if ($null -eq $raw) { $raw = '' }
  $actual = Get-NormalizedHash -Text $raw -SortLines:$SortLines
  if ($actual -ne $ExpectedHash) {
    $shown = (($raw -replace "`r`n", "`n").Trim())
    Write-LessonResult "  NG  中身が違います: $Path" Fail
    Write-LessonResult "      あなたの答え: [$shown]" Info
    if ($Hint) { Write-LessonResult "      $Hint" Info }
    return $false
  }
  Write-LessonResult "  OK  $Path" Pass
  return $true
}

function Start-LessonTest { param([string]$LessonTitle)
  Write-Host ""
  Write-Host "=== 採点: $LessonTitle ===" -ForegroundColor Yellow
}

function Complete-LessonTest {
  param([bool[]]$Results, [string]$LessonId, [string]$NextLesson)
  $ok = $Results -notcontains $false
  Write-Host ""
  if ($ok) {
    Write-LessonResult "合格。次の講座へ進めます: $NextLesson" Pass
    $progressPath = Join-Path (Split-Path $PSScriptRoot -Parent) '.course-progress.json'
    $progress = @{}
    if (Test-Path -LiteralPath $progressPath) {
      $saved = Get-Content -LiteralPath $progressPath -Raw | ConvertFrom-Json
      $saved.PSObject.Properties | ForEach-Object { $progress[$_.Name] = $_.Value }
    }
    $progress[$LessonId] = (Get-Date -Format 'o')
    $progress | ConvertTo-Json | Set-Content -LiteralPath $progressPath -Encoding UTF8
    return 0
  }
  Write-LessonResult "未合格。PROBLEMS.md を見直してください。" Fail
  return 1
}

function ConvertTo-NormalizedLines {
  param([string]$Text)
  if ($null -eq $Text) { return @() }
  return @(($Text -replace "`r`n", "`n" -split "`n") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' })
}

function Assert-Check {
  param([bool]$Condition, [string]$Label, [string]$Hint)
  if ($Condition) {
    Write-LessonResult "  OK  $Label" Pass
    return $true
  }
  Write-LessonResult "  NG  $Label" Fail
  if ($Hint) { Write-LessonResult "      $Hint" Info }
  return $false
}

function Invoke-StudentScript {
  param([string]$Path, [System.Collections.IDictionary]$Arguments = @{})
  $splat = @{}
  foreach ($k in $Arguments.Keys) { $splat[$k] = $Arguments[$k] }
  try {
    $out = & $Path @splat *>&1 | ForEach-Object { "$_" }
  } catch {
    $out = @("エラー: $($_.Exception.Message)")
  }
  return (@($out) -join "`n")
}

function Assert-ScriptOutput {
  param(
    [string]$Path,
    [System.Collections.IDictionary]$Arguments = @{},
    [string[]]$Expected,
    [string]$Label,
    [string]$Hint
  )
  if (-not (Test-Path -LiteralPath $Path)) {
    Write-LessonResult "  NG  まだありません: $Path" Fail
    return $false
  }
  if (-not $Label) { $Label = $Path }
  $actual = ConvertTo-NormalizedLines (Invoke-StudentScript -Path $Path -Arguments $Arguments)
  $want = ConvertTo-NormalizedLines ($Expected -join "`n")
  if ((@($actual) -join "`n") -ceq (@($want) -join "`n")) {
    Write-LessonResult "  OK  $Label" Pass
    return $true
  }
  Write-LessonResult "  NG  $Label" Fail
  Write-LessonResult ("      期待: " + (@($want) -join ' / ')) Info
  Write-LessonResult ("      出力: " + (@($actual) -join ' / ')) Info
  if ($Hint) { Write-LessonResult "      $Hint" Info }
  return $false
}
