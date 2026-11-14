function Get-LampDomainStories {
  # 全分野の入場台詞は謎の老人。部屋の意味と「何を理解すれば扉が開くか」を述べる。
  $elder = '謎の老人'
  return @{
    'island-foundation'  = @{ Npc = $elder; Synopsis = '盾の道の入口。数と論理の基礎を灯す間。'; EnterLine = 'ここは基礎理論の間。ビットや論理など、最小の知を理解すれば、この扉は開く。' }
    'island-algorithm'   = @{ Npc = $elder; Synopsis = '手順と構造を整える間。'; EnterLine = 'ここはアルゴリズムの間。探し方・並べ方・データの型を理解すれば、扉は開く。' }
    'island-hardware'    = @{ Npc = $elder; Synopsis = '計算機の中身を知る間。'; EnterLine = 'ここはハードウェアの間。CPUや記憶の仕組みを理解すれば、扉は開く。' }
    'island-system'      = @{ Npc = $elder; Synopsis = 'システム全体の信頼性を見る間。'; EnterLine = 'ここはシステム構成の間。信頼・冗長・性能の考え方を理解すれば、扉は開く。' }
    'island-software'    = @{ Npc = $elder; Synopsis = 'OSとソフトウェアの層の間。'; EnterLine = 'ここはソフトウェアの間。OSやプロセスの層を理解すれば、扉は開く。' }
    'island-database'    = @{ Npc = $elder; Synopsis = '表と関係で記録を守る間。'; EnterLine = 'ここはデータベースの間。表の関係とSQLの意味を理解すれば、扉は開く。' }
    'island-network'     = @{ Npc = $elder; Synopsis = '通達の約束を学ぶ間。'; EnterLine = 'ここはネットワークの間。届ける約束と経路を理解すれば、扉は開く。' }
    'island-security'    = @{ Npc = $elder; Synopsis = '脅威から守る盾の間。'; EnterLine = 'ここはセキュリティの間。脅威と守り方を理解すれば、扉は開く。' }
    'island-media'       = @{ Npc = $elder; Synopsis = '見え方と体験を扱う間。'; EnterLine = 'ここはメディアの間。データの見え方と体験を理解すれば、扉は開く。' }
    'island-corporate'   = @{ Npc = $elder; Synopsis = '企業と法の間。'; EnterLine = 'ここは企業活動の間。組織と法の決まりを理解すれば、扉は開く。' }
    'island-business'    = @{ Npc = $elder; Synopsis = '経営の狙いを定める間。'; EnterLine = 'ここは経営戦略の間。狙いと価値の置き方を理解すれば、扉は開く。' }
    'island-system-plan' = @{ Npc = $elder; Synopsis = '企画と要件の間。'; EnterLine = 'ここはシステム企画の間。何を作るかを定める考えを理解すれば、扉は開く。' }
    'island-dev-tech'    = @{ Npc = $elder; Synopsis = '開発の型を学ぶ間。'; EnterLine = 'ここは開発技術の間。設計・実装・試験の型を理解すれば、扉は開く。' }
    'island-project'     = @{ Npc = $elder; Synopsis = '工程を束ねる間。'; EnterLine = 'ここはプロジェクトの間。工程と役割の進め方を理解すれば、扉は開く。' }
    'island-service'     = @{ Npc = $elder; Synopsis = 'サービスを保つ間。'; EnterLine = 'ここはサービスの間。止めず・戻す運用の考えを理解すれば、扉は開く。' }
    'island-audit'       = @{ Npc = $elder; Synopsis = '証跡を残す間。'; EnterLine = 'ここは監査の間。正しさを残す証跡の意味を理解すれば、扉は開く。' }
    'gate-sky-trial'     = @{ Npc = $elder; Synopsis = '盾の関門。総合の試練。'; EnterLine = 'ここは盾の関門。これまで学んだ知識を総合して示せば、扉は開く。' }
    'fortress-algorithm' = @{ Npc = $elder; Synopsis = '動きを追う剣の間。'; EnterLine = 'ここはトレースの間。プログラムの動きを正確に追えれば、扉は開く。' }
    'fortress-program'   = @{ Npc = $elder; Synopsis = '擬似言語を刃にする間。'; EnterLine = 'ここはプログラムの間。擬似言語の読み書きを理解すれば、扉は開く。' }
    'fortress-database'  = @{ Npc = $elder; Synopsis = 'SQLと設計の剣の間。'; EnterLine = 'ここはデータベースの剣の間。ERとSQLの読みを理解すれば、扉は開く。' }
    'fortress-network'   = @{ Npc = $elder; Synopsis = '通信設計の剣の間。'; EnterLine = 'ここはネットワークの剣の間。設計と計算の読みを理解すれば、扉は開く。' }
    'fortress-security'  = @{ Npc = $elder; Synopsis = 'リスクを読む剣の間。'; EnterLine = 'ここはセキュリティの剣の間。リスクと守りを読み解けば、扉は開く。' }
    'fortress-deep'      = @{ Npc = $elder; Synopsis = '剣の深層。長文読解の最奥。'; EnterLine = 'ここは剣の深層。長文の意図を読み切れば、扉は開く。' }
    'plateau-mock-am'    = @{ Npc = $elder; Synopsis = '大扉の奥。科目Aの精神試練。'; EnterLine = 'ここは科目A模試の間。広い知識を安定して示せば、扉は開く。' }
    'plateau-mock-pm'    = @{ Npc = $elder; Synopsis = '大扉の奥。科目Bの精神試練。'; EnterLine = 'ここは科目B模試の間。読解とシナリオを貫ければ、扉は開く。' }
    'plateau-final'      = @{ Npc = $elder; Synopsis = '最終試練。精神の総仕上げ。'; EnterLine = 'ここは最終試練の間。盾と剣のすべてを総ざらいできれば、扉は開く。' }
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
基礎理論の間の一段目。知は粒から始まる。
'@ '謎の老人: 最初の封印は「最小の粒」についてだ。理解すれば灯が点く。' '最小の粒が光に溶け、灯芯が一本だけ太くなった。' 'ビットの灯'
  & $add 'island-foundation' 'base' '銘板が2進と16進で刻まれている。' '謎の老人: 銘板の数字を正しい世界の言葉に直せ。' '灯が二段目で、数の桁を数え始めた。' $null
  & $add 'island-foundation' 'unit' '単位の旗がはためく。' '謎の老人: バイトと速度の話。旗の印を選べ。' 'はじめて「大きさ」の意味が灯った。' $null
  & $add 'island-foundation' 'logic' '真理の表が浮かぶ。' '謎の老人: 門は論理で開く。' '霧の向こうに次の路が見えた。' $null
  & $add 'island-foundation' 'shift' '灯芯をずらすと、数が別の姿を見せる。' '謎の老人: シフトの封印だ。' '灯芯がひとつ、丁寧に位置を変えた。' $null
  & $add 'island-foundation' 'float' '誤差の泡が浮かぶ。' '謎の老人: 浮動小数は泡の話。' '泡が一つ割れ、正しい丸さだけが残った。' $null
  & $add 'island-foundation' 'char' '文字の印が並ぶ。' '謎の老人: 文字の符号化だ。' '文字が、ようやく一つの声になった。' $null
  & $add 'island-foundation' 'set' '集合の輪が重なる。' '謎の老人: 集合と論理の続きだ。' '輪が重なり、集合の灯が点灯した。' $null
  & $add 'island-foundation' 'prob' 'サイコロが転がり、平均が囁く。' '謎の老人: 確率の話。' 'サイコロが止まり、静かな見通しが得られた。' $null
  & $add 'island-foundation' 'matrix' '格子の床に行列が浮き上がる。' '謎の老人: 行と列を踏みなさい。' '床の格子が光り、基礎の灯が近づいた。' $null
  & $add 'island-foundation' 'bigo' '計算量の話が語られる。' '謎の老人: オーダの封印。急がず選べ。' '見通しが遠くまで届いた。' $null
  & $add 'island-foundation' 'automata' 'オートマトンの図が眠る。' '謎の老人: 最後の基礎だ。これを越えれば次の間へ。' '基礎の間の灯が一気に繋がった。' '灯台の証'
  & $add 'fortress-algorithm' 'trace-basic' @'
剣の道。動きを追う訓練の始まり。
'@ '謎の老人: 初陣だ。変数の動きを追跡せよ。' '石版の一本が白く光り、剣の最初の灯が灯った。' '地下入り'
  & $add 'fortress-algorithm' 'trace-loop' 'ループが回り始める。' '謎の老人: 繰り返しの封印を解け。' 'ループの跡が円を描き、灯が二つ目を刻んだ。' $null
  & $add 'fortress-algorithm' 'trace-array' '配列の欄が現れる。' '謎の老人: 添字に気をつけろ。' '配列の欄が順に埋まり、記録が一つ完成した。' $null
  & $add 'fortress-algorithm' 'trace-recurse' '自分を呼ぶ式が刻まれる。' '謎の老人: 再帰だ。戻りを見失うな。' '式の呼び木が静かに収まった。' 'トレースの証'
  & $add 'island-algorithm' 'array' '番号の付いた箱が並ぶ。' '謎の老人: 探索は順に踏むことが先だ。' '棚のラベルが一つ光った。' $null
  & $add 'island-algorithm' 'bsearch' '真ん中を指す矢印がある。' '謎の老人: 半分ずつ狭めろ。二分探索だ。' '探索の経路が短く見えた。' $null
  & $add 'island-algorithm' 'bubble' '隣同士を比べて並べ替える。' '謎の老人: バブルと選択の話だ。' '整列の音が響いた。' $null
  & $add 'island-algorithm' 'merge' '分けて整え、合わせる。' '謎の老人: マージとクイックの封印。' 'ソートの図が完成した。' $null
  & $add 'island-algorithm' 'stack' 'LIFO の矢印が刻まれている。' '謎の老人: スタックとキューだ。' '正しい順で板が落ちた。' $null
  & $add 'island-algorithm' 'list' 'つながったノードが浮かぶ。' '謎の老人: 次のつながりを追え。' 'ポインタの道が見えた。' $null
  & $add 'island-algorithm' 'tree' '根から枝分かれする木。' '謎の老人: 根を忘れるな。' '探索の木が澄んだ。' $null
  & $add 'island-algorithm' 'hash' '鍵穴の列に名前が吸い込まれる。' '謎の老人: ハッシュの話だ。' '対応が一瞬で見つかった。' $null
  & $add 'island-algorithm' 'graph' '頂点と辺が広がる。' '謎の老人: グラフを渡れ。' '星図が一筆で繋がった。' 'グラフの渡り手'
  & $add 'gate-sky-trial' 'tech-trial' @'
関の第一扉。テクノロジの空気だけが濃い。
'@ '謎の老人: テクノロジ総合の封印。三問、落ち着いて選べ。' '第一扉が開いた。' '雲裂き・技'
  & $add 'gate-sky-trial' 'mgmt-trial' '第二扉。工程とサービスの旗。' '謎の老人: マネジメント総合だ。' '第二扉が鳴った。' '雲裂き・管'
  & $add 'gate-sky-trial' 'strat-trial' '第三扉。戦略の羅針盤が回る。' '謎の老人: 最後はストラテジ。' '三扉すべてが開いた。' '雲裂き・略'
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
    $d = @{ Npc = '謎の老人'; Synopsis = 'この間の封印を解く旅。'; EnterLine = 'ここはその間だ。問いを理解すれば、扉は開く。' }
  }
  $o = $over[$key]
  $composed = if ($o) { $null } else { New-LampComposedLessonStory -Lesson $Lesson -DomainNpc $d.Npc -DomainSynopsis $d.Synopsis }

  $lore = if ($o -and $o.ReadmeLore) { $o.ReadmeLore } elseif ($composed) { $composed.ReadmeLore } else { "$($d.Synopsis)" }
  $request = if ($o -and $o.Request) { $o.Request } elseif ($composed) { $composed.Request } else { "謎の老人: 次の封印の問いを解いてくれ。理解すれば灯が点く。" }
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
