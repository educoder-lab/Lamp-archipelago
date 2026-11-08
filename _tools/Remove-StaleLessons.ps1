$repoRoot = Split-Path $PSScriptRoot -Parent
. (Join-Path $PSScriptRoot 'LessonData.ps1')
$valid = @{}
foreach ($l in Get-LampLessonCatalog) { $valid[(Join-Path $repoRoot $l.Path).ToLowerInvariant()] = $true }

Get-ChildItem -Path (Join-Path $repoRoot 'sky'), (Join-Path $repoRoot 'underground'), (Join-Path $repoRoot 'land') -Recurse -Directory |
  Where-Object { $_.Name -match '^\d+-' } |
  ForEach-Object {
    $k = $_.FullName.ToLowerInvariant()
    if (-not $valid.ContainsKey($k)) {
      Write-Host "Remove stale $($_.FullName)"
      Remove-Item -LiteralPath $_.FullName -Recurse -Force
    }
  }
