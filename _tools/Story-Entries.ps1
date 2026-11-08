function Get-LampDomainStories {
  return @{
    'island-foundation'  = @{ Npc = '灯台守レン'; Synopsis = '最古の灯台がある島。0と1から知の灯を点ける。' }
    'island-algorithm'   = @{ Npc = '時計塔の技師ミラ'; Synopsis = 'アルゴリズムとデータ構造の塔が並ぶ島。' }
    'island-hardware'    = @{ Npc = '工房長ガスト'; Synopsis = '蒸気と歯車。CPUと記憶の話。' }
    'island-system'      = @{ Npc = '系譜士セラ'; Synopsis = '信頼性と冗長。システム全体の話。' }
    'island-software'    = @{ Npc = '書庫司書オウ'; Synopsis = 'OSとソフトウェアの層。' }
    'island-database'    = @{ Npc = '水晶司ライラ'; Synopsis = '表と関係。データの泉。' }
    'island-network'     = @{ Npc = '航路司フェン'; Synopsis = 'プロトコルの風路。' }
    'island-security'    = @{ Npc = '盾商会マスター・クレス'; Synopsis = '脅威と暗号の商会。' }
    'island-media'       = @{ Npc = '絵師ティア'; Synopsis = '見え方と体験の話。' }
    'island-corporate'   = @{ Npc = '港の書記ホウ'; Synopsis = '企業と法務の港。' }
    'island-business'    = @{ Npc = '羅針盤の執事アル'; Synopsis = '経営と戦略の室。' }
    'island-system-plan' = @{ Npc = '設計士ナギ'; Synopsis = 'システム化計画の港。' }
    'island-dev-tech'    = @{ Npc = '工房棟梁ディン'; Synopsis = '開発の型と技術。' }
    'island-project'     = @{ Npc = '吊橋番ケイ'; Synopsis = '工程とWBSの橋。' }
    'island-service'     = @{ Npc = '灯火番イズミ'; Synopsis = 'サービスと障害復旧。' }
    'island-audit'       = @{ Npc = '記録官トモ'; Synopsis = '証跡と監査の書庫。' }
    'gate-sky-trial'     = @{ Npc = '関門番トリス'; Synopsis = '空を裂く三つの試練。' }
    'fortress-algorithm' = @{ Npc = '衛兵長ヴェルク'; Synopsis = '帝国石版のトレース訓練場。' }
    'fortress-program'   = @{ Npc = '工房技師ザイン'; Synopsis = '擬似言語と構造の工房。' }
    'fortress-database'  = @{ Npc = '水晶管理人ダリア'; Synopsis = '地下のSQLとER。' }
    'fortress-network'   = @{ Npc = '伏線番エルク'; Synopsis = 'サブネットと設計の要塞。' }
    'fortress-security'  = @{ Npc = '盾壁団リーゼ'; Synopsis = 'リスクと暗号の午後。' }
    'fortress-deep'      = @{ Npc = '深層司祭オーレ'; Synopsis = '読解とシナリオの最奥。' }
    'plateau-mock-am'    = @{ Npc = '連合教官マコト'; Synopsis = '午前模試の台地。' }
    'plateau-mock-pm'    = @{ Npc = '参謀ヒロ'; Synopsis = '午後模試の台地。' }
    'plateau-final'      = @{ Npc = '大陸の見張り長'; Synopsis = '最終演習。' }
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
  & $add 'fortress-algorithm' 'trace-recurse' '自分を呼ぶ式が石に刻まれる。' 'ヴェルク: 再帰だ。戻りを見失うな。' '式の呼び木が静かに収まり、衛兵が頷いた。' $null
  return $h
}

function Get-LampStoryForLesson {
  param($Lesson)
  $domains = Get-LampDomainStories
  $over = Get-LampLessonStoryOverrides
  $key = "$($Lesson.Domain)|$($Lesson.SlugSuffix)"
  $d = $domains[$Lesson.Domain]
  if (-not $d) {
    $d = @{ Npc = '案内人'; Synopsis = 'このエリアの封印を解く旅。' }
  }
  $o = $over[$key]
  $lore = if ($o -and $o.ReadmeLore) { $o.ReadmeLore } else { "$($d.Npc)が待っている。$($d.Synopsis)" }
  $request = if ($o -and $o.Request) { $o.Request } else { "$($d.Npc): 次の封印の問いを解いてくれ。" }
  $clear = if ($o -and $o.ClearLine) { $o.ClearLine } else { '灯がひとつ、静かに灯った。' }
  $title = if ($o -and $o.TitleAward) { $o.TitleAward } else { $null }
  [pscustomobject]@{
    Npc = $d.Npc; Synopsis = $d.Synopsis
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
午後試験の型――追跡・読解・SQL――を砦ごとに叩き込みます。  
推奨開始: 講座 **#90** 以降（空の関門後でも可。強制はしません）。
'@
    land = @'
空と地下を経て、ようやく **大陸の台地**。  
ここは連合による模擬戦です。本試験に近い長さの問いに挑みます。  
推奨: **#114** 以降。
'@
  }
}
