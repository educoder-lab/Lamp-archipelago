# データベースの島

[カリキュラム全体](../../CURRICULUM.md) · [WORLD](../../WORLD.md) · [冒険状況](../../Show-Status.ps1)

## あらすじ

**水晶司ライラ** — 表と関係。データの泉。

## 入場

泉底の水晶が脈打ち、ライラが関係の鎖を示す。


## マップ（講座番号）

```
40 ─ 41 ─ 42 ─ 43 ─ 44 ─ 45 ─ 46
40-rdb  41-normal  42-sql-select  43-sql-join  44-sql-update  45-transaction  46-er
```

## 講座

| 講座# | フォルダ | ねらい | 次へ |
|-------|----------|--------|------|
| 40 | [40-rdb](./40-rdb/README.md) | 関係データベースの基礎 | [次: 講座 41](../41-normal/README.md) |
| 41 | [41-normal](./41-normal/README.md) | 正規化 | [次: 講座 42](../42-sql-select/README.md) |
| 42 | [42-sql-select](./42-sql-select/README.md) | SQL SELECT文 | [次: 講座 43](../43-sql-join/README.md) |
| 43 | [43-sql-join](./43-sql-join/README.md) | SQL 結合と副問合せ | [次: 講座 44](../44-sql-update/README.md) |
| 44 | [44-sql-update](./44-sql-update/README.md) | SQL 更新系と制約 | [次: 講座 45](../45-transaction/README.md) |
| 45 | [45-transaction](./45-transaction/README.md) | トランザクションと障害回復 | [次: 講座 46](../46-er/README.md) |
| 46 | [46-er](./46-er/README.md) | E-R図と概念設計 | [次: 講座 47](../47-osi/README.md) |

```powershell
cd sky\island-database\40-rdb
.\Test-Lesson.ps1
```
