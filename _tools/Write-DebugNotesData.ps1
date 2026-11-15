# docs/debug-notes.md → docs/debug-notes-data.js（Show-Map / file:// 用）
function Get-LampDebugNotesPath {
  param([string]$RepoRoot)
  Join-Path $RepoRoot 'docs\debug-notes.md'
}

function Write-DebugNotesDataFile {
  param([string]$RepoRoot)
  $mdPath = Get-LampDebugNotesPath -RepoRoot $RepoRoot
  $outPath = Join-Path $RepoRoot 'docs\debug-notes-data.js'
  $raw = ''
  if (Test-Path -LiteralPath $mdPath) {
    $raw = Get-Content -LiteralPath $mdPath -Raw -Encoding UTF8
  }
  if ($null -eq $raw) { $raw = '' }
  # JS 文字列リテラル用にエスケープ
  $escaped = $raw.
    Replace('\', '\\').
    Replace('"', '\"').
    Replace([string][char]0x2028, '\u2028').
    Replace([string][char]0x2029, '\u2029').
    Replace("`r`n", '\n').
    Replace("`n", '\n').
    Replace("`r", '\n')
  $js = @"
/* Show-Map が docs/debug-notes.md から生成。gitignore 対象 */
window.LAMP_DEBUG_NOTES_MD = "$escaped";
"@
  Set-Content -LiteralPath $outPath -Value $js -Encoding UTF8
  return $outPath
}

function Get-LampDebugNotesOpenItems {
  param([string]$RepoRoot)
  $mdPath = Get-LampDebugNotesPath -RepoRoot $RepoRoot
  if (-not (Test-Path -LiteralPath $mdPath)) { return '' }
  $raw = Get-Content -LiteralPath $mdPath -Raw -Encoding UTF8
  if ($raw -match '(?ms)^##\s*未処理\s*\r?\n(.*?)(?=\r?\n##\s|\z)') {
    return $Matches[1].Trim()
  }
  return $raw.Trim()
}

function Set-LampDebugNotesOpenItems {
  param(
    [string]$RepoRoot,
    [string]$OpenItemsBody
  )
  $body = if ([string]::IsNullOrWhiteSpace($OpenItemsBody)) { '（まだなし）' } else { $OpenItemsBody.TrimEnd() + "`n" }
  $md = @"
# デバッグノート

マップの修正メモ（正本）。ブラウザのノートUIと同期する。  
エージェントへ「デバッグノートを見て修正して」と言ったら、ここを読んで直し、**直した項目はこのファイルから削除**する。

## 未処理

$body
"@
  $mdPath = Get-LampDebugNotesPath -RepoRoot $RepoRoot
  Set-Content -LiteralPath $mdPath -Value ($md.TrimEnd() + "`n") -Encoding UTF8
  Write-DebugNotesDataFile -RepoRoot $RepoRoot | Out-Null
}
