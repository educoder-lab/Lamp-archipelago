# Web クエスト JSON スキーマ（Phase W0）

ブラウザだけで学習ループを回すためのデータ。`docs/data/quests.json` にビルド出力する。  
**正答の平文は含めない**（`Test-Lesson.ps1` と同様 **answerHash のみ**）。

## ルートオブジェクト

| フィールド | 型 | 説明 |
|------------|-----|------|
| `schemaVersion` | number | いまは **1**。破壊的変更時に増やす |
| `generatedAt` | string | ISO 8601（ビルド時刻） |
| `lessonCount` | number | 講座数（121 など） |
| `lessons` | array | 講座オブジェクトの配列（`courseNo` 昇順） |

## 講座オブジェクト `lessons[]`

| フィールド | 型 | 公開 | 説明 |
|------------|-----|------|------|
| `courseNo` | number | ✓ | コース通し番号（1〜） |
| `lessonId` | string | ✓ | 進捗 ID。例 `sky/island-foundation/01-bit` |
| `path` | string | ✓ | リポジトリ相対パス（`/` 区切り） |
| `realm` | string | ✓ | `sky` \| `underground` \| `land` |
| `domain` | string | ✓ | 島・砦 ID |
| `domainTitle` | string | ✓ | 表示用 |
| `title` | string | ✓ | 講座タイトル（`TestTitle`） |
| `blurb` | string | ✓ | 短いねらい |
| `webReady` | boolean | ✓ | 問題パース成功かつ Manifest の問数と一致するとき `true`（W1: 全講座対象） |
| `readmeMarkdown` | string | ✓ | README 相当（物語＋用語。Markdown） |
| `request` | string | | PROBLEMS の依頼文 |
| `questions` | array | ✓ | 四肢択一（下記） |
| `answerHash` | string | ✓ | `answers.txt` 正規化後の SHA-256（小文字 hex） |
| `hint` | string | ✓ | 未合格時のヒント（Manifest） |
| `clearLine` | string | ✓ | 合格時の一言 |
| `titleAwards` | string[] | ✓ | 初回クリアで付与する称号 |
| `nav` | object | ✓ | `prevCourseNo`, `nextCourseNo`, `nextLessonId`（端は null） |

### `questions[]`

| フィールド | 型 | 説明 |
|------------|-----|------|
| `no` | number | 問番号（1 始まり） |
| `stem` | string | 問題文（選択肢除く） |
| `choices` | array | `{ "id": "A", "text": "…" }`（A〜D） |

## 採点（ブラウザ）

`Invoke-LessonAssert.ps1` の `Get-NormalizedHash` と同じ規則:

1. `answers.txt` 相当の文字列を組み立てる（1 行 1 問、`1:B` 形式、問番号昇順）
2. CRLF → LF、各行 trim、空行除去
3. 行を `\n` で結合
4. UTF-8 で SHA-256 → **小文字 hex**（64 文字）

`answerHash` と一致すれば合格。`Manifest-Entries.ps1` の平文 `Answers` は **JSON に出さない**。

## 進捗（ブラウザ）

`docs/lesson.html` は `localStorage` キー `lamp_adventure_v1` を使用（`.adventure-save.json` と同型に近い）:

| フィールド | 型 |
|------------|-----|
| `displayName` | string |
| `clearedIds` | string[] |
| `clearedNos` | number[] |
| `skippedNos` | number[] |
| `titles` | string[] |
| `lastLessonId` | string \| null |
| `lastCourseNo` | number |
| `updatedAt` | string (ISO) |

`docs/lamp-save.js` が `localStorage` と `save-data.js` をマージする。`map.html` / `lesson.html` は W1 から利用。

### W2 API（`LampSave`）

| メソッド | 用途 |
|----------|------|
| `registerSkip` / `unregisterSkip` | 迂回 ↷（マップ・講座） |
| `setDisplayName` | 旅人名 |
| `downloadExport` / `importFromJson` | セーブの JSON 出し入れ |
| `resetLocal` | ブラウザ記録の消去 |

## 参照ページ（W3）

`docs/data/refs.json` … `WORLD.md` / `GLOSSARY.md` / `CURRICULUM.md` / `TITLES.md` を Web 用リンクに差し替え。  
表示: `docs/ref.html?p=curriculum|glossary|world|titles`（`lamp-markdown.js`、表は検索で絞り込み）。

## 生成

```powershell
.\_tools\Build-AllLessons.ps1   # Write-QuestsFile + Write-WebDocsFile
# または
.\_tools\Write-Quests.ps1
.\_tools\Write-WebDocs.ps1
```

## 関連

- 技術設計: [DESIGN.md](../DESIGN.md)
- Web 化ロードマップ: チャット Phase W0〜W1
- 物語フィールド: [Story-Schema.md](./Story-Schema.md)
