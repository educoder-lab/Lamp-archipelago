# Lamp-archipelago（ランプ諸島）

**基本情報技術者試験の出題範囲**を、島・砦ごとに **小さな講座へ分割した網羅学習コース**です。  
最短合格のテクニックより **知識を積み上げる** ことを優先しています。

## 全体像

| エリア | 内容 |
|--------|------|
| [sky](./sky/) | 午前（ストラテジ・マネジメント・テクノロジ） |
| [underground](./underground/) | 午後（追跡・SQL・読解） |
| [land](./land/) | 模擬試験 |

**講座数・順番**: [CURRICULUM.md](./CURRICULUM.md)（自動生成。README/PROBLEMS からも **ナビ** で次へ進めます）  
**RPG**: [WORLD.md](./WORLD.md) · [GLOSSARY.md](./GLOSSARY.md) · [TITLES.md](./TITLES.md)

## はじめ方（ブラウザ・W1）

ターミナル不要で **GitHub Pages** だけで学習できます。

1. [ワールドマップ](https://educoder-lab.github.io/Lamp-archipelago/map.html) を開く（ヘッダから [カリキュラム](https://educoder-lab.github.io/Lamp-archipelago/ref.html?p=curriculum)・[用語図鑑](https://educoder-lab.github.io/Lamp-archipelago/ref.html?p=glossary) も可）  
2. 土地を選び **プレイ**、または [講座 01](https://educoder-lab.github.io/Lamp-archipelago/lesson.html?no=1) から開始  
3. 用語を読む → 四肢択一に答える → **灯を点ける** で採点  
4. 灯・称号はブラウザの **localStorage** に保存（マップに反映）
5. 詰まったら **迂回**、記録は **エクスポート / インポート**（マップ or 講座画面）

ローカル clone 後は `docs/map.html` / `docs/lesson.html` を HTTP で開いてください（`file://` では `quests.json` が読めないことがあります）。

スキーマ: [_tools/WebQuest-Schema.md](./_tools/WebQuest-Schema.md)

## はじめ方（PowerShell）

```powershell
.\Show-Status.ps1
.\Show-Map.ps1                 # 地図 ＋ save-data.js 同期
.\Skip-Lesson.ps1
cd sky\island-foundation\01-bit
# README → PROBLEMS → 演習結果\answers.txt
.\Test-Lesson.ps1
```

採点: [HOW-GRADING-WORKS.md](./HOW-GRADING-WORKS.md)（ブラウザは自動・PS は `Test-Lesson.ps1`）  
品質: `.\_tools\Test-WebQuests.ps1`（Manifest ↔ quests.json ↔ Test-Lesson のハッシュ）  
設計: [DESIGN.md](./DESIGN.md)  
学習RPG化の計画: [RPG-PLAN.md](./RPG-PLAN.md)  
講座データ: `_tools/Manifest-Entries.ps1` → `.\_tools\Build-AllLessons.ps1`
