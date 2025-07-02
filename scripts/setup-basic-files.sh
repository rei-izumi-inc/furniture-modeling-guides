#!/bin/bash
# setup-basic-files.sh
# 基本ファイル（README、LICENSE等）の作成

echo "📝 基本ファイルを作成中..."

# 基本README作成
cat > README.md << 'EOF'
# 🎯 Roblox家具モデリングガイド

> プロフェッショナルな3Dモデラー向けの包括的な制作ガイドとプロジェクト管理システム

[![GitHub Pages](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://pages.github.com/)
[![Issues](https://img.shields.io/github/issues/USER/furniture-modeling-guides)](../../issues)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🌟 概要

このリポジトリは、Roblox向け家具3Dモデルの制作を効率化するための統合システムです：

- **📖 詳細な制作ガイド**: 20件以上の家具アイテム制作指針
- **🎨 スタイル変換例**: カートゥーン、モダン、ミニマルの3スタイル
- **📊 プロジェクト管理**: GitHub Issues/Projects完全統合
- **🌐 Webサイト**: GitHub Pages による美しいドキュメントサイト
- **📦 自動化**: PDF/ZIP出力、進捗管理の完全自動化

## 🚀 クイックスタート

### モデラーの方
1. **[Issues](../../issues)** で制作予定を確認
2. **[プロジェクトボード](../../projects)** で進捗を追跡
3. **[ガイドサイト](https://rei-izumi-inc.github.io/furniture-modeling-guides/)** で詳細情報を確認

### 管理者の方
1. **新規家具追加**: Issues テンプレートを使用
2. **進捗管理**: Projects ボードで状況把握
3. **品質管理**: Pull Request レビューで品質確保

## 📁 構造

```
furniture-modeling-guides/
├── guides/                 # マークダウン制作ガイド
├── images/                 # 画像アセット
│   ├── original/          # 元画像
│   └── transformed/       # スタイル変換済み画像
├── exports/               # 配布用ファイル
│   ├── pdf/              # PDF版ガイド
│   └── zip/              # パッケージファイル
├── docs/                  # ドキュメントサイト
└── .github/               # GitHub統合設定
```

## 🛠 制作フロー

1. **📋 Issue作成** → 制作依頼・タスク登録
2. **🎯 アサイン** → 担当モデラーの決定
3. **🛠 制作開始** → ガイドに従ったモデリング
4. **📝 進捗更新** → Issue コメントで状況報告
5. **🔍 レビュー** → Pull Request でのコードレビュー
6. **✅ 完成** → マージ・自動デプロイ

## 🏷 ラベル体系

- **Priority**: `p-high`, `p-medium`, `p-low`
- **Status**: `status-planning`, `status-in-progress`, `status-review`, `status-done`
- **Type**: `type-bug`, `type-feature`, `type-guide`, `type-improvement`
- **Category**: `category-chair`, `category-table`, `category-storage`, `category-decoration`

## 🔧 開発環境

### 必要なツール
- **Blender 4.0+**: 3Dモデリング
- **Git**: バージョン管理
- **GitHub CLI**: Issue/PR管理
- **Node.js**: ドキュメント生成

### セットアップ
```bash
# リポジトリをクローン
git clone https://github.com/rei-izumi-inc/furniture-modeling-guides.git
cd furniture-modeling-guides

# 依存関係をインストール
npm install

# ローカルサーバー起動
npm run dev
```

## 📚 リソース

- **[制作ガイド](docs/modeling-guide.md)**: 基本的な制作手順
- **[スタイルガイド](docs/style-guide.md)**: 各スタイルの特徴
- **[運用ガイド](docs/operations-guide.md)**: プロジェクト管理手順
- **[FAQ](docs/faq.md)**: よくある質問

## 🤝 コントリビューション

1. **Fork** このリポジトリ
2. **Feature Branch** を作成: `git checkout -b feature/amazing-feature`
3. **Commit** 変更: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Pull Request** を作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## 🙏 謝辞

- **Robloxコミュニティ**: 継続的なフィードバック
- **3Dモデラー**: 品質向上への貢献
- **GitHub**: 素晴らしいプラットフォーム

---

**📧 お問い合わせ**: Issues または [メール](mailto:contact@example.com)
**🐛 バグ報告**: [Issues](../../issues/new?template=bug_report.md)
**💡 機能要望**: [Issues](../../issues/new?template=feature_request.md)
EOF

# ライセンスファイル
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 Roblox Furniture Modeling Guides

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# .gitignore
cat > .gitignore << 'EOF'
# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# Build outputs
dist/
build/
exports/temp/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Blender
*.blend1
*.blend2
*.blend3

# Temporary files
*.tmp
*.temp
*.bak
*.swp
*.swo

# IDE
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOF

# CONTRIBUTING.md
cat > CONTRIBUTING.md << 'EOF'
# 🤝 コントリビューションガイド

## 🎯 概要

このプロジェクトに貢献していただきありがとうございます！このガイドでは、効果的にコントリビューションを行うための手順を説明します。

## 🚀 はじめに

### 必要なスキル
- **Blender**: 基本的な3Dモデリング
- **Git**: バージョン管理の基礎
- **Markdown**: ドキュメント作成

### 開発環境
```bash
# リポジトリをフォーク & クローン
git clone https://github.com/rei-izumi-inc/furniture-modeling-guides.git
cd furniture-modeling-guides

# 依存関係をインストール
npm install

# ブランチを作成
git checkout -b feature/your-feature-name
```

## 📋 コントリビューションの種類

### 1. **新しい家具ガイド**
- Issue を作成してから着手
- テンプレートに従って作成
- 最低3つのスタイル変換を含める

### 2. **既存ガイドの改善**
- 明確な改善点を Issue で説明
- 変更前後のスクリーンショットを含める
- レビューアーを指定

### 3. **バグ修正**
- Bug Report テンプレートを使用
- 再現手順を詳細に記述
- 修正後のテスト結果を含める

### 4. **ドキュメント改善**
- 誤字脱字、情報の更新
- 新しいセクションの追加
- 翻訳（将来的に）

## 🔄 ワークフロー

### 1. **Issue作成**
```bash
# 新機能の場合
gh issue create --template feature_request.md

# バグ報告の場合
gh issue create --template bug_report.md
```

### 2. **ブランチ作成**
```bash
# 機能開発
git checkout -b feature/furniture-sofa-guide

# バグ修正
git checkout -b fix/chair-texture-issue

# ドキュメント
git checkout -b docs/update-style-guide
```

### 3. **コミット**
```bash
# わかりやすいコミットメッセージ
git commit -m "feat: add modern sofa modeling guide

- Complete 3D modeling steps
- Include texture mapping
- Add 3 style variations
- Update README with new guide link"
```

### 4. **プルリクエスト**
```bash
# プッシュ
git push origin feature/furniture-sofa-guide

# PR作成
gh pr create --title "feat: add modern sofa modeling guide" --body "Closes #123"
```

## 📝 スタイルガイド

### コミットメッセージ
```
type(scope): description

body (optional)

footer (optional)
```

**Types:**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: コードスタイル
- `refactor`: リファクタリング
- `test`: テスト
- `chore`: その他

### ファイル命名規則
```
guides/
├── chairs/
│   ├── office-chair-guide.md
│   ├── dining-chair-guide.md
│   └── lounge-chair-guide.md
├── tables/
│   ├── coffee-table-guide.md
│   └── dining-table-guide.md
└── storage/
    ├── bookshelf-guide.md
    └── wardrobe-guide.md
```

### 画像ファイル
```
images/
├── original/
│   ├── chair-reference-01.jpg
│   └── table-reference-01.jpg
└── transformed/
    ├── chair-cartoon-01.jpg
    ├── chair-modern-01.jpg
    └── chair-minimal-01.jpg
```

## 🔍 レビュープロセス

### 1. **自己チェック**
- [ ] コードが動作する
- [ ] ドキュメントが更新されている
- [ ] テストが通る
- [ ] スタイルガイドに準拠

### 2. **レビュー依頼**
- 適切なレビューアーを指定
- 変更点を明確に説明
- スクリーンショットを含める

### 3. **レビュー対応**
- フィードバックに迅速に対応
- 議論は建設的に
- 必要に応じて追加コミット

## 🎨 ガイド作成基準

### 構造
```markdown
# [家具名] モデリングガイド

## 📋 概要
- 制作時間: X時間
- 難易度: ★★★☆☆
- 使用ツール: Blender 4.0+

## 🎯 学習目標
- [具体的な学習目標1]
- [具体的な学習目標2]

## 🛠 制作手順
### 1. 基本形状の作成
### 2. 詳細モデリング
### 3. UV展開
### 4. テクスチャ設定

## 🎨 スタイル変換
### カートゥーンスタイル
### モダンスタイル
### ミニマルスタイル

## 📊 パフォーマンス分析
- ポリゴン数: X
- テクスチャサイズ: X
- 推奨用途: X

## 🔧 トラブルシューティング
### よくある問題1
### よくある問題2
```

### 品質基準
- **画像品質**: 最低1920x1080、PNG形式
- **ポリゴン数**: Roblox最適化を考慮
- **テクスチャ**: 512x512または1024x1024
- **説明**: 初心者でも理解できる詳細さ

## 🏷 ラベル使用方法

### Issue ラベル
- **Priority**: `p-high`, `p-medium`, `p-low`
- **Type**: `type-bug`, `type-feature`, `type-guide`
- **Status**: `status-planning`, `status-in-progress`, `status-review`
- **Category**: `category-chair`, `category-table`, `category-storage`

### PR ラベル
- **Review**: `needs-review`, `approved`, `changes-requested`
- **Size**: `size-small`, `size-medium`, `size-large`

## 🚫 避けるべきこと

- **大きすぎるPR**: 1つのPRで複数の機能を実装
- **不適切なコミットメッセージ**: "fix", "update"など曖昧なメッセージ
- **テストなし**: 新機能にテストを含めない
- **ドキュメント未更新**: コード変更後にドキュメントを更新しない

## 🎉 認定制度

### コントリビューターレベル
- **Bronze**: 初回コントリビューション
- **Silver**: 5回以上のコントリビューション
- **Gold**: 10回以上のコントリビューション + メンター活動
- **Platinum**: プロジェクトリーダー

### 特典
- **READMEへの名前掲載**
- **特別ラベルの付与**
- **レビュー権限の付与**
- **コミュニティ内での表彰**

## 🆘 ヘルプ

### サポートチャンネル
- **Issues**: 技術的な質問
- **Discussions**: 一般的な議論
- **Discord**: リアルタイムチャット（準備中）

### よくある質問
**Q: Blenderの経験がないのですが参加できますか？**
A: はい！ドキュメントの改善や翻訳などでも貢献できます。

**Q: 新しい家具カテゴリを追加したいのですが？**
A: Issue で提案してから着手してください。

**Q: レビューに時間がかかるのですが？**
A: 通常1-3日以内にレビューします。緊急の場合は Issue でお知らせください。

---

**📧 お問い合わせ**: [メール](mailto:contact@example.com)
**🐛 バグ報告**: [Issues](../../issues/new?template=bug_report.md)
**💡 機能要望**: [Issues](../../issues/new?template=feature_request.md)
EOF

echo "✅ 基本ファイルの作成が完了しました"
