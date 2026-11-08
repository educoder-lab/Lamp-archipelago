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
| **Vercel（おすすめ・Private でも可）** | [vercel.com](https://vercel.com) で GitHub 連携 → このリポジトリを Import。**Framework: Other**（`vercel.json` が `docs/` をそのまま公開）。公開 URL は `https://<project>.vercel.app/map.html`。コードは Private のまま、地図だけ URL で開けます。 |
| GitHub Pages | Public リポジトリ（または Private + Pages 有料）向け。[設定後](https://educoder-lab.github.io/Lamp-archipelago/map.html) |
| ローカル `.\Show-Map.ps1` | `.adventure-save.json` を `docs/save-data.js` に同期してから開く。**灯・迂回・称号**が地図に反映されます（Vercel 上には進捗は載りません）。 |
| `docs/map.html` | クローン先でダブルクリック（記録なし）。 |

### Vercel の手順（初回だけ）

1. Vercel にログイン → **Add New → Project** → `Lamp-archipelago` を Import（Private リポジトリへのアクセスを許可）。
2. **Build Command** は空、**Output Directory** は `docs`（ルートの `vercel.json` が同じ内容ならそのまま Deploy）。
3. 完了後 **`/map.html`** を開く。講座の「用語」「問題」は **GitHub 上の README / PROBLEMS**（要 GitHub ログインで Private 閲覧可）にリンクします。

**注意**: Vercel の URL 自体は通常 **誰でも開ける**公開 URL です。教材本文まで隠すなら Vercel の Password Protection（Pro）か、地図はローカルのみにしてください。

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
