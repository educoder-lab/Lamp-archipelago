function Parse-LampChoiceLine {
  param([string]$Text)
  $choices = [System.Collections.Generic.List[object]]::new()
  if (-not $Text) { return @() }
  $pattern = '(?:^|[\s\u3000])([A-D])\.\s*(.+?)(?=[\s\u3000][A-D]\.|$)'
  foreach ($m in [regex]::Matches($Text, $pattern)) {
    $choices.Add([ordered]@{
        id   = $m.Groups[1].Value
        text = $m.Groups[2].Value.Trim()
      })
  }
  return @($choices)
}

function ConvertFrom-LampProblemBody {
  param([string]$Body)
  $text = ($Body -replace "`r`n", "`n").Trim()
  if (-not $text) { return @() }
  $questions = [System.Collections.Generic.List[object]]::new()
  $pattern = '\*\*(\d+)\.\*\*'
  $parts = [regex]::Split($text, $pattern)
  for ($i = 1; $i -lt $parts.Length; $i += 2) {
    $no = [int]$parts[$i]
    $chunk = $parts[$i + 1].Trim()
    $lines = @($chunk -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' })
    if ($lines.Count -eq 0) { continue }
    $stem = $lines[0]
    $optLines = if ($lines.Count -gt 1) { $lines[1..($lines.Count - 1)] -join "`n" } else { '' }
    if (-not $optLines -and $stem -match '^(?s)(.+?)[\s\u3000]+([A-D]\..+)$') {
      $stem = $Matches[1].Trim()
      $optLines = $Matches[2].Trim()
    }
    $choices = Parse-LampChoiceLine -Text $optLines
    $questions.Add([ordered]@{
        no      = $no
        stem    = $stem
        choices = @($choices)
      })
  }
  return @($questions)
}

function Get-LampReadmeMarkdown {
  param($Lesson, $Story)
  $parts = [System.Collections.Generic.List[string]]::new()
  if ($Story.ReadmeLore) {
    $parts.Add('## 物語')
    $parts.Add('')
    $parts.Add($Story.ReadmeLore.Trim())
    $parts.Add('')
  }
  if ($Lesson.ReadmeBody) {
    $parts.Add($Lesson.ReadmeBody.Trim())
  }
  return ($parts -join "`n").Trim()
}

function Write-QuestsFile {
  param([string]$RepoRoot, $Lessons, [hashtable]$DomainLastCourseNo)

  . (Join-Path $RepoRoot '_grading\Invoke-LessonAssert.ps1')
  if (-not (Get-Command Get-LampStoryForLesson -ErrorAction SilentlyContinue)) {
    . (Join-Path $PSScriptRoot 'Story-Entries.ps1')
  }
  . (Join-Path $PSScriptRoot 'Story-Titles.ps1')

  $items = foreach ($L in $Lessons) {
    $story = Get-LampStoryForLesson -Lesson $L
    $awardList = Get-LampTitleAwardsForLesson -Lesson $L -PrimaryTitleAward $story.TitleAward -DomainLastCourseNo $DomainLastCourseNo
    $lessonId = "$($L.Realm)/$($L.Domain)/$($L.Slug)"
    $hash = Get-NormalizedHash -Text ($L.Answers -join "`n")
    $idx = $L.CourseNo - 1
    $prevNo = if ($idx -gt 0) { $Lessons[$idx - 1].CourseNo } else { $null }
    $next = if ($idx -lt $Lessons.Count - 1) { $Lessons[$idx + 1] } else { $null }
    $nextId = if ($next) { "$($next.Realm)/$($next.Domain)/$($next.Slug)" } else { $null }
    $questions = @(ConvertFrom-LampProblemBody -Body $L.ProblemBody)
    $webReady = ($questions.Count -gt 0 -and $questions.Count -eq $L.Answers.Count)

    [ordered]@{
      courseNo        = $L.CourseNo
      lessonId        = $lessonId
      path            = ($L.Path -replace '\\', '/')
      realm           = $L.Realm
      domain          = $L.Domain
      domainTitle     = $L.DomainTitle
      title           = $L.TestTitle
      blurb           = $L.Blurb
      webReady        = $webReady
      readmeMarkdown  = Get-LampReadmeMarkdown -Lesson $L -Story $story
      request         = if ($story.Request) { $story.Request.Trim() } else { '' }
      questions       = @($questions)
      answerHash      = $hash
      hint            = $L.Hint
      clearLine       = if ($story.ClearLine) { $story.ClearLine.Trim() } else { '' }
      titleAwards     = @($awardList)
      nav             = [ordered]@{
        prevCourseNo = $prevNo
        nextCourseNo = if ($next) { $next.CourseNo } else { $null }
        nextLessonId = $nextId
      }
    }
  }

  $root = [ordered]@{
    schemaVersion = 1
    generatedAt   = (Get-Date -Format 'o')
    lessonCount   = $Lessons.Count
    lessons       = @($items)
  }

  $outDir = Join-Path $RepoRoot 'docs/data'
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
  $json = $root | ConvertTo-Json -Depth 8 -Compress:$false
  Set-Content -LiteralPath (Join-Path $outDir 'quests.json') -Value $json -Encoding UTF8
  $ready = @($items | Where-Object { $_.webReady }).Count
  Write-Host "Wrote docs/data/quests.json ($($Lessons.Count) lessons, webReady: $ready)"
}

if ($MyInvocation.InvocationName -ne '.') {
  $ErrorActionPreference = 'Stop'
  $repoRoot = Split-Path $PSScriptRoot -Parent
  . (Join-Path $PSScriptRoot 'LessonData.ps1')
  $lessons = @(Get-LampLessonCatalog)
  $domainLastCourseNo = @{}
  foreach ($L in $lessons) {
    $cur = $domainLastCourseNo[$L.Domain]
    if (-not $cur -or $L.CourseNo -gt $cur) { $domainLastCourseNo[$L.Domain] = $L.CourseNo }
  }
  Write-QuestsFile -RepoRoot $repoRoot -Lessons $lessons -DomainLastCourseNo $domainLastCourseNo
}
