# docs/assets — マップ用ピクセル／ムード画

公開マップ（`map.html`）と拠点シーン向けの画像置き場です。  
トーンの正本は [../ART.md](../ART.md)。物語の正本は [../../WORLD.md](../../WORLD.md)。

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
| 主人公（後ろ姿・ドット） | `common/hero-back.jpg` | ムード案 #1 |
| 大扉（封・装飾） | `rooms/hub/great-door-closed.jpg` | ムード案 #4 |
| ムード正本コピー | `mood/chosen/hero-back-pixel.jpg` · `great-door-ornate.jpg` | 同上 |

`mood/explore/` は第１弾実装の参照用アーカイブです。ゲーム本体からは読みません。

## 命名

- 小文字・ハイフン（例: `great-door-open.png`）
- 状態があるものは接尾辞（`-closed` / `-open` / `-glow`）
- 本番向けは最終的に透過 PNG またはスプライトシートへ寄せる（第１弾以降）
