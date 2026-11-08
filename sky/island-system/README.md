# システム構成の島

[カリキュラム全体](../../CURRICULUM.md) · [WORLD](../../WORLD.md) · [冒険状況](../../Show-Status.ps1)

## あらすじ

**系譜士セラ** — 信頼性と冗長。システム全体の話。

## 入場

系譜の帳が開き、セラが冗長の針を刺す。


## マップ（講座番号）

```
28 ─ 29 ─ 30 ─ 31 ─ 32 ─ 33
28-reliability  29-redundancy  30-perf  31-virtual  32-cluster  33-embed
```

## 講座

| 講座# | フォルダ | ねらい | 次へ |
|-------|----------|--------|------|
| 28 | [28-reliability](./28-reliability/README.md) | システムの信頼性 | [次: 講座 29](../29-redundancy/README.md) |
| 29 | [29-redundancy](./29-redundancy/README.md) | 冗長化と多重化 | [次: 講座 30](../30-perf/README.md) |
| 30 | [30-perf](./30-perf/README.md) | 性能評価 | [次: 講座 31](../31-virtual/README.md) |
| 31 | [31-virtual](./31-virtual/README.md) | 仮想化とクラウド | [次: 講座 32](../32-cluster/README.md) |
| 32 | [32-cluster](./32-cluster/README.md) | クラスタと負荷分散 | [次: 講座 33](../33-embed/README.md) |
| 33 | [33-embed](./33-embed/README.md) | 組込みとIoT | [次: 講座 34](../34-os/README.md) |

```powershell
cd sky\island-system\28-reliability
.\Test-Lesson.ps1
```
