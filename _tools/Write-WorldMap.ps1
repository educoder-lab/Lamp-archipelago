function Get-LampGithubRepoSlug {
  param([string]$RepoRoot)
  try {
    $url = (git -C $RepoRoot remote get-url origin 2>$null | Out-String).Trim()
    if ($url -match 'github\.com[:/](.+?)(?:\.git)?\s*$') {
      return $Matches[1] -replace '\\', '/'
    }
  } catch { }
  return 'educoder-lab/Lamp-archipelago'
}

function Write-WorldMapFile {
  param([string]$RepoRoot, $Lessons, [hashtable]$DomainLastCourseNo)
  . (Join-Path $PSScriptRoot 'Story-Entries.ps1')
  . (Join-Path $PSScriptRoot 'Story-Titles.ps1')

  $stories = Get-LampDomainStories
  $awards = Get-LampDomainClearTitles
  $advisories = @{
    underground = '地下は #90 以降が本編です。空の関門 #87〜89 を越えてからだと物語がつながります（強制ではありません）。'
    land        = '台地は #114 以降の推奨です。地下の深層 #110〜113 まで済ませると安心です（強制ではありません）。'
  }

  $domainOrder = $Lessons | Group-Object Domain | Sort-Object { ($_.Group | Measure-Object CourseNo -Minimum).Minimum }
  $domains = foreach ($g in $domainOrder) {
    $first = $g.Group | Sort-Object CourseNo | Select-Object -First 1
    $s = $stories[$g.Name]
    [ordered]@{
      id       = $g.Name
      title    = $first.DomainTitle
      realm    = $first.Realm
      exam     = $first.ExamField
      npc      = if ($s) { $s.Npc } else { '案内人' }
      synopsis = if ($s) { $s.Synopsis } else { '' }
      enter    = if ($s -and $s.EnterLine) { $s.EnterLine } else { '' }
      award    = $awards[$g.Name]
      advisory = $advisories[$first.Realm]
    }
  }

  $lessonData = foreach ($L in $Lessons) {
    [ordered]@{
      no     = $L.CourseNo
      title  = $L.Blurb
      domain = $L.Domain
      path   = ($L.Path -replace '\\', '/')
    }
  }

  $gh = Get-LampGithubRepoSlug -RepoRoot $RepoRoot
  $pagesUrl = "https://$($gh.Split('/')[0]).github.io/$($gh.Split('/')[1])/map.html"
  $data = [ordered]@{
    prologue   = '雲と海の上に浮かぶランプ諸島。拠点の港から道をたどり、島・砦・台地の灯を一つずつ点けていきます。道は推奨順に開きますが、霧の中の土地にも入ることはできます。'
    githubRepo = $gh
    pagesUrl   = $pagesUrl
    domains    = @($domains)
    lessons    = @($lessonData)
  }
  $json = $data | ConvertTo-Json -Depth 6 -Compress

  $template = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'map-template.html') -Raw -Encoding UTF8
  $html = $template.Replace('/*__LAMP_DATA__*/null', $json)

  $docs = Join-Path $RepoRoot 'docs'
  New-Item -ItemType Directory -Path $docs -Force | Out-Null
  Set-Content -LiteralPath (Join-Path $docs 'map.html') -Value $html -Encoding UTF8
}
