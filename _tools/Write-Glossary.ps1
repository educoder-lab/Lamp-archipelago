function Get-GlossaryRowsFromReadme {
  param([string]$ReadmeBody, [string]$LessonPath, [string]$Blurb)
  if (-not $ReadmeBody) { return @() }
  $rows = @()
  $lines = $ReadmeBody -split "`n"
  $inTable = $false
  foreach ($line in $lines) {
  $t = $line.Trim()
    if ($t -match '^\|\s*用語\s*\|' -or $t -match '^\|\s*\*\*用語\*\*\s*\|') { $inTable = $true; continue }
    if ($inTable -and $t -match '^[\|\-:\s]+$') { continue }
    if ($inTable -and $t -match '^\|(.+)\|(.+)\|$') {
      $term = $Matches[1].Trim() -replace '^\*\*|\*\*$', ''
      $mean = $Matches[2].Trim()
      if ($term -and $term -ne '用語') {
        $link = ($LessonPath -replace '\\', '/')
        $rows += [pscustomobject]@{ Term = $term; Meaning = $mean; Blurb = $Blurb; Link = "$link/README.md" }
      }
      continue
    }
    if ($inTable -and $t -and $t -notmatch '^\|') { $inTable = $false }
  }
  return $rows
}

function Write-GlossaryFile {
  param([string]$RepoRoot, $Lessons)
  $all = foreach ($L in $Lessons) {
    Get-GlossaryRowsFromReadme -ReadmeBody $L.ReadmeBody -LessonPath $L.Path -Blurb $L.Blurb
  }
  $deduped = @{}
  foreach ($r in $all) {
    $key = $r.Term.ToLowerInvariant()
    if (-not $deduped.ContainsKey($key)) { $deduped[$key] = $r }
  }
  $sorted = @($deduped.Values | Sort-Object Term)

  $rows = foreach ($r in $sorted) {
    "| $($r.Term) | $($r.Meaning) | [$($r.Blurb)]($($r.Link)) |"
  }

  $content = @"
# 用語図鑑（自動生成）

[カリキュラム](./CURRICULUM.md) · [WORLD](./WORLD.md)

各講座 README の **今日の用語** 表を集約しました（同語は初出講座を採用）。  
更新: ``.\_tools\Build-AllLessons.ps1``

| 用語 | 意味 | 出典講座 |
|------|------|----------|
$($rows -join "`n")
"@
  Set-Content -LiteralPath (Join-Path $RepoRoot 'GLOSSARY.md') -Value $content -Encoding UTF8
}
