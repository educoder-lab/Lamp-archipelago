# ワールドマップ API 契約（2D マップ ↔ map-template）

`map-template.html` が `mountLampWorld(container, opts)` の返り値を前提にしている。**`lamp-dungeon.js` と `lamp-world.js` は同一シグネチャ**を実装する。

## opts（入力）

| フィールド | 型 | 用途 |
|------------|-----|------|
| `nodes` | array | `hub` / `domain` / `core`。`x`, `y`, `realm`, `kind`, `state`, `d`（domain メタ） |
| `layoutW`, `layoutH` | number | 2D レイアウト寸法（テンプレート計算値） |
| `level` | number | アバターリング |
| `avatarCourseNo` | number | 初期配置用講座番号（0 以下なら拠点シーン） |
| `growth` | object | `{ shield, sword, spirit }` 各 `{ cleared, total, ratio }` |
| `landOpen` | boolean | 大扉開放 |
| `lessonState` | fn(lesson) | `cleared` / `skipped` / `next` / `todo` |
| `reducedMotion` | boolean | アニメ短縮 |
| `onSelectDomain` | fn(d) | 分野選択 |
| `onSelectHub` | fn() | 老人／間 |
| `onSelectLesson` | fn(l) | 講座パッド（分野内） |
| `onTravelRealm` | fn(realm, node) | 道ジャンプ後 |
| `onModeChange` | fn(mode, domain) | `world` / `island` |

## worldApi（返り値メソッド）

| メソッド | 必須 | map-template 呼び出し箇所 |
|----------|------|---------------------------|
| `enterIsland(domain, lessonStateFn)` | はい | `showDomain` |
| `exitIsland()` | はい | `showHome`, hub 旅行 |
| `walkAvatar(fromIdx, toIdx, onDone)` | はい | `?arrive=1` |
| `placeAvatarForProgress(courseNo)` | はい | arrive 前 |
| `findNodeIndexForCourse(courseNo)` | はい | arrive |
| `showOverview(duration?)` | はい | ナビ「全体図」 |
| `travelToRealm(realm, duration?)` | はい | ナビ・老人 |
| `returnToHub(duration?)` | はい | 拠点シーンへ |
| `setAvatarLevel(level)` | はい | レベルアップ |
| `setGrowth(growth, landOpen?)` | 任意 | 成長 HUD |
| `getMode()` | はい | `showHome` |
| `resize()` | 推奨 | — |
| `dispose()` | 推奨 | — |

## nodes.state（domain 集約）

`lamp-progress.js`（`LampProgress.applyDomainStates`）で算出:

- `cleared` — 分野の全講座クリア
- `current` — いまの推奨講座の domain
- `open` — 道内で手前の domain がすべてクリア済み
- `fog` — 未開放（**入場不可**のハード表示。ソフトロック運用はテンプレート側）

領域ルール（内部キーは `sky` / `underground` / `land`）:

1. 間から **左の道（sky）** と **右の道（underground）** へはいつでも行ける
2. 各道の内部は、手前の分野の灯がすべて点くと次が開く
3. **大扉の奥（land）** は、両道の最深がクリアされるまで fog（物語: 盾と剣ではまだ不十分）
4. 分野内の講座も、手前の灯が点くまで挑戦不可（クリア済みは復習可）

## ルート（分岐）

- `hub → sky[0]…sky[n]`（盾の道）
- `hub → underground[0]…`（剣の道）
- `hub → land[0]… → core`（大扉の奥）

## 拠点シーン

既定の第一画面は俯瞰ではなく **後ろ姿構図**（手前に主人公背面、正面に大扉と老人、左に盾の道、右に剣の道）。

## 変更してはいけないもの

- `LampSave` / `lesson.html` / `data/quests.json` の採点形式
- `showDomain` / モーダル DOM の骨格
- `Build-AllLessons.ps1` が埋め込む `DATA` JSON 形状
