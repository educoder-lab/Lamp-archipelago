# 採点のしかた

## ブラウザ（GitHub Pages・おすすめ）

ターミナル不要です。採点は **その場で自動** です。

1. [ワールドマップ](https://educoder-lab.github.io/Lamp-archipelago/map.html) または [講座 01](https://educoder-lab.github.io/Lamp-archipelago/lesson.html?no=1) を開く  
2. 用語を読む → 四肢択一に答える → **灯を点ける（採点）**  
3. 未合格時は画面の **ヒント**（Manifest と同じ）を表示  
4. 合格で `localStorage` に灯・称号が入り、マップに反映  

迂回・記録の出し入れ: マップ / 講座画面の **W2** 機能を参照。

## PowerShell（ローカル・従来）

1. 講座フォルダへ `cd`（例: `sky\island-foundation\01-bit`）  
2. **README.md** → **PROBLEMS.md**（末尾 **ナビ** で次へ）  
3. `演習結果\answers.txt` に選択肢を書く  
4. `.\Test-Lesson.ps1`  
5. 冒険記録: `.\Show-Status.ps1` / `.\Show-Map.ps1`（`.adventure-save.json`）

### answers.txt の形式

```text
1:B
2:A
3:C
```

- 1行1問。半角英字（A〜D）  
- 番号は PROBLEMS の問番号と一致  

ブラウザ採点と **同じ正規化＋SHA-256** です（`docs/data/quests.json` の `answerHash` と一致）。CI: `Test-WebQuests.ps1`。

## Cursor で「採点して」（任意・PowerShell 学習向け）

PowerShell で演習しているときだけ、チャットで **「採点して」** と言うと AI が次の **4つ** を返します。

| # | 内容 |
|---|------|
| 1 | **正式採点** … `Test-Lesson.ps1` |
| 2 | **ターミナル** … 操作の過程・ミス・直し方 |
| 3 | **やろうとしていたこと** |
| 4 | **改善案** |

ブラウザだけで完結している場合は **不要** です（自動採点済み）。

詳細ルール: [.cursor/rules/grading.mdc](./.cursor/rules/grading.mdc)
