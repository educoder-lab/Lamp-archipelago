# 用語図鑑（自動生成）

[カリキュラム](./CURRICULUM.md) · [WORLD](./WORLD.md)

各講座 README の **今日の用語** 表を集約しました（同語は初出講座を採用）。  
更新: `.\_tools\Build-AllLessons.ps1`

| 用語 | 意味 | 出典講座 |
|------|------|----------|
| 10 進数 | 日常で使う 0〜9 の記数法 | [基数変換](sky/island-foundation/02-base/README.md) |
| 16 進数 | 0〜9 と A〜F で表す記数法。4 ビットが 1 桁に対応 | [基数変換](sky/island-foundation/02-base/README.md) |
| 2 の補数 | 負の数を表すための方法。全ビット反転＋1 | [シフト演算と補数](sky/island-foundation/05-shift/README.md) |
| 2 進数 | 0 と 1 だけで数を表す記数法 | [基数変換](sky/island-foundation/02-base/README.md) |
| 2相ロック | ロック取得フェーズと解放フェーズを分ける方式 | [ロックと同時実行制御](underground/fortress-database/100-lock/README.md) |
| 3ウェイハンドシェイク | TCP 接続確立時の SYN→SYN+ACK→ACK のやり取り | [TCP/UDPとポート](sky/island-network/49-tcpudp/README.md) |
| ACID 特性 | 原子性・一貫性・独立性・永続性 | [トランザクションと障害回復](sky/island-database/45-transaction/README.md) |
| AND（論理積） | 両方 1 のとき結果が 1 | [論理演算](sky/island-foundation/04-logic/README.md) |
| Apache License | 制約が緩く商用利用しやすい OSS ライセンス | [OSSとライセンス](sky/island-software/39-oss/README.md) |
| ARP | IP アドレスから MAC アドレスを取得するプロトコル | [パケット解析と通信制御](underground/fortress-network/104-packet/README.md) |
| ASCII | 英数字・記号を 7 ビット（128 種）で表す文字コード | [文字コードと符号化](sky/island-foundation/07-char/README.md) |
| B 木 | バランスの取れた多分岐木。データベースのインデックスに使用 | [障害回復と性能](underground/fortress-database/101-recovery/README.md) |
| BCP（事業継続計画） | 災害時に事業を継続・早期復旧するための計画 | [ファシリティマネジメント](sky/island-service/84-facility/README.md) |
| Bluetooth | 近距離無線通信規格（数m〜数十m） | [入出力インタフェース](sky/island-hardware/26-io/README.md) |
| BNF 記法 | プログラミング言語の文法をルールで定義する記法 | [オートマトンと形式言語](sky/island-foundation/12-automata/README.md) |
| BPR（ビジネスプロセスリエンジニアリング） | 業務プロセスを抜本的に再設計すること | [IT戦略とガバナンス](sky/island-business/70-it-strategy/README.md) |
| BSC（バランススコアカード） | 4 つの視点（財務・顧客・業務・学習）で経営を評価する手法 | [企業分析と標準化](sky/island-corporate/67-analysis/README.md) |
| CASE 式 | 条件に応じて値を切り替える式 | [午後SQL問題演習](underground/fortress-database/99-sql-pm/README.md) |
| CHECK 制約 | 列の値が条件を満たすことを保証する制約 | [SQL 更新系と制約](sky/island-database/44-sql-update/README.md) |
| CI/CD | 継続的インテグレーション / 継続的デリバリの略 | [運用・保守とDevOps](sky/island-dev-tech/79-devops/README.md) |
| CIDR | クラスに依存しない柔軟なアドレス割当て方式 | [IPアドレスとサブネット](sky/island-network/48-ip/README.md) |
| CIDR 表記 | /24 のようにネットワーク部のビット数を表す記法 | [サブネット計算](underground/fortress-network/102-subnet-calc/README.md) |
| CISC | 命令種類が豊富で可変長の CPU 設計 | [パイプラインと高速化](sky/island-hardware/23-pipeline/README.md) |
| COCOMO | ソースコード行数から工数を推定するモデル | [スケジュールと工数](sky/island-project/81-schedule/README.md) |
| Cookie | Web サーバがブラウザに保存させる小さなデータ | [Webとプロトコル応用](sky/island-network/53-webapi/README.md) |
| CPU（中央処理装置） | コンピュータの演算と制御を担う装置 | [CPU の仕組み](sky/island-hardware/22-cpu/README.md) |
| CRM | 顧客情報を管理して関係を強化する手法 | [マーケティングとe-Biz](sky/island-business/69-marketing/README.md) |
| CSIRT | セキュリティインシデントに対応する組織内チーム | [インシデント対応と法規](sky/island-security/61-incident/README.md) |
| CSRF | ログイン済みユーザに意図しない操作をさせる攻撃 | [Webセキュリティ](sky/island-security/58-webattack/README.md) |
| CUI | 文字ベースのコマンド入力で操作するインタフェース | [ヒューマンインタフェース](sky/island-media/63-ux/README.md) |
| DELETE | テーブルから行を削除する SQL 文 | [SQL 更新系と制約](sky/island-database/44-sql-update/README.md) |
| DevOps | 開発と運用を一体化して迅速にリリースする文化と手法 | [運用・保守とDevOps](sky/island-dev-tech/79-devops/README.md) |
| DHCP | IP アドレスを自動的に割り当てるプロトコル | [DNS・DHCP・メール](sky/island-network/50-dns/README.md) |
| DISTINCT | 重複行を除外するキーワード | [SQL SELECT文](sky/island-database/42-sql-select/README.md) |
| DMA（ダイレクトメモリアクセス） | CPU を介さず周辺機器とメモリ間でデータ転送する方式 | [入出力インタフェース](sky/island-hardware/26-io/README.md) |
| DMZ（非武装地帯） | 外部と内部の間に置く中間ネットワーク。公開サーバを配置 | [ファイアウォールとDMZ](sky/island-security/57-firewall/README.md) |
| DNS | ドメイン名を IP アドレスに変換するシステム | [DNS・DHCP・メール](sky/island-network/50-dns/README.md) |
| DoS 攻撃 | 大量リクエストでサービスを妨害する攻撃 | [脅威と攻撃手法](sky/island-security/54-threat/README.md) |
| DR（ディザスタリカバリ） | 災害からの IT システム復旧策 | [ファシリティマネジメント](sky/island-service/84-facility/README.md) |
| EA（エンタープライズアーキテクチャ） | 組織全体の業務と IT を 4 つの体系で設計する手法 | [IT投資評価](sky/island-system-plan/73-eval/README.md) |
| EC（電子商取引） | インターネットを通じた商品・サービスの取引 | [マーケティングとe-Biz](sky/island-business/69-marketing/README.md) |
| E-R 図 | エンティティ（実体）とリレーションシップ（関連）でデータ構造を表す図 | [E-R図と概念設計](sky/island-database/46-er/README.md) |
| E-R 図の読み方 | エンティティ間の多重度（1:N, M:N）を正しく読む | [午後E-R図の読解](underground/fortress-database/98-er-read/README.md) |
| ERP | 企業資源を統合管理する基幹業務システム | [IT戦略とガバナンス](sky/island-business/70-it-strategy/README.md) |
| EVM（アーンドバリューマネジメント） | 出来高でコストとスケジュールの進捗を管理する手法 | [リスクと品質管理](sky/island-project/82-risk/README.md) |
| EXISTS | 副問合せが結果を返すかどうかを判定する述語 | [午後SQL問題演習](underground/fortress-database/99-sql-pm/README.md) |
| GB（ギガバイト） | 約 10 億バイト | [情報量の単位](sky/island-foundation/03-unit/README.md) |
| GPL | 改変物にも同じライセンスを要求するコピーレフト型ライセンス | [OSSとライセンス](sky/island-software/39-oss/README.md) |
| GROUP BY | 指定列でグループ化し集約関数を適用する | [SQL 結合と副問合せ](sky/island-database/43-sql-join/README.md) |
| GUI | グラフィカルユーザインタフェース。マウスやアイコンで操作 | [ヒューマンインタフェース](sky/island-media/63-ux/README.md) |
| HAVING | GROUP BY の結果をさらに絞り込む句 | [SQL 結合と副問合せ](sky/island-database/43-sql-join/README.md) |
| HDD | 磁気ディスクで大容量データを保存する装置 | [補助記憶と入出力](sky/island-hardware/25-disk/README.md) |
| HDMI | 映像と音声をデジタルで送るインタフェース | [入出力インタフェース](sky/island-hardware/26-io/README.md) |
| HTTP/HTTPS | Web ページの取得に使うプロトコル。S は SSL/TLS で暗号化 | [無線LANとHTTP](sky/island-network/52-wireless/README.md) |
| IaaS | インフラ（サーバ・ネットワーク等）をクラウドで提供 | [仮想化とクラウド](sky/island-system/31-virtual/README.md) |
| ICMP | ネットワーク診断用のプロトコル（ping が使用） | [パケット解析と通信制御](underground/fortress-network/104-packet/README.md) |
| IDS/IPS | 侵入を検知(IDS)・防止(IPS)するシステム | [ファイアウォールとDMZ](sky/island-security/57-firewall/README.md) |
| IEEE 754 | 浮動小数点の国際標準。単精度(32ビット)・倍精度(64ビット) | [浮動小数点と誤差](sky/island-foundation/06-float/README.md) |
| INSERT | テーブルに行を追加する SQL 文 | [SQL 更新系と制約](sky/island-database/44-sql-update/README.md) |
| IoT | あらゆるモノがインターネットにつながる概念 | [組込みとIoT](sky/island-system/33-embed/README.md) |
| IPsec | IP レベルで暗号化・認証を行うプロトコル群 | [VLANとVPN](underground/fortress-network/103-vlan/README.md) |
| IPv4 | 32 ビットのアドレス。約 43 億個 | [IPアドレスとサブネット](sky/island-network/48-ip/README.md) |
| IPv6 | 128 ビットのアドレス。事実上無限 | [IPアドレスとサブネット](sky/island-network/48-ip/README.md) |
| ISMS | 情報セキュリティマネジメントシステム（ISO 27001） | [情報セキュリティ管理](sky/island-security/59-policy/README.md) |
| IT ガバナンス | 経営戦略に沿って IT を統制する仕組み | [IT戦略とガバナンス](sky/island-business/70-it-strategy/README.md) |
| IT 統制 | 情報システムに関する内部統制 | [内部統制と法令遵守](sky/island-audit/86-internal/README.md) |
| ITIL | IT サービスマネジメントのベストプラクティス集 | [ITサービスマネジメント](sky/island-service/83-itil/README.md) |
| KB（キロバイト） | 約 1,000 バイト（厳密には 1,024 バイト） | [情報量の単位](sky/island-foundation/03-unit/README.md) |
| L2スイッチ（スイッチングハブ） | MAC アドレスを基にフレームを転送する装置 | [ルーティングとスイッチ](sky/island-network/51-routing/README.md) |
| LIKE | パターンマッチングに使う演算子。% は任意文字列 | [SQL SELECT文](sky/island-database/42-sql-select/README.md) |
| Linux | Unix 系の OSS カーネル | [OSSとライセンス](sky/island-software/39-oss/README.md) |
| LRU | 最も長く使われていないページを置き換える方式 | [仮想記憶](sky/island-software/36-vmem/README.md) |
| M&A | 合併と買収による企業再編 | [経営戦略](sky/island-business/68-strategy/README.md) |
| MB（メガバイト） | 約 100 万バイト | [情報量の単位](sky/island-foundation/03-unit/README.md) |
| MIPS | 1 秒間に実行できる命令数（百万単位） | [性能評価](sky/island-system/30-perf/README.md) |
| MTBF（平均故障間隔） | 故障と故障の間の平均稼働時間 | [システムの信頼性](sky/island-system/28-reliability/README.md) |
| MTTR（平均修復時間） | 故障発生から復旧までの平均時間 | [システムの信頼性](sky/island-system/28-reliability/README.md) |
| NAT | プライベート IP とグローバル IP を変換する技術 | [IPアドレスとサブネット](sky/island-network/48-ip/README.md) |
| NOT NULL 制約 | 列に NULL を許さない制約 | [SQL 更新系と制約](sky/island-database/44-sql-update/README.md) |
| NOT（否定） | 0 と 1 を反転する | [論理演算](sky/island-foundation/04-logic/README.md) |
| O 記法（ビッグオー） | 計算量の上限を漸近的に表す表記。O(n), O(n²) など | [計算量とオーダ](sky/island-foundation/11-bigo/README.md) |
| O(1) | データ量に関係なく一定時間 | [計算量とオーダ](sky/island-foundation/11-bigo/README.md) |
| O(n log n) | 効率的なソートの典型的な計算量 | [計算量とオーダ](sky/island-foundation/11-bigo/README.md) |
| OR（論理和） | どちらか 1 なら結果が 1 | [論理演算](sky/island-foundation/04-logic/README.md) |
| ORDER BY | 結果を指定列で並べ替える句 | [SQL SELECT文](sky/island-database/42-sql-select/README.md) |
| OS（オペレーティングシステム） | ハードウェアを管理し、アプリに共通サービスを提供する基盤ソフト | [OSの役割とプロセス](sky/island-software/34-os/README.md) |
| OSI 参照モデル | ネットワーク通信を 7 階層に分けた標準モデル | [OSI参照モデル](sky/island-network/47-osi/README.md) |
| OSS（オープンソースソフトウェア） | ソースコードが公開され自由に利用・改変・再配布できるソフト | [OSSとライセンス](sky/island-software/39-oss/README.md) |
| PaaS | 開発実行環境をクラウドで提供 | [仮想化とクラウド](sky/island-system/31-virtual/README.md) |
| PERT | 作業の依存関係をネットワーク図で表し最短工期を求める手法 | [OR・在庫管理](sky/island-corporate/66-or/README.md) |
| PKI（公開鍵基盤） | 認証局を核として公開鍵を管理する仕組み | [認証と証明書](sky/island-security/56-cert/README.md) |
| PMBOK | プロジェクト管理の知識体系。10 の知識エリア | [プロジェクト管理の基礎](sky/island-project/80-pmbok/README.md) |
| POP3/IMAP | メール受信に使うプロトコル | [DNS・DHCP・メール](sky/island-network/50-dns/README.md) |
| PPM（プロダクトポートフォリオマネジメント） | 市場成長率と市場シェアで事業を分類する手法 | [企業分析と標準化](sky/island-corporate/67-analysis/README.md) |
| QC 七つ道具 | パレート図・特性要因図など品質管理に使う基本ツール群 | [企業分析と標準化](sky/island-corporate/67-analysis/README.md) |
| QoS（サービス品質） | 通信の優先度を制御して品質を保証する技術 | [ネットワーク設計と冗長化](underground/fortress-network/105-design-nw/README.md) |
| RAID | 複数ディスクを組み合わせて信頼性・速度を向上させる技術 | [補助記憶と入出力](sky/island-hardware/25-disk/README.md) |
| RBAC（ロールベースアクセス制御） | 役割（ロール）を通じて権限を付与する方式 | [アクセス制御と認証技術](sky/island-security/60-accessctl/README.md) |
| REST | HTTP メソッド(GET/POST等)でリソースを操作する設計方式 | [Webとプロトコル応用](sky/island-network/53-webapi/README.md) |
| RFI（情報提供依頼書） | ベンダに技術情報や実績を問い合わせる文書 | [システム調達と契約](sky/island-business/71-contract/README.md) |
| RFP（提案依頼書） | ベンダに提案を依頼する文書。要件・条件を記載 | [システム調達と契約](sky/island-business/71-contract/README.md) |
| RISC | 命令種類を少なく固定長にした CPU 設計。パイプライン向き | [パイプラインと高速化](sky/island-hardware/23-pipeline/README.md) |
| ROI（投資利益率） | 利益 ÷ 投資額 × 100 で投資効果を測る指標 | [IT投資評価](sky/island-system-plan/73-eval/README.md) |
| ROM | 読出し専用メモリ。電源 OFF でも内容が残る | [記憶装置の階層](sky/island-hardware/24-memory/README.md) |
| SaaS | ソフトウェアをクラウドで提供 | [仮想化とクラウド](sky/island-system/31-virtual/README.md) |
| SCM | 調達から販売までの供給連鎖を最適化する管理手法 | [マーケティングとe-Biz](sky/island-business/69-marketing/README.md) |
| SELECT | テーブルからデータを取得する SQL 文 | [SQL SELECT文](sky/island-database/42-sql-select/README.md) |
| SEO | 検索エンジンで上位表示させる施策 | [マーケティングとe-Biz](sky/island-business/69-marketing/README.md) |
| Shift_JIS | 日本語を 1〜2 バイトで表す文字コード | [文字コードと符号化](sky/island-foundation/07-char/README.md) |
| SIEM | ログを一元的に収集・分析してセキュリティ脅威を検知するシステム | [ログ管理とフォレンジック](underground/fortress-security/108-log-forensic/README.md) |
| SLA | サービス提供者と利用者の間で合意した品質水準 | [ITサービスマネジメント](sky/island-service/83-itil/README.md) |
| SLA（サービスレベル合意書） | サービス品質の合意事項を定めた文書 | [システム調達と契約](sky/island-business/71-contract/README.md) |
| SMTP | メール送信に使うプロトコル（ポート 25） | [DNS・DHCP・メール](sky/island-network/50-dns/README.md) |
| SoR / SoE | 記録のシステム（安定重視）と関与のシステム（変化対応） | [IT戦略とガバナンス](sky/island-business/70-it-strategy/README.md) |
| SQLインジェクション | SQL文を不正に挿入してDBを操作する攻撃 | [Webセキュリティ](sky/island-security/58-webattack/README.md) |
| SSD | フラッシュメモリを使った高速な補助記憶装置 | [補助記憶と入出力](sky/island-hardware/25-disk/README.md) |
| SSID | 無線 LAN のネットワーク名 | [無線LANとHTTP](sky/island-network/52-wireless/README.md) |
| SSL/TLS | 通信を暗号化し、証明書で相手を認証するプロトコル | [認証と証明書](sky/island-security/56-cert/README.md) |
| SSL-VPN | SSL/TLS を利用した VPN。ブラウザで利用可能 | [VLANとVPN](underground/fortress-network/103-vlan/README.md) |
| SSO（シングルサインオン） | 一度の認証で複数システムを利用可能にする仕組み | [アクセス制御と認証技術](sky/island-security/60-accessctl/README.md) |
| STP（スパニングツリー） | ループを防止する L2 プロトコル | [ネットワーク設計と冗長化](underground/fortress-network/105-design-nw/README.md) |
| SWOT 分析 | 強み・弱み・機会・脅威で経営環境を分析するフレームワーク | [企業分析と標準化](sky/island-corporate/67-analysis/README.md) |
| TB（テラバイト） | 約 1 兆バイト | [情報量の単位](sky/island-foundation/03-unit/README.md) |
| TCO（総所有コスト） | 導入から廃棄まで全期間の総コスト | [IT投資評価](sky/island-system-plan/73-eval/README.md) |
| TCP | コネクション型の信頼性ある通信プロトコル | [TCP/UDPとポート](sky/island-network/49-tcpudp/README.md) |
| UDP | コネクションレス型の高速だが信頼性を保証しないプロトコル | [TCP/UDPとポート](sky/island-network/49-tcpudp/README.md) |
| UML | オブジェクト指向の統一モデリング言語。クラス図・ユースケース図等 | [設計手法とUML](sky/island-dev-tech/75-design/README.md) |
| Unicode | 世界中の文字を統一的に扱う文字集合 | [文字コードと符号化](sky/island-foundation/07-char/README.md) |
| UPDATE | テーブルの既存行を更新する SQL 文 | [SQL 更新系と制約](sky/island-database/44-sql-update/README.md) |
| UPS（無停電電源装置） | 停電時に一時的に電力を供給する装置 | [ファシリティマネジメント](sky/island-service/84-facility/README.md) |
| URL | Web 上のリソースの場所を示す文字列 | [Webとプロトコル応用](sky/island-network/53-webapi/README.md) |
| USB | 周辺機器を接続する汎用シリアルバス | [入出力インタフェース](sky/island-hardware/26-io/README.md) |
| UTF-8 | Unicode を可変長（1〜4 バイト）で符号化する方式。ASCII 互換 | [文字コードと符号化](sky/island-foundation/07-char/README.md) |
| VLAN | 物理的な接続に関係なく論理的にネットワークを分割する技術 | [VLANとVPN](underground/fortress-network/103-vlan/README.md) |
| VPN | 暗号化トンネルで安全な通信を実現する仮想プライベートネットワーク | [VLANとVPN](underground/fortress-network/103-vlan/README.md) |
| VRAM | 画面表示用の専用メモリ。表示色数×解像度で必要量が決まる | [表示装置と解像度](sky/island-hardware/27-display/README.md) |
| WAF | Web アプリケーションへの攻撃を防ぐファイアウォール | [ファイアウォールとDMZ](sky/island-security/57-firewall/README.md) |
| WBS（作業分解構成図） | 成果物を階層的にタスクに分解する図 | [プロジェクト管理の基礎](sky/island-project/80-pmbok/README.md) |
| WHERE | 条件を指定して行を絞り込む句 | [SQL SELECT文](sky/island-database/42-sql-select/README.md) |
| WPA2/WPA3 | 無線 LAN の暗号化規格 | [無線LANとHTTP](sky/island-network/52-wireless/README.md) |
| XOR（排他的論理和） | 値が異なるとき結果が 1 | [論理演算](sky/island-foundation/04-logic/README.md) |
| XSS（クロスサイトスクリプティング） | 悪意あるスクリプトをWebページに埋め込む攻撃 | [Webセキュリティ](sky/island-security/58-webattack/README.md) |
| アウトソーシング | 業務を外部企業に委託すること | [経営戦略](sky/island-business/68-strategy/README.md) |
| アクセシビリティ | 障がいの有無に関わらず利用できること | [ヒューマンインタフェース](sky/island-media/63-ux/README.md) |
| アクセス制御 | 利用者ごとに情報資源への操作を制限する仕組み | [アクセス制御と認証技術](sky/island-security/60-accessctl/README.md) |
| アクチュエータ | 電気信号を物理的な動き（モータなど）に変換する装置 | [組込みとIoT](sky/island-system/33-embed/README.md) |
| アジャイル開発 | 短いイテレーションで機能を繰り返し開発する手法 | [開発プロセスモデル](sky/island-dev-tech/74-sdlc/README.md) |
| アライアンス | 企業間の戦略的提携 | [経営戦略](sky/island-business/68-strategy/README.md) |
| アローダイアグラム | 作業を矢印で表すネットワーク図 | [スケジュールと工数](sky/island-project/81-schedule/README.md) |
| アンダーフロー | 空の構造からデータを取り出そうとするエラー | [スタックとキュー](sky/island-algorithm/17-stack/README.md) |
| インシデント管理 | サービスの中断を速やかに復旧する活動 | [ITサービスマネジメント](sky/island-service/83-itil/README.md) |
| インシデント対応 | セキュリティ事故の検知・封じ込め・復旧・再発防止の一連の活動 | [インシデント対応と法規](sky/island-security/61-incident/README.md) |
| インスペクション | 第三者が公式な手順で欠陥を検出するレビュー | [レビューと品質管理](sky/island-dev-tech/78-review/README.md) |
| インタフェース | 実装を持たず、メソッドの仕様のみを定義する型 | [オブジェクト指向](sky/island-dev-tech/76-oop/README.md) |
| インタプリタ | ソースコードを 1 行ずつ解釈・実行するプログラム | [コンパイラとリンカ](sky/island-software/38-compiler/README.md) |
| インデックス | 検索を高速化するためのデータ構造（B 木など） | [障害回復と性能](underground/fortress-database/101-recovery/README.md) |
| ウォークスルー | 作成者が資料を説明しながらレビューする方法 | [レビューと品質管理](sky/island-dev-tech/78-review/README.md) |
| ウォーターフォールモデル | 要件定義→設計→実装→テストを順に進める開発モデル | [開発プロセスモデル](sky/island-dev-tech/74-sdlc/README.md) |
| エンティティ | 管理対象となる「もの」（顧客、商品など） | [E-R図と概念設計](sky/island-database/46-er/README.md) |
| オーバーフロー | 容量を超えてデータを追加しようとするエラー | [スタックとキュー](sky/island-algorithm/17-stack/README.md) |
| オープンアドレス法 | 衝突時に別の空き位置を探す方法 | [ハッシュ法](sky/island-algorithm/20-hash/README.md) |
| カーディナリティ | 1対1、1対多、多対多などの関連の多重度 | [E-R図と概念設計](sky/island-database/46-er/README.md) |
| カーネル | OS の中核部分。資源管理や割込み処理を行う | [OSの役割とプロセス](sky/island-software/34-os/README.md) |
| カプセル化 | データと操作をまとめ外部から隠蔽する概念 | [オブジェクト指向](sky/island-dev-tech/76-oop/README.md) |
| ガントチャート | 横軸に時間、タスクの開始・終了を棒で示す図 | [プロジェクト管理の基礎](sky/island-project/80-pmbok/README.md) |
| キャッシュメモリ | CPU とメインメモリの間に置く高速小容量の記憶装置 | [記憶装置の階層](sky/island-hardware/24-memory/README.md) |
| キュー | 先入れ先出し (FIFO)。enqueue で追加、dequeue で取出し | [スタックとキュー](sky/island-algorithm/17-stack/README.md) |
| クイックソート | 基準値(ピボット)で分割を繰り返す。平均 O(n log n) | [マージソートとクイックソート](sky/island-algorithm/16-merge/README.md) |
| クラスタリング | 複数のサーバをまとめて 1 台のように使う技術 | [クラスタと負荷分散](sky/island-system/32-cluster/README.md) |
| クラス図 | クラスの属性・操作・関連を表す UML 図 | [設計手法とUML](sky/island-dev-tech/75-design/README.md) |
| グラフ | 頂点（ノード）と辺（エッジ）で関係を表すデータ構造 | [グラフと探索](sky/island-algorithm/21-graph/README.md) |
| クリティカルパス | プロジェクト最短工期を決める最長経路 | [OR・在庫管理](sky/island-corporate/66-or/README.md) |
| クリティカルパス法 (CPM) | 最長経路から最短工期を算出する手法 | [スケジュールと工数](sky/island-project/81-schedule/README.md) |
| クロック周波数 | CPU の動作速度。GHz 単位で表す | [CPU の仕組み](sky/island-hardware/22-cpu/README.md) |
| コアコンピタンス | 競合に模倣されにくい企業独自の強み | [経営戦略](sky/island-business/68-strategy/README.md) |
| コールスタック | 関数呼出しの履歴を管理するスタック構造 | [午後トレース：再帰と応用](underground/fortress-algorithm/93-trace-recurse/README.md) |
| コールドスタンバイ | 待機系は停止状態。障害時に起動する | [冗長化と多重化](sky/island-system/29-redundancy/README.md) |
| コミット | トランザクションの結果を確定する操作 | [トランザクションと障害回復](sky/island-database/45-transaction/README.md) |
| コンパイラ | ソースコードを一括して機械語に翻訳するプログラム | [コンパイラとリンカ](sky/island-software/38-compiler/README.md) |
| コンプライアンス | 法令や規則を遵守すること | [内部統制と法令遵守](sky/island-audit/86-internal/README.md) |
| サーバルーム | サーバ設置のための温度・湿度管理された部屋 | [ファシリティマネジメント](sky/island-service/84-facility/README.md) |
| サブネットマスク | ネットワーク部とホスト部を区別するためのビットマスク | [IPアドレスとサブネット](sky/island-network/48-ip/README.md) |
| シーク時間 | 磁気ヘッドを目的トラックまで移動させる時間 | [補助記憶と入出力](sky/island-hardware/25-disk/README.md) |
| システムテスト | システム全体が要件を満たすかを確認するテスト | [テスト技法](sky/island-dev-tech/77-test/README.md) |
| システム化計画 | 経営課題を解決する IT 投資の方針と優先度を決める活動 | [システム企画と要件定義](sky/island-system-plan/72-plan/README.md) |
| システム監査 | 情報システムの信頼性・安全性・効率性を独立した立場で評価する活動 | [システム監査](sky/island-audit/85-audit-base/README.md) |
| スーパースカラ | 複数のパイプラインで同時に命令を実行する方式 | [パイプラインと高速化](sky/island-hardware/23-pipeline/README.md) |
| スクラム | アジャイルの代表的なフレームワーク。スプリント単位で開発 | [開発プロセスモデル](sky/island-dev-tech/74-sdlc/README.md) |
| スケールアウト | サーバ台数を増やして処理能力を上げること | [クラスタと負荷分散](sky/island-system/32-cluster/README.md) |
| スケールアップ | サーバ自体の性能（CPU・メモリ）を上げること | [クラスタと負荷分散](sky/island-system/32-cluster/README.md) |
| スタック | 後入れ先出し (LIFO)。push で追加、pop で取出し | [スタックとキュー](sky/island-algorithm/17-stack/README.md) |
| ステップ実行 | 1 行ずつ実行して動作を確認するデバッグ手法 | [デバッグと穴埋め対策](underground/fortress-program/97-debug/README.md) |
| スパイラルモデル | プロトタイプ＋リスク分析を繰り返す開発モデル | [開発プロセスモデル](sky/island-dev-tech/74-sdlc/README.md) |
| スラッシング | ページ置換が頻発して処理が進まなくなる現象 | [仮想記憶](sky/island-software/36-vmem/README.md) |
| スループット | 単位時間あたりの処理量 | [性能評価](sky/island-system/30-perf/README.md) |
| スレッド | プロセス内の実行単位。軽量プロセスとも呼ばれる | [OSの役割とプロセス](sky/island-software/34-os/README.md) |
| セキュアバイデザイン | 設計段階からセキュリティを組み込む考え方 | [セキュア設計とゼロトラスト](underground/fortress-security/109-secure-design/README.md) |
| セマフォ | 資源の利用可能数を管理し排他制御を実現する仕組み | [スケジューリングと排他](sky/island-software/35-sched/README.md) |
| ゼロトラスト | 内部外部を問わずすべてのアクセスを検証するセキュリティモデル | [セキュア設計とゼロトラスト](underground/fortress-security/109-secure-design/README.md) |
| センサ | 温度・圧力・光などの物理量を電気信号に変換する装置 | [組込みとIoT](sky/island-system/33-embed/README.md) |
| ソーシャルエンジニアリング | 人間の心理的弱点を突いて情報を入手する手法 | [脅威と攻撃手法](sky/island-security/54-threat/README.md) |
| ターンアラウンドタイム | ジョブ投入から結果受取りまでの全時間 | [性能評価](sky/island-system/30-perf/README.md) |
| タイムスタンプ | データの存在時刻を第三者が証明する仕組み | [暗号と認証の午後対策](underground/fortress-security/107-crypto-pm/README.md) |
| チェイン法 | 衝突時にリンクリストでつなげる方法 | [ハッシュ法](sky/island-algorithm/20-hash/README.md) |
| チェックポイント | ある時点でメモリ上のデータをディスクに書き出すこと | [障害回復と性能](underground/fortress-database/101-recovery/README.md) |
| ディレクトリ（フォルダ） | ファイルを階層的に整理する入れ物 | [ファイルシステム](sky/island-software/37-file/README.md) |
| ディレクトリトラバーサル | パス操作で非公開ファイルにアクセスする攻撃 | [Webセキュリティ](sky/island-security/58-webattack/README.md) |
| データリンク層 | 同一ネットワーク内のフレーム伝送。MAC アドレスを使用 | [OSI参照モデル](sky/island-network/47-osi/README.md) |
| データ圧縮 | 可逆（元に戻せる）と非可逆（情報を捨てる）がある | [画像と音声のデータ](sky/island-media/62-image/README.md) |
| データ型 | 整数・実数・文字列・論理値などの分類 | [コーディングと変数](underground/fortress-program/95-coding/README.md) |
| テーブル（表） | 行（レコード）と列（カラム）で構成されるデータの集合 | [関係データベースの基礎](sky/island-database/40-rdb/README.md) |
| デザインレビュー | 設計書を関係者が確認して問題を指摘する活動 | [レビューと品質管理](sky/island-dev-tech/78-review/README.md) |
| デジタルフォレンジック | 電子的な証拠を収集・保全・分析する技術 | [ログ管理とフォレンジック](underground/fortress-security/108-log-forensic/README.md) |
| デジタル署名 | 送信者の秘密鍵で署名し公開鍵で検証する仕組み | [暗号化の基礎](sky/island-security/55-crypto/README.md) |
| デッドロック | 互いに資源の解放を待ち合って処理が止まる状態 | [スケジューリングと排他](sky/island-software/35-sched/README.md) |
| デバッグ | プログラムの誤り（バグ）を発見して修正する作業 | [デバッグと穴埋め対策](underground/fortress-program/97-debug/README.md) |
| デフォルトゲートウェイ | 外部ネットワークへの出口となるルータの IP | [ルーティングとスイッチ](sky/island-network/51-routing/README.md) |
| デュアルシステム | 2 系統が同時に同じ処理を行い結果を照合 | [冗長化と多重化](sky/island-system/29-redundancy/README.md) |
| デュプレックスシステム | 現用系と待機系の 2 系統で構成 | [冗長化と多重化](sky/island-system/29-redundancy/README.md) |
| トランザクション | 一連の処理をまとめた不可分な単位 | [トランザクションと障害回復](sky/island-database/45-transaction/README.md) |
| トランスポート層 | 端末間の信頼性ある通信。TCP/UDP を使用 | [OSI参照モデル](sky/island-network/47-osi/README.md) |
| トレース | 擬似言語のコードを 1 行ずつ実行し変数の変化を追うこと | [午後トレース基礎](underground/fortress-algorithm/90-trace-basic/README.md) |
| ネットワークアドレス | ホスト部がすべて 0 のアドレス | [サブネット計算](underground/fortress-network/102-subnet-calc/README.md) |
| ネットワーク層 | 異なるネットワーク間のルーティング。IP アドレスを使用 | [OSI参照モデル](sky/island-network/47-osi/README.md) |
| バイト (byte) | 8 ビットをまとめた単位。1 バイト = 8 ビット | [ビットとバイト](sky/island-foundation/01-bit/README.md) |
| ハイパーバイザ | 仮想マシンを管理するソフトウェア層 | [仮想化とクラウド](sky/island-system/31-virtual/README.md) |
| パイプラインハザード | データ依存や分岐で流れが停止する問題 | [パイプラインと高速化](sky/island-hardware/23-pipeline/README.md) |
| パイプライン処理 | 命令の各段階をずらして並行実行する高速化手法 | [パイプラインと高速化](sky/island-hardware/23-pipeline/README.md) |
| ハイブリッド暗号 | 共通鍵暗号で本文を、公開鍵暗号で共通鍵を暗号化する方式 | [暗号と認証の午後対策](underground/fortress-security/107-crypto-pm/README.md) |
| パケットキャプチャ | ネットワーク上のパケットを取得して分析する手法 | [パケット解析と通信制御](underground/fortress-network/104-packet/README.md) |
| パケットフィルタリング | IPアドレス・ポート番号でパケットの通過を制御する方式 | [ファイアウォールとDMZ](sky/island-security/57-firewall/README.md) |
| ハッシュ関数 | キーを配列の添字に変換する関数 | [ハッシュ法](sky/island-algorithm/20-hash/README.md) |
| ハッシュ法 | キーからハッシュ関数で格納位置を計算する方法。O(1)の探索 | [ハッシュ法](sky/island-algorithm/20-hash/README.md) |
| バブルソート | 隣接要素を比較・交換して整列する。O(n²) | [バブルソートと選択ソート](sky/island-algorithm/15-bubble/README.md) |
| ビット (bit) | 情報の最小単位。0 か 1 の二択を 1 ビットと呼ぶ | [ビットとバイト](sky/island-foundation/01-bit/README.md) |
| ヒット率 | キャッシュにデータがあった割合 | [記憶装置の階層](sky/island-hardware/24-memory/README.md) |
| ファイアウォール | ネットワーク境界で不正アクセスを遮断する装置・ソフト | [ファイアウォールとDMZ](sky/island-security/57-firewall/README.md) |
| ファイルシステム | ファイルの保存・管理を行う OS の仕組み | [ファイルシステム](sky/island-software/37-file/README.md) |
| ファシリティマネジメント | コンピュータ室・電源・空調など設備を管理する活動 | [ファシリティマネジメント](sky/island-service/84-facility/README.md) |
| ファンクションポイント法 (FP) | 機能数から工数を見積もる手法 | [スケジュールと工数](sky/island-project/81-schedule/README.md) |
| フィジビリティスタディ | プロジェクトの実現可能性を事前に検証する調査 | [システム企画と要件定義](sky/island-system-plan/72-plan/README.md) |
| フィッシング | 偽サイトに誘導して個人情報を騙し取る攻撃 | [脅威と攻撃手法](sky/island-security/54-threat/README.md) |
| フェールセーフ | 故障時に安全な状態に移行する設計思想 | [システムの信頼性](sky/island-system/28-reliability/README.md) |
| フォールトトレラント | 故障が起きても運用を継続できる設計 | [システムの信頼性](sky/island-system/28-reliability/README.md) |
| フラグメンテーション | ファイルがディスク上に断片化して散らばる現象 | [補助記憶と入出力](sky/island-hardware/25-disk/README.md) |
| ブラックボックステスト | 仕様を基に入出力をテストする手法 | [テスト技法](sky/island-dev-tech/77-test/README.md) |
| ブロードキャストアドレス | ホスト部がすべて 1 のアドレス | [サブネット計算](underground/fortress-network/102-subnet-calc/README.md) |
| フロー制御 | 受信側の処理能力に合わせて送信量を調整する仕組み | [パケット解析と通信制御](underground/fortress-network/104-packet/README.md) |
| プロキシサーバ | クライアントの代理で外部にアクセスする中継サーバ | [Webとプロトコル応用](sky/island-network/53-webapi/README.md) |
| プログラムカウンタ | 次に実行する命令のアドレスを保持するレジスタ | [CPU の仕組み](sky/island-hardware/22-cpu/README.md) |
| プロジェクト | 期限と目標が定まった一回限りの活動 | [プロジェクト管理の基礎](sky/island-project/80-pmbok/README.md) |
| プロセス | 実行中のプログラムの単位 | [OSの役割とプロセス](sky/island-software/34-os/README.md) |
| プロトタイピング | 試作品を作りユーザの確認を得ながら進める手法 | [開発プロセスモデル](sky/island-dev-tech/74-sdlc/README.md) |
| ページフォールト | 必要なページが主記憶にないとき発生する割込み | [仮想記憶](sky/island-software/36-vmem/README.md) |
| ページング | 仮想空間を固定長のページに分割して管理する方式 | [仮想記憶](sky/island-software/36-vmem/README.md) |
| ベクタ画像 | 数式で図形を定義する画像（SVG）。拡大しても劣化しない | [画像と音声のデータ](sky/island-media/62-image/README.md) |
| ベンチマーク | 標準的なプログラムで性能を測定すること | [性能評価](sky/island-system/30-perf/README.md) |
| ベン図 | 集合の関係を円の重なりで視覚化する図 | [集合と論理](sky/island-foundation/08-set/README.md) |
| ポインタ | メモリ上のアドレスを保持する変数 | [リスト構造](sky/island-algorithm/18-list/README.md) |
| ポート番号 | アプリケーションを識別する 0〜65535 の番号 | [TCP/UDPとポート](sky/island-network/49-tcpudp/README.md) |
| ホスト数の計算 | 2^(ホスト部ビット数) − 2（ネットワーク・ブロードキャスト除外） | [サブネット計算](underground/fortress-network/102-subnet-calc/README.md) |
| ホットスタンバイ | 待機系が稼働状態で即座に切替え可能 | [冗長化と多重化](sky/island-system/29-redundancy/README.md) |
| ホワイトボックステスト | 内部構造（コード）を基にテストケースを作成する手法 | [テスト技法](sky/island-dev-tech/77-test/README.md) |
| マーケティングミックス (4P) | 製品・価格・流通・販促で戦略を立てるフレームワーク | [マーケティングとe-Biz](sky/island-business/69-marketing/README.md) |
| マージソート | 分割統治法で配列を半分ずつ分けて統合。O(n log n)・安定 | [マージソートとクイックソート](sky/island-algorithm/16-merge/README.md) |
| マイルストーン | プロジェクトの重要な節目 | [プロジェクト管理の基礎](sky/island-project/80-pmbok/README.md) |
| マルウェア | 悪意あるソフトウェアの総称（ウイルス・ワーム・トロイの木馬など） | [脅威と攻撃手法](sky/island-security/54-threat/README.md) |
| マルチタスク | 複数のタスクを切り替えて並行実行する仕組み | [OSの役割とプロセス](sky/island-software/34-os/README.md) |
| メインメモリ (RAM) | CPU が直接アクセスする主記憶。電源 OFF で消える | [記憶装置の階層](sky/island-hardware/24-memory/README.md) |
| メッセージ認証コード (MAC) | 通信内容の改ざんを検出するための認証データ | [暗号と認証の午後対策](underground/fortress-security/107-crypto-pm/README.md) |
| モジュール結合度・凝集度 | 結合度は低いほど、凝集度は高いほど良い設計 | [設計手法とUML](sky/island-dev-tech/75-design/README.md) |
| ユニバーサルデザイン | 年齢・能力に関わらず誰でも使えるデザイン | [ヒューマンインタフェース](sky/island-media/63-ux/README.md) |
| ラウンドロビン | 各プロセスに均等な CPU 時間（タイムスライス）を与える方式 | [スケジューリングと排他](sky/island-software/35-sched/README.md) |
| ラスタ画像 | ピクセルの集合で表す画像（BMP, JPEG, PNG） | [画像と音声のデータ](sky/island-media/62-image/README.md) |
| ランサムウェア | データを暗号化して身代金を要求するマルウェア | [脅威と攻撃手法](sky/island-security/54-threat/README.md) |
| リアルタイム OS | 応答時間が保証された OS。制御用途に使用 | [組込みとIoT](sky/island-system/33-embed/README.md) |
| リスクアセスメント | リスクの特定・分析・評価を行うプロセス | [情報セキュリティ管理](sky/island-security/59-policy/README.md) |
| リスク回避 | リスクの原因となる活動を取りやめること | [リスクと品質管理](sky/island-project/82-risk/README.md) |
| リスク管理 | リスクの特定・分析・対応策を計画する活動 | [リスクと品質管理](sky/island-project/82-risk/README.md) |
| リスク対応 | 回避・軽減・転嫁・受容の 4 つの戦略 | [リスクアセスメント演習](underground/fortress-security/106-risk-assess/README.md) |
| リスク値 | 脅威×脆弱性×資産価値で算出される指標 | [リスクアセスメント演習](underground/fortress-security/106-risk-assess/README.md) |
| リスク転嫁 | 保険や外注によりリスクを第三者に移すこと | [リスクと品質管理](sky/island-project/82-risk/README.md) |
| リファクタリング | 外部動作を変えずにコードの内部構造を改善すること | [運用・保守とDevOps](sky/island-dev-tech/79-devops/README.md) |
| リンカ | オブジェクトファイルやライブラリを結合して実行ファイルを作る | [コンパイラとリンカ](sky/island-software/38-compiler/README.md) |
| ルータ | 異なるネットワーク間でパケットを転送する装置（L3） | [ルーティングとスイッチ](sky/island-network/51-routing/README.md) |
| ルーティングテーブル | パケットの転送先を管理する経路表 | [ルーティングとスイッチ](sky/island-network/51-routing/README.md) |
| ループカウンタ | 繰返し回数を数える変数 | [午後トレース：繰返し](underground/fortress-algorithm/91-trace-loop/README.md) |
| ループ不変条件 | ループの各反復の前後で常に成り立つ条件 | [午後トレース：繰返し](underground/fortress-algorithm/91-trace-loop/README.md) |
| レジスタ | CPU 内部の高速な記憶領域 | [CPU の仕組み](sky/island-hardware/22-cpu/README.md) |
| レスポンスタイム | 要求を出してから応答が返るまでの時間 | [性能評価](sky/island-system/30-perf/README.md) |
| ローダ | 実行ファイルをメモリに読み込んで実行準備をする | [コンパイラとリンカ](sky/island-software/38-compiler/README.md) |
| ロードバランサ | アクセスを複数サーバに振り分ける装置 | [クラスタと負荷分散](sky/island-system/32-cluster/README.md) |
| ロールバック | トランザクションの結果を取消して元に戻す操作 | [トランザクションと障害回復](sky/island-database/45-transaction/README.md) |
| ロールフォワード | チェックポイント以降のログを使って最新状態に復元する操作 | [障害回復と性能](underground/fortress-database/101-recovery/README.md) |
| ログ（ジャーナル） | 更新履歴を記録してリカバリに使うファイル | [トランザクションと障害回復](sky/island-database/45-transaction/README.md) |
| ログ管理 | システムの操作記録を保存・監視する活動 | [ログ管理とフォレンジック](underground/fortress-security/108-log-forensic/README.md) |
| ワード | CPU が一度に扱うデータ幅。32 ビットや 64 ビットなど | [ビットとバイト](sky/island-foundation/01-bit/README.md) |
| 安定ソート | 同値要素の相対順序が保たれるソート | [バブルソートと選択ソート](sky/island-algorithm/15-bubble/README.md) |
| 右シフト | ビット列を右にずらす。1 回で値が 1/2 | [シフト演算と補数](sky/island-foundation/05-shift/README.md) |
| 営業利益 | 売上総利益 − 販売費及び一般管理費 | [財務と会計の基礎](sky/island-corporate/64-accounting/README.md) |
| 液晶ディスプレイ | 液晶の光透過率を制御して表示する装置 | [表示装置と解像度](sky/island-hardware/27-display/README.md) |
| 下線部参照 | 設問が指す本文中の該当箇所を正確に特定する技術 | [長文読解の技法](underground/fortress-deep/110-reading/README.md) |
| 仮想化 | 物理資源を論理的に分割・統合する技術 | [仮想化とクラウド](sky/island-system/31-virtual/README.md) |
| 仮想記憶 | 主記憶＋補助記憶で実際より大きなメモリ空間を実現する仕組み | [仮想記憶](sky/island-software/36-vmem/README.md) |
| 稼働率 | MTBF / (MTBF + MTTR)。1 に近いほど高信頼 | [システムの信頼性](sky/island-system/28-reliability/README.md) |
| 解像度 | 画面のピクセル数。1920×1080 など | [表示装置と解像度](sky/island-hardware/27-display/README.md) |
| 回帰テスト（リグレッションテスト） | 修正後に他の箇所に影響がないか確認するテスト | [レビューと品質管理](sky/island-dev-tech/78-review/README.md) |
| 外部キー | 他テーブルの主キーを参照する列。参照整合性を保つ | [関係データベースの基礎](sky/island-database/40-rdb/README.md) |
| 外部結合 (OUTER JOIN) | 一致しない行も NULL で返す | [SQL 結合と副問合せ](sky/island-database/43-sql-join/README.md) |
| 外部設計（基本設計） | 画面・帳票・インタフェースなどユーザ視点の設計 | [設計手法とUML](sky/island-dev-tech/75-design/README.md) |
| 確率 | ある事象が起こる割合。0〜1 の値 | [確率と統計](sky/island-foundation/09-prob/README.md) |
| 楽観的ロック | 更新時に競合を検出する方式。バージョン番号で管理 | [ロックと同時実行制御](underground/fortress-database/100-lock/README.md) |
| 監査証拠 | 監査意見の根拠となる資料やデータ | [システム監査](sky/island-audit/85-audit-base/README.md) |
| 監査人の独立性 | 被監査部門から独立し客観的に評価すること | [システム監査](sky/island-audit/85-audit-base/README.md) |
| 監査報告書 | 監査結果と改善勧告をまとめた文書 | [システム監査](sky/island-audit/85-audit-base/README.md) |
| 関係データベース (RDB) | データを表（テーブル）で管理するデータベース | [関係データベースの基礎](sky/island-database/40-rdb/README.md) |
| 丸め誤差 | 有限桁で表せない値を丸めることで生じる誤差 | [浮動小数点と誤差](sky/island-foundation/06-float/README.md) |
| 基数変換 | ある基数の数を別の基数に直すこと | [基数変換](sky/island-foundation/02-base/README.md) |
| 基底条件（ベースケース） | 再帰の終了条件 | [午後トレース：再帰と応用](underground/fortress-algorithm/93-trace-recurse/README.md) |
| 期待値 | 確率を重みとした値の加重平均 | [確率と統計](sky/island-foundation/09-prob/README.md) |
| 機能要件 | システムが実現すべき処理や入出力 | [システム企画と要件定義](sky/island-system-plan/72-plan/README.md) |
| 機密性・完全性・可用性 | 情報セキュリティの 3 要素（CIA） | [情報セキュリティ管理](sky/island-security/59-policy/README.md) |
| 擬似言語 | IPA 午後問題で使われるプログラム記述用の疑似コード | [午後トレース基礎](underground/fortress-algorithm/90-trace-basic/README.md) |
| 逆ポーランド記法 | 演算子を被演算子の後に書く。スタックで評価可能 | [オートマトンと形式言語](sky/island-foundation/12-automata/README.md) |
| 逆行列 | 元の行列と掛けると単位行列になる行列 | [行列と線形代数](sky/island-foundation/10-matrix/README.md) |
| 共通フレーム | ソフトウェアライフサイクルの標準プロセス体系（JIS X 0160） | [IT投資評価](sky/island-system-plan/73-eval/README.md) |
| 共通鍵暗号方式 | 暗号化と復号に同じ鍵を使う方式（AES など） | [暗号化の基礎](sky/island-security/55-crypto/README.md) |
| 共有ロック | 他のトランザクションの読みは許可し書きを禁止するロック | [ロックと同時実行制御](underground/fortress-database/100-lock/README.md) |
| 境界値 | ループや条件分岐の境界でバグが起きやすい値 | [デバッグと穴埋め対策](underground/fortress-program/97-debug/README.md) |
| 強制アクセス制御 (MAC) | システムが機密レベルで強制的に制御する方式 | [アクセス制御と認証技術](sky/island-security/60-accessctl/README.md) |
| 繰返し | 条件が成立する間処理を繰り返す構造 | [制御構造の組合せ](underground/fortress-program/96-structure/README.md) |
| 繰返し（ループ） | 条件が成立する間、処理を繰り返す構造 | [午後トレース：繰返し](underground/fortress-algorithm/91-trace-loop/README.md) |
| 型変換（キャスト） | あるデータ型を別の型に変換すること | [コーディングと変数](underground/fortress-program/95-coding/README.md) |
| 経営戦略 | 企業が競争優位を確立するための方針と計画 | [経営戦略](sky/island-business/68-strategy/README.md) |
| 継承（インヘリタンス） | 既存クラスの性質を引き継いで新クラスを作ること | [オブジェクト指向](sky/island-dev-tech/76-oop/README.md) |
| 桁落ち | 近い値の引き算で有効桁数が減る現象 | [浮動小数点と誤差](sky/island-foundation/06-float/README.md) |
| 穴埋め問題 | 擬似言語の空欄に正しいコードを選ぶ午後の出題形式 | [デバッグと穴埋め対策](underground/fortress-program/97-debug/README.md) |
| 結合テスト | モジュール間の連携を確認するテスト | [テスト技法](sky/island-dev-tech/77-test/README.md) |
| 見直し | 解答後にケアレスミスや読み違いがないか確認する作業 | [総合戦略と時間管理](underground/fortress-deep/113-final-strategy/README.md) |
| 個人情報保護法 | 個人情報の取扱いに関する日本の法律 | [インシデント対応と法規](sky/island-security/61-incident/README.md) |
| 午後シナリオ問題 | 具体的な業務シナリオを読み解いて解答する問題形式 | [システム構成シナリオ](underground/fortress-deep/111-system-scenario/README.md) |
| 午後問題の構造 | 問題文（状況説明）→設問→選択肢の形式 | [長文読解の技法](underground/fortress-deep/110-reading/README.md) |
| 公開鍵暗号方式 | 暗号化と復号に異なる鍵を使う方式（RSA など） | [暗号化の基礎](sky/island-security/55-crypto/README.md) |
| 構造化定理 | あらゆるアルゴリズムは順次・選択・繰返しの組合せで表現できる | [制御構造の組合せ](underground/fortress-program/96-structure/README.md) |
| 行列 | 数を縦横に並べた配列。行(横)と列(縦)で位置を指定 | [行列と線形代数](sky/island-foundation/10-matrix/README.md) |
| 根（ルート） | 木の最上位ノード | [木構造と二分木](sky/island-algorithm/19-tree/README.md) |
| 左シフト | ビット列を左にずらす。1 回で値が 2 倍 | [シフト演算と補数](sky/island-foundation/05-shift/README.md) |
| 再帰 | 関数が自分自身を呼び出す手法 | [午後トレース：再帰と応用](underground/fortress-algorithm/93-trace-recurse/README.md) |
| 最小権限の原則 | 必要最小限のアクセス権だけを与える原則 | [セキュア設計とゼロトラスト](underground/fortress-security/109-secure-design/README.md) |
| 在庫管理（EOQ） | 発注費と保管費の合計を最小にする経済的発注量 | [OR・在庫管理](sky/island-corporate/66-or/README.md) |
| 算術シフト | 符号ビットを保持したままシフトする操作 | [シフト演算と補数](sky/island-foundation/05-shift/README.md) |
| 残余リスク | 対策後に残るリスク | [リスクアセスメント演習](underground/fortress-security/106-risk-assess/README.md) |
| 試験戦略 | 出題傾向と自分の得意分野を踏まえた解答順序の計画 | [総合戦略と時間管理](underground/fortress-deep/113-final-strategy/README.md) |
| 時間計算量 | アルゴリズムの実行ステップ数がデータ量でどう増えるか | [計算量とオーダ](sky/island-foundation/11-bigo/README.md) |
| 時間配分 | 午後試験で各問題に適切な時間を割り当てる戦略 | [分野横断演習](underground/fortress-deep/112-cross-domain/README.md) |
| 実効アクセス時間 | ヒット率を加味した平均アクセス時間 | [記憶装置の階層](sky/island-hardware/24-memory/README.md) |
| 主キー | 行を一意に識別する列。NULL 不可 | [関係データベースの基礎](sky/island-database/40-rdb/README.md) |
| 手続き・関数 | 処理のまとまり。引数を受け取り値を返すことがある | [擬似言語の読み方](underground/fortress-program/94-pseudo/README.md) |
| 準委任契約 | 業務遂行を委託する契約。成果物の完成義務なし | [システム調達と契約](sky/island-business/71-contract/README.md) |
| 順次 | 上から順に処理を実行する構造 | [制御構造の組合せ](underground/fortress-program/96-structure/README.md) |
| 商標権 | ブランドの名前やマークを保護する権利 | [知的財産と法務](sky/island-corporate/65-law/README.md) |
| 消去法 | 明らかに誤りの選択肢を除外して正答を絞る技法 | [長文読解の技法](underground/fortress-deep/110-reading/README.md) |
| 衝突（コリジョン） | 異なるキーが同じハッシュ値になること | [ハッシュ法](sky/island-algorithm/20-hash/README.md) |
| 冗長構成 | 障害に備えて経路や機器を二重化する設計 | [ネットワーク設計と冗長化](underground/fortress-network/105-design-nw/README.md) |
| 情報セキュリティポリシ | 組織の情報セキュリティに関する基本方針 | [情報セキュリティ管理](sky/island-security/59-policy/README.md) |
| 情報の関連付け | 問題文中の異なる箇所の情報を結びつけて推論する技術 | [分野横断演習](underground/fortress-deep/112-cross-domain/README.md) |
| 情報落ち | 大きい値に小さい値を加えても反映されない現象 | [浮動小数点と誤差](sky/island-foundation/06-float/README.md) |
| 条件分岐（if-else） | 条件に応じて異なる処理を実行する構造 | [擬似言語の読み方](underground/fortress-program/94-pseudo/README.md) |
| 職務分掌 | 権限と責任を分離して不正を防ぐ仕組み | [内部統制と法令遵守](sky/island-audit/86-internal/README.md) |
| 深さ優先探索 (DFS) | スタックを使い、行けるだけ深く探索してから戻る | [グラフと探索](sky/island-algorithm/21-graph/README.md) |
| 正規化 | データの冗長性を排除しテーブルを分割する設計手法 | [正規化](sky/island-database/41-normal/README.md) |
| 正規表現 | 文字列パターンを記述する表記法 | [オートマトンと形式言語](sky/island-foundation/12-automata/README.md) |
| 請負契約 | 成果物の完成を約束する契約。瑕疵担保責任あり | [システム調達と契約](sky/island-business/71-contract/README.md) |
| 積集合（A∩B） | A と B の両方に属する要素の集合 | [集合と論理](sky/island-foundation/08-set/README.md) |
| 絶対パス | ルートからの完全な経路指定 | [ファイルシステム](sky/island-software/37-file/README.md) |
| 線形計画法 (LP) | 制約条件のもとで目的関数を最大化・最小化する手法 | [OR・在庫管理](sky/island-corporate/66-or/README.md) |
| 線形探索（逐次探索） | 先頭から順に目的の値を探す方法。O(n) | [配列と線形探索](sky/island-algorithm/13-array/README.md) |
| 選択 | 条件に応じて処理を分岐させる構造 | [制御構造の組合せ](underground/fortress-program/96-structure/README.md) |
| 選択ソート | 未整列部分から最小値を選んで先頭に置く。O(n²) | [バブルソートと選択ソート](sky/island-algorithm/15-bubble/README.md) |
| 前提条件 | 二分探索はデータが整列済みでなければならない | [二分探索](sky/island-algorithm/14-bsearch/README.md) |
| 組込みシステム | 特定の機能を実行するために機器に内蔵されたコンピュータシステム | [組込みとIoT](sky/island-system/33-embed/README.md) |
| 双方向リスト | 前後両方の要素を指すリスト | [リスト構造](sky/island-algorithm/18-list/README.md) |
| 相関副問合せ | 外側のクエリの値を参照する副問合せ | [午後SQL問題演習](underground/fortress-database/99-sql-pm/README.md) |
| 相対パス | 現在地からの経路指定 | [ファイルシステム](sky/island-software/37-file/README.md) |
| 走査（トラバーサル） | 木の全ノードを一定の順序で訪問すること | [木構造と二分木](sky/island-algorithm/19-tree/README.md) |
| 属性（アトリビュート） | エンティティが持つデータ項目 | [E-R図と概念設計](sky/island-database/46-er/README.md) |
| 属性の導出 | E-R図とテーブル定義から適切な列を特定する技法 | [午後E-R図の読解](underground/fortress-database/98-er-read/README.md) |
| 損益計算書（P/L） | 一定期間の収益と費用から利益を示す書類 | [財務と会計の基礎](sky/island-corporate/64-accounting/README.md) |
| 損益分岐点 | 売上高と費用が等しくなり利益ゼロとなる点 | [財務と会計の基礎](sky/island-corporate/64-accounting/README.md) |
| 多態性（ポリモーフィズム） | 同じメッセージで異なる動作をする性質 | [オブジェクト指向](sky/island-dev-tech/76-oop/README.md) |
| 多要素認証 (MFA) | 知識・所持・生体の 2 つ以上を組み合わせた認証 | [認証と証明書](sky/island-security/56-cert/README.md) |
| 帯域計算 | 通信容量（bps）とデータ量から転送時間を求める計算 | [ネットワーク設計と冗長化](underground/fortress-network/105-design-nw/README.md) |
| 貸借対照表（B/S） | ある時点の資産・負債・純資産を示す書類 | [財務と会計の基礎](sky/island-corporate/64-accounting/README.md) |
| 第1正規形 | 繰返し項目を除去し、すべての列が原子的な値を持つ | [正規化](sky/island-database/41-normal/README.md) |
| 第2正規形 | 部分関数従属を除去し、主キー全体に完全関数従属させる | [正規化](sky/island-database/41-normal/README.md) |
| 第3正規形 | 推移的関数従属を除去する | [正規化](sky/island-database/41-normal/README.md) |
| 単位行列 | 対角成分が 1、それ以外が 0 の正方行列 | [行列と線形代数](sky/island-foundation/10-matrix/README.md) |
| 単体テスト | モジュール単位で動作を確認するテスト | [テスト技法](sky/island-dev-tech/77-test/README.md) |
| 単方向リスト | 次の要素だけを指すリスト | [リスト構造](sky/island-algorithm/18-list/README.md) |
| 探索範囲 | 探索対象として残っている部分 | [二分探索](sky/island-algorithm/14-bsearch/README.md) |
| 抽象クラス | インスタンス化できない、派生クラスの雛形となるクラス | [オブジェクト指向](sky/island-dev-tech/76-oop/README.md) |
| 著作権 | 創作物を保護する権利。登録不要で発生 | [知的財産と法務](sky/island-corporate/65-law/README.md) |
| 直列・並列の稼働率 | 直列=積、並列=1-(1-A)(1-B) | [冗長化と多重化](sky/island-system/29-redundancy/README.md) |
| 添字（インデックス） | 配列の要素位置を示す番号（0 始まりが多い） | [配列と線形探索](sky/island-algorithm/13-array/README.md) |
| 得点最大化 | 確実に取れる問題を先に解き、難問は後回しにする戦略 | [総合戦略と時間管理](underground/fortress-deep/113-final-strategy/README.md) |
| 特許権 | 発明を保護する権利。出願・審査が必要 | [知的財産と法務](sky/island-corporate/65-law/README.md) |
| 内部結合 (INNER JOIN) | 両テーブルで一致する行だけを返す | [SQL 結合と副問合せ](sky/island-database/43-sql-join/README.md) |
| 内部設計（詳細設計） | モジュール構造やデータ構造の設計 | [設計手法とUML](sky/island-dev-tech/75-design/README.md) |
| 内部統制 | 業務の有効性・効率性・法令遵守・資産保全のための仕組み | [内部統制と法令遵守](sky/island-audit/86-internal/README.md) |
| 二分探索 | ソート済み配列の中央と比較して範囲を半分に絞る探索。O(log n) | [二分探索](sky/island-algorithm/14-bsearch/README.md) |
| 二分探索木 | 左部分木 < 親 < 右部分木 の規則を持つ二分木 | [木構造と二分木](sky/island-algorithm/19-tree/README.md) |
| 任意アクセス制御 (DAC) | 所有者が自由に権限を設定できる方式 | [アクセス制御と認証技術](sky/island-security/60-accessctl/README.md) |
| 認証局 (CA) | デジタル証明書を発行し公開鍵の正当性を保証する機関 | [認証と証明書](sky/island-security/56-cert/README.md) |
| 排他ロック | 他のトランザクションの読書きを禁止するロック | [ロックと同時実行制御](underground/fortress-database/100-lock/README.md) |
| 排他制御 | 共有資源に同時アクセスさせないための制御 | [スケジューリングと排他](sky/island-software/35-sched/README.md) |
| 配列 | 同じ型のデータを連続して格納するデータ構造 | [配列と線形探索](sky/island-algorithm/13-array/README.md) |
| 配列の走査 | 配列の全要素を順に処理すること | [午後トレース：配列操作](underground/fortress-algorithm/92-trace-array/README.md) |
| 配列の添字 | 要素位置を示す番号。擬似言語では 1 始まりが多い | [午後トレース：配列操作](underground/fortress-algorithm/92-trace-array/README.md) |
| 売上総利益 | 売上高 − 売上原価 | [財務と会計の基礎](sky/island-corporate/64-accounting/README.md) |
| 番兵 | 配列末尾にダミー値を置いて探索の終了判定を簡略化する手法 | [午後トレース：配列操作](underground/fortress-algorithm/92-trace-array/README.md) |
| 番兵法 | 末尾にダミーを置いて終了判定を省略する手法 | [配列と線形探索](sky/island-algorithm/13-array/README.md) |
| 非機能要件 | 性能・信頼性・セキュリティなどの品質要件 | [システム企画と要件定義](sky/island-system-plan/72-plan/README.md) |
| 標準偏差 | 分散の正の平方根 | [確率と統計](sky/island-foundation/09-prob/README.md) |
| 標本化（サンプリング） | アナログ信号を一定間隔で値を取り出しデジタル化する工程 | [画像と音声のデータ](sky/island-media/62-image/README.md) |
| 表・図の読解 | ネットワーク構成図やテーブル定義から情報を読み取る技術 | [システム構成シナリオ](underground/fortress-deep/111-system-scenario/README.md) |
| 不正アクセス禁止法 | 他人のID・パスワードで不正ログインすることを禁じる法律 | [インシデント対応と法規](sky/island-security/61-incident/README.md) |
| 不正競争防止法 | 営業秘密の不正取得などを禁じる法律 | [知的財産と法務](sky/island-corporate/65-law/README.md) |
| 浮動小数点数 | 仮数部×基数の指数乗で実数を表す形式 | [浮動小数点と誤差](sky/island-foundation/06-float/README.md) |
| 副問合せ（サブクエリ） | SQL 文の中に入れ子にした SELECT 文 | [SQL 結合と副問合せ](sky/island-database/43-sql-join/README.md) |
| 幅優先探索 (BFS) | キューを使い、近い頂点から順に探索する | [グラフと探索](sky/island-algorithm/21-graph/README.md) |
| 物理層 | 電気信号やケーブルなどの物理的な伝送 | [OSI参照モデル](sky/island-network/47-osi/README.md) |
| 分割統治法 | 問題を小さく分けて解き、結果を統合する手法 | [マージソートとクイックソート](sky/island-algorithm/16-merge/README.md) |
| 分散 | データのばらつきの指標。偏差の二乗の平均 | [確率と統計](sky/island-foundation/09-prob/README.md) |
| 分野横断問題 | セキュリティ＋ネットワーク等、複数分野にまたがる問題 | [分野横断演習](underground/fortress-deep/112-cross-domain/README.md) |
| 変更管理 | 変更によるリスクを最小化する管理プロセス | [ITサービスマネジメント](sky/island-service/83-itil/README.md) |
| 変数テーブル | トレース時に各変数の値を記録する表 | [午後トレース基礎](underground/fortress-algorithm/90-trace-basic/README.md) |
| 変数のスコープ | 変数が参照可能な範囲（局所変数・大域変数） | [コーディングと変数](underground/fortress-program/95-coding/README.md) |
| 保守 | リリース後の不具合修正や機能追加を行う活動 | [運用・保守とDevOps](sky/island-dev-tech/79-devops/README.md) |
| 補集合 | 全体集合のうちその集合に属さない要素 | [集合と論理](sky/island-foundation/08-set/README.md) |
| 無線 LAN (Wi-Fi) | 電波を使ったローカルエリアネットワーク。IEEE 802.11 規格 | [無線LANとHTTP](sky/island-network/52-wireless/README.md) |
| 命令サイクル | 命令の取出し→解読→実行→書戻しの一連の流れ | [CPU の仕組み](sky/island-hardware/22-cpu/README.md) |
| 木（ツリー） | 親子関係を持つ階層的なデータ構造 | [木構造と二分木](sky/island-algorithm/19-tree/README.md) |
| 問題管理 | インシデントの根本原因を特定・解消する活動 | [ITサービスマネジメント](sky/island-service/83-itil/README.md) |
| 優先度方式 | 優先度の高いプロセスから実行する方式 | [スケジューリングと排他](sky/island-software/35-sched/README.md) |
| 有機 EL | 有機化合物の発光を利用した自発光型ディスプレイ | [表示装置と解像度](sky/island-hardware/27-display/README.md) |
| 有限オートマトン | 状態と遷移で文字列の受理を判定する計算モデル | [オートマトンと形式言語](sky/island-foundation/12-automata/README.md) |
| 有向グラフ | 辺に方向があるグラフ | [グラフと探索](sky/island-algorithm/21-graph/README.md) |
| 葉（リーフ） | 子を持たないノード | [木構造と二分木](sky/island-algorithm/19-tree/README.md) |
| 要件の読み取り | 問題文から機能要件・非機能要件を抽出する技術 | [システム構成シナリオ](underground/fortress-deep/111-system-scenario/README.md) |
| 要件定義 | システムに求められる機能・性能を明確にする工程 | [システム企画と要件定義](sky/island-system-plan/72-plan/README.md) |
| 量子化 | 標本化した値を有限ビットで近似する工程 | [画像と音声のデータ](sky/island-media/62-image/README.md) |
| 連関エンティティ | M:N 関連を解消するために追加する中間エンティティ | [午後E-R図の読解](underground/fortress-database/98-er-read/README.md) |
| 連結リスト | 各要素がデータと次の要素へのポインタを持つ構造 | [リスト構造](sky/island-algorithm/18-list/README.md) |
| 和集合（A∪B） | A か B の少なくとも一方に属する要素の集合 | [集合と論理](sky/island-foundation/08-set/README.md) |
