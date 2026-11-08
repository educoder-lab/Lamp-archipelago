# Story-Entries スキーマ（Phase 2）

物語は **手編集の講座フォルダには書かない**。`_tools/Story-Entries.ps1` とオーバーライド、なければ `Story-Compose.ps1` で生成する。

## ドメイン `Get-LampDomainStories`

| フィールド | 用途 |
|------------|------|
| `Npc` | 依頼人（講座・島 README） |
| `Synopsis` | 島・砦のあらすじ（1行） |
| `EnterLine` | 入場時の一言（島 README） |

## 講座オーバーライド `Get-LampLessonStoryOverrides`

キー: `"{Domain}|{SlugSuffix}"`（例 `island-foundation|bit`）

| フィールド | 用途 |
|------------|------|
| `ReadmeLore` | README `## 物語` |
| `Request` | PROBLEMS `## 依頼` |
| `ClearLine` | 合格時（Test-Lesson / Invoke-LessonAssert） |
| `TitleAward` | 称号（任意） |

## 合成 `New-LampComposedLessonStory`

オーバーライドが無い講座は `Lesson.Blurb` とドメインの **SceneKit** から依頼・物語を生成する。  
手書きを増やすときは overrides に追加し、同一キーで合成より優先される。

## 執筆ルール

- 用語・数値は Manifest（教材）に従う。物語はラップのみ。
- 地下: 石版・トレース・衛兵の口調を統一。
- 陸地: 軍議・連合演習トーン。
- 1依頼: 1〜2文。README 物語: 2〜4文。
