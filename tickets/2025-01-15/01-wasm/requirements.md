# 要件定義書: WASM+SPA構成への移行

## 概要
TypeScriptパフォーマンス監視ツール「ts-bench」のWebダッシュボード（apps/web）を、従来のSSG（静的サイト生成）構成からWASM+SPA（Single Page Application）構成に移行する。これにより、データサイズ増大による長時間ビルドの問題を解決し、動的なデータ読み込み機能を実現する。

## 背景と目的

### 背景
- 現在のSSGビルドでは、過去の分析データが数MBに達するとビルド時間が大幅に増加
- React Router v7のprerender機能により、ビルド時にSQLiteデータベース全体を読み込む仕組み
- データ蓄積に伴い、継続的インテグレーションのパフォーマンスが悪化

### 目的
- ビルド時間の短縮とスケーラビリティの向上
- ブラウザでの動的データ読み込み機能の実現
- パフォーマンス監視データの効率的な可視化
- ユーザー体験の向上（必要なデータのみ読み込み）

## 現状分析

### 既存アーキテクチャ
- **フロントエンド**: React Router v7 + Recharts
- **データベース**: SQLite (@ts-bench/db with Drizzle ORM)
- **ビルド**: SSG prerender（react-router.config.ts）
- **データフロー**: ビルド時にDB全体読み込み → 静的ファイル生成

### 現在のルート構成
```
/ (index) - トップページ
/graph - パッケージ一覧とサマリーグラフ
/graph/:scope?/:name - 個別パッケージ詳細
/ai - AI統合機能
```

### データ構造
- **scanTbl**: スキャン実行情報（コミット、リポジトリ情報）
- **resultTbl**: パフォーマンス測定結果（types, instantiations, totalTimeなど）

## 機能要件

### データ読み込み機能
- [ ] WHEN a user navigates to any route THEN the system SHALL load SQLite database using sql.js in the browser
- [ ] WHEN a user accesses the graph page THEN the system SHALL fetch only package list and summary data using Client Loader
- [ ] WHEN a user navigates to a specific package detail THEN the system SHALL fetch only relevant performance data for that package
- [ ] WHEN the SQLite file is not available THEN the system SHALL display an appropriate error message with fallback content

### グラフ表示機能
- [ ] WHEN performance data is loaded THEN the system SHALL render interactive charts using existing Recharts components
- [ ] WHEN a user interacts with charts THEN the system SHALL maintain current UX patterns (hover, selection, etc.)
- [ ] WHEN displaying summary data THEN the system SHALL aggregate metrics across all packages as currently implemented
- [ ] WHEN rendering package-specific charts THEN the system SHALL filter data by package name

### ナビゲーション機能
- [ ] WHEN a user navigates between routes THEN the system SHALL implement Client Loader for efficient data fetching
- [ ] WHEN the app initializes THEN the system SHALL load SQLite database once and reuse for subsequent operations
- [ ] WHEN route parameters change THEN the system SHALL fetch incremental data without full page reload

## ユーザーストーリー

### メインフロー
1. **初期ロード**: ユーザーがアプリケーションにアクセス
2. **WASM初期化**: ブラウザがsql.jsライブラリを読み込みSQLiteデータベースを初期化
3. **ルート遷移**: ユーザーが/graphページに移動
4. **データ取得**: Client Loaderが必要なパッケージデータのみを取得
5. **グラフ描画**: Rechartsコンポーネントが取得したデータでチャートを描画
6. **詳細表示**: ユーザーが特定パッケージを選択し詳細ページに遷移
7. **増分読み込み**: 該当パッケージの詳細データのみを追加取得

### エラーフロー
1. **WASM読み込み失敗**: sql.jsの読み込みに失敗した場合のフォールバック表示
2. **SQLiteファイル不在**: データベースファイルが見つからない場合のエラーハンドリング
3. **データ形式エラー**: 期待されるスキーマと異なる場合の適切なエラー表示

### 画面仕様
```
[Header: TSBench Logo]
[Main Content Area]
  ├── Graph Summary (ALL Packages)
  ├── Individual Package Charts (Grid Layout)
  └── Package Detail Links
[Footer: Version Info]
```

### 画面要素
- **Chart Container**: Recharts Area Chart with responsive design
- **Package Filter**: Dynamic package selection based on available data
- **Loading States**: WASM initialization and data loading indicators
- **Error Boundaries**: Graceful error handling for WASM/SQLite failures

### ナビゲーション・UX
- [ ] Client-side routing with React Router v7
- [ ] Progressive data loading with visual feedback
- [ ] Consistent chart interaction patterns
- [ ] Mobile-responsive design preservation

## 受け入れテスト項目
- [ ] typecheck / lint / format が全て通過すること
