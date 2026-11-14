# 第１弾プロンプト（Google Flow / 画像生成用）

トーン正本: 主人公 **#3**（きれいめ JRPG）・大扉 **#4**（装飾封印）。  
参照画像: `mood/chosen/hero-back-clean-rpg.jpg` · `mood/chosen/great-door-ornate.jpg`

共通指定（毎回付ける）:

> Clean modern JRPG concept art, clear readable shapes, soft cel-shaded, muted jewel tones indigo amber violet teal, transparent or plain dark void background when sprite, no text, no logos, no watermark.

## 生成リスト

| # | 出力ファイル | プロンプト要約 |
|---|--------------|----------------|
| 1 | `common/hero-back.png` | Traveler from behind, navy coat, small bronze shield left hip, short sword right, standing idle, match reference #3 |
| 2 | `common/hero-walk-1.png` | Same hero from behind, left foot forward walk cycle frame |
| 3 | `common/hero-walk-2.png` | Same hero from behind, right foot forward walk cycle frame |
| 4 | `rooms/hub/great-door-closed.png` | Enormous ornate sealed double doors, dark bronze black stone, gold seal center, match reference #4 |
| 5 | `rooms/hub/great-door-ajar.png` | Same doors slightly ajar, faint green-gold spirit light in crack |
| 6 | `rooms/hub/elder.png` | Mysterious elderly sage, side/front three-quarter, simple robe staff, soft cyan eye glint, JRPG readable |
| 7 | `rooms/hub/path-shield.png` | Stone arch corridor mouth, amber and blue glow, shield motif, perspective into hall |
| 8 | `rooms/hub/path-sword.png` | Stone arch corridor mouth, purple and silver glow, sword motif |
| 9 | `common/icon-shield.png` | Small UI icon round bronze shield, amber rim, simple |
| 10 | `common/icon-sword.png` | Small UI icon short sword, purple silver |
| 11 | `common/icon-spirit.png` | Small UI icon green-gold spirit flame / lamp |

無料枠内では 1 プロンプトあたり出力を抑え、上表の順で止める。

## 実施メモ（2026-11-14）

Google Flow はセルフィー本人確認でブラウザ自動化が止まったため、同トーンのプロンプトを Cursor `GenerateImage`（参照: ムード #3 / #4）で生成し `docs/assets` に配置した。出力は JPG。
