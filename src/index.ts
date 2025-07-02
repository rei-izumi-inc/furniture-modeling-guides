#!/usr/bin/env ts-node

import { Config } from './utils/config';
import { Logger } from './utils/logger';

/**
 * アプリケーションのメインエントリーポイント
 */
class Application {
  private logger = Logger.getInstance();

  /**
   * アプリケーション開始
   */
  async start(): Promise<void> {
    try {
      this.logger.info('Roblox家具画像スタイル変換バッチシステム開始');
      
      // 設定表示
      this.logger.info('現在の設定', Config.getSafeConfig());
      
      // 環境確認
      const configErrors = Config.validate();
      if (configErrors.length > 0) {
        throw new Error(`設定エラー: ${configErrors.join(', ')}`);
      }

      this.logger.info('システム準備完了');
      this.showUsage();

    } catch (error) {
      this.logger.error('システム初期化エラー', {
        error: (error as Error).message
      });
      throw error;
    }
  }

  /**
   * 使用方法を表示
   */
  private showUsage(): void {
    console.log(`
🎮 Roblox向け家具画像スタイル変換バッチシステム

利用可能なコマンド:
  npm run batch:data-fetch          # BigQueryからデータ取得・画像ダウンロード
  npm run batch:roblox-transform    # Roblox向けスタイル変換
  npm run batch:markdown-generation # マークダウン資料生成
  npm run batch:pdf-converter       # PDF変換
  npm run batch:all                 # 全バッチ処理を順次実行

オプション例:
  npm run batch:data-fetch -- --limit 50 --category "chair"
  npm run batch:data-fetch -- --brand "IKEA" --limit 100

環境変数設定:
  .env ファイルを編集してAPIキーや設定を更新してください
  
ログ:
  ログファイルは ${Config.LOG_PATH} に出力されます
  
出力:
  - オリジナル画像: ${Config.ORIGINAL_IMAGES_PATH}
  - 変換画像: ${Config.ROBLOX_TRANSFORMED_PATH}
  - マークダウン: ${Config.MARKDOWN_OUTPUT_PATH}
  - PDF: ${Config.PDF_OUTPUT_PATH}
`);
  }
}

/**
 * メイン実行
 */
async function main() {
  try {
    const app = new Application();
    await app.start();
  } catch (error) {
    console.error('❌ システム初期化エラー:', (error as Error).message);
    console.error('\n📋 解決方法:');
    console.error('1. .env ファイルの設定を確認');
    console.error('2. Google Cloud認証キーファイルの配置を確認');
    console.error('3. 必要な環境変数が設定されているか確認');
    process.exit(1);
  }
}

// 直接実行された場合のみmain関数を呼び出し
if (require.main === module) {
  main();
}

export { Application };
