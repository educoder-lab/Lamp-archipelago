function Get-LampDomainStories {
  return @{
    'island-foundation'  = @{ Npc = '灯台守レン'; Synopsis = '最古の灯台がある島。0と1から知の灯を点ける。'; EnterLine = '「知は粒から。ここが最初の島だ」とレンが言う。' }
    'island-algorithm'   = @{ Npc = '時計塔の技師ミラ'; Synopsis = 'アルゴリズムとデータ構造の塔が並ぶ島。'; EnterLine = '塔の歯車が止まり、ミラが図版を指差す。' }
    'island-hardware'    = @{ Npc = '工房長ガスト'; Synopsis = '蒸気と歯車。CPUと記憶の話。'; EnterLine = '工房の蒸気が霧となり、ガストが基板を磨く。' }
    'island-system'      = @{ Npc = '系譜士セラ'; Synopsis = '信頼性と冗長。システム全体の話。'; EnterLine = '系譜の帳が開き、セラが冗長の針を刺す。' }
    'island-software'    = @{ Npc = '書庫司書オウ'; Synopsis = 'OSとソフトウェアの層。'; EnterLine = '書庫の層が重なり、オウがプロセスの印を求める。' }
    'island-database'    = @{ Npc = '水晶司ライラ'; Synopsis = '表と関係。データの泉。'; EnterLine = '泉底の水晶が脈打ち、ライラが関係の鎖を示す。' }
    'island-network'     = @{ Npc = '航路司フェン'; Synopsis = 'プロトコルの風路。'; EnterLine = '航路図が風にはためき、フェンが灯標を点検する。' }
    'island-security'    = @{ Npc = '盾商会マスター・クレス'; Synopsis = '脅威と暗号の商会。'; EnterLine = '盾壁の奥で、クレスが脅威のリストを広げる。' }
    'island-media'       = @{ Npc = '絵師ティア'; Synopsis = '見え方と体験の話。'; EnterLine = '色の試料が並び、ティアが見え方の封印を語る。' }
    'island-corporate'   = @{ Npc = '港の書記ホウ'; Synopsis = '企業と法務の港。'; EnterLine = '港の帳場に印鑑の列。ホウが企業の帆を数える。' }
    'island-business'    = @{ Npc = '羅針盤の執事アル'; Synopsis = '経営と戦略の室。'; EnterLine = '羅針盤が一瞬だけ北を指し、アルが戦略の地図を開く。' }
    'island-system-plan' = @{ Npc = '設計士ナギ'; Synopsis = 'システム化計画の港。'; EnterLine = '企画港に錨が下り、ナギが要件の潮を見る。' }
    'island-dev-tech'    = @{ Npc = '工房棟梁ディン'; Synopsis = '開発の型と技術。'; EnterLine = '開発工房で型が乾き、ディンが試作の灯を点ける。' }
    'island-project'     = @{ Npc = '吊橋番ケイ'; Synopsis = '工程とWBSの橋。'; EnterLine = '吊橋が揺れ、ケイが工程表の矢石を並べる。' }
    'island-service'     = @{ Npc = '灯火番イズミ'; Synopsis = 'サービスと障害復旧。'; EnterLine = '灯火番小屋のベルが鳴り、イズミがSLAの巻を持つ。' }
    'island-audit'       = @{ Npc = '記録官トモ'; Synopsis = '証跡と監査の書庫。'; EnterLine = '記録庫の灯が点き、トモが証跡の判子を用意する。' }
    'gate-sky-trial'     = @{ Npc = '関門番トリス'; Synopsis = '空を裂く三つの試練。'; EnterLine = '雲が裂け、トリスが三本の試練の扉を示す。' }
    'fortress-algorithm' = @{ Npc = '衛兵長ヴェルク'; Synopsis = '帝国石版のトレース訓練場。'; EnterLine = '石版室に靴音。ヴェルクが「動きを追え」と囁く。' }
    'fortress-program'   = @{ Npc = '工房技師ザイン'; Synopsis = '擬似言語と構造の工房。'; EnterLine = '擬似言語の煙が立ち、ザインが石版コードを渡す。' }
    'fortress-database'  = @{ Npc = '水晶管理人ダリア'; Synopsis = '地下のSQLとER。'; EnterLine = '地下水晶庫の錠が鳴り、ダリアがERの板を掲げる。' }
    'fortress-network'   = @{ Npc = '伏線番エルク'; Synopsis = 'サブネットと設計の要塞。'; EnterLine = '伏線が壁を走り、エルクが配線図を灯で照らす。' }
    'fortress-security'  = @{ Npc = '盾壁団リーゼ'; Synopsis = 'リスクと暗号の科目B。'; EnterLine = '盾壁団の詰所で、リーゼがリスク表を叩く。' }
    'fortress-deep'      = @{ Npc = '深層司祭オーレ'; Synopsis = '読解とシナリオの最奥。'; EnterLine = '最奥の読書室。オーレが帝国の長文記録を開く。' }
    'plateau-mock-am'    = @{ Npc = '連合教官マコト'; Synopsis = '科目A模試の台地。'; EnterLine = '科目A演習場に旗。マコトが「演習開始」と叫ぶ。' }
    'plateau-mock-pm'    = @{ Npc = '参謀ヒロ'; Synopsis = '科目B模試の台地。'; EnterLine = '軍議場に石版束。ヒロが科目Bの号令を待つ。' }
    'plateau-final'      = @{ Npc = '大陸の見張り長'; Synopsis = '最終演習。'; EnterLine = '地平にすべての灯が集まり、見張り長が最終線を引く。' }
  }
}

