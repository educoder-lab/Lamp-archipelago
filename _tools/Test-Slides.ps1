# 解説スライド（_tools/slides/*.json）の検証
# 使い方:
#   .\_tools\Test-Slides.ps1                 … 書かれている分を検証
#   .\_tools\Test-Slides.ps1 -RequireAll     … 全 121 講座が手書き済みか（未執筆はエラー）
#   .\_tools\Test-Slides.ps1 -Domain island-foundation
param(
  [switch]$RequireAll,
  [string]$Domain = ''
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
. (Join-Path $PSScriptRoot 'Write-Slides.ps1')
. (Join-Path $PSScriptRoot 'LessonData.ps1')

$catalog = @(Get-LampLessonCatalog)
$domainNos = @{}
foreach ($L in $catalog) {
  if (-not $domainNos.ContainsKey($L.Domain)) { $domainNos[$L.Domain] = [System.Collections.Generic.List[int]]::new() }
  $domainNos[$L.Domain].Add([int]$L.CourseNo)
}

$visual = @('analogy', 'flow', 'compare', 'table', 'cards', 'bits', 'trace', 'layers', 'steps', 'array', 'tree', 'big')
$required = @{
  p       = @('text')
  bullets = @('items')
  big     = @('text')
  analogy = @('real', 'tech')
  flow    = @('steps')
  compare = @('left', 'right')
  table   = @('rows')
  cards   = @('items')
  callout = @('text')
  code    = @('text')
  bits    = @('bits')
  trace   = @('vars', 'rows')
  check   = @('q', 'choices', 'answer')
  layers  = @('items')
  steps   = @('items')
  array   = @('cells')
  tree    = @('root')
}

$script:errors = [System.Collections.Generic.List[string]]::new()
$script:warns = [System.Collections.Generic.List[string]]::new()
function Err([string]$m) { $script:errors.Add($m) }
function Warn([string]$m) { $script:warns.Add($m) }
function Has($o, [string]$k) { return ($o -is [System.Collections.IDictionary]) -and ([bool]$o.ContainsKey($k)) -and $null -ne $o[$k] }

$files = @(Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot 'slides') -Filter '*.json' -ErrorAction SilentlyContinue)
if ($Domain) { $files = @($files | Where-Object { $_.BaseName -eq $Domain }) }
$covered = [System.Collections.Generic.HashSet[int]]::new()

