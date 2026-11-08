# ランプ諸島（Lamp-archipelago）

**基本情報技術者試験**の出題範囲を **121 講座**に刻んだ、網羅型の学習コースです。  
最短合格のテクニックより **知識を積み上げる順** を優先し、物語（RPG）で進行が見えるようにしています。

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
   スライドは、たとえ話・図・クリックできる 2 進数・1 歩ずつ進むトレース・ミニ確認つき。「一覧で読む」や全画面にも切り替えられます
3. **灯を点ける** で自動採点 → 合格で灯・称号が増える（`localStorage`）
4. 詰まったら **迂回 ↷**（あとで戻れる）／記録は **JSON エクスポート・インポート**

初回アクセス後、主要ページは **オフライン**でも開けます（Service Worker）。進捗のバックアップはエクスポートを推奨します。

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
