#!/bin/bash
# setup-workflows.sh
# GitHub Actions ワークフローの設定

echo "⚙️ GitHub Actions ワークフローを作成中..."

# 1. GitHub Pages デプロイワークフロー
cat > .github/workflows/deploy-pages.yml << 'EOF'
name: 🌐 Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout
      uses: actions/checkout@v4
      
    - name: 🔧 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: 📦 Install dependencies
      run: npm ci
      
    - name: 🏗️ Build site
      run: npm run build
      
    - name: 📋 Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./dist
        
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
      
    steps:
    - name: 🚀 Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
EOF

# 2. PDF 生成ワークフロー
cat > .github/workflows/generate-pdfs.yml << 'EOF'
name: 📄 Generate PDF Guides

on:
  push:
    branches: [ main ]
    paths: [ 'guides/**/*.md' ]
  workflow_dispatch:
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday 2:00 AM

jobs:
  generate-pdfs:
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout
      uses: actions/checkout@v4
      
    - name: 🔧 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        
    - name: 📦 Install dependencies
      run: |
        npm ci
        sudo apt-get update
        sudo apt-get install -y wkhtmltopdf
        
    - name: 📄 Generate PDFs
      run: |
        mkdir -p exports/pdf
        
        # 各ガイドをPDFに変換
        for guide in guides/**/*.md; do
          if [ -f "$guide" ]; then
            filename=$(basename "$guide" .md)
            category=$(dirname "$guide" | sed 's/guides\///')
            
            echo "🔄 Converting $guide to PDF..."
            
            # Markdown to HTML
            npx marked "$guide" > "temp_${filename}.html"
            
            # HTML to PDF with styling
            wkhtmltopdf \
              --page-size A4 \
              --margin-top 0.75in \
              --margin-right 0.75in \
              --margin-bottom 0.75in \
              --margin-left 0.75in \
              --encoding UTF-8 \
              --print-media-type \
              "temp_${filename}.html" \
              "exports/pdf/${category}-${filename}.pdf"
              
            rm "temp_${filename}.html"
          fi
        done
        
    - name: 📊 Generate PDF index
      run: |
        cat > exports/pdf/README.md << 'EOFPDF'
# 📄 PDF ガイド一覧

このディレクトリには、各種家具モデリングガイドのPDF版が含まれています。

## 📋 利用可能なガイド

