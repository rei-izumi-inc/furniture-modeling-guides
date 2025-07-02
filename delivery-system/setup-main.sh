#!/bin/bash
# setup-main.sh
# Roblox家具モデリングガイド専用リポジトリ メインセットアップ

set -e

echo "🚀 Roblox家具モデリングガイドリポジトリセットアップを開始します..."

# 設定値
REPO_NAME="furniture-modeling-guides"
REPO_DESCRIPTION="Professional Roblox furniture modeling guides with project management integration"
ORG_NAME="rei-izumi-inc"  # rei-izumi-inc 組織でリポジトリを作成

# スクリプトのディレクトリ
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# GitHub CLI の確認
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) がインストールされていません"
    echo "📥 https://cli.github.com/ からインストールしてください"
    exit 1
fi

# 認証確認
if ! gh auth status &> /dev/null; then
    echo "🔐 GitHub認証を行います..."
    gh auth login
fi

echo "📁 新しいリポジトリを作成しています..."

# リポジトリ作成
if [ -n "$ORG_NAME" ]; then
    gh repo create "$ORG_NAME/$REPO_NAME" --public --description "$REPO_DESCRIPTION" --clone
else
    gh repo create "$REPO_NAME" --public --description "$REPO_DESCRIPTION" --clone
fi

cd "$REPO_NAME"

echo "📝 基本ファイル構造を作成しています..."

# ディレクトリ構造作成
mkdir -p {guides,images/{original,transformed},exports/{pdf,zip},docs,scripts,.github/{workflows,ISSUE_TEMPLATE,PULL_REQUEST_TEMPLATE}}

# 各セットアップスクリプトを実行
echo "🏗️ 基本ファイルをセットアップしています..."
bash "$SCRIPT_DIR/scripts/setup-basic-files.sh"

echo "🏷️ ラベルを設定しています..."
bash "$SCRIPT_DIR/scripts/setup-labels.sh"

echo "📋 テンプレートを作成しています..."
bash "$SCRIPT_DIR/scripts/setup-templates.sh"

echo "⚙️ GitHub Actionsを設定しています..."
bash "$SCRIPT_DIR/scripts/setup-workflows.sh"

echo "📖 ドキュメントサイトを構築しています..."
bash "$SCRIPT_DIR/scripts/setup-docs-site.sh"

echo "📦 データ移行を実行しています..."
bash "$SCRIPT_DIR/scripts/migrate-data.sh"

echo "🎯 初期Issueを作成しています..."
bash "$SCRIPT_DIR/scripts/create-initial-issues.sh"

echo "✅ セットアップが完了しました！"
echo ""
echo "📖 ドキュメントサイト: https://$ORG_NAME.github.io/$REPO_NAME/"
echo "📋 Issues: https://github.com/$ORG_NAME/$REPO_NAME/issues"
echo "🎯 Projects: https://github.com/$ORG_NAME/$REPO_NAME/projects"
echo ""
echo "🚀 運用を開始できます！"
