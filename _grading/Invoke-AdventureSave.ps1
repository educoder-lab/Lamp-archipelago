function Get-AdventureSavePath {
  Join-Path (Split-Path $PSScriptRoot -Parent) '.adventure-save.json'
}

function Get-AdventureSave {
  $path = Get-AdventureSavePath
  if (-not (Test-Path -LiteralPath $path)) {
    return [pscustomobject]@{
      displayName     = '旅人'
      clearedIds      = [string[]]@()
      clearedNos      = [int[]]@()
      titles          = [string[]]@()
      lastLessonId    = $null
      lastCourseNo    = 0
    }
  }
  $raw = Get-Content -LiteralPath $path -Raw | ConvertFrom-Json
  $ids = @(); if ($raw.clearedIds) { $ids = @($raw.clearedIds) }
  $nos = @(); if ($raw.clearedNos) { $nos = @($raw.clearedNos | ForEach-Object { [int]$_ }) }
  $titles = @(); if ($raw.titles) { $titles = @($raw.titles) }
  [pscustomobject]@{
    displayName  = if ($raw.displayName) { $raw.displayName } else { '旅人' }
    clearedIds   = $ids
    clearedNos   = $nos
    titles       = $titles
    lastLessonId = $raw.lastLessonId
    lastCourseNo = [int]($raw.lastCourseNo)
  }
}

function Set-AdventurePlayerName {
  param([string]$Name)
  $save = Get-AdventureSave
  $save.displayName = $Name.Trim()
  Write-AdventureSave -Save $save
}

function Write-AdventureSave {
  param($Save)
  $path = Get-AdventureSavePath
  $obj = @{
    displayName  = $Save.displayName
    clearedIds   = @($Save.clearedIds)
    clearedNos   = @($Save.clearedNos)
    titles       = @($Save.titles)
    lastLessonId = $Save.lastLessonId
    lastCourseNo = $Save.lastCourseNo
  }
  $obj | ConvertTo-Json | Set-Content -LiteralPath $path -Encoding UTF8
}

function Register-LessonClear {
  param(
    [string]$LessonId,
    [int]$CourseNo,
    [string]$ClearLine,
    [string]$TitleAward,
    [string]$TitleAwards
  )
  $save = Get-AdventureSave
  $awardList = @()
  if ($TitleAwards) {
    $awardList = @($TitleAwards -split '\|' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  } elseif ($TitleAward) {
    $awardList = @($TitleAward)
  }
  if ($save.clearedIds -notcontains $LessonId) {
    $save.clearedIds = @($save.clearedIds + $LessonId)
    $save.clearedNos = @($save.clearedNos + $CourseNo | Sort-Object -Unique)
    foreach ($t in $awardList) {
      if ($save.titles -notcontains $t) {
        $save.titles = @($save.titles + $t)
      }
    }
  }
  $save.lastLessonId = $LessonId
  $save.lastCourseNo = $CourseNo
  Write-AdventureSave -Save $save
  if ($ClearLine) {
    Write-Host ""
    Write-Host $ClearLine -ForegroundColor Cyan
  }
}
