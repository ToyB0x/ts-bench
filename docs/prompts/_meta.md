# TypeScripプロジェクト軽量化のためのMetaプロンプト

## 本プロンプトの目的

TypeScriptプロジェクトにおいて、多々存在する軽量化手法を
AIを活用し効率的にAI向けプロンプトに落とし込むMetaプロントとして活用する

## 背景

一般的な開発者にとって
- IDEでの型推論やインテリセンス速度の速度向上
- TypeScriptコンパイル時のパフォーマンス改善
- 開発生産性向上 

は重要であるが、これらの指標とtscコマンドの実行速度は密接に関連している可能性がある。

## 重要事項

- DevinやClaude、ClineなどのAIは本メタプロンプトを読んだ際に、このメタプロンプト自体を改善できるようであれば積極的に改善提案を行うこと  
  (最新の技術は常に進化しているため、この資料が古くなっている可能性もあり、改善の余地がある場合は積極的に提案することが重要)

## 各種改善手法のプロンプト作成にあたり

- TypeScript公式
  - https://github.com/microsoft/Typescript/wiki/Performance
  - https://github.com/microsoft/TypeScript/wiki/Performance-Tracing
  - https://github.com/microsoft/TypeScript/wiki/Debugging-Language-Service-in-VS-Code
  - https://github.com/microsoft/TypeScript/issues/30235

- Turborepo関連
  - https://turborepo.com/docs/core-concepts/internal-packages#compiled-packages
  - https://turborepo.com/docs/guides/tools/typescript#you-likely-dont-need-typescript-project-references
  - https://github.com/vercel/turborepo/discussions/10325
  - https://github.com/vercel/turborepo/discussions/4143

- 関連ツール
  - https://github.com/ToyB0x/ts-bench (このリポジトリ)
  - https://deepwiki.com/ToyB0x/ts-bench (このリポジトリのDeepWiki)
  - https://www.npmjs.com/package/@typescript/analyze-trace 

- 参考になる各種記事
  - https://zenn.dev/cybozu_frontend/articles/ts-explicit-type-annotation
  - https://zenn.dev/forcia_tech/articles/20231017_tsuji
  - https://qiita.com/knjname/items/fc83a4248f459f1b052e

## 各種改善手法の目次

WIP: ここに目次をマークダウンのテーブル形式で記載してください。
- 目次には例えば以下のカラムでの各種評価が記載されているとよさそうです
- 手法の手軽さ
- 手法の段階的な実現しやすさ
- AIによる自動対応のしやすさ
- 改善影響の期待できる大きさ
- 既存の稼働中のサービスのデグレの可能性のリスク
- その他
