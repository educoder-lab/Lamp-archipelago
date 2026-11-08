# 講座 44　SQL 更新系と制約

## できた状態

- フォルダ `演習結果` がある
- `演習結果\answers.txt` に **3 問**（`1:B` 形式）

## 依頼

水晶司ライラ: 今回の依頼は「SQL 更新系と制約」。表と鍵の封印を解いてくれ。

## 封印の問い

**1.** テーブルに新しい行を追加する SQL 文はどれか。
A. SELECT　B. INSERT　C. UPDATE　D. CREATE

**2.** UPDATE 文で更新対象を絞るには何を使うか。
A. HAVING　B. GROUP BY　C. WHERE　D. ORDER BY

**3.** 列に NULL を許さない制約はどれか。
A. UNIQUE　B. PRIMARY KEY　C. CHECK　D. NOT NULL

## 採点

```powershell
.\Test-Lesson.ps1
```

## ナビ

| | リンク |
|---|--------|
| 前の講座 | [講座 43　SQL 結合と副問合せ](..43-sql-join README.md) |
| 次の講座 | [講座 45　トランザクションと障害回復（問題）](..45-transaction PROBLEMS.md) |
| 次（用語） | [講座 45　トランザクションと障害回復（用語）](..45-transaction README.md) |
| この島・砦 | [データベースの島](../README.md) |
| 全体一覧 | [カリキュラム（全講座）](../../../CURRICULUM.md) |
| 世界 | [WORLD.md](../../../WORLD.md) |
| 用語図鑑 | [GLOSSARY.md](../../../GLOSSARY.md) |
| 称号 | [TITLES.md](../../../TITLES.md) |
| ワールドマップ | [docs/map.html](../../../docs/map.html)（`.\Show-Map.ps1` で記録つき） |
