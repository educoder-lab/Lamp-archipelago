# ハードウェアの島

[カリキュラム全体](../../CURRICULUM.md) · [WORLD](../../WORLD.md) · [冒険状況](../../Show-Status.ps1)

## あらすじ

**工房長ガスト** — 蒸気と歯車。CPUと記憶の話。


## マップ（講座番号）

```
22 ─ 23 ─ 24 ─ 25 ─ 26 ─ 27
22-cpu  23-pipeline  24-memory  25-disk  26-io  27-display
```

## 講座

| 講座# | フォルダ | ねらい | 次へ |
|-------|----------|--------|------|
| 22 | [22-cpu](./22-cpu/README.md) | CPU の仕組み | [次: 講座 23](../23-pipeline/README.md) |
| 23 | [23-pipeline](./23-pipeline/README.md) | パイプラインと高速化 | [次: 講座 24](../24-memory/README.md) |
| 24 | [24-memory](./24-memory/README.md) | 記憶装置の階層 | [次: 講座 25](../25-disk/README.md) |
| 25 | [25-disk](./25-disk/README.md) | 補助記憶と入出力 | [次: 講座 26](../26-io/README.md) |
| 26 | [26-io](./26-io/README.md) | 入出力インタフェース | [次: 講座 27](../27-display/README.md) |
| 27 | [27-display](./27-display/README.md) | 表示装置と解像度 | [次: 講座 28](../28-reliability/README.md) |

```powershell
cd sky\island-hardware\22-cpu
.\Test-Lesson.ps1
```
