# 解説スライド スキーマ（Phase S）

**目的**: 「全く分からない初心者」でも、図とたとえで理解できる講座解説。  
**表示**: `docs/lesson.html` の「やさしい解説（スライド）」。プレイヤーは `docs/lamp-slides.js`。

## 置き場所

| パス | 役割 |
|------|------|
| `_tools/slides/<domain>.json` | **手書きの解説（ソース）** ← ここを編集する |
| `docs/data/slides/<講座#>.json` | ビルド生成（`Write-Slides.ps1`）。手編集しない |

`<domain>` は島・砦のフォルダ名（例 `island-foundation`）。

```json
{
  "domain": "island-foundation",
  "lessons": {
    "1": { "slides": [ /* スライド */ ] },
    "2": { "slides": [ /* スライド */ ] }
  }
}
```

キーは **講座通し番号**（`CURRICULUM.md` の講座#）。**その領域に属する番号だけ**書く。

## スライド

| フィールド | 必須 | 説明 |
|------------|------|------|
| `layout` | | `"title"` なら表紙（1 枚目のみ推奨） |
| `emoji` | | 見出しの絵文字（1 文字〜2 文字） |
| `title` | ✓ | スライドの見出し（**問いかけ・日常語**推奨） |
| `subtitle` | | 表紙のみ。1 行の導入 |
| `blocks` | ✓* | ブロックの配列（表紙は空でも可） |
| `note` | | 「💬 …」の補足。話しかける口調で |

## ブロック（`t` で種類を指定）

| `t` | 必須フィールド | 任意 | 用途 |
|-----|----------------|------|------|
| `p` | `text` | | 本文。**太字** `==強調==` `` `コード` `` が使える |
| `bullets` | `items`（文字列配列） | | 箇条書き（3〜5 項目まで） |
| `big` | `text` | `sub` | 大きく見せたい 1 行（公式・結論） |
| `analogy` | `real`, `tech` | `icon`, `note` | **身近なたとえ → IT の言葉**（初心者向けの主役） |
| `flow` | `steps`（`label` + 任意 `sub` `icon` / 文字列） | `direction:"v"`, `arrows:false`, `caption` | 流れ・手順の図 |
| `compare` | `left`, `right`（各 `title`, `items`） | `vs` | 2 つを比べる |
| `table` | `rows`（行の配列） | `head`, `highlight`, `caption` | 表 |
| `cards` | `items`（`title`, 任意 `text` `icon`） | | 概念カード（2〜4 枚） |
| `callout` | `text` | `kind`: `tip`/`warn`/`exam`/`memo` | 吹き出し |
| `code` | `text` | `caption` | コード・擬似言語・SQL |
| `bits` | `bits`（`"1011"` のような 0/1 文字列） | `interactive`（既定 true）, `weights`, `showHex`, `caption` | **クリックで 0/1 を切り替える**ビット図 |
| `trace` | `vars`, `rows`（各行は `vars` と同じ長さの文字列配列） | `code`（行の配列）, `lines`（各 row で光らせる `code` の 0 始まり行）, `notes`, `caption` | **1 歩ずつ進める**トレース表 |
| `check` | `q`, `choices`（2〜4）, `answer`（0 始まり） | `explain`, `hint` | **その場で確認するミニクイズ**（採点とは無関係） |
| `layers` | `items`（文字列 or `label`+`sub`+`icon`） | `top`, `bottom` | 階層・積み重ね |
| `steps` | `items`（文字列 or `title`+`text`） | | 番号付き手順 |
| `array` | `cells`（文字列配列） | `highlight`, `pointers`（`{ "1": "i" }`）, `start`, `index`, `caption` | 配列・並び |
| `tree` | `root`（`label` + `children`） | `caption` | 木構造・階層 |

## 1 講座の組み立て（推奨 7〜10 枚）

1. **表紙**（`layout: "title"`）… 絵文字＋「この講座で何ができるようになるか」
2. **なぜ必要？ / ざっくり何？** … 日常のたとえ（`analogy`）
3. **キーワード 1〜3 個** … 1 スライド 1 概念。図（`flow` `bits` `layers` `compare` `array` `tree`）を必ず 1 つ以上
4. **手順・計算の見せ方** … `steps` `trace` `table`
5. **まちがえやすい点** … `callout` `warn`
6. **試験ではここ** … `callout` `exam`（頻出の「答えの型」を教える。**封印の問いの答えそのものを書かない**）
7. **ミニ確認** … `check` を 1〜2 個（講座の問いとは**別の数値・別の題材**で）
8. **まとめ** … 3 行以内＋「次は封印の問いへ」

## 書き方のルール（初心者向け）

- **専門用語は初出の直後に、かんたんな言い換え**を添える（例: 「ビット（0 か 1 のスイッチ 1 個）」）。
- **必ずたとえ話**を 1 回は入れる（料理・学校・買い物・スイッチ・郵便・図書館など）。
- 1 スライドの文字は **200 字前後**まで。長い説明は図やカードに分ける。
- **試験の正答性を最優先**。たとえが厳密さを壊さないよう、「ただし本当は…」で補足してよい。
- 講座の `README`（用語表）・`PROBLEMS` と**矛盾させない**。用語名は README と同じ表記を使う。
- ミニ確認 (`check`) は PROBLEMS の問題文を**そのまま使わない**。
- 絵文字は見出し・カードのアイコンに使ってよいが、本文に乱発しない。
- 日本語は「です・ます」。親しみやすく、でも幼稚にしない。

## 例（抜粋）

```json
{
  "layout": "title", "emoji": "💡", "title": "ビットとバイト",
  "subtitle": "コンピュータの中身は、ぜんぶ『0 と 1』です。",
  "blocks": []
},
{
  "emoji": "🔦", "title": "1 ビット = スイッチ 1 個",
  "blocks": [
    { "t": "analogy", "icon": "💡", "real": "部屋の電気のスイッチ。ON か OFF の 2 通り。", "tech": "**ビット**。0 か 1 の 2 通りを表す、情報の最小単位。" },
    { "t": "bits", "bits": "1" }
  ]
},
{
  "emoji": "✅", "title": "ためしてみよう",
  "blocks": [
    { "t": "check", "q": "スイッチ 4 個で作れる ON/OFF の組み合わせは何通り？", "choices": ["8", "12", "16", "32"], "answer": 2, "explain": "2 × 2 × 2 × 2 = 16 通りです。" }
  ]
}
```

## ビルドと検証

```powershell
.\_tools\Write-Slides.ps1    # 手書き + かんたん版（未執筆講座の自動生成）→ docs/data/slides/
.\_tools\Test-Slides.ps1     # スキーマ検証＋カバレッジ表示
```

手書きがない講座は、README の用語表から **かんたん版**（`authored: false`）が自動生成されます。