foreach ($f in $files) {
  $name = $f.BaseName
  try {
    $data = ConvertFrom-LampJsonText -Text (Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8)
  } catch {
    Err "$name.json: JSON が壊れています ($($_.Exception.Message))"; continue
  }
  if (-not $domainNos.ContainsKey($name)) { Err "$name.json: 不明な領域名（ファイル名は領域フォルダ名）"; continue }
  if (-not (Has $data 'lessons')) { Err "$name.json: lessons がありません"; continue }
  if ($data['domain'] -and $data['domain'] -ne $name) { Err "$name.json: domain 値がファイル名と違います" }

  foreach ($key in $data['lessons'].Keys) {
    $no = 0
    if (-not [int]::TryParse([string]$key, [ref]$no)) { Err "${name}: キー '$key' が数字ではありません"; continue }
    $tag = "${name}#$no"
    if (-not $domainNos[$name].Contains($no)) { Err "${tag}: この領域の講座番号ではありません（$($domainNos[$name][0])〜$($domainNos[$name][-1])）"; continue }
    [void]$covered.Add($no)
    $les = $data['lessons'][$key]
    $slides = @($les['slides'])
    if ($slides.Count -lt 8 -or $slides.Count -gt 16) { Err "${tag}: スライド数 $($slides.Count)（8〜16 枚・1枚1概念）" }
    $hasVisual = $false; $hasCheck = $false; $hasAnalogy = $false
    for ($i = 0; $i -lt $slides.Count; $i++) {
      $s = $slides[$i]
      $st = "$tag/スライド$($i + 1)"
      if (-not (Has $s 'title')) { Err "${st}: title がありません" }
      if (-not (Has $s 'blocks') -and $s['layout'] -ne 'title') { Err "${st}: blocks がありません" }
      $blocks = @($s['blocks'])
      if ($s['layout'] -ne 'title' -and $blocks.Count -gt 2) { Err "${st}: ブロックが $($blocks.Count) 個（最大 2・1枚1概念）" }
      $textLen = 0
      foreach ($b in $blocks) {
        if (-not (Has $b 't')) { Err "${st}: ブロックに t がありません"; continue }
        $t = [string]$b['t']
        if (-not $required.ContainsKey($t)) { Err "${st}: 未知のブロック種別 '$t'"; continue }
        foreach ($rk in $required[$t]) { if (-not (Has $b $rk)) { Err "${st}: $t に $rk がありません" } }
        if ($visual -contains $t) { $hasVisual = $true }
        if ($t -eq 'analogy') { $hasAnalogy = $true }
        foreach ($tk in @('text', 'real', 'tech', 'q')) { if (Has $b $tk) { $textLen += ([string]$b[$tk]).Length } }
        switch ($t) {
          'check' {
            $hasCheck = $true
            $ch = @($b['choices'])
            if ($ch.Count -lt 2 -or $ch.Count -gt 4) { Err "${st}: check の choices は 2〜4 個" }
            $ans = -1
            if (-not [int]::TryParse([string]$b['answer'], [ref]$ans) -or $ans -lt 0 -or $ans -ge $ch.Count) { Err "${st}: check の answer が範囲外（0 始まり）" }
          }
          'bits' {
            if ([string]$b['bits'] -notmatch '^[01]+$') { Err "${st}: bits は 0/1 だけの文字列" }
            elseif (([string]$b['bits']).Length -gt 16) { Err "${st}: bits は 16 桁まで" }
          }
          'trace' {
            $w = @($b['vars']).Count
            $rows = @($b['rows'])
            if ($rows.Count -lt 2) { Err "${st}: trace の rows は 2 行以上" }
            foreach ($r in $rows) { if (@($r).Count -ne $w) { Err "${st}: trace の行の幅 $(@($r).Count) が vars ($w) と違う" } }
            if (Has $b 'lines') {
              if (@($b['lines']).Count -lt $rows.Count) { Err "${st}: trace の lines が rows より少ない" }
              if (-not (Has $b 'code')) { Err "${st}: trace に lines があるのに code がない" }
              else { foreach ($ln in @($b['lines'])) { if ([int]$ln -lt 0 -or [int]$ln -ge @($b['code']).Count) { Err "${st}: trace の lines が code の範囲外" } } }
            }
            if ((Has $b 'notes') -and @($b['notes']).Count -lt $rows.Count) { Warn "${st}: trace の notes が rows より少ない" }
          }
          'table' {
            if (Has $b 'head') { $w = @($b['head']).Count; foreach ($r in @($b['rows'])) { if (@($r).Count -ne $w) { Err "${st}: table の行の幅が head と違う" } } }
          }
          'callout' {
            if ($b['kind'] -and @('tip', 'warn', 'exam', 'memo') -notcontains [string]$b['kind']) { Err "${st}: callout.kind が不正" }
          }
          'flow' { if (@($b['steps']).Count -lt 2) { Err "${st}: flow の steps は 2 個以上" } }
          'array' {
            $n = @($b['cells']).Count
            if (Has $b 'highlight') { foreach ($x in @($b['highlight'])) { if ([int]$x -lt 0 -or [int]$x -ge $n) { Err "${st}: array.highlight が範囲外" } } }
          }
        }
      }
      if ($textLen -gt 160) { Err "${st}: 文字が多すぎ ($textLen 字)。上限 160・目標 80。枚を分けてください" }
      elseif ($textLen -gt 100) { Warn "${st}: 文字が多め ($textLen 字)。目標は 80 字。大事な語だけ **太字** / ==強調== に" }
    }
    if (-not $hasVisual) { Err "${tag}: 図解ブロックがありません" }
    if (-not $hasCheck) { Err "${tag}: check（ミニ確認）がありません" }
    if (-not $hasAnalogy) { Warn "${tag}: analogy（たとえ話）がありません" }
    if ($slides.Count -gt 0 -and $slides[0]['layout'] -ne 'title') { Warn "${tag}: 1 枚目は layout=title の表紙を推奨" }
  }
}

$scopeNos = if ($Domain) { @($domainNos[$Domain]) } else { @($catalog | ForEach-Object { [int]$_.CourseNo }) }
$missing = @($scopeNos | Where-Object { -not $covered.Contains($_) })
Write-Host ("手書き済み: {0} / {1} 講座" -f ($scopeNos.Count - $missing.Count), $scopeNos.Count)
if ($missing.Count -gt 0 -and $missing.Count -le 40) { Write-Host ("未執筆: " + ($missing -join ', ')) -ForegroundColor DarkYellow }
elseif ($missing.Count -gt 40) { Write-Host ("未執筆: {0} 講座" -f $missing.Count) -ForegroundColor DarkYellow }
if ($RequireAll -and $missing.Count -gt 0) { Err ("全講座が手書き済みではありません（未執筆 {0}）" -f $missing.Count) }

foreach ($w in $script:warns) { Write-Host "WARN $w" -ForegroundColor Yellow }
foreach ($e in $script:errors) { Write-Host "NG   $e" -ForegroundColor Red }
if ($script:errors.Count -gt 0) {
  Write-Host ("NG: {0} 件のエラー / WARN {1} 件" -f $script:errors.Count, $script:warns.Count) -ForegroundColor Red
  exit 1
}
Write-Host ("OK: スライド検証に合格（WARN {0} 件）" -f $script:warns.Count) -ForegroundColor Green
exit 0
