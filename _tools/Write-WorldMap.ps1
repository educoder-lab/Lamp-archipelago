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
    underground = '右の道は分野の順に進みます。手前の剣房の灯がすべて点くまで、先へは入れません。'
    land        = '大扉の奥は、盾の関門と剣の深層がすべて灯るまで開通しません。'
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
    prologue   = '道分かれの間。謎の老人が言う——今の力を試したいなら、この扉の奥を目指しなさい。強靭な精神を身に付けられるだろう。ただし相手は強い。その盾と剣では不十分だ。盾を鍛えるなら左へ、剣を鍛えるなら右へ進みなさい。講座をクリアするたび、盾・剣・精神が光り成長する。'
    githubRepo = $gh
    pagesUrl   = $pagesUrl
    domains    = @($domains)
    lessons    = @($lessonData)
  }
  if (-not $domains -or @($domains).Count -eq 0 -or -not $lessonData -or @($lessonData).Count -eq 0) {
    throw "Write-WorldMapFile: domains/lessons が空です。カタログ読込失敗のまま map.html を上書きしません。"
  }

  $json = $data | ConvertTo-Json -Depth 6 -Compress

  $template = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'map-template.html') -Raw -Encoding UTF8
  $html = $template.Replace('/*__LAMP_DATA__*/null', $json)

  $docs = Join-Path $RepoRoot 'docs'
  New-Item -ItemType Directory -Path $docs -Force | Out-Null
  $out = Join-Path $docs 'map.html'
  $utf8Bom = New-Object System.Text.UTF8Encoding $true
  for ($n = 1; $n -le 6; $n++) {
    try {
      [System.IO.File]::WriteAllText($out, $html, $utf8Bom)
      break
    } catch {
      if ($n -eq 6) { throw }
      Start-Sleep -Milliseconds (80 * $n)
    }
  }
}
