# 採点のしかた

「**採点して**」と言うと、AI は次の **4つ** をセットで返します。

| # | 内容 |
|---|------|
| 1 | **正式採点** … `Test-Lesson.ps1`（合格で次へ進める） |
| 2 | **ターミナル** … 操作の過程・ミス・直し方 |
| 3 | **やろうとしていたこと** … あなたの意図を言葉にしたもの |
| 4 | **改善案** … README の範囲＋あなたの意図に合った考え方 |

## あなたがやること

1. 講座フォルダへ `cd`（例: `sky\island-foundation\01-bit`）
2. **README.md** で用語・定義を読む → **PROBLEMS.md** でクエスト（末尾 **ナビ** で次講座へ）
3. 選択肢は `演習結果\answers.txt` に書く（書く問題は PROBLEMS の指示どおり）
4. `.\Test-Lesson.ps1`
5. チャットで「**採点して**」

### answers.txt の形式

```text
1:B
2:A
3:C
```

- 1行1問。半角英字の選択肢（A〜D）
- 番号は PROBLEMS の問番号と一致

詳細ルール: [.cursor/rules/grading.mdc](./.cursor/rules/grading.mdc)
