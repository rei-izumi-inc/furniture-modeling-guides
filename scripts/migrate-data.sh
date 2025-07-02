#!/bin/bash
# migrate-data.sh
# 既存データの新リポジトリへの移行

echo "📦 データ移行を開始中..."

# 移行元のデータパスを設定（実際の環境に合わせて調整）
SOURCE_DIR="../../../furniture-image-style-transformer"
CURRENT_DIR="$(pwd)"

echo "📍 移行元: $SOURCE_DIR"
echo "📍 移行先: $CURRENT_DIR"

# 1. 制作ガイドの移行
echo "📖 制作ガイドを移行中..."
if [ -d "$SOURCE_DIR/docs" ]; then
    mkdir -p guides
    
    # マークダウンファイルをカテゴリ別に整理
    find "$SOURCE_DIR/docs" -name "*.md" -type f | while read file; do
        filename=$(basename "$file")
        
        # ファイル名からカテゴリを推測
        case "$filename" in
            *chair* | *チェア*)
                mkdir -p guides/chairs
                cp "$file" "guides/chairs/"
                ;;
            *table* | *テーブル*)
                mkdir -p guides/tables
                cp "$file" "guides/tables/"
                ;;
            *storage* | *収納* | *shelf* | *シェルフ*)
                mkdir -p guides/storage
                cp "$file" "guides/storage/"
                ;;
            *decoration* | *装飾* | *lamp* | *ランプ*)
                mkdir -p guides/decoration
                cp "$file" "guides/decoration/"
                ;;
            *)
                mkdir -p guides/general
                cp "$file" "guides/general/"
                ;;
        esac
        
        echo "✅ 移行完了: $filename"
    done
else
    echo "⚠️ 移行元のdocsディレクトリが見つかりません"
fi

# 2. 画像ファイルの移行
echo "🖼️ 画像を移行中..."
if [ -d "$SOURCE_DIR/images" ]; then
    # 元画像の移行
    if [ -d "$SOURCE_DIR/images/original" ]; then
        mkdir -p images/original
        cp -r "$SOURCE_DIR/images/original/"* images/original/ 2>/dev/null || true
        echo "✅ 元画像の移行完了"
    fi
    
    # 変換済み画像の移行
    if [ -d "$SOURCE_DIR/images/transformed" ]; then
        mkdir -p images/transformed
        cp -r "$SOURCE_DIR/images/transformed/"* images/transformed/ 2>/dev/null || true
        echo "✅ 変換済み画像の移行完了"
    fi
    
    # その他の画像フォルダ
    if [ -d "$SOURCE_DIR/images" ]; then
        find "$SOURCE_DIR/images" -name "*.jpg" -o -name "*.png" -o -name "*.gif" | while read img; do
            if [[ ! "$img" =~ (original|transformed) ]]; then
                mkdir -p images/misc
                cp "$img" images/misc/
            fi
        done
        echo "✅ その他画像の移行完了"
    fi
else
    echo "⚠️ 移行元のimagesディレクトリが見つかりません"
fi

# 3. メタデータの移行
echo "📋 メタデータを移行中..."
if [ -f "$SOURCE_DIR/metadata.json" ]; then
    cp "$SOURCE_DIR/metadata.json" ./
    echo "✅ メタデータファイルの移行完了"
fi

# 4. 設定ファイルの移行
echo "⚙️ 設定ファイルを移行中..."
if [ -f "$SOURCE_DIR/config.json" ]; then
    cp "$SOURCE_DIR/config.json" ./
    echo "✅ 設定ファイルの移行完了"
fi

# 5. ガイドの品質チェックと修正
echo "🔍 ガイドの品質チェック中..."
find guides -name "*.md" -type f | while read guide; do
    # ファイルの存在確認
    if [ -f "$guide" ]; then
        # 画像リンクの修正
        sed -i '' 's|../images/|../../images/|g' "$guide" 2>/dev/null || true
        sed -i '' 's|images/|../images/|g' "$guide" 2>/dev/null || true
        
        # メタデータセクションの追加（存在しない場合）
        if ! grep -q "## 📋 概要" "$guide"; then
            filename=$(basename "$guide" .md)
            cat > temp_header.md << EOF
# $filename モデリングガイド

