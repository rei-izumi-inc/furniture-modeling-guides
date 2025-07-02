# 🚛 移行計画 / Migration Plan

## 概要

furniture-image-style-transformerからfurniture-modeling-guidesへの段階的移行計画

## 移行対象の分析

### ✅ 移行すべき成果物
- **モデリングガイド** (20件) - `output/markdown-reports/`
- **変換済み画像** - `output/roblox-transformed/`
- **配布システム** - `delivery-system/`
- **分析ドキュメント** - `docs/delivery-solution-analysis.md`

### ⚠️ 移行を検討すべき要素
- **画像変換ツール** - 一部のスクリプト
- **メタデータ** - JSON形式の構造化データ

### ❌ 移行しない要素
- **データ処理システム** - BigQuery連携など
- **開発用依存関係** - node_modules, TypeScript設定
- **認証情報** - credentials/

## Phase 1: 成果物移行 🎯

### ステップ1: ガイド移行
```bash
# モデリングガイドをguides/ディレクトリに移行
mkdir -p guides/
cp output/markdown-reports/*.md guides/
```

### ステップ2: 画像アセット移行
```bash
# 画像をassets/images/に移行
mkdir -p assets/images/
cp -r output/roblox-transformed/* assets/images/
```

### ステップ3: ディレクトリ構造整理
```
furniture-modeling-guides/
├── guides/              # モデリングガイド（20件）
├── assets/
│   └── images/         # 変換済み画像
├── templates/          # Issueテンプレート
├── .github/
│   └── workflows/      # GitHub Actions
└── docs/              # 運用ドキュメント
```

## Phase 2: ツール統合（オプション）

- delivery-systemをGitHub Actionsに変換
- 画像変換ツールの簡易版を追加
- 自動レポート生成機能

## Phase 3: クリーンアップ

- 元リポジトリから移行済みファイルを削除
- READMEの更新
- リンクの修正

## 実行スケジュール

| Phase | 期間 | 担当 | 状況 |
|-------|------|------|------|
| Phase 1 | 1日 | @shinobu | 🟡 準備中 |
| Phase 2 | 2-3日 | @shinobu | ⚪ 待機中 |
| Phase 3 | 1日 | @shinobu | ⚪ 待機中 |

## リスク・注意点

- 画像ファイルサイズによるリポジトリ容量制限
- 既存リンクの無効化
- GitHub Pages設定の調整が必要

---

**Next Action**: Phase 1の実行承認待ち
