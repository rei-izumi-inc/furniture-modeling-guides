#!/usr/bin/env ts-node

import { Config } from '../../utils/config';
import { Logger } from '../../utils/logger';
import { FileUtils } from '../../utils/helpers';
import { BigQueryService } from '../../services/bigquery-service';
import { ImageDownloadService } from '../../services/image-download-service';
import { QueryConfig } from '../../types';
import fs from 'fs-extra';
import path from 'path';

/**
 * データ取得バッチ処理
 * BigQueryからデータを取得し、画像をダウンロードする
 */
class DataFetchBatch {
  private logger = Logger.getInstance();
  private config = Config.getInstance();
  private bigQueryService = new BigQueryService();
  private imageDownloadService = new ImageDownloadService();
  private fileUtils = new FileUtils();

  /**
   * バッチ処理実行
   */
  async execute(queryConfig: QueryConfig = {}): Promise<void> {
    const batchName = 'data-fetch';
    Logger.logBatchStart(batchName, queryConfig);

    try {
      // 設定の検証
      await this.validateConfiguration();

      // 出力ディレクトリ初期化
      await this.fileUtils.initializeOutputDirs();

      // BigQuery接続テスト
      await this.testBigQueryConnection();

      // データ統計表示
      await this.showDataStatistics();

      // 家具データ取得
      const furnitureData = await this.bigQueryService.fetchFurnitureData(queryConfig);

      if (furnitureData.length === 0) {
        this.logger.warn('取得データが0件です');
        return;
      }

      // データをJSONファイルに保存
      await this.saveFurnitureData(furnitureData);

      // 画像ダウンロード
      const downloadResults = await this.imageDownloadService.downloadImages(furnitureData);

      // 失敗した画像のリトライ
      const failedCount = downloadResults.filter(r => !r.downloaded).length;
      if (failedCount > 0) {
        this.logger.info('失敗した画像のリトライを実行');
        await this.imageDownloadService.retryFailedDownloads(furnitureData, downloadResults);
      }

      // 結果レポート作成
      await this.generateReport(furnitureData, downloadResults);

      // 最終統計
      const finalStats = {
        furnitureDataCount: furnitureData.length,
        downloadSuccessCount: downloadResults.filter(r => r.downloaded).length,
        downloadFailureCount: downloadResults.filter(r => !r.downloaded).length
      };

      Logger.logBatchComplete(batchName, finalStats);

    } catch (error) {
      Logger.logBatchError(batchName, error as Error);
      throw error;
    }
  }

  /**
   * 設定の検証
   */
  private async validateConfiguration(): Promise<void> {
    this.logger.info('設定検証開始');

    const configErrors = this.config.validate();
    if (configErrors.length > 0) {
      throw new Error(`設定エラー: ${configErrors.join(', ')}`);
    }

    // 認証ファイルの存在確認
    const credentialsPath = this.config.getAbsolutePath(this.config.GOOGLE_APPLICATION_CREDENTIALS);
    if (!await this.fileUtils.exists(credentialsPath)) {
      throw new Error(`認証ファイルが見つかりません: ${credentialsPath}`);
    }

    this.logger.info('設定検証完了', this.config.getSafeConfig());
  }

  /**
   * BigQuery接続テスト
   */
  private async testBigQueryConnection(): Promise<void> {
    this.logger.info('BigQuery接続テスト開始');
    
    const isConnected = await this.bigQueryService.validateConnection();
    if (!isConnected) {
      throw new Error('BigQuery接続に失敗しました');
    }

    this.logger.info('BigQuery接続テスト完了');
  }

  /**
   * データ統計表示
   */
  private async showDataStatistics(): Promise<void> {
    try {
      this.logger.info('データ統計取得中...');
      
      const stats = await this.bigQueryService.getDataStats();
      const categories = await this.bigQueryService.getCategories();
      const brands = await this.bigQueryService.getBrands();

      this.logger.info('データ統計', {
        totalCount: stats.totalCount,
        categoryCount: Object.keys(stats.categoryBreakdown).length,
        brandCount: Object.keys(stats.brandBreakdown).length,
        topCategories: Object.entries(stats.categoryBreakdown)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5),
        topBrands: Object.entries(stats.brandBreakdown)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
      });

    } catch (error) {
      this.logger.warn('データ統計取得エラー', {
        error: (error as Error).message
      });
    }
  }

  /**
   * 家具データをJSONファイルに保存
   */
  private async saveFurnitureData(furnitureData: any[]): Promise<void> {
    // ディレクトリが存在しない場合は作成
    await fs.ensureDir(this.config.getAbsolutePath(this.config.DATA_OUTPUT_PATH));
    
    const outputPath = path.join(
      this.config.getAbsolutePath(this.config.DATA_OUTPUT_PATH),
      'furniture-data.json'
    );

    await fs.writeJSON(outputPath, furnitureData, { spaces: 2 });
    
    this.logger.info('家具データ保存完了', {
      outputPath,
      count: furnitureData.length
    });
  }

  /**
   * 結果レポート生成
   */
  private async generateReport(furnitureData: any[], downloadResults: any[]): Promise<void> {
    const report = {
      executedAt: new Date().toISOString(),
      dataFetch: {
        totalFurnitureCount: furnitureData.length,
        categories: [...new Set(furnitureData.map(f => f.category))],
        brands: [...new Set(furnitureData.map(f => f.brand))]
      },
      imageDownload: {
        totalAttempts: downloadResults.length,
        successful: downloadResults.filter(r => r.downloaded).length,
        failed: downloadResults.filter(r => !r.downloaded).length,
        failedUrls: downloadResults
          .filter(r => !r.downloaded)
          .map(r => ({ id: r.furnitureId, url: r.originalUrl, error: r.error }))
      },
      storage: await this.imageDownloadService.getStorageInfo()
    };

    const reportPath = path.join(
      this.config.getAbsolutePath(this.config.DATA_OUTPUT_PATH),
      'data-fetch-report.json'
    );

    await fs.writeJSON(reportPath, report, { spaces: 2 });
    
    this.logger.info('結果レポート生成完了', {
      reportPath,
      summary: {
        furnitureData: report.dataFetch.totalFurnitureCount,
        downloadSuccess: report.imageDownload.successful,
        downloadFail: report.imageDownload.failed
      }
    });
  }
}

/**
 * コマンドライン実行
 */
async function main() {
  try {
    const batch = new DataFetchBatch();
    
    // コマンドライン引数をパース（簡易実装）
    const args = process.argv.slice(2);
    const queryConfig: QueryConfig = {};
    
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i];
      const value = args[i + 1];
      
      switch (key) {
        case '--limit':
          queryConfig.limit = parseInt(value);
          break;
        case '--offset':
          queryConfig.offset = parseInt(value);
          break;
        case '--category':
          queryConfig.category = value;
          break;
        case '--brand':
          queryConfig.brand = value;
          break;
      }
    }

    await batch.execute(queryConfig);
    console.log('✅ データ取得バッチ処理が正常に完了しました');

  } catch (error) {
    console.error('❌ データ取得バッチ処理でエラーが発生しました:', (error as Error).message);
    process.exit(1);
  }
}

// 直接実行された場合のみmain関数を呼び出し
if (require.main === module) {
  main();
}

export { DataFetchBatch };
