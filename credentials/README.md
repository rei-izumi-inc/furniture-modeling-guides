# 認証情報ディレクトリ

このディレクトリには以下の認証ファイルを配置してください：

## BigQuery認証設定

- `service-account-key.json` または `bigquery-service-account.json` - Google Cloud Service Accountキー

## OpenAI API認証設定

- `.env`ファイルの`OPENAI_API_KEY`にAPIキーを設定

## セットアップ手順

### BigQuery認証の設定

1. Google Cloud Consoleから Service Account キーをダウンロード
2. ファイル名を `service-account-key.json` または `bigquery-service-account.json` に変更
3. このディレクトリに配置

### OpenAI API認証の設定

1. [OpenAI Platform](https://platform.openai.com/)でAPIキーを生成
2. プロジェクトルートの`.env`ファイルに設定

## セキュリティ注意事項

- 認証ファイルは `.gitignore` に含まれています
- 本番環境では環境変数での認証を推奨
- 認証ファイルの権限は適切に設定してください（例: `chmod 600`）
