# Lumina Code

**基本情報技術者試験**の出題範囲を **121 講座**に刻んだ、網羅型の学習コースです（リポジトリ名: Lamp-archipelago）。  
物語の舞台は **ランプ諸島**。最短合格のテクニックより **知識を積み上げる順** を優先し、RPG 形式で進行が見えるようにしています。

## いま学習を始める（ブラウザ）

**ターミナル不要**です。スマホのホーム画面に追加（PWA）もできます。

| 入口 | URL |
|------|-----|
| **ワールドマップ** | https://educoder-lab.github.io/Lamp-archipelago/map.html |
| **講座 01 から** | https://educoder-lab.github.io/Lamp-archipelago/lesson.html?no=1 |
| **全講座一覧** | https://educoder-lab.github.io/Lamp-archipelago/ref.html?p=curriculum |
| **用語図鑑** | https://educoder-lab.github.io/Lamp-archipelago/ref.html?p=glossary |

### 1 講座の流れ

1. マップで土地を選び **プレイ**（または講座 URL の `?no=番号`）
2. **やさしい解説（図解スライド）**を読む → **封印の問い**（四肢択一）に答える  
   スライドは高校生でも追える密度で、たとえ話・**具体例（数・式）**・▶再生の流れ・クリックできる 2 進数・トレース・ミニ確認つき。「一覧で読む」や全画面にも切り替えられます
3. **灯を点ける** で自動採点 → 合格で灯・称号が増える（この端末の `localStorage`）
4. （任意）マップの **Google でログイン** → 進捗がクラウドにも残り、別の端末でも続きから学べます
5. 詰まったら **迂回 ↷**（あとで戻れる）／記録は **JSON エクスポート・インポート**も可

初回アクセス後、主要ページは **オフライン**でも開けます（Service Worker）。ログインは任意で、未ログインでも学習できます。公開サイト（GitHub Pages）ではクラウド同期が有効です。自分で fork してログインを立てる場合は [Supabase 手順](./_tools/Supabase-Setup.md) を参照してください。

採点の詳細: [HOW-GRADING-WORKS.md](./HOW-GRADING-WORKS.md)

## コースの構造

| エリア | フォルダ | 内容 |
|--------|----------|------|
| 空 | [sky](./sky/) | 午前（ストラテジ・マネジメント・テクノロジ） |
| 地下 | [underground](./underground/) | 午後（追跡・SQL・読解） |
| 陸地 | [land](./land/) | 模擬試験 |

- **121 講座** … [CURRICULUM.md](./CURRICULUM.md)（Web: [カリキュラム](https://educoder-lab.github.io/Lamp-archipelago/ref.html?p=curriculum)・表検索可）
- **物語・設定** … [WORLD.md](./WORLD.md) · [GLOSSARY.md](./GLOSSARY.md) · [TITLES.md](./TITLES.md)
- **RPG 設計** … [RPG-PLAN.md](./RPG-PLAN.md)

## リポジトリの地図

```text
docs/              … GitHub Pages（map / lesson / ref / PWA）
_tools/            … 講座ビルド・Web JSON 生成
  Manifest-Entries.ps1   正答・問題本文（ソース）
  Build-AllLessons.ps1   README/PROBLEMS/Test-Lesson + docs 再生成
  Test-WebQuests.ps1     採点ハッシュ整合チェック
  slides/<領域>.json      解説スライドのソース（手書き）
  Write-Slides.ps1       スライド JSON 生成 → docs/data/slides/
  Test-Slides.ps1        スライド形式の検証
  Supabase-Setup.md      Google ログイン＋進捗同期の設定手順
  supabase/lamp_progress.sql  進捗テーブル（RLS）
sky|underground|land/    講座フォルダ（Markdown + Test-Lesson.ps1）
```

Web データ仕様: [_tools/WebQuest-Schema.md](./_tools/WebQuest-Schema.md)

## PowerShell で学ぶ（任意）

clone してターミナル派の従来ルートも利用できます。

```powershell
.\Show-Status.ps1
.\Show-Map.ps1          # ブラウザ地図 + save-data.js 同期
.\Skip-Lesson.ps1
cd sky\island-foundation\01-bit
# 演習結果\answers.txt → .\Test-Lesson.ps1
```

ブラウザの `localStorage` と `.adventure-save.json` は別系統です。マップは両方をマージ表示できます（`lamp-save.js`）。

## 開発・ビルド

```powershell
.\_tools\Build-AllLessons.ps1    # 講座 MD + docs/data/*.json + map.html
.\_tools\Test-WebQuests.ps1      # CI と同じ検証
```

- **Pages デプロイ**: push → `.github/workflows/pages.yml`
- **整合 CI**: `.github/workflows/verify-web.yml`

技術メモ: [DESIGN.md](./DESIGN.md)

## ライセンス・公開

リポジトリは Public。教材の正答は Manifest 上にありますが、公開 Web（`quests.json`）は **ハッシュのみ**です。