function Get-LampLessonStoryOverrides {
  $h = @{}
  $add = {
    param($domain, $suffix, $lore, $request, $clear, $title)
    $h["$domain|$suffix"] = @{
      ReadmeLore = $lore; Request = $request; ClearLine = $clear; TitleAward = $title
    }
  }
  & $add 'island-foundation' 'bit' @'
雲の端、灯台の一段目。レンは言う。「知は粒から始まる」と。
あなたの手持ちの灯は、まだ弱い光だ。
'@ '灯台守レン: 最初の封印は「最小の粒」についてだ。答えを置いてくれ。' '最小の粒が光に溶け、灯芯が一本だけ太くなった。' 'ビットの灯'
  & $add 'island-foundation' 'base' '銘板が2進と16進で刻まれている。読めば扉が開くという。' 'レン: 銘板の数字を正しい世界の言葉に直してくれ。' '灯台の二段目で、風が数の桁を数え始めた。' $null
  & $add 'island-foundation' 'unit' '風車が回り、単位の旗がはためく。' 'レン: バイトと速度の話。旗の印を選んでくれ。' '風車の影が、はじめて「大きさ」の意味を教えてくれた。' $null
  & $add 'island-foundation' 'logic' '雲門に真理の表が浮かぶ。ANDとORが問いかける。' 'レン: 門は論理で開く。' '雲門がすっと開き、霧の向こうに三つの路が見えた。' $null
  & $add 'island-foundation' 'shift' '灯芯をずらすと、数が別の姿を見せる。' 'レン: シフトの封印だ。' '灯芯がひとつ、丁寧に位置を変えた。' $null
  & $add 'island-foundation' 'float' '水槽に丸い誤差の泡が浮かぶ。' 'レン: 浮動小数は泡の話。' '泡が一つ割れ、正しい丸さだけが残った。' $null
  & $add 'island-foundation' 'char' '古い巻物に文字の印が並ぶ。' 'レン: 文字の符号化だ。' '巻物の文字が、ようやく一つの声になった。' $null
  & $add 'island-foundation' 'set' '集合の輪が空中に重なる。' 'レン: 集合と論理の続きだ。' '輪が重なり、集合の灯が点灯した。' $null
  & $add 'island-foundation' 'prob' 'サイコロが転がり、平均が囁く。' 'レン: 確率の話。' 'サイコロが止まり、静かな見通しが得られた。' $null
  & $add 'island-foundation' 'matrix' '格子の床に行列が浮き上がる。' 'レン: 行と列を踏みなさい。' '床の格子が光り、基礎理論の灯が十二分に近づいた。' $null
  & $add 'island-foundation' 'bigo' '塔の見上げる先で、計算量の神話が語られる。' 'レン: オーダの封印。急がず選べ。' '塔の影が短くなり、見通しが遠くまで届いた。' $null
  & $add 'island-foundation' 'automata' '最上階にオートマトンの図が眠る。' 'レン: 最後の基礎だ。これを越えれば次の島へ。' '灯台の最上階まで、灯が一気に繋がった。' '灯台の証'
  & $add 'fortress-algorithm' 'trace-basic' @'
雲の下。帝国の石版室。衛兵長が言う。「動きを追え。思考を止めるな」。
'@ 'ヴェルク: 初陣だ。石版の変数を追跡しろ。' '石版の一本が白く光り、地下での最初の灯が灯った。' '地下入り'
  & $add 'fortress-algorithm' 'trace-loop' 'ループの石版が回り始める。' 'ヴェルク: 繰り返しの封印を解け。' 'ループの跡が円を描き、灯が二つ目を刻んだ。' $null
  & $add 'fortress-algorithm' 'trace-array' '配列の欄が石板上に現れる。' 'ヴェルク: 添字に気をつけろ。' '配列の欄が順に埋まり、記録が一つ完成した。' $null
  & $add 'fortress-algorithm' 'trace-recurse' '自分を呼ぶ式が石に刻まれる。' 'ヴェルク: 再帰だ。戻りを見失うな。' '式の呼び木が静かに収まり、衛兵が頷いた。' 'トレースの証'
  & $add 'island-algorithm' 'array' '塔の低層。棚に番号の付いた箱が並び、先頭から光が走る。' 'ミラ: 探索は順に踏むことが先だ。配列と線形探索の封印を解いて。' '棚のラベルが一つ光り、塔の歯車がかすかに回り始めた。' $null
  & $add 'island-algorithm' 'bsearch' '塔の螺旋階段の途中、真ん中を指す矢印がある。' 'ミラ: 半分ずつ狭めろ。二分探索だ。' '矢印が折れ、探索の経路が短く見えた。' $null
  & $add 'island-algorithm' 'bubble' '泡のような光が要素の間を昇っていく。' 'ミラ: 隣同士を比べて並べ替える。バブルと選択の話だ。' '泡が一つ消え、整列の音が塔に響いた。' $null
  & $add 'island-algorithm' 'merge' '二つの歯車列が合流する分岐点。' 'ミラ: 分けて整え、合わせろ。マージとクイックの封印。' '二列の歯車が噛み合い、ソートの図が完成した。' $null
  & $add 'island-algorithm' 'stack' '塔壁に棚と射出口。LIFO の矢印が刻まれている。' 'ミラ: 後から入れたものが先に出る。スタックとキューだ。' '射出口から一枚、正しい順で板が落ちた。' $null
  & $add 'island-algorithm' 'list' '鎖のようにつながったノードが空中に浮く。' 'ミラ: 次のつながりを追え。リスト構造の依頼だ。' '鎖の一环が光り、ポインタの道が見えた。' $null
  & $add 'island-algorithm' 'tree' '根から枝分かれする光の木。' 'ミラ: 根を忘れるな。木と二分木の封印を解いて。' '木の一条の枝が灯り、探索の木が澄んだ。' $null
  & $add 'island-algorithm' 'hash' '鍵穴の列に名前が吸い込まれていく。' 'ミラ: 鍵を作り、穴に合わせろ。ハッシュの話だ。' '鍵穴が一つ鳴り、対応が一瞬で見つかった。' $null
  & $add 'island-algorithm' 'graph' '塔頂で頂点と辺が星のように広がる。' 'ミラ: 最後の島内試練だ。グラフを渡れ。' '星図が一筆で繋がり、塔全体が灯台のように輝いた。' 'グラフの渡り手'
  & $add 'gate-sky-trial' 'tech-trial' @'
関の第一扉。テクノロジの空気だけが濃い。
トリス: 「技の試練だ。空を裂くには基礎から証明せよ。」
'@ 'トリス: テクノロジ総合の封印。三問、落ち着いて選べ。' '第一扉が開き、雲の割れ目から地下の臭いがした。' '雲裂き・技'
  & $add 'gate-sky-trial' 'mgmt-trial' '第二扉。工程表とサービスの旗が並ぶ。' 'トリス: マネジメント総合だ。管理の灯を揃えろ。' '第二扉が鳴り、マネジメントの空が澄んだ。' '雲裂き・管'
  & $add 'gate-sky-trial' 'strat-trial' '第三扉。港と戦略の羅針盤が同時に回る。' 'トリス: 最後はストラテジ。これで空の関門は越えられる。' '三扉すべてが開き、雲の下に帝国の尖塔が見えた。' '雲裂き・略'
  return $h
}

