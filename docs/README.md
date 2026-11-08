# docs（GitHub Pages）— Lumina Code

公開サイト: https://educoder-lab.github.io/Lamp-archipelago/

箱庭型の **3D ワールドマップ**と、**121 講座＋港の手引き**をブラウザだけで学べます。

## 入口

| URL | 内容 |
|-----|------|
| [map.html](./map.html) | 3D 航路・アバター・領域ナビ・迂回 |
| [lesson.html?hub=1](./lesson.html?hub=1) | 灯台の港 — FE 試験の概要（スライド／プリント／演習） |
| [lesson.html?no=1](./lesson.html?no=1) | 講座 01 から |
| [ref.html](./ref.html) | 世界・用語・カリキュラム・称号 |

## ファイル一覧

| ファイル | 役割 |
|----------|------|
| `map.html` | マップ（`_tools/map-template.html` から生成） |
| `lamp-world.js` · `lamp-world.css` | Three.js 箱庭（空の光の橋・地下ブルーム・陸地の影） |
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
