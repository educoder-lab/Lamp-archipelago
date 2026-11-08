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

## はじめ方

```powershell
.\Show-Status.ps1              # 冒険状況・次の cd
cd sky\island-foundation\01-bit
# README → PROBLEMS → 演習結果\answers.txt
.\Test-Lesson.ps1
```

採点: [HOW-GRADING-WORKS.md](./HOW-GRADING-WORKS.md)  
設計: [DESIGN.md](./DESIGN.md)  
学習RPG化の計画: [RPG-PLAN.md](./RPG-PLAN.md)  
講座データ: `_tools/Manifest-Entries.ps1` → `.\_tools\Build-AllLessons.ps1`
