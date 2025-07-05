# 🤝 貢献ガイド

家具モデリングガイドプロジェクトへの貢献をありがとうございます！

## 📝 貢献方法

### 1. 新しいガイドのリクエスト

新しい家具のモデリングガイドが必要な場合：

1. [Issues](../../issues/new/choose) から「新しいガイドのリクエスト」テンプレートを選択
2. 必要な情報を記入して送信
3. メンテナーがレビューして対応を検討します

### 2. 既存ガイドの改善

既存のガイドに問題がある場合：

1. 該当するガイドファイルを直接編集
2. Pull Requestを作成
3. 変更内容を明確に説明

### 3. バグの報告

サイトやガイドに問題がある場合：

1. [Issues](../../issues/new/choose) から「バグレポート」テンプレートを選択
2. 詳細な情報を記入して送信

## 📋 ガイド作成の基準

### 必須項目

- **基本情報**: 家具ID、名前、カテゴリ、ブランド
- **元家具仕様**: 寸法、素材、価格、説明
- **Robloxスタイル変換**: 6つのスタイル（Cartoony、Realistic、Minimalist、Fantasy、Modern、Retro）
- **制作手順**: ステップバイステップの詳細説明
- **参考画像**: 各スタイルの変換済み画像

### 品質基準

- 初心者でも理解できる明確な説明
- Roblox Studioでの実装方法を具体的に記載
- プラットフォーム特有の制約への対応
- 一貫したフォーマットの使用

## 🛠️ 開発環境

### 必要なツール

- Git
- Markdown エディタ
- Roblox Studio
- 画像編集ソフト（GIMP、Photoshop等）

### ローカル開発

```bash
# リポジトリのクローン
git clone https://github.com/rei-izumi-inc/furniture-modeling-guides.git

# 依存関係のインストール
npm install

# TypeScriptビルド
npm run build

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な値を設定

# Roblox画像変換バッチの実行
npm run batch:roblox-transform

# GitHub Issues作成（dry-runモードでテスト）
npm run create:issues:dry-run

# ブランチの作成
git checkout -b feature/new-guide

# 変更のコミット
git add .
git commit -m "Add new guide for [家具名]"

# プッシュ
git push origin feature/new-guide
```

### 自動化ツール

プロジェクトには以下の自動化ツールが含まれています：

**GitHub Issues作成ツール**:
```bash
# 全ガイドをIssueとして一括作成
npm run create:issues

# プレビューモード（実際の作成は行わない）
npm run create:issues:dry-run

# オプション指定での作成
npx ts-node bin/create-issues.ts --limit 10 --labels "priority-high"
```

**Roblox画像変換バッチ**:
```bash
# 全スタイルでの画像変換
npm run batch:roblox-transform

# 特定オプションでの実行
npx ts-node bin/roblox-transform.ts
```

## 🎨 画像ガイドライン

### 画像仕様

- **フォーマット**: PNG推奨
- **解像度**: 最低 800x600px
- **ファイルサイズ**: 2MB以下
- **命名規則**: `{UUID}_{ブランド}_{カテゴリ}_{家具名}_{スタイル}.png`
- **保存場所**: `output/roblox-transformed/` (変換後画像), `output/original-images/` (元画像)

### スタイル定義

- **Cartoony**: 明るい色、デフォルメされた形状、親しみやすいデザイン
- **Realistic**: リアルな質感、実際の家具に近い外観
- **Minimalist**: シンプル、モノトーン、クリーンなライン
- **Fantasy**: ファンタジー風、装飾的、魔法的な要素
- **Modern**: 現代的なデザイン、洗練された形状
- **Retro**: レトロ風、ヴィンテージ、懐かしいデザイン

## 📖 マークダウン形式

```markdown
# Roblox向け家具制作ガイド: [家具名]

## 基本情報
- **家具ID**: 
- **家具名**: 
- **カテゴリ**: 
- **ブランド**: 
- **制作日**: 

## 元家具仕様
![元画像](../output/original-images/[ファイル名])

- **寸法**: 
- **素材**: 
- **価格**: 
- **説明**: 

## Robloxスタイル変換

### Cartoonyスタイル
![Cartoony](../output/roblox-transformed/[ファイル名])
[制作手順]

### Realisticスタイル
![Realistic](../output/roblox-transformed/[ファイル名])
[制作手順]

### Minimalistスタイル
![Minimalist](../output/roblox-transformed/[ファイル名])
[制作手順]

### Fantasyスタイル
![Fantasy](../output/roblox-transformed/[ファイル名])
[制作手順]

### Modernスタイル
![Modern](../output/roblox-transformed/[ファイル名])
[制作手順]

### Retroスタイル
![Retro](../output/roblox-transformed/[ファイル名])
[制作手順]

## 制作のポイント
[重要なポイントを記載]

## トラブルシューティング
[よくある問題と解決方法]
```

## 📞 サポート

質問やサポートが必要な場合：

- [Issues](../../issues) で質問を投稿
- [Discussions](../../discussions) でコミュニティと議論
- [@shinobu](https://github.com/shinobu) に直接連絡

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。貢献した内容も同じライセンスが適用されます。

---

**ありがとうございます！** あなたの貢献がRobloxモデラーコミュニティの成長に大きく貢献します。