EOFPDF
        
        for pdf in exports/pdf/*.pdf; do
          if [ -f "$pdf" ]; then
            filename=$(basename "$pdf")
            echo "- [$filename](./$filename)" >> exports/pdf/README.md
          fi
        done
        
        cat >> exports/pdf/README.md << 'EOFPDF'

## 📥 ファイルサイズ

EOFPDF
        
        du -h exports/pdf/*.pdf | sort -hr >> exports/pdf/README.md
        
    - name: 📤 Commit and push
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add exports/pdf/
        git diff --staged --quiet || git commit -m "📄 Auto-update PDF guides"
        git push
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
EOF

# 3. ZIP パッケージ生成ワークフロー
cat > .github/workflows/create-packages.yml << 'EOF'
name: 📦 Create Distribution Packages

on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      version:
        description: 'Package version'
        required: true
        default: 'latest'

jobs:
  create-packages:
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout
      uses: actions/checkout@v4
      
    - name: 🏷️ Set version
      id: version
      run: |
        if [ "${{ github.event_name }}" = "release" ]; then
          echo "version=${{ github.event.release.tag_name }}" >> $GITHUB_OUTPUT
        else
          echo "version=${{ github.event.inputs.version }}" >> $GITHUB_OUTPUT
        fi
        
    - name: 📦 Create packages
      run: |
        mkdir -p exports/zip
        version="${{ steps.version.outputs.version }}"
        
        # Complete package
        echo "📦 Creating complete package..."
        zip -r "exports/zip/furniture-modeling-guides-complete-${version}.zip" \
          guides/ \
          images/ \
          docs/ \
          README.md \
          LICENSE \
          CONTRIBUTING.md \
          -x "*.git*" "node_modules/*" ".DS_Store"
          
        # Guides only
        echo "📖 Creating guides-only package..."
        zip -r "exports/zip/furniture-modeling-guides-docs-${version}.zip" \
          guides/ \
          docs/ \
          README.md \
          -x "*.git*" ".DS_Store"
          
        # Images only
        echo "🎨 Creating images-only package..."
        zip -r "exports/zip/furniture-modeling-guides-images-${version}.zip" \
          images/ \
          -x "*.git*" ".DS_Store"
          
        # PDF package (if exists)
        if [ -d "exports/pdf" ]; then
          echo "📄 Creating PDF package..."
          zip -r "exports/zip/furniture-modeling-guides-pdf-${version}.zip" \
            exports/pdf/ \
            -x "*.git*" ".DS_Store"
        fi
        
    - name: 📊 Generate package info
      run: |
        cat > exports/zip/README.md << 'EOFZIP'
# 📦 配布パッケージ

## 📋 利用可能なパッケージ

### 完全版パッケージ
すべてのガイド、画像、ドキュメントを含む完全版です。

### ドキュメントのみ
マークダウンガイドとドキュメントのみのパッケージです。

### 画像のみ  
参考画像とスタイル変換済み画像のみのパッケージです。

### PDF版
すべてのガイドをPDF形式で提供するパッケージです。

## 📥 ファイルサイズ

EOFZIP
        
        for zip in exports/zip/*.zip; do
          if [ -f "$zip" ]; then
            filename=$(basename "$zip")
            size=$(du -h "$zip" | cut -f1)
            echo "- **$filename**: $size" >> exports/zip/README.md
          fi
        done
        
        cat >> exports/zip/README.md << 'EOFZIP'

## 🔧 使用方法

1. 目的に応じてパッケージをダウンロード
2. ZIP ファイルを解凍
3. README.md を確認して使用開始

## 📅 更新履歴

パッケージは以下のタイミングで自動更新されます：
- リリース作成時
- 手動トリガー時

## 📝 備考

- すべてのパッケージにはライセンス情報が含まれています
- 最新版は常にリポジトリで確認してください
EOFZIP

    - name: ⬆️ Upload packages to release
      if: github.event_name == 'release'
      uses: softprops/action-gh-release@v1
      with:
        files: exports/zip/*.zip
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        
    - name: 📤 Commit packages
      if: github.event_name != 'release'
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add exports/zip/
        git diff --staged --quiet || git commit -m "📦 Auto-update distribution packages"
        git push
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
EOF

# 4. Issue 自動管理ワークフロー
cat > .github/workflows/issue-management.yml << 'EOF'
name: 🎯 Issue Management

on:
  issues:
    types: [opened, edited, closed, reopened]
  issue_comment:
    types: [created]
  pull_request:
    types: [opened, closed, merged]

jobs:
  auto-label:
    if: github.event.action == 'opened'
    runs-on: ubuntu-latest
    
    steps:
    - name: 🏷️ Auto-label issues
      uses: actions/github-script@v7
      with:
        script: |
          const issue = context.payload.issue;
          const title = issue.title.toLowerCase();
          const body = issue.body.toLowerCase();
          
          const labels = [];
          
          // カテゴリ自動判定
          if (title.includes('chair') || body.includes('chair')) {
            labels.push('category-chair');
          }
          if (title.includes('table') || body.includes('table')) {
            labels.push('category-table');
          }
          if (title.includes('storage') || body.includes('storage')) {
            labels.push('category-storage');
          }
          
          // 難易度自動判定
          if (body.includes('beginner')) {
            labels.push('difficulty-beginner');
          }
          if (body.includes('advanced')) {
            labels.push('difficulty-advanced');
          }
          
          // スタイル自動判定
          if (body.includes('cartoon')) {
            labels.push('style-cartoon');
          }
          if (body.includes('modern')) {
            labels.push('style-modern');
          }
          if (body.includes('minimal')) {
            labels.push('style-minimal');
          }
          
          if (labels.length > 0) {
            await github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issue.number,
              labels: labels
            });
          }

  stale-check:
    runs-on: ubuntu-latest
    
    steps:
    - name: 🕒 Mark stale issues
      uses: actions/stale@v9
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        stale-issue-message: |
          🕒 この Issue は30日間アクティビティがありません。
          まだ有効な場合は、コメントを追加してください。
          そうでなければ、7日後に自動的にクローズされます。
        stale-pr-message: |
          🕒 この Pull Request は30日間アクティビティがありません。
          まだ有効な場合は、コメントを追加してください。
          そうでなければ、7日後に自動的にクローズされます。
        close-issue-message: |
          🔒 アクティビティがないため、この Issue をクローズしました。
          必要に応じて再開してください。
        close-pr-message: |
          🔒 アクティビティがないため、この Pull Request をクローズしました。
          必要に応じて再開してください。
        days-before-stale: 30
        days-before-close: 7
        stale-issue-label: 'status-stale'
        stale-pr-label: 'status-stale'
        exempt-issue-labels: 'status-pinned,type-discussion'
        exempt-pr-labels: 'status-pinned,work-in-progress'

  welcome-new-contributors:
    if: github.event.action == 'opened' && github.event.issue.author_association == 'FIRST_TIME_CONTRIBUTOR'
    runs-on: ubuntu-latest
    
    steps:
    - name: 👋 Welcome new contributors
      uses: actions/github-script@v7
      with:
        script: |
          const welcomeMessage = `
          👋 **初回コントリビューションありがとうございます！**
          
          🎉 このプロジェクトへの最初の貢献を歓迎します！
          
          📚 **はじめる前に：**
          - [コントリビューションガイド](./CONTRIBUTING.md) をご確認ください
          - [プロジェクトの概要](./README.md) をお読みください
          - 質問があれば遠慮なくコメントしてください
          
          🏷️ **ラベルについて：**
          - 自動的にラベルが付与されます
          - 不適切な場合はメンテナーが調整します
          
          ⏰ **レスポンス予定：**
          - 通常1-3営業日以内にレスポンスします
          - 緊急の場合は Issue に \"urgent\" とコメントしてください
          
          🙏 再度、コントリビューションありがとうございます！
          `;
          
          await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.payload.issue.number,
            body: welcomeMessage
          });
EOF

# 5. 品質チェック ワークフロー
cat > .github/workflows/quality-check.yml << 'EOF'
name: 🔍 Quality Check

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint-markdown:
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout
      uses: actions/checkout@v4
      
    - name: 🔧 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        
    - name: 📦 Install dependencies
      run: npm ci
      
    - name: 📝 Lint Markdown
      run: |
        npm install -g markdownlint-cli
        markdownlint guides/**/*.md docs/**/*.md README.md CONTRIBUTING.md

  check-links:
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout
      uses: actions/checkout@v4
      
    - name: 🔗 Check links
      uses: gaurav-nelson/github-action-markdown-link-check@v1
      with:
        use-quiet-mode: 'yes'
        use-verbose-mode: 'yes'
        config-file: '.markdown-linkcheck.json'

  validate-images:
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout
      uses: actions/checkout@v4
      
    - name: 🖼️ Validate images
      run: |
        echo "🔍 Checking image files..."
        
        # 画像ファイルの存在確認
        find guides/ -name "*.md" -exec grep -l "!\[.*\](" {} \; | while read file; do
          echo "📝 Checking images in: $file"
          grep -o "!\[.*\]([^)]*)" "$file" | sed 's/.*(\([^)]*\)).*/\1/' | while read img; do
            if [[ $img == http* ]]; then
              echo "🌐 External image: $img"
            else
              if [ ! -f "$img" ]; then
                echo "❌ Missing image: $img in $file"
                exit 1
              else
                echo "✅ Found: $img"
              fi
            fi
          done
        done
        
        # 未使用画像の検出
        echo "🔍 Checking for unused images..."
        find images/ -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" \) | while read img; do
          if ! grep -r "$(basename "$img")" guides/ docs/ README.md CONTRIBUTING.md >/dev/null 2>&1; then
            echo "⚠️ Potentially unused image: $img"
          fi
        done

  check-guide-structure:
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout
      uses: actions/checkout@v4
      
    - name: 📋 Validate guide structure
      run: |
        echo "📋 Validating guide structure..."
        
        for guide in guides/**/*.md; do
          if [ -f "$guide" ]; then
            echo "🔍 Checking: $guide"
            
            # 必須セクションの確認
            if ! grep -q "## 📋 概要" "$guide"; then
              echo "❌ Missing '概要' section in $guide"
              exit 1
            fi
            
            if ! grep -q "## 🛠 制作手順" "$guide"; then
              echo "❌ Missing '制作手順' section in $guide"
              exit 1
            fi
            
            if ! grep -q "## 🎨 スタイル変換" "$guide"; then
              echo "❌ Missing 'スタイル変換' section in $guide"
              exit 1
            fi
            
            echo "✅ Structure valid: $guide"
          fi
        done

  spell-check:
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout
      uses: actions/checkout@v4
      
    - name: 📖 Spell check
      uses: rojopolis/spellcheck-github-actions@0.35.0
      with:
        config_path: .spellcheck.yml
        task_name: Markdown
EOF

echo "✅ GitHub Actions ワークフローの作成が完了しました！"

# ワークフロー一覧表示
echo "📋 作成されたワークフロー:"
echo "• 🌐 GitHub Pages デプロイ"
echo "• 📄 PDF ガイド生成"
echo "• 📦 配布パッケージ作成"
echo "• 🎯 Issue 自動管理"
echo "• 🔍 品質チェック"
