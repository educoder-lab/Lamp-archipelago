# ワールドマップ API 契約（2D ダンジョン ↔ map-template）

`map-template.html` が `mountLampWorld(container, opts)` の返り値を前提にしている。**`lamp-dungeon.js` と `lamp-world.js` は同一シグネチャ**を実装する。

## opts（入力）

| フィールド | 型 | 用途 |
|------------|-----|------|
| `nodes` | array | `hub` / `domain` / `core`。`x`, `y`, `realm`, `kind`, `state`, `d`（domain メタ） |
| `layoutW`, `layoutH` | number | 2D レイアウト寸法（テンプレート計算値） |
| `level` | number | アバターリング |
| `avatarCourseNo` | number | 初期配置用講座番号 |
| `lessonState` | fn(lesson) | `cleared` / `skipped` / `next` / `todo` |
| `reducedMotion` | boolean | アニメ短縮 |
| `onSelectDomain` | fn(d) | 島 domain 選択 |
| `onSelectHub` | fn() | 港 |
| `onSelectLesson` | fn(l) | 講座パッド（島内） |
| `onTravelRealm` | fn(realm, node) | 領域ジャンプ後 |
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
| `travelToRealm(realm, duration?)` | はい | ナビ・港 |
| `returnToHub(duration?)` | はい | hub モーダル |
| `setAvatarLevel(level)` | はい | レベルアップ |
| `getMode()` | はい | `showHome` |
| `resize()` | 推奨 | — |
| `dispose()` | 推奨 | — |
| `spawnParticles(at)` | 任意 | — |

## nodes.state（domain 集約）

テンプレート側（`map-template.html`）で算出:

- `cleared` — 分野の全講座クリア
- `current` — `next.domain` と一致
- `open` — 推奨順まで開放、または一部クリア / skip あり
- `fog` — それ以外

2D では **部屋の明度・枠色** に反映。fog でも入場可（警告は右パネル）。

## ルート順（主線・光の道）

1. `hub`（land）
2. `realm === 'sky'` の `domain`（配列順）
3. `realm === 'underground'` の `domain`
4. `realm === 'land'` の `domain`
5. `core`

廊下タイルの接続と `walkAvatar` の経路に使用。

## 変更してはいけないもの

- `LampSave` / `lesson.html` / `data/quests.json`
- `showDomain` / モーダル DOM
- `Build-AllLessons.ps1` が埋め込む `DATA` JSON 形状