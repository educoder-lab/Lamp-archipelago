# 講座ごとの依頼文・物語を自動合成（Story-Entries のオーバーライドが無いときに使用）
# 正答・用語定義には触れない。Blurb とドメイン口調だけを使う。

function Get-LampDomainSceneKit {
  return @{
    'island-foundation'  = @{ Place = '灯台'; Motif = '灯芯と封印'; Hook = '風が数と論理の匂いを運ぶ' }
    'island-algorithm'   = @{ Place = '時計塔'; Motif = '歯車と図版'; Hook = '針の音がアルゴリズムを刻む' }
    'island-hardware'    = @{ Place = '工房'; Motif = '蒸気と基板'; Hook = 'ハンマーの音がメモリの階層を思い出させる' }
    'island-system'      = @{ Place = '系譜の館'; Motif = '冗長の梁'; Hook = '信頼性の釣り合いが館を支える' }
    'island-software'    = @{ Place = '書庫'; Motif = '層と扉'; Hook = 'プロセスの足音が廊下に響く' }
    'island-database'    = @{ Place = '水晶の泉'; Motif = '表と鍵'; Hook = '関係の水脈が泉底でつながる' }
    'island-network'     = @{ Place = '航路台'; Motif = '風路と灯標'; Hook = 'パケットの星が空図に並ぶ' }
    'island-security'    = @{ Place = '盾商会'; Motif = '盾壁と鍵'; Hook = '脅威の影が商会の灯を試す' }
    'island-media'         = @{ Place = '絵師の亭'; Motif = '色と音'; Hook = '見え方と触れ方が同一の封印になる' }
    'island-corporate'     = @{ Place = '港の帳場'; Motif = '帳簿と印'; Hook = '船目が企業の物語を運ぶ' }
    'island-business'      = @{ Place = '羅針盤室'; Motif = '方角と戦略'; Hook = '経営の風が帆を張る' }
    'island-system-plan'   = @{ Place = '企画港'; Motif = '設計図と錨'; Hook = '要件の潮が港に打ち寄せる' }
    'island-dev-tech'      = @{ Place = '開発工房'; Motif = '型と試作'; Hook = 'UMLの線が壁に浮かぶ' }
    'island-project'       = @{ Place = '吊橋'; Motif = '工程表と矢石'; Hook = '工数の風が橋を揺らす' }
    'island-service'       = @{ Place = '灯火番小屋'; Motif = 'サービスと復旧'; Hook = '障害の警笛が遠くで鳴る' }
    'island-audit'         = @{ Place = '記録庫'; Motif = '証跡と判子'; Hook = '監査の灯が書架を照らす' }
    'gate-sky-trial'       = @{ Place = '雲裂の関'; Motif = '三連の試練'; Hook = '空そのものが問いを投げかける' }
    'fortress-algorithm'   = @{ Place = '石版室'; Motif = 'トレース'; Hook = '変数の刻みが石に残る' }
    'fortress-program'     = @{ Place = '擬似言語工房'; Motif = '石版コード'; Hook = '帝国の文法が機械を動かす' }
    'fortress-database'    = @{ Place = '地下水晶庫'; Motif = 'ERとSQL'; Hook = '同時実行の錠が音を立てる' }
    'fortress-network'     = @{ Place = '伏線要塞'; Motif = '配線と設計'; Hook = 'パケットの矢が壁を描く' }
    'fortress-security'    = @{ Place = '盾壁団詰所'; Motif = 'リスクと証跡'; Hook = '暗号の霧が通路を覆う' }
    'fortress-deep'        = @{ Place = '深層読書室'; Motif = '長文と戦略'; Hook = '帝国の記録が一冊に束ねられる' }
    'plateau-mock-am'      = @{ Place = '科目A演習場'; Motif = '連合演習'; Hook = '旗が科目Aの鉄砲煙のように上がる' }
    'plateau-mock-pm'      = @{ Place = '科目B軍議場'; Motif = '模擬軍議'; Hook = '石版束が机に並ぶ' }
    'plateau-final'        = @{ Place = '大陸の最終線'; Motif = '総力戦'; Hook = 'すべての灯が一つの地平に集まる' }
  }
}

function New-LampComposedLessonStory {
  param($Lesson, $DomainNpc, $DomainSynopsis)

  $kits = Get-LampDomainSceneKit
  $kit = $kits[$Lesson.Domain]
  if (-not $kit) {
    $kit = @{ Place = '灯のある部屋'; Motif = '封印'; Hook = '知の欠片が空気に浮かぶ' }
  }

  $blurb = $Lesson.Blurb
  $no = $Lesson.CourseNo
  $npc = $DomainNpc
  $shortNpc = $npc

  $loreSky = @"
講座 **$($no.ToString('00'))** $($kit.Place)に「$blurb」の封印がある。
$($kit.Hook)。$shortNpc が待っている。
"@.Trim()

  $loreUnder = @"
地下の$($kit.Place)。$($kit.Motif)の訓練──**$blurb**。
衛兵の足音と、石が擦れる音。$shortNpc が石版を指さす。
"@.Trim()

  $loreLand = @"
大陸の$($kit.Place)。連合による **$blurb**。
空と地下で灯した知が、ここで一つの試合になる。$shortNpc が号令を待つ。
"@.Trim()

  $lore = switch ($Lesson.Realm) {
    'underground' { $loreUnder }
    'land'        { $loreLand }
    default       { $loreSky }
  }

  $request = switch ($Lesson.Realm) {
    'underground' {
      "${shortNpc}: 石版の封印だ。**$blurb**。変数の動きを追い、問いに答えろ。"
    }
    'land' {
      if ($Lesson.Domain -eq 'plateau-final') {
        "${shortNpc}: 最終演習だ。**$blurb**。全身全霊で封印を解いてくれ。"
      } else {
        "${shortNpc}: 軍議が始まる。**$blurb**。模擬の封印を一つずつ外してくれ。"
      }
    }
    default {
      if ($Lesson.Domain -eq 'gate-sky-trial') {
        "${shortNpc}: 関門の試練だ。**$blurb**。雲を裂く答えを選べ。"
      } else {
        "${shortNpc}: 今回の依頼は「$blurb」。$($kit.Motif)の封印を解いてくれ。"
      }
    }
  }

  $clear = switch ($Lesson.Realm) {
    'underground' { "石版の一角が白く染まり、地下の灯が $($no.ToString('00')) 番目を刻んだ。" }
    'land'        { "台地の旗が一瞬だけ高く上がり、講座 $($no.ToString('00')) の灯が炎に加わった。" }
    default       { "$($kit.Place)の$($kit.Motif)が一つ光り、灯が $($no.ToString('00')) 番目に繋がった。" }
  }

  $title = $null
  if ($no -eq 20) { $title = '塔の見習い' }
  if ($no -eq 21) { $title = 'グラフの渡り手' }
  if ($no -eq 87) { $title = '雲裂き・技' }
  if ($no -eq 88) { $title = '雲裂き・管' }
  if ($no -eq 89) { $title = '雲裂き・略' }
  if ($no -eq 93) { $title = 'トレースの証' }
  if ($no -eq 113) { $title = '深層の読者' }
  if ($no -eq 121) { $title = '諸島の旅人' }

  [pscustomobject]@{
    ReadmeLore  = $lore
    Request     = $request
    ClearLine   = $clear
    TitleAward  = $title
  }
}
