param(
  [Parameter(Mandatory = $false)]
  [string] $Lesson,
  [Parameter(Mandatory = $false)]
  [ValidateSet('sky', 'underground', 'land')]
  [string] $Realm
)

$repoRoot = $PSScriptRoot
. (Join-Path $repoRoot '_grading\Resolve-Lesson.ps1')

if (-not $Lesson) {
  $resolved = Resolve-LessonFromLocation -RepoRoot $repoRoot
  if ($resolved) {
    . (Join-Path $repoRoot '_grading\Invoke-LessonAssert.ps1')
    & $resolved.TestScript
    exit $LASTEXITCODE
  }
  Write-Error @"
講座フォルダ（例: sky\island-foundation\01-bit）に cd するか、
-Lesson island-foundation/01-bit または -Lesson 05-order を指定してください。
"@
  exit 1
}

$lessonNorm = $Lesson -replace '\\', '/'
$testScript = Resolve-LessonTestScript -RepoRoot $repoRoot -Lesson $lessonNorm -Realm $Realm
if (-not $testScript) {
  Write-Error "講座が見つかりません: $lessonNorm（空・地下・陸地の島／砦配下を確認）"
  exit 1
}

. (Join-Path $repoRoot '_grading\Invoke-LessonAssert.ps1')
& $testScript
exit $LASTEXITCODE
