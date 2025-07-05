import dotenv from 'dotenv';
import path from 'path';

// 環境変数を読み込み
dotenv.config();

/**
 * 環境設定クラス（シングルトン）
 */
export class Config {
  private static instance: Config;

  // BigQuery設定
  readonly GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || '';
  readonly BIGQUERY_DATASET_ID = process.env.BIGQUERY_DATASET_ID || 'furniture_data';
  readonly BIGQUERY_TABLE_ID = process.env.BIGQUERY_TABLE_ID || 'products';
  readonly GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || './config/bigquery-key.json';

  // OpenAI設定
  readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

  // GitHub設定
  readonly GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
  readonly GITHUB_OWNER = process.env.GITHUB_OWNER || 'rei-izumi-inc';
  readonly GITHUB_REPO = process.env.GITHUB_REPO || 'furniture-modeling-guides';
  readonly GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  // ストレージ設定
  readonly STORAGE_PATH = process.env.STORAGE_PATH || './storage';
  readonly ORIGINAL_IMAGES_PATH = process.env.ORIGINAL_IMAGES_PATH || './output/original-images';
  readonly ROBLOX_TRANSFORMED_PATH = process.env.ROBLOX_TRANSFORMED_PATH || './output/roblox-transformed';
  readonly MARKDOWN_OUTPUT_PATH = process.env.MARKDOWN_OUTPUT_PATH || './output/markdown-reports';
  readonly PDF_OUTPUT_PATH = process.env.PDF_OUTPUT_PATH || './output/pdf-reports';
  readonly DATA_OUTPUT_PATH = process.env.DATA_OUTPUT_PATH || './output/data';
  readonly REPORTS_OUTPUT_PATH = process.env.REPORTS_OUTPUT_PATH || './output/reports';

  // バッチ処理設定
  readonly BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '10');
  readonly MAX_CONCURRENT_DOWNLOADS = parseInt(process.env.MAX_CONCURRENT_DOWNLOADS || '5');
  readonly MAX_CONCURRENT_TRANSFORMS = parseInt(process.env.MAX_CONCURRENT_TRANSFORMS || '3');

  // ログ設定
  readonly LOG_LEVEL = process.env.LOG_LEVEL || 'info';
  readonly LOG_PATH = process.env.LOG_PATH || './logs';

  private constructor() {}

  /**
   * シングルトンインスタンスを取得
   */
  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /**
   * GitHub Token を取得
   */
  getGitHubToken(): string {
    return this.GITHUB_TOKEN;
  }

  /**
   * GitHub Owner を取得
   */
  getGitHubOwner(): string {
    return this.GITHUB_OWNER;
  }

  /**
   * GitHub Repo を取得
   */
  getGitHubRepo(): string {
    return this.GITHUB_REPO;
  }

  /**
   * GitHub Branch を取得
   */
  getGitHubBranch(): string {
    return this.GITHUB_BRANCH;
  }

  /**
   * 設定の妥当性チェック
   */
  validate(): string[] {
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
  getAbsolutePath(relativePath: string): string {
    return path.resolve(relativePath);
  }

  /**
   * 設定情報を出力（機密情報は隠す）
   */
  getSafeConfig(): Record<string, any> {
    return {
      GOOGLE_CLOUD_PROJECT_ID: this.GOOGLE_CLOUD_PROJECT_ID,
      BIGQUERY_DATASET_ID: this.BIGQUERY_DATASET_ID,
      BIGQUERY_TABLE_ID: this.BIGQUERY_TABLE_ID,
      OPENAI_API_KEY: this.OPENAI_API_KEY ? '***設定済み***' : '未設定',
      GITHUB_TOKEN: this.GITHUB_TOKEN ? '***設定済み***' : '未設定',
      GITHUB_OWNER: this.GITHUB_OWNER,
      GITHUB_REPO: this.GITHUB_REPO,
      GITHUB_BRANCH: this.GITHUB_BRANCH,
      STORAGE_PATH: this.STORAGE_PATH,
      BATCH_SIZE: this.BATCH_SIZE,
      MAX_CONCURRENT_DOWNLOADS: this.MAX_CONCURRENT_DOWNLOADS,
      MAX_CONCURRENT_TRANSFORMS: this.MAX_CONCURRENT_TRANSFORMS,
      LOG_LEVEL: this.LOG_LEVEL
    };
  }
}
