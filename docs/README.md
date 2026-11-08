# docs（GitHub Pages）

公開サイト: https://educoder-lab.github.io/Lamp-archipelago/

| ファイル | 役割 |
|----------|------|
| [map.html](./map.html) | ワールドマップ・進行・迂回 |
| [lesson.html](./lesson.html) | 121 講座プレイヤー |
| [ref.html](./ref.html) | 世界 / 用語 / カリキュラム / 称号 |
| [data/quests.json](./data/quests.json) | 講座 UI 用（ビルド生成） |
| [data/refs.json](./data/refs.json) | 参照 Markdown（ビルド生成） |
| [data/slides/](./data/slides/) | 講座ごとの解説スライド（ビルド生成。ソースは `_tools/slides/`） |
| `lamp-slides.js` · `lamp-slides.css` | スライドプレイヤー |
| `sw.js` · `manifest.webmanifest` | PWA（オフラインキャッシュ） |

`map.html` は `_tools/map-template.html` から `Build-AllLessons.ps1` で生成。  
個人進捗: ブラウザ `localStorage`（`lamp-save.js`）。PowerShell 利用時は `save-data.js`（git 管理外）も可。
