function ConvertTo-LampWebMarkdown {
  param([string]$Md, $Lessons)
  if (-not $Md) { return '' }
  $text = $Md
  $text = $text -replace '\]\(\./WORLD\.md\)', '](ref.html?p=world)'
  $text = $text -replace '\]\(\./GLOSSARY\.md\)', '](ref.html?p=glossary)'
  $text = $text -replace '\]\(\./CURRICULUM\.md\)', '](ref.html?p=curriculum)'
  $text = $text -replace '\]\(\./TITLES\.md\)', '](ref.html?p=titles)'
  $text = $text -replace '\]\(\./Show-Status\.ps1\)', '](map.html)'
  $text = $text -replace '\]\(\./HOW-GRADING-WORKS\.md\)', '](ref.html?p=world)'
  foreach ($L in $Lessons) {
    $p = ($L.Path -replace '\\', '/')
    $esc = [regex]::Escape($p)
    $no = $L.CourseNo
    $text = [regex]::Replace($text, "\]\($esc/README\.md\)", "](lesson.html?no=$no)")
    $text = [regex]::Replace($text, "\]\($esc/PROBLEMS\.md\)", "](lesson.html?no=$no)")
  }
  return $text
}

function Write-WebDocsFile {
  param([string]$RepoRoot, $Lessons)

  $pages = [ordered]@{
    world = [ordered]@{
      title      = '世界設定'
      markdown   = ''
      searchable = $false
    }
    glossary = [ordered]@{
      title      = '用語図鑑'
      markdown   = ''
      searchable = $true
    }
    curriculum = [ordered]@{
      title      = 'カリキュラム（全講座）'
      markdown   = ''
      searchable = $true
    }
    titles = [ordered]@{
      title      = '称号一覧'
      markdown   = ''
      searchable = $true
    }
  }

  $map = @{
    world      = 'WORLD.md'
    glossary   = 'GLOSSARY.md'
    curriculum = 'CURRICULUM.md'
    titles     = 'TITLES.md'
  }

  foreach ($key in $pages.Keys) {
    $file = Join-Path $RepoRoot $map[$key]
    if (-not (Test-Path -LiteralPath $file)) { continue }
    $raw = Get-Content -LiteralPath $file -Raw -Encoding UTF8
    $pages[$key].markdown = ConvertTo-LampWebMarkdown -Md $raw -Lessons $Lessons
  }

  $navMd = @"
## 参照（ブラウザ）

| ページ | リンク |
|--------|--------|
| ワールドマップ | [map.html](map.html) |
| カリキュラム | [ref.html?p=curriculum](ref.html?p=curriculum) |
| 用語図鑑 | [ref.html?p=glossary](ref.html?p=glossary) |
| 世界設定 | [ref.html?p=world](ref.html?p=world) |
| 称号 | [ref.html?p=titles](ref.html?p=titles) |
"@
  $pages.world.markdown = ($navMd + "`n`n" + $pages.world.markdown).Trim()

  $root = [ordered]@{
    schemaVersion = 1
    generatedAt   = (Get-Date -Format 'o')
    pages         = $pages
  }

  $outDir = Join-Path $RepoRoot 'docs/data'
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
  $json = $root | ConvertTo-Json -Depth 6 -Compress:$false
  Set-Content -LiteralPath (Join-Path $outDir 'refs.json') -Value $json -Encoding UTF8
  Write-Host "Wrote docs/data/refs.json"
}

if ($MyInvocation.InvocationName -ne '.') {
  $ErrorActionPreference = 'Stop'
  $repoRoot = Split-Path $PSScriptRoot -Parent
  . (Join-Path $PSScriptRoot 'LessonData.ps1')
  $lessons = @(Get-LampLessonCatalog)
  Write-WebDocsFile -RepoRoot $repoRoot -Lessons $lessons
}
