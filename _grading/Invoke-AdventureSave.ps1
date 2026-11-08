function Get-AdventureRepoRoot {
  Split-Path $PSScriptRoot -Parent
}

function Get-AdventureSavePath {
  Join-Path (Get-AdventureRepoRoot) '.adventure-save.json'
}

function Get-AdventureSave {
  $path = Get-AdventureSavePath
  if (-not (Test-Path -LiteralPath $path)) {
    return [pscustomobject]@{
      displayName     = '旅人'
      clearedIds      = [string[]]@()
      clearedNos      = [int[]]@()
      skippedNos      = [int[]]@()
      titles          = [string[]]@()
      lastLessonId    = $null
      lastCourseNo    = 0
    }
  }
  $raw = Get-Content -LiteralPath $path -Raw -Encoding UTF8 | ConvertFrom-Json
  $ids = @(); if ($raw.clearedIds) { $ids = @($raw.clearedIds) }
  $nos = @(); if ($raw.clearedNos) { $nos = @($raw.clearedNos | ForEach-Object { [int]$_ }) }
  $skips = @(); if ($raw.skippedNos) { $skips = @($raw.skippedNos | ForEach-Object { [int]$_ }) }
  $titles = @(); if ($raw.titles) { $titles = @($raw.titles) }
  [pscustomobject]@{
    displayName  = if ($raw.displayName) { $raw.displayName } else { '旅人' }
    clearedIds   = $ids
    clearedNos   = $nos
    skippedNos   = $skips
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

function Write-AdventureMapData {
  param($Save)
  $docs = Join-Path (Get-AdventureRepoRoot) 'docs'
  if (-not (Test-Path -LiteralPath $docs)) { return }
  $obj = [ordered]@{
    displayName = $Save.displayName
    clearedNos  = @($Save.clearedNos)
    skippedNos  = @($Save.skippedNos)
    titles      = @($Save.titles)
    repoRoot    = (Get-AdventureRepoRoot)
    updatedAt   = (Get-Date -Format 'o')
  }
  $js = 'window.LAMP_SAVE = ' + ($obj | ConvertTo-Json -Compress) + ';'
  Set-Content -LiteralPath (Join-Path $docs 'save-data.js') -Value $js -Encoding UTF8
}

function Write-AdventureSave {
  param($Save)
  $path = Get-AdventureSavePath
  $obj = @{
    displayName  = $Save.displayName
    clearedIds   = @($Save.clearedIds)
    clearedNos   = @($Save.clearedNos)
    skippedNos   = @($Save.skippedNos)
    titles       = @($Save.titles)
    lastLessonId = $Save.lastLessonId
    lastCourseNo = $Save.lastCourseNo
  }
  $obj | ConvertTo-Json | Set-Content -LiteralPath $path -Encoding UTF8
  Write-AdventureMapData -Save $Save
}

function Register-LessonSkip {
  param([int]$CourseNo)
  $save = Get-AdventureSave
  if ($save.clearedNos -contains $CourseNo) { return $false }
  if ($save.skippedNos -notcontains $CourseNo) {
    $save.skippedNos = @($save.skippedNos + $CourseNo | Sort-Object -Unique)
    Write-AdventureSave -Save $save
  }
  return $true
}

function Unregister-LessonSkip {
  param([int]$CourseNo)
  $save = Get-AdventureSave
  $save.skippedNos = @($save.skippedNos | Where-Object { $_ -ne $CourseNo })
  Write-AdventureSave -Save $save
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
  $save.skippedNos = @($save.skippedNos | Where-Object { $_ -ne $CourseNo })
  $save.lastLessonId = $LessonId
  $save.lastCourseNo = $CourseNo
  Write-AdventureSave -Save $save
  if ($ClearLine) {
    Write-Host ""
    Write-Host $ClearLine -ForegroundColor Cyan
  }
}