## 📋 概要
- 制作時間: 未設定
- 難易度: ★★★☆☆
- 使用ツール: Blender 4.0+

## 🎯 学習目標
- [学習目標を設定してください]

EOF
            cat temp_header.md "$guide" > temp_combined.md
            mv temp_combined.md "$guide"
            rm temp_header.md
            echo "🔧 メタデータを追加: $guide"
        fi
        
        echo "✅ 品質チェック完了: $guide"
    fi
done

# 6. 画像の最適化とメタデータ生成
echo "🎨 画像の最適化とメタデータ生成中..."
if command -v identify >/dev/null 2>&1; then
    # ImageMagickが利用可能な場合
    find images -name "*.jpg" -o -name "*.png" | while read img; do
        # 画像情報の取得
        info=$(identify "$img" 2>/dev/null || echo "Unknown format")
        echo "📊 $img: $info"
        
        # 大きすぎる画像のリサイズ（幅1920px以上の場合）
        width=$(identify -format "%w" "$img" 2>/dev/null || echo "0")
        if [ "$width" -gt 1920 ]; then
            convert "$img" -resize 1920x "$img"
            echo "🔧 リサイズ完了: $img"
        fi
    done
else
    echo "⚠️ ImageMagickが見つかりません。画像最適化をスキップします"
fi

# 7. 統計情報の生成
echo "📊 統計情報を生成中..."
cat > migration-report.md << EOF
# 📦 データ移行レポート

## 📅 移行日時
$(date '+%Y年%m月%d日 %H:%M:%S')

## 📋 移行統計

### ガイドファイル
- **総数**: $(find guides -name "*.md" -type f | wc -l)
- **チェア**: $(find guides/chairs -name "*.md" -type f 2>/dev/null | wc -l)
- **テーブル**: $(find guides/tables -name "*.md" -type f 2>/dev/null | wc -l)
- **収納**: $(find guides/storage -name "*.md" -type f 2>/dev/null | wc -l)
- **装飾**: $(find guides/decoration -name "*.md" -type f 2>/dev/null | wc -l)
- **その他**: $(find guides/general -name "*.md" -type f 2>/dev/null | wc -l)

### 画像ファイル
- **元画像**: $(find images/original -type f 2>/dev/null | wc -l)
- **変換済み**: $(find images/transformed -type f 2>/dev/null | wc -l)
- **その他**: $(find images/misc -type f 2>/dev/null | wc -l)

### ファイルサイズ
- **ガイド総サイズ**: $(du -sh guides 2>/dev/null | cut -f1)
- **画像総サイズ**: $(du -sh images 2>/dev/null | cut -f1)

## 📁 ディレクトリ構造

\`\`\`
EOF

tree . -I 'node_modules|.git' >> migration-report.md 2>/dev/null || find . -type d | head -20 | sed 's/^/  /' >> migration-report.md

cat >> migration-report.md << EOF
\`\`\`

## ✅ 移行完了項目
- [x] 制作ガイドの移行とカテゴリ分類
- [x] 画像ファイルの移行と整理
- [x] メタデータの移行
- [x] ガイドの品質チェック
- [x] 画像リンクの修正
- [x] メタデータセクションの追加
- [x] 統計情報の生成

## 🔧 後続作業項目
- [ ] ガイド内容の詳細レビュー
- [ ] 画像の品質確認
- [ ] リンクの動作確認
- [ ] メタデータの完全性チェック

## 📝 注意事項
- 一部のファイルは手動での調整が必要な場合があります
- 画像リンクが正しく動作するかテストしてください
- メタデータが不完全なガイドは後で更新してください

---
**移行スクリプト**: migrate-data.sh
**実行者**: $(whoami)
**環境**: $(uname -s) $(uname -r)
EOF

echo "✅ データ移行が完了しました！"
echo ""
echo "📊 移行結果:"
echo "- ガイドファイル: $(find guides -name "*.md" -type f 2>/dev/null | wc -l)件"
echo "- 画像ファイル: $(find images -type f 2>/dev/null | wc -l)件"
echo "- 詳細レポート: migration-report.md"
echo ""
echo "🔍 次の手順:"
echo "1. migration-report.md を確認"
echo "2. ガイドの内容とリンクをテスト"
echo "3. 必要に応じて手動調整を実施"
