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

## ワールドマップ（HTML）

| 開き方 | 説明 |
|--------|------|
| [GitHub Pages で開く](https://educoder-lab.github.io/Lamp-archipelago/map.html) | ブラウザだけ。講座リンクは GitHub 上の README / PROBLEMS へ飛びます（**main** に push 後、リポジトリの **Settings → Pages** で GitHub Actions が有効なこと）。 |
| ローカル `.\Show-Map.ps1` | `.adventure-save.json` を `docs/save-data.js` に同期してから `docs/map.html` を開きます。**灯・迂回・称号**が地図に反映されます。 |
| ファイル `docs/map.html` | クローン先でダブルクリックでも動きます（記録なし）。 |

初回のみ: GitHub で **Pages** の Source が **GitHub Actions** になっているか確認してください（`.github/workflows/pages.yml` が `docs/` を公開します）。

## はじめ方

```powershell
.\Show-Status.ps1              # 冒険状況・次の cd
.\Show-Map.ps1                 # ワールドマップ（ブラウザ）を記録つきで開く
.\Skip-Lesson.ps1              # 詰まったら迂回して先へ（あとで戻れる）
cd sky\island-foundation\01-bit
# README → PROBLEMS → 演習結果\answers.txt
.\Test-Lesson.ps1
```

採点: [HOW-GRADING-WORKS.md](./HOW-GRADING-WORKS.md)  
設計: [DESIGN.md](./DESIGN.md)  
学習RPG化の計画: [RPG-PLAN.md](./RPG-PLAN.md)  
講座データ: `_tools/Manifest-Entries.ps1` → `.\_tools\Build-AllLessons.ps1`
