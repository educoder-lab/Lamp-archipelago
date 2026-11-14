# docs（GitHub Pages）— Lumina Code

公開サイト: https://educoder-lab.github.io/Lamp-archipelago/

**2D ダンジョン・オーバーワールド**（既定）と **121 講座＋港の手引き**をブラウザだけで学べます。

## 入口

| URL | 内容 |
|-----|------|
| [map.html](./map.html) | 2D ダンジョン・港モーダル・光の道・領域ナビ |
| [lesson.html?hub=1](./lesson.html?hub=1) | 灯台の港 — FE 試験の概要（スライド／プリント／演習） |
| [lesson.html?no=1](./lesson.html?no=1) | 講座 01 から |
| [ref.html](./ref.html) | 世界・用語・カリキュラム・称号 |

## ファイル一覧

| ファイル | 役割 |
|----------|------|
| `map.html` | マップ（`_tools/map-template.html` から生成） |
| `lamp-dungeon.js` · `dungeon-geometry.js` · `lamp-dungeon.css` | 2D オーバーワールド（既定） |
| `lamp-world.js` · `lamp-world.css` | Three.js 箱庭（ロールバック用・非推奨） |
| `world-api-contract.md` | map-template とワールド API の契約 |
| `island-themes.js` | 島ごとのテーマ色・代表オブジェクト |
| `lesson.html` | 講座プレイヤー（`?hub=1` / `?no=`） |
| `data/hub-quest.json` · `data/slides/hub.json` | 港クエスト |
| `data/quests.json` · `data/refs.json` | 講座 UI・参照 MD（ビルド生成） |
| `data/slides/<n>.json` | 各講座スライド（ビルド生成。ソースは `_tools/slides/`） |
| `lamp-slides.js` · `lamp-slides.css` | スライドプレイヤー |
| `lamp-save.js` · `lamp-cloud.js` | 端末進捗 / 任意の Google 同期 |
| `sw.js` · `manifest.webmanifest` | PWA |

個人進捗はブラウザ `localStorage`（`lamp-save.js`）。PowerShell 利用時は `save-data.js`（git 管理外）も可。

ルートの案内: [../README.md](../README.md)
