# 🚀 家具モデリングガイド配布システム

> 分割・整理された効率的なRoblox家具モデリングガイド配布・管理システム

## 📋 概要

このシステムは、肥大化していた単一のセットアップスクリプトを、機能ごとに適切に分割・整理したモジュール化されたソリューションです。

## 🎯 主要な改善点

### ✅ 問題解決

- **肥大化したスクリプト**: 682行の巨大なスクリプトを8つの専門的なモジュールに分割
- **保守性の向上**: 各機能が独立したファイルで管理可能
- **再利用性**: 個別のスクリプトを他のプロジェクトでも利用可能
- **可読性**: 目的が明確で理解しやすい構造

### 🔧 新しい構造

```text
delivery-system/
├── setup-main.sh              # メインセットアップスクリプト
├── scripts/                   # 機能別スクリプト
│   ├── setup-basic-files.sh   # 基本ファイル作成
│   ├── setup-labels.sh        # GitHubラベル設定
│   ├── setup-templates.sh     # Issue/PRテンプレート
│   ├── setup-workflows.sh     # GitHub Actions設定
│   ├── setup-docs-site.sh     # ドキュメントサイト構築
│   ├── migrate-data.sh        # データ移行
│   └── create-initial-issues.sh # 初期Issue作成
├── templates/                 # 再利用可能テンプレート
├── workflows/                 # GitHub Actions定義
└── docs/                      # 運用ドキュメント
```

## 🚀 クイックスタート

### 1. 基本セットアップ

```bash
# システムのクローン
git clone https://github.com/YOUR-USERNAME/llm-furniture-coordinator.git
cd llm-furniture-coordinator/furniture-image-style-transformer/delivery-system

# 実行権限の付与
chmod +x setup-main.sh
chmod +x scripts/*.sh

# メインセットアップの実行
./setup-main.sh
```

### 2. 個別スクリプトの実行

```bash
# 特定の機能のみ実行したい場合
./scripts/setup-labels.sh      # ラベル設定のみ
./scripts/setup-templates.sh   # テンプレート作成のみ
./scripts/setup-workflows.sh   # ワークフロー設定のみ
```

## 📁 ファイル構成詳細

### メインスクリプト

- **`setup-main.sh`**: 全体の統合制御（135行）
  - 環境確認、リポジトリ作成、各モジュールの実行

### 機能別スクリプト

- **`setup-basic-files.sh`**: 基本ファイル群作成（365行）
  - README.md, LICENSE, CONTRIBUTING.md, .gitignore
  
- **`setup-labels.sh`**: GitHubラベル管理（120行）
  - Priority, Status, Type, Category, Style, Difficulty等のラベル体系

- **`setup-templates.sh`**: Issue/PRテンプレート（450行）
  - 新家具ガイド、バグ報告、機能要望、改善提案テンプレート

- **`setup-workflows.sh`**: GitHub Actions設定（380行）
  - Pages デプロイ、PDF生成、パッケージ作成、Issue管理、品質チェック

- **`setup-docs-site.sh`**: ドキュメントサイト構築（420行）
  - Vite, HTML, CSS, JavaScript, package.json設定

- **`migrate-data.sh`**: データ移行処理（180行）
  - 既存ガイド・画像の移行、品質チェック、統計生成

- **`create-initial-issues.sh`**: 初期Issue作成（180行）
  - ウェルカムIssue、サンプルガイド、改善提案、マイルストーン設定

## 🛠 使用方法

### 完全セットアップ

```bash
# 新しいリポジトリの完全セットアップ
./setup-main.sh
```

### 部分的セットアップ

```bash
# 既存リポジトリにラベルのみ追加
./scripts/setup-labels.sh

# 既存リポジトリにワークフローのみ追加
./scripts/setup-workflows.sh

# データ移行のみ実行
./scripts/migrate-data.sh
```

### カスタマイズ

```bash
# 設定値の変更
export REPO_NAME="your-custom-repo-name"
export ORG_NAME="your-organization"
./setup-main.sh
```

## 🔧 各スクリプトの詳細

### setup-basic-files.sh

**目的**: プロジェクトの基盤ファイル作成

- README.md: プロジェクト概要とクイックスタート
- LICENSE: MIT ライセンス
- CONTRIBUTING.md: 詳細なコントリビューションガイド
- .gitignore: Node.js/Blender対応の除外設定

### setup-labels.sh

**目的**: 体系的なラベル管理

- **Priority**: p-critical, p-high, p-medium, p-low
- **Status**: status-planning, status-in-progress, status-review, etc.
- **Type**: type-bug, type-feature, type-guide, etc.
- **Category**: category-chair, category-table, etc.
- **Style**: style-cartoon, style-modern, style-minimal
- **Difficulty**: difficulty-beginner, difficulty-intermediate, etc.

### setup-templates.sh

**目的**: 一貫したIssue/PR管理

