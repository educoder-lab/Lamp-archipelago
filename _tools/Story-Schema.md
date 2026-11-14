# Story-Entries スキーマ（Phase 2）

物語は **手編集の講座フォルダには書かない**。`_tools/Story-Entries.ps1` とオーバーライド、なければ `Story-Compose.ps1` で生成する。

## ドメイン `Get-LampDomainStories`

| フィールド | 用途 |
|------------|------|
| `Npc` | 依頼人（講座・分野 README） |
| `Synopsis` | 分野のあらすじ（1行） |
| `EnterLine` | 入場時の一言（分野 README） |

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
- **左の道（盾）**: 知識・択一・琥珀と青のトーン。分野クリアで盾が成長する含み。
- **右の道（剣）**: トレース・読解・紫と銀。分野クリアで剣が成長する含み。
- **大扉の奥（精神）**: 模擬・総合。緑と金。精神が成長する含み。
- 諸島・空海・地下帝国・港の比喩は使わない（三つの扉の世界観）。
- 1依頼: 1〜2文。README 物語: 2〜4文。
