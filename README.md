# Lumina Code

**基本情報技術者試験（FE）** の出題範囲を **121 講座**に刻んだ、網羅型の学習冒険です（リポジトリ名: Lamp-archipelago）。

舞台は **三つの扉の間**。謎の老人の前で、左に盾の道（科目A）、右に剣の道（科目B）、正面の大扉の奥で精神（模擬）を鍛えます。分野をクリアするたび盾・剣・精神が光り成長します。最短合格のテクニックより、**積み上がる順**と、マップで見える進行を大切にしています。

---

## いますぐ始める（ブラウザだけで OK）

ターミナル不要。スマホならホーム画面追加（PWA）もできます。

| 入口 | URL |
|------|-----|
| **ワールドマップ（2D ダンジョン）** | https://educoder-lab.github.io/Lamp-archipelago/map.html |
| **三つの扉の間 — FE 試験の手引き**（最初におすすめ） | https://educoder-lab.github.io/Lamp-archipelago/lesson.html?hub=1 |
| **講座 01（ビットとバイト）** | https://educoder-lab.github.io/Lamp-archipelago/lesson.html?no=1 |
| **全講座一覧** | https://educoder-lab.github.io/Lamp-archipelago/ref.html?p=curriculum |
| **用語図鑑** | https://educoder-lab.github.io/Lamp-archipelago/ref.html?p=glossary |

### 推奨ルート

1. **マップ**を開く → 手前に自分の後ろ姿、正面に大扉と老人、左に盾の道・右に剣の道  
2. **老人**に話し、**FE 試験の手引き**（スライド → 学習プリント → 演習）を学ぶ  
3. **左で盾／右で剣**を鍛える。各分野で灯を点けると次へ進み、分野クリアで武具が成長する  
4. **大扉の奥**は両道の鍛錬が十分になってから。精神を鍛え、模擬の総仕上げへ  

### 1 講座の型（どの道も同じ）

1. **やさしい解説（HTML スライド）** … たとえ・図・具体例・▶再生。高校生でも追える密度  
2. **学習プリント（README）** … 用語表・対応表を見返す（印刷も可）  
3. **封印の問い** … 四肢択一などをブラウザで採点  
4. 合格で **灯・XP・称号**。分野クリアで盾・剣・精神が成長し、レベルアップ演出  

詰まったら **迂回 ↷**（あとで間の復習から戻れます）。記録は端末内のほか、任意で **Google ログイン＋クラウド同期**。JSON の出し入れもできます。

採点の仕組み: [HOW-GRADING-WORKS.md](./HOW-GRADING-WORKS.md)  
クラウド設定（fork 時）: [_tools/Supabase-Setup.md](./_tools/Supabase-Setup.md)

---

## ワールドマップ（2D・既定）

公開マップは **後ろ姿視点の拠点**と、道の中のオーバーワールドです（従来の Three.js 箱庭は `lamp-world.js` に残置・非推奨）。

| 場所 | 試験との対応 | 画面のイメージ |
|------|----------------|----------------|
| **三つの扉の間** | 旅の拠点・FE 概要 | 手前に後ろ姿、正面に大扉と老人。手引きは `lesson.html?hub=1` |
| **左の道（盾）** | 科目A | 琥珀と青。分野クリアで盾が成長 |
| **右の道（剣）** | 科目B | 紫と銀。分野クリアで剣が成長 |
| **大扉の奥（精神）** | 模擬・総仕上げ | 緑と金。分野クリアで精神が成長 |

- **老人／扉クリック**で会話と進路  
- 道の中では矢印／WASD、ナビ（全体図 / 左 / 大扉 / 右 / 間）  
- 次の分野は **current**。未開放は **fog**（入場は可）  

世界観の文章: [WORLD.md](./WORLD.md)

---

## コースの構造

| 場所 | フォルダ | 内容 |
|------|----------|------|
| 拠点 | [land/hub-harbor](./land/hub-harbor/) | FE 概要（Web 専用クエスト） |
| 左の道 | [sky](./sky/) | 科目A（テクノロジ〜ストラテジ）＝盾 |
| 右の道 | [underground](./underground/) | 科目B（擬似言語・セキュリティ・読解）＝剣 |
| 大扉の奥 | [land](./land/) | 模擬試験＝精神 |

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
