# TypeScriptプロジェクト最適化のためのメタプロンプト

## 本プロンプトの目的

TypeScriptプロジェクトにおける性能最適化手法を体系化し、AIを活用して効率的に実装可能なプロンプトとして構造化することで、開発生産性とコンパイル性能の向上を支援する。

## 背景

TypeScript開発における性能課題は開発体験に直接影響する：

### 主要な課題領域
- **IDE体験**: 型推論やインテリセンスの応答速度
- **ビルド性能**: TypeScriptコンパイル時間とメモリ使用量
- **開発効率**: Hot Reloadや型チェックの速度
- **CI/CD**: パイプラインでのビルド時間とリソース消費

これらは相互に関連し、`tsc`の実行性能が全体の開発体験を左右する。

## AI支援による継続的改善

### メタプロンプト自体の進化
- **AI共同進化**: DevinやClaude、ClineなどのAIは本メタプロンプトの改善機会を積極的に提案すること
- **技術追従**: TypeScript、ビルドツール、開発環境の最新動向を反映
- **実証ベース**: 実際の性能改善結果に基づく手法の評価更新

### 品質保証
- **検証可能性**: 各手法は`ts-bench`などのツールで測定可能であること
- **再現性**: AIが自動実装する際の具体的な手順を明示
- **安全性**: 本番環境への影響リスクを明確化

## 技術リソースと参考資料

### TypeScript公式ドキュメント
- **Performance Wiki**: https://github.com/microsoft/Typescript/wiki/Performance  
  コンパイル性能の基本原則とベストプラクティス
- **Performance Tracing**: https://github.com/microsoft/TypeScript/wiki/Performance-Tracing  
  `--generateTrace`を用いた詳細な性能分析手法
- **VS Code Language Service**: https://github.com/microsoft/TypeScript/wiki/Debugging-Language-Service-in-VS-Code  
  IDE統合における性能問題の診断
- **Issue #30235**: https://github.com/microsoft/TypeScript/issues/30235  
  大規模プロジェクトにおける性能課題の議論

### モノレポ・ビルドツール
- **Turborepo Compiled Packages**: https://turborepo.com/docs/core-concepts/internal-packages#compiled-packages  
  モノレポでの効率的なTypeScriptビルド戦略
- **TypeScript Project References**: https://turborepo.com/docs/guides/tools/typescript#you-likely-dont-need-typescript-project-references  
  プロジェクト参照の適切な使用判断
- **Turborepo Discussions**: 
  - https://github.com/vercel/turborepo/discussions/10325
  - https://github.com/vercel/turborepo/discussions/4143

### 測定・分析ツール
- **ts-bench**: https://github.com/ToyB0x/ts-bench (このリポジトリ)  
  TypeScript性能の継続的測定とベンチマーク
- **DeepWiki**: https://deepwiki.com/ToyB0x/ts-bench  
  プロジェクトの詳細な技術ドキュメント
- **@typescript/analyze-trace**: https://www.npmjs.com/package/@typescript/analyze-trace  
  TypeScriptトレースファイルの自動解析

### 実践的な改善事例
- **明示的型注釈**: https://zenn.dev/cybozu_frontend/articles/ts-explicit-type-annotation  
  型推論負荷軽減のための具体的手法
- **大規模プロジェクト最適化**: https://zenn.dev/forcia_tech/articles/20231017_tsuji  
  実際のプロダクションでの性能改善事例
- **TypeScript高速化**: https://qiita.com/knjname/items/fc83a4248f459f1b052e  
  コンパイル速度向上のテクニック集

## TypeScript最適化手法一覧

### 評価基準
各手法を以下の基準で評価し、AIによる自動実装の優先順位を決定する：

| 手法カテゴリ | 実装容易度 | 段階実装 | AI自動化 | 性能影響 | デグレリスク | 備考 |
|------------|------------|----------|----------|----------|-------------|------|
| **設定最適化** | | | | | | |
| tsconfig.json調整 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | 基本的な設定変更 |
| 型定義絞り込み | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐ | @typesの最適化 |
| **コード構造** | | | | | | |
| 明示的型注釈 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ | 型推論負荷軽減 |
| Interface vs Union | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ | 設計パターン変更 |
| **プロジェクト構造** | | | | | | |
| Project References | ⭐ | ⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐ | 大規模向け |
| モノレポ最適化 | ⭐ | ⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | アーキテクチャ変更 |

**凡例**: ⭐(低/簡単/安全) ⭐⭐(中) ⭐⭐⭐(高/複雑/影響大)

### 実装プロンプト生成方針
1. **段階的アプローチ**: 低リスクな設定変更から開始
2. **測定駆動**: 各変更前後でts-benchによる測定実施
3. **自動化優先**: AI実装容易度の高い手法を優先的に体系化
4. **安全性重視**: 本番影響を最小化する段階的実装パス提供
