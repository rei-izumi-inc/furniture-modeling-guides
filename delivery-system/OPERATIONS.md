# 📚 運用ガイド

## 🎯 日常運用フロー

### 新しい家具ガイドの追加

1. **Issue作成**

   ```bash
   gh issue create --template new_furniture_guide.md \
     --title "[GUIDE] ソファ モデリングガイド作成" \
     --label "type-guide,category-seating,p-medium"
   ```

2. **ブランチ作成**

   ```bash
   git checkout -b feature/sofa-modeling-guide
   mkdir -p guides/seating
   ```

3. **ガイド作成**
   - `guides/seating/sofa-guide.md` を作成
   - 必要な画像を `images/` に配置
   - ガイド構造に従った内容作成

4. **品質チェック**

   ```bash
   # リンクの確認
   markdownlint guides/seating/sofa-guide.md
   
   # 画像の確認
   ls -la images/sofa/
   ```

5. **Pull Request**

   ```bash
   git add .
   git commit -m "feat: add sofa modeling guide with 3 style variations"
   git push origin feature/sofa-modeling-guide
   gh pr create --title "feat: add sofa modeling guide"
   ```

### Issue管理

#### ラベル付けルール

- **Priority**: 緊急度に応じて設定
- **Type**: 作業の種類（guide/bug/feature/improvement）
- **Category**: 家具のカテゴリ
- **Status**: 現在の状態
- **Difficulty**: 作業の難易度

#### 進捗更新

```bash
# Issueの状態更新
gh issue edit 123 --add-label "status-in-progress"
gh issue comment 123 --body "モデリング開始しました。予想完成日：2024/XX/XX"
```

### 自動化システムの監視

#### GitHub Actions の確認

```bash
# ワークフロー状態の確認
gh run list --limit 10

# 失敗したワークフローの詳細
gh run view [RUN_ID]
```

#### PDF生成の確認

- 毎週月曜日2:00 AMに自動実行
- `exports/pdf/` ディレクトリに出力
- 失敗時はIssueで通知

#### パッケージ作成

- リリース作成時に自動実行
- ZIP形式で複数パッケージを生成

## 🛠 メンテナンス

### 月次メンテナンス

1. **依存関係の更新**

   ```bash
   npm update
   git add package*.json
   git commit -m "chore: update dependencies"
   ```

2. **画像の最適化**

   ```bash
   # 大きすぎる画像のリサイズ
   find images -name "*.jpg" -exec identify -format "%f %wx%h\n" {} \; | awk '$2>1920' | cut -d' ' -f1 | xargs -I {} convert {} -resize 1920x {}
   ```

3. **リンクの確認**

   ```bash
   # デッドリンクのチェック
   markdown-link-check guides/**/*.md
   ```

### ユーザー管理

#### 新規コントリビューターのオンボーディング

1. ウェルカムコメントの自動投稿
2. 初回Issue の推奨
3. レビューア の割り当て

#### 権限管理

- **Write権限**: コアコントリビューター
- **Triage権限**: レビューア
- **Read権限**: 一般利用者

## 📊 品質管理

### コードレビュー基準

#### ガイド品質

- [ ] 必須セクションの存在確認
- [ ] 画像の品質・サイズ確認
- [ ] 手順の明確性
- [ ] 3つのスタイル変換

#### 技術品質

- [ ] Markdownの構文確認
- [ ] リンクの動作確認
- [ ] 画像の表示確認
- [ ] メタデータの完整性

### 自動品質チェック

- **Markdown Lint**: 構文・スタイルの統一
- **Link Check**: デッドリンクの検出
- **Image Validation**: 画像ファイルの確認
- **Structure Check**: ガイド構造の検証

## 🚨 トラブルシューティング

### よくある問題と解決法

#### GitHub Actions 失敗

```bash
# ログの確認
gh run view --log [RUN_ID]

# 再実行
gh run rerun [RUN_ID]
```

#### PDF生成エラー

```bash
# ローカルでの確認
wkhtmltopdf --version
npm list marked

# 手動生成
npx marked guides/chairs/office-chair.md > temp.html
wkhtmltopdf temp.html test.pdf
```

#### サイトビルドエラー

```bash
# 依存関係の確認
npm ci

# ローカルビルド
npm run build

# 開発サーバー
npm run dev
```

#### データ移行問題

```bash
# 移行元の確認
ls -la ../../../furniture-image-style-transformer/

# パスの修正
vim scripts/migrate-data.sh
# SOURCE_DIR を実際のパスに修正
```

## 📈 分析とレポート

### 統計情報の取得

#### ガイド統計

```bash
# カテゴリ別ガイド数
find guides -name "*.md" | cut -d'/' -f2 | sort | uniq -c

# 月別作成数
git log --since="1 month ago" --grep="feat.*guide" --oneline | wc -l
```

#### Issue統計

```bash
# 月別Issue作成数
gh issue list --state all --created ">=$(date -v-1m +%Y-%m-%d)" --json number | jq length

# ラベル別統計
gh issue list --label "type-guide" --json number | jq length
```

#### パフォーマンス監視

- サイトの読み込み速度
- 画像の最適化状況
- ビルド時間の推移

### レポート生成

```bash
# 月次レポートの生成
./scripts/generate-monthly-report.sh

# 品質レポート
./scripts/generate-quality-report.sh
```

## 🔄 バックアップとリストア

### データバックアップ

```bash
# 定期バックアップ（外部ストレージ）
tar -czf backup-$(date +%Y%m%d).tar.gz guides/ images/ docs/

# GitHubでのバックアップ
git push --all origin
```

### リストア手順

```bash
# バックアップからの復元
tar -xzf backup-YYYYMMDD.tar.gz

# Gitからの復元
git clone --mirror https://github.com/rei-izumi-inc/furniture-modeling-guides.git
```

## 📞 サポート体制

### エスカレーション手順

1. **Level 1**: FAQ・ドキュメント確認
2. **Level 2**: Issue作成・コミュニティサポート
3. **Level 3**: メンテナー直接連絡

### 連絡先

- **技術的問題**: GitHub Issues
- **緊急事項**: [メール]
- **一般的質問**: GitHub Discussions

---

**定期的な見直しとアップデートを忘れずに！**
