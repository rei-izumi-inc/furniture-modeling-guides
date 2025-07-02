#!/bin/bash
# create-initial-issues.sh
# 初期Issueとプロジェクトボードの作成

echo "🎯 初期Issueとプロジェクトを作成中..."

# 1. プロジェクトボードの作成
echo "📋 プロジェクトボードを作成中..."
project_id=$(gh project create --title "🎯 家具モデリング制作管理" --body "家具モデリングガイドの制作・管理・品質保証を統合的に管理するプロジェクトボード")

if [ $? -eq 0 ]; then
    echo "✅ プロジェクトボード作成完了: $project_id"
else
    echo "⚠️ プロジェクトボード作成をスキップ（手動で作成してください）"
fi

# 2. マイルストーンの作成
echo "🏁 マイルストーンを作成中..."
gh api repos/:owner/:repo/milestones \
  --method POST \
  --field title="v1.0 - 基本ガイド完成" \
  --field description="基本的な家具カテゴリのガイドを完成させる" \
  --field due_on="$(date -v+3m -u +%Y-%m-%dT%H:%M:%SZ)" \
  --field state="open" >/dev/null 2>&1

gh api repos/:owner/:repo/milestones \
  --method POST \
  --field title="v1.1 - スタイル拡張" \
  --field description="全スタイル変換の品質向上と新スタイル追加" \
  --field due_on="$(date -v+6m -u +%Y-%m-%dT%H:%M:%SZ)" \
  --field state="open" >/dev/null 2>&1

gh api repos/:owner/:repo/milestones \
  --method POST \
  --field title="v2.0 - 高度な機能" \
  --field description="アニメーション、インタラクション機能の追加" \
  --field due_on="$(date -v+12m -u +%Y-%m-%dT%H:%M:%SZ)" \
  --field state="open" >/dev/null 2>&1

echo "✅ マイルストーン作成完了"

# 3. 基本的なIssueテンプレートのテスト
echo "📝 基本Issueを作成中..."

# Issue 1: ウェルカムIssue
gh issue create \
  --title "🎉 プロジェクト開始のお知らせ" \
  --body "## 🎯 プロジェクト概要

このリポジトリは、Roblox向け家具3Dモデルの制作を効率化するための統合システムです。

## 🌟 主要機能
- **📖 制作ガイド**: 20件以上の詳細な制作指針
- **🎨 スタイル変換**: カートゥーン、モダン、ミニマルの3スタイル
- **📊 プロジェクト管理**: GitHub Issues/Projects完全統合
- **🌐 Webサイト**: 美しいドキュメントサイト
- **📦 自動化**: PDF/ZIP出力、進捗管理の完全自動化

## 🚀 はじめ方

