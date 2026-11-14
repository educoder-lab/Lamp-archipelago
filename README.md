# Lumina Code

**基本情報技術者試験（FE）** の出題範囲を **121 講座**に刻んだ、網羅型の学習冒険です（リポジトリ名: Lamp-archipelago）。

舞台は雲と海の上の **ランプ諸島**。知識の灯を一つずつ点けながら、空（午前）→ 地下（午後）→ 陸地（模擬）へと進みます。最短合格のテクニックより、**積み上がる順**と、マップで見える進行を大切にしています。

---

## いますぐ始める（ブラウザだけで OK）

ターミナル不要。スマホならホーム画面追加（PWA）もできます。

| 入口 | URL |
|------|-----|
| **ワールドマップ（2D ダンジョン）** | https://educoder-lab.github.io/Lamp-archipelago/map.html |
| **灯台の港 — FE 試験の手引き**（最初におすすめ） | https://educoder-lab.github.io/Lamp-archipelago/lesson.html?hub=1 |
| **講座 01（ビットとバイト）** | https://educoder-lab.github.io/Lamp-archipelago/lesson.html?no=1 |
| **全講座一覧** | https://educoder-lab.github.io/Lamp-archipelago/ref.html?p=curriculum |
| **用語図鑑** | https://educoder-lab.github.io/Lamp-archipelago/ref.html?p=glossary |

### 推奨ルート

1. **マップ**を開く → **灯台の港**をクリック（モーダルが開く）  
2. モーダルから **FE 試験の手引き**（スライド → 学習プリント → 演習）／空・地下・陸地への移動／間違い復習  
3. マップ上は **光の道**の一本道に沿って歩き進む（地下・陸地も領域バンドでつながる）  
4. 地下の砦で午後型、陸地の台地で模擬の総仕上げ  

### 1 講座の型（港も島も同じ）

1. **やさしい解説（HTML スライド）** … たとえ・図・具体例・▶再生。高校生でも追える密度  
2. **学習プリント（README）** … 用語表・対応表を見返す（印刷も可）  
3. **封印の問い** … 四肢択一などをブラウザで採点  
4. 合格で **灯・XP・称号**。マップのアバターが次へ進み、島クリアでレベルアップ演出  

詰まったら **迂回 ↷**（あとで港の復習から戻れます）。記録は端末内のほか、任意で **Google ログイン＋クラウド同期**。JSON の出し入れもできます。

採点の仕組み: [HOW-GRADING-WORKS.md](./HOW-GRADING-WORKS.md)  
クラウド設定（fork 時）: [_tools/Supabase-Setup.md](./_tools/Supabase-Setup.md)

---

## ワールドマップ（2D ダンジョン・既定）

公開マップは **トップダウンのオーバーワールド**です（従来の Three.js 箱庭は `lamp-world.js` に残置・非推奨）。

| エリア | 試験との対応 | マップ上のイメージ |
|--------|----------------|--------------------|
| **灯台の港**（陸地） | 旅の拠点・FE 概要クエスト | 手前の桟橋。手引きは `lesson.html?hub=1` |
| **空** | 午前（知識の四肢択一） | マップ上段。**スネーク順＋光の道** |
| **地下帝国** | 午後（トレース・読解） | マップ中段。紫系の床タイル |
| **陸地の台地** | 模擬・総仕上げ | マップ下段。緑系の床タイル |

- **港クリック**で拠点モーダル（学習・領域ジャンプ・復習）  
- 進行ルートは **光の道**（廊下タイルのハイライト）で明示  
- 矢印／WASD で歩行、ナビ（全体図 / 空 / 陸 / 地下 / 港）でジャンプ  
- 次に攻略すべき島は枠色 **current**。未開放は **fog**（入場は可）  
- 島ごとにテーマ色（[_tools/Island-Themes.md](./_tools/Island-Themes.md)）  

世界観の文章: [WORLD.md](./WORLD.md)

---

## コースの構造

| エリア | フォルダ | 内容 |
|--------|----------|------|
| 拠点 | [land/hub-harbor](./land/hub-harbor/) | FE 概要（Web 専用クエスト） |
| 空 | [sky](./sky/) | 午前（テクノロジ〜ストラテジ） |
| 地下 | [underground](./underground/) | 午後（追跡・SQL・読解） |
| 陸地 | [land](./land/) | 模擬試験の台地 |

- **121 講座一覧** … [CURRICULUM.md](./CURRICULUM.md)（Web: [カリキュラム](https://educoder-lab.github.io/Lamp-archipelago/ref.html?p=curriculum)）  
- **用語・称号** … [GLOSSARY.md](./GLOSSARY.md) · [TITLES.md](./TITLES.md)  
- **RPG 設計メモ** … [RPG-PLAN.md](./RPG-PLAN.md)

---

## リポジトリの地図

```text
docs/                 GitHub Pages（map / lesson / ref / PWA）
  map.html            2D ダンジョンマップ（テンプレートから生成）
  lamp-dungeon.js     Canvas オーバーワールド（既定）
  lesson.html         講座プレイヤー（?hub=1 で港の手引き）
  data/hub-quest.json 港クエスト本体
  data/slides/        講座・港のスライド（ビルド生成＋ hub.json）
  lamp-world.js       Three.js（ロールバック用）
_tools/               ビルド・検証・スライドソース
  slides/<領域>.json  手書きスライド
  map-template.html   マップ HTML のソース
  Build-AllLessons.ps1
sky|underground|land/ 講座フォルダ（README + PROBLEMS + Test-Lesson.ps1）
```

Web データ仕様: [_tools/WebQuest-Schema.md](./_tools/WebQuest-Schema.md)  
Pages 側のファイル一覧: [docs/README.md](./docs/README.md)

---

## PowerShell で学ぶ（任意）

clone してターミナル派のルートもそのまま使えます。

```powershell
.\Show-Status.ps1
.\Show-Map.ps1
cd sky\island-foundation\01-bit
# 演習結果\answers.txt を書いてから
.\Test-Lesson.ps1
```

ブラウザの `localStorage` と `.adventure-save.json` は別系統です。マップは両方をマージ表示できます。

---

## 開発・ビルド

```powershell
.\_tools\Build-AllLessons.ps1    # 講座 MD + docs/data + map.html
.\_tools\Test-WebQuests.ps1      # 採点ハッシュ整合
.\_tools\Test-Slides.ps1         # スライド形式
```

- **Pages デプロイ**: `main` への push → `.github/workflows/pages.yml`  
- **整合 CI**: `.github/workflows/verify-web.yml`  
- 技術メモ: [DESIGN.md](./DESIGN.md)

---

## ライセンス・公開

リポジトリは Public です。教材の正答は Manifest 上にありますが、公開 Web（`quests.json`）には **採点ハッシュのみ**を載せています。
