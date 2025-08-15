# wasm

## 目的
- When the size of past analysis data reaches several MB, SSG takes a long time, so we changed the configuration to read SQLite etc. using

## 要件
- apps/webのSSGをWasm+SPA構成に置き換える (Client Loaderが必要)

## 受け入れ基準
- ブラウザでSQLiteを読み込んで、画面にデータをグラフ表示できること

## 備考
- related issue: https://github.com/ToyB0x/ts-bench/issues/255

### Additional Information
1. SQLiteのデータソース

現在のSSGで使用しているSQLiteファイルの取得方法：
- CIパイプラインでSPAアプリのビルド時にpublicディレクトリに配置

2. WASMライブラリの選択

SQLiteをブラウザで読み込むためのWASMライブラリ：
- a) sql.js（SQLite公式のWASM版
- b) wa-sqlite 
- c) 未定/調査が必要
- d) その他（具体的に）

Answer: a

3. React Router v7のClient Loader実装

Client Loaderでのデータ取得タイミング：
- a) 初回ロード時に全データを読み込み
- b) ルート遷移ごとに必要なデータのみ取得
- c) 両方のパターンを使い分け

Answer: b

4. グラフ表示の互換性

現在のRechartsを使用したグラフ表示：
- a) そのまま維持（データソースのみ変更）
- b) 必要に応じてリファクタリング可
- c) パフォーマンス優先で別ライブラリも検討可

Answer: a, b


5. ビルド構成の変更範囲

- a) apps/webのみ変更
- b) packages/dbも含めて変更が必要
- c) Turboの設定も含めて見直し

Answer: a


6. 開発の優先順位

- a) まず動作する最小限の実装を優先
- b) パフォーマンス最適化も含めて実装
- c) 段階的な移行（一部ルートから開始）

Answer: a, c
