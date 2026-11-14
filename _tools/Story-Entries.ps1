function Get-LampDomainStories {
  # 三つの扉の間トーン（WORLD.md）。諸島・空海・地下帝国の比喩は使わない。
  return @{
    'island-foundation'  = @{ Npc = '灯守レン'; Synopsis = '盾の道の入口。最小の知から灯を点ける間。'; EnterLine = 'レンが言う。「知は粒から。ここが盾の最初の間だ。」' }
    'island-algorithm'   = @{ Npc = '技師ミラ'; Synopsis = 'アルゴリズムとデータ構造の間。'; EnterLine = 'ミラが図版を指す。「手順を整えれば、盾は軽くなる。」' }
    'island-hardware'    = @{ Npc = '工房長ガスト'; Synopsis = 'ハードウェアの間。CPUと記憶の鍛錬。'; EnterLine = 'ガストが基板を磨く。「中身を知らねば、盾は割れる。」' }
    'island-system'      = @{ Npc = '系譜士セラ'; Synopsis = 'システム構成の間。信頼と冗長。'; EnterLine = 'セラが帳を開く。「全体を見渡せ。盾は一枚ではない。」' }
    'island-software'    = @{ Npc = '書庫司書オウ'; Synopsis = 'ソフトウェアの間。層とプロセス。'; EnterLine = 'オウが言う。「層を間違えぬこと。それが盾の厚みだ。」' }
    'island-database'    = @{ Npc = '司書ライラ'; Synopsis = 'データベースの間。表と関係。'; EnterLine = 'ライラが鎖を示す。「関係を結べば、記録は守られる。」' }
    'island-network'     = @{ Npc = '通路番フェン'; Synopsis = 'ネットワークの間。通路と約束。'; EnterLine = 'フェンが灯標を点検する。「約束どおり届けるのが盾だ。」' }
    'island-security'    = @{ Npc = '盾師クレス'; Synopsis = 'セキュリティの間。脅威と暗号。'; EnterLine = 'クレスが脅威の表を広げる。「ここから盾が本気で育つ。」' }
    'island-media'       = @{ Npc = '絵師ティア'; Synopsis = 'メディアの間。見え方と体験。'; EnterLine = 'ティアが言う。「正しく見せることも、守りの一部だ。」' }
    'island-corporate'   = @{ Npc = '書記ホウ'; Synopsis = '企業活動の間。法と組織。'; EnterLine = 'ホウが印を並べる。「決まりを知る者だけが盾を保てる。」' }
    'island-business'    = @{ Npc = '執事アル'; Synopsis = '経営戦略の間。'; EnterLine = 'アルが地図を開く。「狙いを定めよ。盾は方向を持つ。」' }
    'island-system-plan' = @{ Npc = '設計士ナギ'; Synopsis = 'システム化計画の間。'; EnterLine = 'ナギが要件を見る。「計画なき盾は、ただの板だ。」' }
    'island-dev-tech'    = @{ Npc = '棟梁ディン'; Synopsis = '開発技術の間。型と試作。'; EnterLine = 'ディンが試作の灯を点ける。「作り方そのものが鍛錬だ。」' }
    'island-project'     = @{ Npc = '橋番ケイ'; Synopsis = 'プロジェクトの間。工程とWBS。'; EnterLine = 'ケイが工程表を並べる。「順序を守れ。盾の継ぎ目だ。」' }
    'island-service'     = @{ Npc = '灯火番イズミ'; Synopsis = 'サービスの間。障害と復旧。'; EnterLine = 'イズミが巻物を持つ。「落ちても立て直せ。それが盾だ。」' }
    'island-audit'       = @{ Npc = '記録官トモ'; Synopsis = '監査の間。証跡を残す。'; EnterLine = 'トモが判子を用意する。「残りたる証が、最後の盾になる。」' }
    'gate-sky-trial'     = @{ Npc = '関門番トリス'; Synopsis = '盾の関門。総合の試練。'; EnterLine = 'トリスが三つの扉を示す。「ここで盾を鍛え直せ。」' }
    'fortress-algorithm' = @{ Npc = '衛兵長ヴェルク'; Synopsis = '剣の道。動きを追う訓練の間。'; EnterLine = 'ヴェルクが囁く。「動きを追え。剣は思考の刃だ。」' }
    'fortress-program'   = @{ Npc = '技師ザイン'; Synopsis = '擬似言語と構造の剣の間。'; EnterLine = 'ザインが板を渡す。「言葉を刃に変えよ。」' }
    'fortress-database'  = @{ Npc = '管理人ダリア'; Synopsis = 'SQLとERの剣の間。'; EnterLine = 'ダリアが板を掲げる。「関係を斬り結び直せ。」' }
    'fortress-network'   = @{ Npc = '配線番エルク'; Synopsis = 'ネットワーク設計の剣の間。'; EnterLine = 'エルクが図を照らす。「通路を誤れば、剣は空を斬る。」' }
    'fortress-security'  = @{ Npc = '守備長リーゼ'; Synopsis = 'リスクと暗号の剣の間。'; EnterLine = 'リーゼが表を叩く。「脅威を読め。剣の切っ先だ。」' }
    'fortress-deep'      = @{ Npc = '深層のオーレ'; Synopsis = '剣の深層。読解の最奥。'; EnterLine = 'オーレが長文を開く。「ここで剣が研がれる。」' }
    'plateau-mock-am'    = @{ Npc = '教官マコト'; Synopsis = '大扉の奥。科目Aの精神試練。'; EnterLine = 'マコトが言う。「精神を試すぞ。盾と剣の先だ。」' }
    'plateau-mock-pm'    = @{ Npc = '参謀ヒロ'; Synopsis = '大扉の奥。科目Bの精神試練。'; EnterLine = 'ヒロが号令を待つ。「刃と盾を、同時に使え。」' }
    'plateau-final'      = @{ Npc = '見張り長'; Synopsis = '最終試練。精神の総仕上げ。'; EnterLine = '見張り長が線を引く。「すべての灯が、ここに集まる。」' }
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
**左の道（盾）**。科目Aの知識を四肢択一で鍛え、講座をクリアするたび盾が光り成長します。  
関門まで進めば、盾は大きく鍛え直されます。
'@
    underground = @'
**右の道（剣）**。科目Bの追跡・読解・SQLを間ごとに鍛えます。  
講座クリアで剣が成長します。推奨開始: 講座 **#90** 以降（左の道と並行可）。
'@
    land = @'
**大扉の奥（精神）**。両道の鍛錬が十分になってから開く総仕上げです。  
模擬に近い問いで精神が成長します。推奨: **#114** 以降。
'@
  }
}
