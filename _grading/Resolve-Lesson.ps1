function Get-LampRepoRoot {
  param([Parameter(Mandatory = $true)][string]$StartDir)
  $dir = $StartDir
  while ($dir) {
    $marker = Join-Path $dir '_grading\Invoke-LessonAssert.ps1'
    if (Test-Path -LiteralPath $marker) { return $dir }
    $parent = Split-Path $dir -Parent
    if (-not $parent -or $parent -eq $dir) { break }
    $dir = $parent
  }
  return $null
}

function Get-LessonFolderName {
  param([string]$Path)
  $leaf = Split-Path -Leaf $Path
  if ($leaf -match '^\d+-') { return $leaf }
  return $null
}

function Get-RealmFromPath {
  param([string]$Path)
  $parts = $Path -split '[\\/]'
  foreach ($p in $parts) {
    if ($p -in @('sky', 'underground', 'land')) { return $p }
  }
  return $null
}

function Get-LessonRelativePath {
  param([string]$LessonDir)
  $realm = Get-RealmFromPath -Path $LessonDir
  if (-not $realm) { return $null }
  $parts = $LessonDir -split '[\\/]'
  $idx = [Array]::IndexOf($parts, $realm)
  if ($idx -lt 0) { return $null }
  $tail = @($parts[($idx + 1)..($parts.Length - 1)])
  if ($tail.Count -lt 1) { return $null }
  return ($tail -join '/')
}

function Resolve-LessonTestScript {
  param(
    [string]$RepoRoot,
    [string]$Lesson,
    [string]$Realm
  )
  $realms = if ($Realm) { @($Realm) } else { @('sky', 'underground', 'land') }
  $lessonNorm = ($Lesson -replace '\\', '/').Trim('/')

  foreach ($r in $realms) {
    $realmRoot = Join-Path $RepoRoot $r
    if (-not (Test-Path -LiteralPath $realmRoot)) { continue }

    if ($lessonNorm -match '/') {
      $direct = Join-Path $realmRoot ($lessonNorm -replace '/', [IO.Path]::DirectorySeparatorChar)
      $script = Join-Path $direct 'Test-Lesson.ps1'
      if (Test-Path -LiteralPath $script) { return $script }
    }

    $matches = @(
      Get-ChildItem -LiteralPath $realmRoot -Recurse -Filter 'Test-Lesson.ps1' -File -ErrorAction SilentlyContinue |
        Where-Object {
          $dir = $_.Directory.FullName
          (Split-Path -Leaf $dir) -eq $lessonNorm -and
          (Get-LessonFolderName -Path $dir)
        }
    )
    if ($matches.Count -eq 1) { return $matches[0].FullName }
    if ($matches.Count -gt 1) {
      throw "講座名 $Lesson が複数の島・砦にあります。`-Lesson island名/01-bit` のように指定してください。"
    }
  }
  return $null
}

function Resolve-LessonFromLocation {
  param([string]$RepoRoot)
  $cwd = (Get-Location).Path
  if (-not (Get-LessonFolderName -Path $cwd)) { return $null }
  $rel = Get-LessonRelativePath -LessonDir $cwd
  if (-not $rel) { return $null }
  $realm = Get-RealmFromPath -Path $cwd
  $script = Resolve-LessonTestScript -RepoRoot $RepoRoot -Lesson $rel -Realm $realm
  if (-not $script) { return $null }
  return @{
    Lesson     = $rel
    Realm      = $realm
    TestScript = $script
    ProgressId = "$realm/$($rel -replace '\\', '/')"
  }
}
