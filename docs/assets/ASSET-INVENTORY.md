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

## 優先度 A — 共通

| # | 用途 | パス | 状態 |
|---|------|------|------|
| A1 | 主人公・後ろ姿 | `common/hero-back.jpg` | 済 |
| A1b | 歩行 | `hero-walk-1/2.jpg` | 済 |
| A2 | 成長差分 | `hero-mid.jpg` · `hero-strong.jpg` | 済 |
| A3 | 精神光輪 | `spirit-aura.jpg` | 済 |
| A4 | セリフ枠 | `common/say-frame.jpg` | 済 |
| A5 | UI アイコン | `icon-*.jpg`（6） | 済 |

## 優先度 B — 場所セット

拠点・盾／剣／精神の背景＋扉・老人・道口 → **済**

## 優先度 C — 分野扉

全 26 分野 → `rooms/domains/<id>.jpg` **済**

## 優先度 D — マップ

| # | 用途 | パス | 状態 |
|---|------|------|------|
| D1–D3, D5 | 背景・ピン・現在地 | `map/*` | 済 |
| D4 | 道の色帯 | `map/band-shield/sword/spirit.jpg` | 済 |
| D6 | 凡例 | UI テキスト | 代替済 |

## 優先度 E — 演出

| 用途 | パス | 状態 |
|------|------|------|
| 扉開閉フレーム | `rooms/hub/great-door-open-1/2.jpg`（＋既存 ajar） | 済 |
| 灯／Lv 演出 | `common/fx-lamp-lit.jpg` · `fx-level-up.jpg` | 済 |
| 老人表情 | `elder.jpg` · `elder-talk.jpg` · `elder-smile.jpg` | 済 |
| 手引き挿絵 | `slides/fe-overview.jpg` · `shield-sword.jpg` | 済 |
| アプリアイコン | `common/app-icon.jpg` · `docs/icon.jpg` | 済 |

## 枚数まとめ

| 段階 | 状態 |
|------|------|
| 第1弾 A＋B＋D | **実装済** |
| 第2弾 C1 | **実装済** |
| 完成形 C3＋成長 | **実装済** |
| 演出 E | **実装済** |
