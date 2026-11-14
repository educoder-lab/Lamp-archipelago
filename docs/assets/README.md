# docs/assets — マップ用ピクセル／ムード画

公開マップ（`map.html`）と拠点シーン向けの画像置き場です。  
トーンの正本は [../ART.md](../ART.md)。物語の正本は [../../WORLD.md](../../WORLD.md)。  
必要画像一覧: [ASSET-INVENTORY.md](./ASSET-INVENTORY.md) · 第１弾プロンプト: [PHASE1-PROMPTS.md](./PHASE1-PROMPTS.md)

## ディレクトリ

```text
docs/assets/
  common/           # 全シーン共通（主人公後ろ姿など）
  rooms/
    hub/            # 三つの扉の間（大扉・老人まわり）
    shield/         # 左の道（盾）部屋素材
    sword/          # 右の道（剣）部屋素材
    spirit/         # 大扉の奥（精神）部屋素材
    domains/        # 分野ドア／標識など
  map/              # 俯瞰マップ用タイル・アイコン
  mood/
    chosen/         # 採用したムードボード（編集の正）
    explore/        # 不採用案（参照のみ・本番には載せない）
```

## いま入っている正本

| 役割 | パス | 由来 |
|------|------|------|
| 主人公・成長 | `common/hero-back.jpg` · `hero-mid.jpg` · `hero-strong.jpg` · 歩行 | #3 |
| UI | `common/icon-*.jpg`（盾／剣／精神／設定／地図／灯） | 第１弾 |
| 拠点 | `rooms/hub/*`（背景・大扉・老人・道口） | #4 |
| 道タイプ | `rooms/shield|sword|spirit/{bg,door}.jpg` | 第１弾 |
| マップ | `map/bg.jpg` · `hub-pin` · `pin-*` · `marker.jpg` | 第１弾 |
| ムード正本 | `mood/chosen/hero-back-clean-rpg.jpg` · `great-door-ornate.jpg` | #3 / #4 |

`mood/explore/` は参照用アーカイブです。ゲーム本体からは読みません。  
※ 生成ツールが JPG を返すため、本番ファイルも `.jpg`（同内容の `.png` 別名あり）。

## 命名

- 小文字・ハイフン（例: `great-door-open.png`）
- 状態があるものは接尾辞（`-closed` / `-open` / `-glow`）
- 本番向けは透過 PNG を優先（ムード JPG はフォールバック可）
