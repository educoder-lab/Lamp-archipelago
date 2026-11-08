function Get-LampLessonCatalog {
  . $PSScriptRoot\New-Lesson.ps1
  . $PSScriptRoot\Manifest-Entries.ps1

  $entries = Get-LampManifestEntries
  $lessons = Import-LampLessonsFromManifest -Entries $entries -Meta $script:LampDomainMeta

  $n = $lessons.Count
  function Get-CourseSlug([int]$no, [string]$suffix) {
    if ($no -ge 100) { return '{0:D3}-{1}' -f $no, $suffix }
    return '{0:D2}-{1}' -f $no, $suffix
  }

  $final = for ($i = 0; $i -lt $n; $i++) {
    $L = $lessons[$i]
    $no = $i + 1
    $slug = Get-CourseSlug $no $L.SlugSuffix
    $short = $L.Blurb
    $title = "講座 $($no.ToString('00'))　$short"
    $path = "$($L.Realm)\$($L.Domain)\$slug"
    $next = if ($i -lt $n - 1) {
      $nx = $lessons[$i + 1]
      $nxSlug = Get-CourseSlug ($i + 2) $nx.SlugSuffix
      "$($nx.Domain)/$nxSlug"
    } else { '（コース修了）' }

    [pscustomobject]@{
      Realm       = $L.Realm
      Domain      = $L.Domain
      DomainTitle = $L.DomainTitle
      ExamField   = $L.ExamField
      Slug        = $slug
      SlugSuffix  = $L.SlugSuffix
      CourseNo    = $no
      Path        = $path
      TestTitle   = $title
      Blurb       = $L.Blurb
      Next        = $next
      ReadmeBody  = $L.ReadmeBody
      ProblemBody = $L.ProblemBody
      Answers     = $L.Answers
      Hint        = $L.Hint
    }
  }
  return $final
}