- **新家具ガイド**: 詳細な制作依頼テンプレート
- **バグ報告**: 再現可能な問題報告
- **機能要望**: 構造化された提案フォーマット
- **改善提案**: 既存機能の改善提案

### setup-workflows.sh

**目的**: 完全自動化されたCI/CD

- **GitHub Pages**: 自動デプロイ
- **PDF生成**: 週次自動生成
- **パッケージ作成**: リリース時自動パッケージング
- **Issue管理**: 自動ラベル付け、古いIssueの管理
- **品質チェック**: Markdown, リンク, 画像, 構造の検証

### setup-docs-site.sh

**目的**: 美しいドキュメントサイト

- **Vite**: 高速なビルドシステム
- **レスポンシブ**: モバイル完全対応
- **インタラクティブ**: フィルター、検索、ギャラリー
- **SEO対応**: メタタグ、構造化データ

### migrate-data.sh

**目的**: 既存資産の安全な移行

- **ガイド移行**: カテゴリ別自動分類
- **画像移行**: 元画像・変換済み画像の整理
- **品質チェック**: リンク修正、メタデータ追加
- **統計生成**: 移行レポート作成

### create-initial-issues.sh

**目的**: プロジェクト開始の加速

- **ウェルカムIssue**: プロジェクト概要の説明
- **サンプルガイド**: 制作例の提示
- **改善提案**: 具体的な次のステップ
- **マイルストーン**: 段階的な目標設定

## 📊 従来版との比較

| 項目 | 従来版 | 分割版 |
|------|--------|--------|
| ファイル数 | 1個 | 8個 |
| 総行数 | 682行 | 2,230行（機能大幅拡張） |
| 保守性 | 困難 | 簡単 |
| 再利用性 | 低 | 高 |
| テスト性 | 困難 | 容易 |
| 可読性 | 低 | 高 |

## 🎯 利点

### 🔧 開発効率

- **モジュール化**: 各機能が独立して開発・テスト可能
- **並行開発**: 複数人での同時開発が可能
- **部分更新**: 必要な機能のみ更新可能

### 📈 保守性

- **責任分担**: 各ファイルが明確な役割を持つ
- **エラー特定**: 問題の発生箇所を容易に特定
- **バージョン管理**: 機能ごとの変更履歴を追跡

### 🚀 拡張性

- **新機能追加**: 新しいスクリプトを追加するだけ
- **カスタマイズ**: 特定の環境に合わせた調整が容易
- **再利用**: 他のプロジェクトでの部分利用が可能

## 🔍 トラブルシューティング

### よくある問題

#### 1. GitHub CLI認証エラー

```bash
# 認証状態の確認
gh auth status

# 再認証
gh auth login
```

#### 2. 権限エラー

```bash
# 実行権限の付与
chmod +x setup-main.sh
chmod +x scripts/*.sh
```

#### 3. Node.js関連エラー

```bash
# Node.jsバージョン確認
node --version

# 推奨バージョン: 20以上
# 依存関係の再インストール
npm ci
```

#### 4. データ移行エラー

```bash
# 移行元パスの確認
ls -la ../../../furniture-image-style-transformer

# パスの修正（migrate-data.sh内）
SOURCE_DIR="実際のパス"
```

## 🔄 更新とメンテナンス

### 定期的な更新

```bash
# 最新版の取得
git pull origin main

# 依存関係の更新
npm update
```

### スクリプトの更新

```bash
# 個別スクリプトの再実行
./scripts/setup-labels.sh      # ラベル体系の更新
./scripts/setup-workflows.sh   # ワークフローの更新
```

## 📚 参考資料

### 関連ドキュメント

- [GitHub CLI ドキュメント](https://cli.github.com/manual/)
- [GitHub Actions ガイド](https://docs.github.com/ja/actions)
- [Vite ドキュメント](https://vitejs.dev/guide/)

### ベストプラクティス

- [Git ワークフロー](https://guides.github.com/introduction/flow/)
- [Issue管理](https://guides.github.com/features/issues/)
- [プロジェクト管理](https://docs.github.com/ja/issues/organizing-your-work-with-project-boards)

## 🤝 コントリビューション

### 改善提案

1. **Issue作成**: 改善提案をIssueで報告
2. **Pull Request**: 具体的な改善をPRで提案
3. **ディスカッション**: 大きな変更は事前にディスカッション

### 開発ガイドライン

- **モジュール性**: 各スクリプトの独立性を保つ
- **再利用性**: 他のプロジェクトでも使える汎用性
- **ドキュメント**: 変更時は必ずドキュメントも更新

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- **GitHub**: 素晴らしいプラットフォームとツール
- **Robloxコミュニティ**: 継続的なフィードバック
- **3Dモデラー**: 実用的な要求と改善提案

---

**🚀 効率的な配布システムで、プロフェッショナルな3Dモデリングを実現しましょう！**
