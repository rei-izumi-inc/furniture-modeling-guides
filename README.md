# 🪑 家具モデリングガイド / Furniture Modeling Guides

Roblox向け家具3Dモデル作成のための包括的なガイドコレクションです。

## 📚 ガイド一覧

現在、**50件以上**のRoblox向け家具モデリングガイドを提供しています：

- 🪑 **チェア・椅子類** - 各種デザインチェア、オフィスチェア、フロアチェアなど
- 🛏️ **ベッド・寝具** - ベッド、ベッドパッド、掛け布団カバー、まくらカバーなど
- 🛋️ **ソファ・カウチ** - ソファ、カウチ、オットマンなど
- 🍽️ **テーブル・デスク** - ダイニングテーブル、デスク、ラグなど
- 💡 **照明器具** - USBランプ、各種照明器具
- 🔧 **小物・アクセサリー** - ツマミ、その他の装飾品

各ガイドには6つのスタイル（Cartoony、Realistic、Minimalist、Fantasy、Modern、Retro）の変換済み画像が含まれています。

## 🎯 対象読者

- Robloxでの3Dモデル作成初心者
- 既存のモデリング経験者でRoblox特有の要件を学びたい方
- チーム開発で一貫したモデリング品質を保ちたいプロジェクト

## 🚀 はじめ方

1. **[ガイド一覧](output/markdown-reports/)** から制作したい家具を選択
2. マークダウンファイルを開いて詳細な制作手順を確認
3. [`output/original-images/`](output/original-images/) から元画像、[`output/roblox-transformed/`](output/roblox-transformed/) から参考画像をダウンロード
4. ステップバイステップの手順に従ってモデリング

## 📁 リポジトリ構造

```text
furniture-modeling-guides/
├── output/
│   ├── markdown-reports/      # 50件以上のモデリングガイド
│   ├── original-images/       # 元の家具画像
│   ├── roblox-transformed/    # 6スタイル変換済み画像
│   ├── data/                  # 処理済みデータ
│   └── reports/               # バッチ処理レポート
├── src/                       # ソースコード
├── bin/                       # 実行可能スクリプト
├── scripts/utilities/         # ユーティリティスクリプト
├── archive/                   # アーカイブ
├── docs/                      # 技術ドキュメント
└── templates/                 # テンプレート（将来用）
```

## 📋 プロジェクト管理

- **[Projects](../../projects)** - 全体の進捗状況
- **[Issues](../../issues)** - 各ガイドの詳細とディスカッション
- **[Milestones](../../milestones)** - リリース計画

## 🔧 技術仕様

### システム機能

- **BigQuery連携**: 家具データの自動取得・分析
- **OpenAI画像生成**: 6つのRobloxスタイル画像を自動生成
- **マークダウン生成**: ガイドの自動生成
- **バッチ処理**: 大量データの効率的処理

### ガイド内容

- **詳細な制作手順** - ステップバイステップの説明
- **寸法・素材情報** - 元家具の仕様
- **Roblox最適化** - プラットフォーム特有の考慮点
- **6つのスタイル** - Cartoony、Realistic、Minimalist、Fantasy、Modern、Retro

### 画像アセット

- **元画像** - 実際の家具写真（`output/original-images/`）
- **変換済み画像** - Robloxスタイル別の参考画像（`output/roblox-transformed/`）
- **高解像度** - モデリング作業に適した画質

## 🚀 セットアップ

### 前提条件

- Node.js 18.0+
- TypeScript
- Google Cloud アカウント（BigQuery用）
- OpenAI APIキー

### インストール

```bash
# 依存関係のインストール
npm install

# TypeScriptのビルド
npm run build

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な値を設定
```

### 認証設定

1. Google Cloud Service Accountキーを取得
2. `credentials/service-account-key.json` として保存
3. OpenAI APIキーを `.env` に設定

### 使用方法

```bash
# Roblox画像変換（全スタイル）
npm run batch:roblox-transform

# 個別バッチの実行も可能
npx ts-node bin/roblox-transform.ts

# ユーティリティスクリプトの実行
npx ts-node scripts/utilities/[スクリプト名].ts
```

## 🤝 コントリビューション

ガイドの改善提案や新しいガイドのリクエストは、Issueまたはプルリクエストでお気軽にお寄せください。

### 貢献方法

1. 新しいガイドのリクエスト → Issue作成
2. 既存ガイドの改善 → Pull Request
3. バグ報告 → Issue作成
4. フィードバック → Discussions

## 📄 ライセンス

このプロジェクトは[MIT License](LICENSE)の下で公開されています。

## 📊 統計

- **ガイド総数**: 50件以上
- **画像総数**: 300枚以上（6スタイル × 50件以上）
- **対応スタイル**: 6スタイル（Cartoony、Realistic、Minimalist、Fantasy、Modern、Retro）
- **対応ブランド**: Francfranc
- **最終更新**: 2025年7月5日

---

**開発組織**: [Rei Izumi Inc.](https://github.com/rei-izumi-inc)  
**メンテナー**: [@shinobu](https://github.com/shinobu)  
**技術スタック**: Roblox Studio, BigQuery, OpenAI API
