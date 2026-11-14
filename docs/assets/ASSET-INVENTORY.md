# 必要画像一覧（後ろ姿固定構図）

正本トーン: [../ART.md](../ART.md)（主人公 #3・大扉 #4）。  
配置: [README.md](./README.md)。

## 画面の決まり

- **プレイ画面**: 常に手前＝主人公の後ろ姿、正面＝扉（＋案内役）。盾／剣／精神の道でも俯瞰に切り替えない。
- **全体マップ**: ナビ「全体」。分野の並び・クリア状況の俯瞰専用。

| 状態 | 見た目 |
|------|--------|
| 拠点 | `rooms/hub/` |
| 盾の道 | `rooms/shield/` |
| 剣の道 | `rooms/sword/` |
| 大扉の奥 | `rooms/spirit/` |
| 全体 | `map/` ＋既存ノード俯瞰 |

## 優先度 A — 共通（どの場所でも）

| # | 用途 | パス | 状態 |
|---|------|------|------|
| A1 | 主人公・後ろ姿 | `common/hero-back.jpg` | 済 |
| A1b | 歩行 2 コマ | `common/hero-walk-1.jpg` · `hero-walk-2.jpg` | 済 |
| A2 | 成長差分（中／強） | `common/hero-mid.jpg` · `hero-strong.jpg` | 済 |
| A3 | 精神光輪 | `common/spirit-aura.jpg` | 済 |
| A4 | セリフ枠 | UI CSS で代替 | 代替済 |
| A5 | UI アイコン | `icon-shield/sword/spirit/settings/map/lamp.jpg` | 済 |

## 優先度 B — 場所セット（第1弾）

### 拠点

| # | 用途 | パス | 状態 |
|---|------|------|------|
| B1 | 背景 | `rooms/hub/bg.jpg` | 済 |
| B2 | 大扉 閉／開 | `great-door-closed.jpg` · `great-door-ajar.jpg` | 済 |
| B3 | 左・盾の道口 | `path-shield.jpg` | 済 |
| B4 | 右・剣の道口 | `path-sword.jpg` | 済 |
| B5 | 謎の老人（通常／話す） | `elder.jpg` · `elder-talk.jpg` | 済 |

### 道タイプ

| # | 用途 | パス | 状態 |
|---|------|------|------|
| B6 | 盾：背景＋正面扉 | `rooms/shield/bg.jpg` · `door.jpg` | 済 |
| B7 | 剣：背景＋正面扉 | `rooms/sword/bg.jpg` · `door.jpg` | 済 |
| B8 | 精神：背景＋正面扉 | `rooms/spirit/bg.jpg` · `door.jpg` | 済 |

## 優先度 C — 分野扉（段階）

| 段階 | 内容 | 状態 |
|------|------|------|
| C1 | 節目 6 | **済** |
| C2 | 主要分野 | **済**（C3 に包含） |
| C3 | 全 26 分野×扉 | **済**（`rooms/domains/<id>.jpg`） |

置き場: `rooms/domains/`（26 ファイル。分野 ID と同名）

節目の例: foundation／gate-sky-trial／fortress-algorithm／fortress-deep／plateau-mock-am／plateau-final

## 優先度 D — マップ画面

| # | 用途 | パス | 状態 |
|---|------|------|------|
| D1 | マップ背景 | `map/bg.jpg` | 済 |
| D2 | 拠点ピン | `map/hub-pin.jpg` | 済 |
| D3 | 分野ピン（状態） | `pin-fog/open/current/cleared.jpg` | 済 |
| D4 | 道の色帯 | コード描画 | 代替済 |
| D5 | 現在地 | `map/marker.jpg` | 済 |
| D6 | マップ枠・凡例 | UI テキスト | 代替済 |

## 優先度 E — 演出（任意）

扉開閉フレーム・灯／Lv・スライド挿絵・アプリアイコン → 後続。

## 枚数まとめ

| 段階 | 内容 | 状態 |
|------|------|------|
| **第1弾** | A ＋ B 拠点・3道 ＋ D | **実装済** |
| **第2弾** | ＋ C1 節目 6 | **実装済** |
| **完成形** | ＋分野全26・成長差分 | **実装済**（演出 E は任意・後続可） |
