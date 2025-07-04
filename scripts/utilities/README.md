# ユーティリティスクリプト

このディレクトリには、開発・デバッグ・検証で使用されるユーティリティスクリプトが含まれています。

## スクリプト一覧

### BigQuery関連

- `check-bigquery.ts` - BigQuery接続とクエリの基本的なテスト
- `test-bigquery.ts` - BigQueryサービスの詳細テスト
- `check-table-relations.ts` - テーブル間の関連性チェック
- `check-tables.ts` - テーブル構造の確認
- `find-join-keys.ts` - テーブル結合キーの検索

### データ検証関連

- `check-universal-products.ts` - ユニバーサル商品データの検証
- `test-complex-join.ts` - 複雑なJOIN操作のテスト

### 画像・変換関連

- `check-multi-platform.ts` - マルチプラットフォーム対応の確認
- `check-multi-platform-images.ts` - マルチプラットフォーム画像の確認

### その他

- `test-markdown.ts` - Markdownジェネレーターのテスト

## 使用方法

```bash
# TypeScriptで直接実行
npx ts-node scripts/utilities/[スクリプト名].ts

# またはJavaScriptにコンパイル後実行
npx tsc scripts/utilities/[スクリプト名].ts
node scripts/utilities/[スクリプト名].js
```

## 注意事項

- これらのスクリプトは開発・デバッグ用途のため、本番環境では使用しないでください
- 一部のスクリプトは`.env`ファイルの設定が必要です
- BigQuery関連のスクリプトは適切なサービスアカウントキーが必要です
