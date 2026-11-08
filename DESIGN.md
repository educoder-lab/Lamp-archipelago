# 設計メモ（Lamp-archipelago）

## ディレクトリ階層（3層）

```text
<realm>/                    # sky | underground | land
  <domain>/                   # 島・砦・台地（学習分野 or 問題タイプ）
    README.md                 # そのエリアの案内・講座一覧
    NN-slug/                  # 1講座。**NN はコース通し番号**（01〜、全島で重複しない）
      README.md
      PROBLEMS.md
      Test-Lesson.ps1
      演習結果/                 # gitignore
```

| 層 | 空（午前） | 地下（午後） | 陸地 |
|----|------------|--------------|------|
| realm | `sky/` | `underground/` | `land/` |
| 分野フォルダ | `island-*` / `gate-sky-trial` | `fortress-*` | `plateau-*` |
| 講座 | `01-bit` など | `01-trace` など | `01-mock` など |

**進捗 ID**（`.course-progress.json`）は `sky/island-foundation/01-bit` のように **realm/島または砦/講座** です。

## 方針

- **網羅** … 出題範囲を `Manifest-Entries.ps1` で順序付きに列挙（現在 100 講座超）
- **ナビ必須** … README / PROBLEMS 末尾の **ナビ**（前・次・島一覧・[CURRICULUM.md](./CURRICULUM.md)）
- 再生成: `.\_tools\Build-AllLessons.ps1`（ナビ・物語付きで上書き）
- RPG: [WORLD.md](./WORLD.md) · `Show-Status.ps1` · `.adventure-save.json` · `_tools/Story-Entries.ps1` · [_tools/Story-Schema.md](./_tools/Story-Schema.md) · [GLOSSARY.md](./GLOSSARY.md) · [TITLES.md](./TITLES.md)
- 講座 README/PROBLEMS の物語は **ビルドのみ**（`Story-Entries` / `Story-Compose`）。講座フォルダへ手書きしない。

## 1講座の型

| ファイル | 役割 |
|----------|------|
| `README.md` | 用語・定義だけ |
| `PROBLEMS.md` | RPG + 選択問題 3〜5 問（午後は追跡・記述） |
| `Test-Lesson.ps1` | 自動採点（ハッシュ） |
| `演習結果/answers.txt` | 学習者作成 |

午前: `answers.txt`（`1:B`）  
午後: 講座ごとに PROBLEMS で指定（`answers.txt` / `answer.txt` / コード）

## 空の島 ↔ 試験分野（IPA 午前）

| 島フォルダ | 分野 |
|------------|------|
| island-corporate | 企業と法務 |
| island-business | 経営戦略 |
| island-system-plan | システム戦略・企画 |
| island-dev-tech | システム開発技術 |
| island-project | プロジェクトマネジメント |
| island-service | サービスマネジメント |
| island-audit | システム監査 |
| island-foundation | 基礎理論 |
| island-algorithm | アルゴリズムとプログラミング |
| island-hardware | コンピュータ構成要素 |
| island-system | システム構成要素 |
| island-software | ソフトウェア |
| island-database | データベース |
| island-network | ネットワーク |
| island-security | 情報セキュリティ |
| island-media | 情報デザイン・情報メディア |
| gate-sky-trial | 午前ミニ模試 |

推奨プレイ順（一例）: **foundation → algorithm → hardware → … → ストラテジ系 → gate**  
すべてを一本道にしなくてよい。島 README に「おすすめ順」を書いてよい。

### いまの講座数

- 空 … 20 講座（17 島 + 試練）
- 地下 … 6 講座
- 陸地 … 3 講座

一覧と順番は [CURRICULUM.md](./CURRICULUM.md)。本文データは `_tools/LessonData.ps1`、再生成は `Build-AllLessons.ps1`。

### island-foundation ロードマップ

| # | slug | テーマ |
|---|------|--------|
| 01 | bit | ビット |
| 02 | base | 進数 |
| 03 | unit | バイト・単位 |
| 04 | logic | 論理演算 |

## 地下の砦 ↔ 午後

| 砦 | 内容 |
|----|------|
| fortress-algorithm | 追跡・フロー |
| fortress-program | 読解 |
| fortress-database | SQL |
| fortress-network | NW 午後 |
| fortress-security | セキュリティ午後 |
| fortress-deep | 総合大問 |

## 陸地の台地

- plateau-mock-am / plateau-mock-pm / plateau-final

## 採点・パス解決

- 講座フォルダで `.\Test-Lesson.ps1` → `_grading/Resolve-Lesson.ps1` がパスを解決
- ルート: `.\Test-Lesson.ps1 -Lesson island-foundation/01-bit`
- 同じ `01-bit` が複数島にあるときは **必ず島付き** で指定

## 講座を追加するとき

1. 島（または砦）の下に `NN-slug/` を作る
2. README / PROBLEMS / Test-Lesson.ps1
3. `LessonId` と `NextLesson` は `island-…/NN-slug` 形式
4. 島の README.md の表を更新

## AI 採点

`.cursor/rules/grading.mdc` を参照。