### モデラーの方
1. [Issues](../../issues) で制作予定を確認
2. [プロジェクトボード](../../projects) で進捗を追跡
3. [ガイドサイト](https://YOUR-USERNAME.github.io/furniture-modeling-guides/) で詳細情報を確認

### 管理者の方
1. 新規家具追加: Issues テンプレートを使用
2. 進捗管理: Projects ボードで状況把握
3. 品質管理: Pull Request レビューで品質確保

## 📚 リソース
- **制作ガイド**: [docs/modeling-guide.md](docs/modeling-guide.md)
- **コントリビューション**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **よくある質問**: [docs/faq.md](docs/faq.md)

## 🤝 参加方法
このプロジェクトへの参加を歓迎します！
- 🐛 バグ報告: [Bug Report テンプレート](../../issues/new?template=bug_report.md)
- 💡 機能要望: [Feature Request テンプレート](../../issues/new?template=feature_request.md)
- 🪑 新ガイド: [New Furniture Guide テンプレート](../../issues/new?template=new_furniture_guide.md)

皆様のご参加をお待ちしています！" \
  --label "type-documentation,status-pinned,p-high" \
  --pin

# Issue 2: 最初の家具ガイド作成例
gh issue create \
  --title "🪑 [GUIDE] オフィスチェア モデリングガイド作成" \
  --body "## 📋 家具情報

### 基本情報
- **家具名**: オフィスチェア
- **カテゴリ**: chair
- **難易度**: intermediate
- **推定制作時間**: 4時間

### 参考資料
- **参考画像**: 一般的なオフィスチェアの形状
- **参考URL**: https://example.com/office-chair-reference
- **類似ガイド**: なし（初回作成）

## 🎯 制作内容

### 必須要素
- [x] 基本モデリング手順
- [x] UV展開とテクスチャ設定
- [x] 3つのスタイル変換（カートゥーン、モダン、ミニマル）
- [x] パフォーマンス分析
- [x] トラブルシューティング

### 追加要素（任意）
- [ ] 回転アニメーション設定
- [ ] 高さ調節バリエーション
- [ ] 高度なマテリアル設定
- [ ] ライティング設定例

## 🎨 スタイル要件

### カートゥーンスタイル
- 鮮やかな色彩（ブルー/レッド系）
- 丸みを帯びた形状
- シンプルなディテール

### モダンスタイル
- モノトーン色彩
- シャープなエッジ
- リアルなレザーテクスチャ

### ミニマルスタイル
- ホワイト/グレー基調
- 装飾的要素なし
- 基本的な形状のみ

## 📊 技術要件

### パフォーマンス目標
- **ポリゴン数**: 2000以下
- **テクスチャサイズ**: 1024x1024
- **描画負荷**: Roblox最適化

## 📅 スケジュール
- **開始予定**: $(date '+%Y/%m/%d')
- **完成予定**: $(date -v+1w '+%Y/%m/%d')
- **レビュー期間**: 3日間

## ✅ チェックリスト

### 着手前
- [x] 参考資料の収集完了
- [x] 制作環境の準備完了
- [x] スケジュール調整完了

### 制作中
- [ ] 基本モデリング完了
- [ ] UV展開完了
- [ ] テクスチャ設定完了
- [ ] スタイル変換完了

### 完成後
- [ ] 動作テスト完了
- [ ] ドキュメント作成完了
- [ ] レビュー対応完了
- [ ] 最終チェック完了" \
  --label "type-guide,category-chair,difficulty-intermediate,status-planning,p-high" \
  --milestone "v1.0 - 基本ガイド完成"

# Issue 3: ドキュメントサイトの改善
gh issue create \
  --title "🌐 [IMPROVEMENT] ドキュメントサイトのUX改善" \
  --body "## 🔧 改善対象
GitHub Pages ドキュメントサイトのユーザーエクスペリエンス

## 📊 現状の問題点

### 問題点1: ナビゲーション
- **内容**: メニューが分かりにくい
- **影響**: ユーザーが目的のガイドを見つけにくい
- **頻度**: 常時

### 問題点2: 検索機能
- **内容**: サイト内検索が不十分
- **影響**: 大量のガイドから目的のものを探すのが困難
- **頻度**: ガイド数増加に伴い悪化

## 💡 改善提案

### 主要な改善点
1. **カテゴリ別フィルタリング機能の強化**
2. **検索機能の実装**
3. **レスポンシブデザインの最適化**
4. **ローディング速度の改善**

### 実装方法
- JavaScript による動的フィルタリング
- Fuse.js を使った高速検索
- 画像の遅延読み込み
- CSS の最適化

## 📈 期待される効果

### 定量的効果
- **検索時間短縮**: 50%削減
- **ページ表示速度**: 30%向上
- **モバイル利便性**: 70%向上

### 定性的効果
- **ユーザビリティ**: 直感的な操作
- **アクセシビリティ**: より多くのユーザーに対応
- **SEO**: 検索エンジン最適化

## 📋 実装計画

### Phase 1: 準備
- [x] 詳細設計
- [x] 影響範囲調査
- [ ] テストケース作成

### Phase 2: 実装
- [ ] フィルタリング機能実装
- [ ] 検索機能実装
- [ ] レスポンシブ対応

### Phase 3: リリース
- [ ] 動作確認
- [ ] ドキュメント更新
- [ ] ユーザー通知

## 🔍 検証方法

### テスト項目
- [ ] 各ブラウザでの動作確認
- [ ] モバイルデバイスでの確認
- [ ] パフォーマンステスト

### 成功基準
- [ ] 全機能が正常動作
- [ ] 表示速度3秒以内
- [ ] モバイル対応完了

## 📅 スケジュール
- **開始予定**: $(date '+%Y/%m/%d')
- **完成予定**: $(date -v+2w '+%Y/%m/%d')
- **リリース予定**: $(date -v+3w '+%Y/%m/%d')" \
  --label "type-improvement,status-planning,p-medium" \
  --milestone "v1.1 - スタイル拡張"

# Issue 4: CI/CDパイプラインの最適化
gh issue create \
  --title "⚙️ [FEATURE] CI/CDパイプラインの最適化" \
  --body "## 💡 機能の説明
GitHub Actions ワークフローの実行時間短縮と信頼性向上

## 🎯 解決したい問題
- ビルド時間が長い（現在10分以上）
- 時々失敗するワークフロー
- 並列実行の最適化不足

## 🚀 提案する解決策

### 基本的な実装
- **キャッシュ機能の強化**: npm/pip キャッシュの最適化
- **並列実行の改善**: 独立可能なジョブの並列化
- **条件実行の追加**: 変更されたファイルに応じた条件実行

### 高度な実装（任意）
- **マトリックスビルド**: 複数環境での同時テスト
- **段階的デプロイ**: Blue-Green デプロイメント
- **失敗通知**: Slack/Discord 通知システム

## 📊 期待される効果

### ユーザーへの利益
- 高速なフィードバックループ
- 安定したデプロイメント
- 品質向上の自動化

### 開発への影響
- **開発工数**: 20時間
- **メンテナンス**: 定期的な見直しが必要
- **既存機能への影響**: 最小限

## 📋 実装要件

### 必須要件
- [ ] ビルド時間を5分以内に短縮
- [ ] 成功率95%以上
- [ ] 全ワークフローの並列化

### 任意要件
- [ ] 失敗時の詳細な通知
- [ ] パフォーマンス監視
- [ ] ログの構造化

## 🔧 技術的考慮事項

### 対応プラットフォーム
- [x] GitHub Actions
- [ ] 他CI/CDプラットフォーム
- [ ] セルフホスト Runner

### パフォーマンス要件
- **実行時間**: 5分以内
- **並列度**: 最大10ジョブ
- **成功率**: 95%以上

## 📝 参考資料
- [GitHub Actions ベストプラクティス](https://docs.github.com/en/actions/learn-github-actions/best-practices-for-workflows)
- [CI/CD最適化ガイド](https://example.com/cicd-optimization)" \
  --label "type-feature,status-planning,p-medium" \
  --milestone "v1.1 - スタイル拡張"

# Issue 5: コミュニティガイドラインの整備
gh issue create \
  --title "📚 [DOCUMENTATION] コミュニティガイドラインの整備" \
  --body "## 📖 概要
健全で生産的なコミュニティ形成のためのガイドライン整備

## 🎯 目的
- 新規参加者への明確な指針提供
- 品質基準の統一
- コントリビューション促進

## 📋 作成予定文書

### 1. Code of Conduct（行動規範）
- 尊重と包括性の原則
- 禁止事項の明確化
- 報告・対応プロセス

### 2. Style Guide（スタイルガイド）
- マークダウン記法の統一
- 画像ファイルの命名規則
- ディレクトリ構造の標準化

### 3. Review Guidelines（レビューガイド）
- レビュー基準の明文化
- フィードバック方法の指針
- 承認プロセスの定義

### 4. Recognition System（認定制度）
- コントリビューターレベル設定
- バッジ・特典システム
- 功績の可視化方法

## ✅ チェックリスト

### 準備段階
- [ ] 他プロジェクトのガイドライン調査
- [ ] ステークホルダーへのヒアリング
- [ ] ドラフト作成

### 作成段階
- [ ] Code of Conduct 作成
- [ ] Style Guide 作成
- [ ] Review Guidelines 作成
- [ ] Recognition System 設計

### 完成段階
- [ ] コミュニティレビュー
- [ ] フィードバック反映
- [ ] 最終承認・公開

## 📅 予定スケジュール
- **ドラフト完成**: $(date -v+1w '+%Y/%m/%d')
- **コミュニティレビュー**: $(date -v+2w '+%Y/%m/%d')
- **最終公開**: $(date -v+3w '+%Y/%m/%d')

## 🎯 成功指標
- 新規コントリビューター数の増加
- Issue/PRの品質向上
- コミュニティ活動の活性化" \
  --label "type-documentation,status-planning,p-medium,good-first-issue" \
  --milestone "v1.0 - 基本ガイド完成"

echo "✅ 初期Issue作成が完了しました！"
echo ""
echo "📋 作成されたIssue:"
echo "1. 🎉 プロジェクト開始のお知らせ (ピン留め)"
echo "2. 🪑 オフィスチェア モデリングガイド作成"
echo "3. 🌐 ドキュメントサイトのUX改善"
echo "4. ⚙️ CI/CDパイプラインの最適化"
echo "5. 📚 コミュニティガイドラインの整備"
echo ""
echo "🏁 作成されたマイルストーン:"
echo "• v1.0 - 基本ガイド完成"
echo "• v1.1 - スタイル拡張"
echo "• v2.0 - 高度な機能"
echo ""
echo "🎯 次の手順:"
echo "1. GitHub でIssueを確認"
echo "2. プロジェクトボードの設定"
echo "3. チームメンバーのアサイン"
