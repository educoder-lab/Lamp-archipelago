# 解説スライドを生成: _tools/slides/<domain>.json（手書き）+ かんたん版（自動）→ docs/data/slides/<講座#>.json
# 使い方: .\_tools\Write-Slides.ps1   （Build-AllLessons.ps1 からも呼ばれる）

function ConvertFrom-LampJsonText {
  param([string]$Text)
  if ($PSVersionTable.PSVersion.Major -ge 7) {
    return ($Text | ConvertFrom-Json -AsHashtable -Depth 30)
  }
  Add-Type -AssemblyName System.Web.Extensions
  $ser = New-Object System.Web.Script.Serialization.JavaScriptSerializer
  $ser.MaxJsonLength = [int]::MaxValue
  $ser.RecursionLimit = 100
  return $ser.DeserializeObject($Text)
}

function ConvertTo-LampJsonText {
  param($Object)
  if ($PSVersionTable.PSVersion.Major -ge 7) {
    return ($Object | ConvertTo-Json -Depth 30 -Compress)
  }
  Add-Type -AssemblyName System.Web.Extensions
  $ser = New-Object System.Web.Script.Serialization.JavaScriptSerializer
  $ser.MaxJsonLength = [int]::MaxValue
  $ser.RecursionLimit = 100
  return $ser.Serialize($Object)
}

function Get-LampReadmeTerms {
  param([string]$Body)
  $terms = [System.Collections.Generic.List[object]]::new()
  foreach ($line in ($Body -split "`r?`n")) {
    if ($line -match '^\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$') {
      $a = $Matches[1]; $b = $Matches[2]
      if ($a -match '^-+$' -or $a -eq '用語' -or $a -match '^:?-+:?$') { continue }
      $terms.Add([ordered]@{ title = $a; text = $b })
    }
  }
  if ($terms.Count -eq 0) {
    foreach ($line in ($Body -split "`r?`n")) {
      if ($line -match '^\s*[-*]\s+(.+)$') {
        $terms.Add([ordered]@{ title = ''; text = $Matches[1].Trim() })
      }
    }
  }
  return @($terms)
}

function New-LampLiteDeck {
  param($Lesson)
  $slides = [System.Collections.Generic.List[object]]::new()
  $slides.Add([ordered]@{
      layout   = 'title'
      emoji    = '📖'
      title    = ([string]$Lesson.TestTitle -replace '^講座\s*\d+[\s\u3000]+', '')
      subtitle = [string]$Lesson.Blurb
      blocks   = @()
    })
  $terms = @(Get-LampReadmeTerms -Body ([string]$Lesson.ReadmeBody))
  $chunk = 4
  for ($i = 0; $i -lt $terms.Count -and $slides.Count -lt 10; $i += $chunk) {
    $end = [Math]::Min($i + $chunk, $terms.Count) - 1
    $items = foreach ($t in $terms[$i..$end]) {
      if ($t.title) { [ordered]@{ icon = '🔑'; title = $t.title; text = $t.text } }
      else { [ordered]@{ icon = '🔑'; title = $t.text } }
    }
    $slides.Add([ordered]@{
        emoji  = '🔑'
        title  = 'おぼえる言葉'
        blocks = @([ordered]@{ t = 'cards'; items = @($items) })
      })
  }
  $slides.Add([ordered]@{
      emoji  = '🚪'
      title  = 'つぎは封印の問い'
      blocks = @([ordered]@{ t = 'callout'; kind = 'memo'; text = '言葉の意味をざっと読めたら、下の「封印の問い」に進みましょう。わからなくなったら、ここに戻って読み直せます。' })
    })
  return @($slides)
}

function Write-SlidesFile {
  param([string]$RepoRoot, $Lessons)

  $srcDir = Join-Path $PSScriptRoot 'slides'
  $outDir = Join-Path $RepoRoot 'docs/data/slides'
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
  Get-ChildItem -LiteralPath $outDir -Filter '*.json' -ErrorAction SilentlyContinue | Remove-Item -Force

  $authored = @{}
  if (Test-Path -LiteralPath $srcDir) {
    foreach ($f in (Get-ChildItem -LiteralPath $srcDir -Filter '*.json')) {
      $text = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8
      $data = ConvertFrom-LampJsonText -Text $text
      foreach ($key in $data['lessons'].Keys) {
        $authored[[int]$key] = $data['lessons'][$key]['slides']
      }
    }
  }

  $nAuth = 0
  foreach ($L in $Lessons) {
    $no = [int]$L.CourseNo
    $isAuth = $authored.ContainsKey($no)
    $slides = if ($isAuth) { $authored[$no] } else { New-LampLiteDeck -Lesson $L }
    if ($isAuth) { $nAuth++ }
    $deck = [ordered]@{
      schemaVersion = 1
      courseNo      = $no
      lessonId      = "$($L.Realm)/$($L.Domain)/$($L.Slug)"
      authored      = $isAuth
      slides        = $slides
    }
    $json = ConvertTo-LampJsonText -Object $deck
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText((Join-Path $outDir ('{0}.json' -f $no)), $json, $utf8)
  }
  Write-Host "Wrote docs/data/slides ($($Lessons.Count) decks, authored: $nAuth, lite: $($Lessons.Count - $nAuth))"
}

if ($MyInvocation.InvocationName -ne '.') {
  $ErrorActionPreference = 'Stop'
  $repoRoot = Split-Path $PSScriptRoot -Parent
  . (Join-Path $PSScriptRoot 'LessonData.ps1')
  $lessons = @(Get-LampLessonCatalog)
  Write-SlidesFile -RepoRoot $repoRoot -Lessons $lessons
}