function Get-LampStoryForLesson {
  param($Lesson)
  $composePath = Join-Path $PSScriptRoot 'Story-Compose.ps1'
  if (Test-Path -LiteralPath $composePath) { . $composePath }

  $domains = Get-LampDomainStories
  $over = Get-LampLessonStoryOverrides
  $key = "$($Lesson.Domain)|$($Lesson.SlugSuffix)"
  $d = $domains[$Lesson.Domain]
  if (-not $d) {
    $d = @{ Npc = '案内人'; Synopsis = 'このエリアの封印を解く旅。'; EnterLine = '案内人が小さく灯を掲げる。' }
  }
  $o = $over[$key]
  $composed = if ($o) { $null } else { New-LampComposedLessonStory -Lesson $Lesson -DomainNpc $d.Npc -DomainSynopsis $d.Synopsis }

  $lore = if ($o -and $o.ReadmeLore) { $o.ReadmeLore } elseif ($composed) { $composed.ReadmeLore } else { "$($d.Npc)が待っている。$($d.Synopsis)" }
  $request = if ($o -and $o.Request) { $o.Request } elseif ($composed) { $composed.Request } else { "$($d.Npc): 次の封印の問いを解いてくれ。" }
  $clear = if ($o -and $o.ClearLine) { $o.ClearLine } elseif ($composed) { $composed.ClearLine } else { '灯がひとつ、静かに灯った。' }
  $title = if ($o -and $o.TitleAward) { $o.TitleAward } elseif ($composed) { $composed.TitleAward } else { $null }
  [pscustomobject]@{
    Npc = $d.Npc; Synopsis = $d.Synopsis; EnterLine = $d.EnterLine
    ReadmeLore = $lore; Request = $request; ClearLine = $clear; TitleAward = $title
  }
}

function Get-LampRealmPrologues {
  return @{
    sky = @'
雲海の上。**ランプ諸島** は学問の島々です。  
あなたは灯台から旅を始め、テクノロジ・マネジメント・ストラテジの空へ進みます。  
関門（#87〜89）を越えると、雲の下が見えてきます。
'@
    underground = @'
空の下に沈んだ **地下帝国**。知は石版と機械に封印されています。  
科目B試験の型――追跡・読解・SQL――を砦ごとに叩き込みます。  
推奨開始: 講座 **#90** 以降（空の関門後でも可。強制はしません）。
'@
    land = @'
空と地下を経て、ようやく **大陸の台地**。  
ここは連合による模擬戦です。本試験に近い長さの問いに挑みます。  
推奨: **#114** 以降。
'@
  }
}
