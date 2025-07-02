import dotenv from 'dotenv';
import path from 'path';

// 環境変数を読み込み
dotenv.config();

/**
 * 環境設定クラス
 */
export class Config {
  // BigQuery設定
  static readonly GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || '';
  static readonly BIGQUERY_DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'furniture_data';
  static readonly BIGQUERY_TABLE_ID = process.env.BIGQUERY_TABLE_ID || 'products';
  static readonly GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || './config/bigquery-key.json';

  // OpenAI設定
  static readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

  // ストレージ設定
  static readonly STORAGE_PATH = process.env.STORAGE_PATH || './storage';
  static readonly ORIGINAL_IMAGES_PATH = process.env.ORIGINAL_IMAGES_PATH || './output/original-images';
  static readonly ROBLOX_TRANSFORMED_PATH = process.env.ROBLOX_TRANSFORMED_PATH || './output/roblox-transformed';
  static readonly MARKDOWN_OUTPUT_PATH = process.env.MARKDOWN_OUTPUT_PATH || './output/markdown-reports';
  static readonly PDF_OUTPUT_PATH = process.env.PDF_OUTPUT_PATH || './output/pdf-reports';
  static readonly DATA_OUTPUT_PATH = process.env.DATA_OUTPUT_PATH || './output/data';
  static readonly REPORTS_OUTPUT_PATH = process.env.REPORTS_OUTPUT_PATH || './output/reports';

  // バッチ処理設定
  static readonly BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '10');
  static readonly MAX_CONCURRENT_DOWNLOADS = parseInt(process.env.MAX_CONCURRENT_DOWNLOADS || '5');
  static readonly MAX_CONCURRENT_TRANSFORMS = parseInt(process.env.MAX_CONCURRENT_TRANSFORMS || '3');

  // ログ設定
  static readonly LOG_LEVEL = process.env.LOG_LEVEL || 'info';
  static readonly LOG_PATH = process.env.LOG_PATH || './logs';

  /**
   * 設定の妥当性チェック
   */
  static validate(): string[] {
    const errors: string[] = [];

    if (!this.GOOGLE_CLOUD_PROJECT_ID) {
      errors.push('GOOGLE_CLOUD_PROJECT_ID is required');
    }

    if (!this.OPENAI_API_KEY) {
      errors.push('OPENAI_API_KEY is required');
    }

    if (!this.GOOGLE_APPLICATION_CREDENTIALS) {
      errors.push('GOOGLE_APPLICATION_CREDENTIALS is required');
    }

    return errors;
  }

  /**
   * 絶対パスを取得
   */
  static getAbsolutePath(relativePath: string): string {
    return path.resolve(relativePath);
  }

  /**
   * 設定情報を出力（機密情報は隠す）
   */
  static getSafeConfig(): Record<string, any> {
    return {
      GOOGLE_CLOUD_PROJECT_ID: this.GOOGLE_CLOUD_PROJECT_ID,
      BIGQUERY_DATASET_ID: this.BIGQUERY_DATASET_ID,
      BIGQUERY_TABLE_ID: this.BIGQUERY_TABLE_ID,
      OPENAI_API_KEY: this.OPENAI_API_KEY ? '***設定済み***' : '未設定',
      STORAGE_PATH: this.STORAGE_PATH,
      BATCH_SIZE: this.BATCH_SIZE,
      MAX_CONCURRENT_DOWNLOADS: this.MAX_CONCURRENT_DOWNLOADS,
      MAX_CONCURRENT_TRANSFORMS: this.MAX_CONCURRENT_TRANSFORMS,
      LOG_LEVEL: this.LOG_LEVEL
    };
  }
}
