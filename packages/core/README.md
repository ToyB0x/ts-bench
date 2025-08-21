# @ts-bench/core

## Use cases
- 本Coreパッケージは、主に model と workflow 相当のコードが、ライブラリとして以下から利用される想定です
  - CLI
  - MCP (直接、本coreパッケージを利用するか、MCP内部で上記CLIを実行することで間接的にcoreパッケージを利用)

## TODO
### リポジトリのセットアップ処理
- リポジトリのクローン
- パッケージマネージャの判定
- パッケージのインストール
- リポジトリのビルド

### 差し替え可能な依存
- パッケージマネージャ (eg, pnpm, npm, yarn)
- ビルドツール (eg, tsc, esbuild, swc. tsgo)
- ビルドパイプライン(turbo, nx, moon, etc.)
- モノレポ管理ツール(pnpm workspace, yarn workspaces, etc.)
- 依存分析処理 (pnpm graph, yarn graph, turbo graph, etc.)
- キャッシュ分析処理 (turbo cache, nx cache, etc.)
- ビルドパイプラインの起動処理コマンド(turbo buildの実行など。これが分かれば上記のいくつかの依存の分析は省略できる)
- ビルド成果物の変化検出処理 (/build, /dist, /out, etc. などの出力先の種類はなにであり、どこにいくつあり、Before/Afterの検知が可能か？)

### 差し替え可能な分析方法
- 根本的にtsc または tsgoで計測することは同じだが、オプションなどは差し替え可能
- ビルドキャッュや前回分析後の変更差分を見たい場合にコマンドを変更可能
  - 最初のturbo typecheckだけ見るのでも良いかもしれない(キャッシュ再利用などを勝手にやってくれるメリットがあるため)

### 上記依存の検出、推測分析処理
- 静的コードによる推測処理
- AIによる推測処理 (turbo typecheck や turbo check-typeなどのコマンドを発見してくれる)