# docs/assets — マップ用ピクセル／ムード画

公開マップ（`map.html`）と拠点シーン向けの画像置き場です。  
トーンの正本は [../ART.md](../ART.md)。物語の正本は [../../WORLD.md](../../WORLD.md)。  
必要画像一覧: [ASSET-INVENTORY.md](./ASSET-INVENTORY.md) · 第１弾プロンプト: [PHASE1-PROMPTS.md](./PHASE1-PROMPTS.md)

## ディレクトリ

```text
docs/assets/
  common/           # 全シーン共通（主人公後ろ姿など）
  rooms/
    hub/            # 道分かれの間（大扉・老人まわり）
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
| 主人公・成長 | `common/hero-*.png`（透過） | #3 |
| UI | `common/icon-*.png`（盾／剣／精神／設定／地図／灯） | 第１弾 |
| 拠点 | `rooms/hub/bg.jpg` ＋ 扉・老人・道口 `.png` | #4 |
| 道タイプ | `{shield,sword,spirit}/bg.jpg` ＋ `door.png` | 扉合わせ再生成 |
| 分野部屋 | `domains/<id>.png` ＋ `<id>-bg.jpg` | 扉ごと背景 |
| マップ | `map/bg.jpg`（案Aじゃばら確定）＋ピンPNG・`data/map-layout.json` | 確定 |
| ムード正本 | `mood/chosen/hero-back-clean-rpg.jpg` · `great-door-ornate.jpg` | #3 / #4 |

`mood/explore/` は参照用アーカイブです。ゲーム本体からは読みません。

**フォーマット方針**

- **スプライト**（主人公・扉・老人・道口・分野扉・ピン・UI アイコン）→ **透過 PNG**（JPG はフォールバック）
- **プレート**（各 `bg.jpg`・`map/bg.jpg`・`say-frame.jpg`・スライド・アプリアイコン）→ **JPG**
- マット除去: `../_tools/Remove-AssetMattes.ps1`（既存 JPG から背景だけ抜く）

## 命名

- 小文字・ハイフン（例: `great-door-open.png`）
- 状態があるものは接尾辞（`-closed` / `-open` / `-glow`）
- 重ねる絵は透過 PNG を正とする
