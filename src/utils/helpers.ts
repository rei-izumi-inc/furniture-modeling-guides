import fs from 'fs-extra';
import path from 'path';
import { Config } from './config';

/**
 * ファイル・ディレクトリ操作ユーティリティ
 */
export class FileUtils {
  /**
   * ディレクトリを確実に作成
   */
  static async ensureDir(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
  }

  /**
   * ファイルの存在チェック
   */
  static async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ファイルサイズを取得
   */
  static async getFileSize(filePath: string): Promise<number> {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  /**
   * 出力ディレクトリを初期化
   */
  static async initializeOutputDirs(): Promise<void> {
    const dirs = [
      Config.STORAGE_PATH,
      Config.ORIGINAL_IMAGES_PATH,
      Config.ROBLOX_TRANSFORMED_PATH,
      Config.MARKDOWN_OUTPUT_PATH,
      Config.PDF_OUTPUT_PATH,
      Config.LOG_PATH
    ];

    for (const dir of dirs) {
      await this.ensureDir(Config.getAbsolutePath(dir));
    }
  }

  /**
   * 安全なファイル名を生成
   */
  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  /**
   * 拡張子を取得
   */
  static getExtension(filePath: string): string {
    return path.extname(filePath).toLowerCase();
  }

  /**
   * ベース名（拡張子なし）を取得
   */
  static getBaseName(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }
}

/**
 * 非同期処理ユーティリティ
 */
export class AsyncUtils {
  /**
   * 指定時間待機
   */
  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 並列処理制限付きで配列を処理
   */
  static async processWithLimit<T, R>(
    items: T[],
    processor: (item: T, index: number) => Promise<R>,
    limit: number
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += limit) {
      const batch = items.slice(i, i + limit);
      const batchPromises = batch.map((item, batchIndex) => 
        processor(item, i + batchIndex)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          throw result.reason;
        }
      }
    }
    
    return results;
  }

  /**
   * リトライ機能付き実行
   */
  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        await this.sleep(delay * attempt);
      }
    }
    
    throw lastError!;
  }
}

/**
 * 進行状況追跡ユーティリティ
 */
export class ProgressTracker {
  private total: number;
  private completed: number = 0;
  private failed: number = 0;
  private startTime: number;

  constructor(total: number) {
    this.total = total;
    this.startTime = Date.now();
  }

  /**
   * 成功した項目を記録
   */
  markCompleted(): void {
    this.completed++;
    this.logProgress();
  }

  /**
   * 失敗した項目を記録
   */
  markFailed(): void {
    this.failed++;
    this.logProgress();
  }

  /**
   * 進行状況をログ出力
   */
  private logProgress(): void {
    const processed = this.completed + this.failed;
    const progress = (processed / this.total * 100).toFixed(1);
    const elapsed = Date.now() - this.startTime;
    const rate = processed / (elapsed / 1000);
    const eta = (this.total - processed) / rate;

    console.log(
      `進行状況: ${processed}/${this.total} (${progress}%) ` +
      `成功: ${this.completed}, 失敗: ${this.failed} ` +
      `ETA: ${Math.round(eta)}秒`
    );
  }

  /**
   * 最終統計を取得
   */
  getFinalStats() {
    const duration = Date.now() - this.startTime;
    return {
      total: this.total,
      completed: this.completed,
      failed: this.failed,
      duration: Math.round(duration / 1000),
      successRate: (this.completed / this.total * 100).toFixed(1)
    };
  }
}

/**
 * データバリデーションユーティリティ
 */
export class ValidationUtils {
  /**
   * URL形式チェック
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 画像URLかチェック
   */
  static isImageUrl(url: string): boolean {
    if (!this.isValidUrl(url)) return false;
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const urlPath = new URL(url).pathname.toLowerCase();
    
    return imageExtensions.some(ext => urlPath.endsWith(ext));
  }

  /**
   * 必須フィールドチェック
   */
  static validateFurnitureData(data: any): string[] {
    const errors: string[] = [];
    const requiredFields = ['id', 'name', 'category', 'originalImageUrl'];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`必須フィールド '${field}' が不足しています`);
      }
    }
    
    if (data.originalImageUrl && !this.isImageUrl(data.originalImageUrl)) {
      errors.push('originalImageUrl が有効な画像URLではありません');
    }
    
    return errors;
  }
}
