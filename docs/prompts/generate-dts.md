# TypeScript型定義ファイル生成の実装プラン

## タスク概要

TypeScript型定義ファイル（.d.ts）の生成を追加することで、IDEの型推論を改善するための実装計画です。現在型定義ファイルを生成していないパッケージに対して、適切なビルド設定を追加します。

## 背景

型定義ファイルの生成を適切に設定することで以下の改善が期待できます：
- IDEでの型推論の精度向上
- 開発者の生産性向上  
- 型安全性の向上
- TypeScriptコンパイル時のパフォーマンス改善

## 型定義ファイル未生成パッケージの特定

以下のような条件のパッケージを対象とします：

- 実際のコードを含む（設定ファイルのみではない）
- build または dist ディレクトリを持つ
- 他のパッケージから利用される可能性がある
- 現在 .d.ts ファイルを生成していない

**重要:** 設定ファイルのみを含むパッケージはスキップし、実際のコードとbuild/distディレクトリを持つパッケージに焦点を当てます。

## 実装手順

選択した各パッケージに対して：

1. **パッケージ構造の確認**:
    - 実際のコードを含むことを確認（設定ファイルのみではない）
    - build または dist ディレクトリがあることを確認
    - 既存のビルド設定（tsup.config.ts など）を確認

2. **TypeScript型定義ファイル生成の追加**:

   パッケージがtsupを使用している場合、tsup.config.tsファイルを修正：
   ```diff
   export default defineConfig({
     clean: true,
     target: 'es2022',
     entry: ['src/index.ts'],
     format: ['esm'],
     minify: true,
     sourcemap: true,
   +  dts: false, // tsupはdeclarationMapに対応していないため、dtsをfalseにし、tscを使って型定義ファイルを生成する
   +  onSuccess: 'pnpm build:types',
   })
   ```

   package.jsonにbuild:typesスクリプトを追加：
   ```diff
   "scripts": {
     "build": "tsup",
   +  "build:types": "tsc --emitDeclarationOnly --declaration --declarationMap"
   }
   ```

   tsconfig.jsonで適切な宣言設定を確保：
   ```json
   {
     "compilerOptions": {
       "declaration": true,
       "declarationMap": true
     }
   }
   ```

## 実装パターン

コードベース分析に基づいて、TypeScript型定義生成には以下のようなパターンがあります：

1. **tsupで `dts: true` を使用**:
   一部のパッケージでは、tsupの組み込み型定義生成を直接使用します。

2. **tsupで `dts: false` と別のtscコマンドを使用**:
   より高度なパッケージでは以下のような設定を使用します：
   ```javascript
   dts: false, // tsupはdeclarationMapに対応していないため、dtsをfalseにし、tscを使って型定義ファイルを生成する
   onSuccess: 'pnpm build:types',
   ```
   このアプローチは宣言マップをサポートするため推奨されます。

3. **Viteでunplugin-dtsを使用**:
   データベースパッケージなどでは以下のような設定を使用します：
   ```javascript
   dts({ bundleTypes: false, tsconfigPath: './tsconfig.build.json', entryRoot: 'src' }),
   ```

パッケージの既存のビルド設定に基づいて適切なパターンを選択してください。

## 実装時の要件

各実装において：
1. パッケージごとに個別の作業を実施
2. 全てのCIチェックが通ることを確認
3. TypeScriptベンチマーク結果の改善を確認
4. 変更は最小限に留め、型定義ファイル生成の追加に焦点を当てる

## 成果物

1. 型定義ファイル生成を実装した各パッケージ
2. 各実装には以下を含める：
    - 修正されたビルド設定ファイル
    - 必要に応じて更新されたpackage.jsonスクリプト
    - 必要なtsconfig.jsonの変更

## 追加の注意事項

- モノレポではTurborepoがビルドオーケストレーションに使用される
- 型定義ファイルから最も恩恵を受けるパッケージ（他のパッケージから使用されるライブラリ）に焦点を当てる
- パッケージについて不明な場合は、複数の他のパッケージからインポートされているものを優先する
