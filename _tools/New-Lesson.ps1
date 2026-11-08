function New-LampLesson {
  param(
    [string]$Realm,
    [string]$Domain,
    [string]$DomainTitle,
    [string]$ExamField,
    [string]$SlugSuffix,
    [string]$Blurb,
    [string]$ReadmeBody,
    [string]$ProblemBody,
    [string[]]$Answers,
    [string]$Hint = '1行1問 番号:英字'
  )
  [pscustomobject]@{
    Realm       = $Realm
    Domain      = $Domain
    DomainTitle = $DomainTitle
    ExamField   = $ExamField
    SlugSuffix  = $SlugSuffix
    Blurb       = $Blurb
    ReadmeBody  = $ReadmeBody
    ProblemBody = $ProblemBody
    Answers     = $Answers
    Hint        = $Hint
  }
}

function Import-LampLessonsFromManifest {
  param($Entries, [hashtable]$Meta)
  $result = [System.Collections.Generic.List[object]]::new()
  foreach ($e in $Entries) {
    $m = $Meta[$e.Domain]
    if (-not $m) { throw "Unknown domain: $($e.Domain)" }
    $result.Add((New-LampLesson `
        -Realm $m.Realm -Domain $e.Domain -DomainTitle $m.Title -ExamField $m.Exam `
        -SlugSuffix $e.SlugSuffix -Blurb $e.Blurb `
        -ReadmeBody $e.Readme -ProblemBody $e.Problems -Answers $e.Answers -Hint $e.Hint))
  }
  return $result
}
