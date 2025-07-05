import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { Config } from '../utils/config';
import { Logger } from '../utils/logger';
import { FurnitureData, ImageDownloadResult } from '../types';
import { FileUtils, AsyncUtils } from '../utils/helpers';

/**
 * 画像ダウンロードサービス
 */
export class ImageDownloadService {
  private logger = Logger.getInstance();
  private config = Config.getInstance();
  private fileUtils = new FileUtils();

  /**
   * 画像を一括ダウンロード
   */
  async downloadImages(furnitureData: FurnitureData[]): Promise<ImageDownloadResult[]> {
    this.logger.info('画像ダウンロード開始', { 
      totalCount: furnitureData.length 
    });

    await this.fileUtils.ensureDir(this.config.getAbsolutePath(this.config.ORIGINAL_IMAGES_PATH));

    const results = await AsyncUtils.processWithLimit(
      furnitureData,
      (data, index) => this.downloadSingleImage(data, index, furnitureData.length),
      this.config.MAX_CONCURRENT_DOWNLOADS
    );

    const stats = this.calculateStats(results);
    this.logger.info('画像ダウンロード完了', stats);

    return results;
  }

  /**
   * 単一画像のダウンロード
   */
  private async downloadSingleImage(
    furnitureData: FurnitureData,
    index: number,
    total: number
  ): Promise<ImageDownloadResult> {
    const result: ImageDownloadResult = {
      furnitureId: furnitureData.id,
      originalUrl: furnitureData.originalImageUrl,
      localPath: '',
      downloaded: false
    };

    try {
      // ファイル名を生成
      const fileName = this.generateFileName(furnitureData);
      const localPath = path.join(
        this.config.getAbsolutePath(this.config.ORIGINAL_IMAGES_PATH),
        fileName
      );

      result.localPath = localPath;

      // すでにファイルが存在するかチェック
      if (await this.fileUtils.exists(localPath)) {
        this.logger.info('画像ファイル既存のためスキップ', {
          furnitureId: furnitureData.id,
          localPath
        });
        
        result.downloaded = true;
        result.fileSize = await this.fileUtils.getFileSize(localPath);
        result.dimensions = await this.getImageDimensions(localPath);
        return result;
      }

      // 画像をダウンロード
      const imageBuffer = await this.fetchImageBuffer(furnitureData.originalImageUrl);
      
      // 画像を処理・最適化
      const processedBuffer = await this.processImage(imageBuffer);
      
      // ファイルに保存
      await fs.writeFile(localPath, processedBuffer);
      
      result.downloaded = true;
      result.fileSize = processedBuffer.length;
      result.dimensions = await this.getImageDimensions(localPath);

      this.logger.info('画像ダウンロード成功', {
        furnitureId: furnitureData.id,
        originalUrl: furnitureData.originalImageUrl,
        localPath,
        fileSize: result.fileSize,
        progress: `${index + 1}/${total}`
      });

    } catch (error) {
      const errorMessage = (error as Error).message;
      result.error = errorMessage;
      
      this.logger.error('画像ダウンロードエラー', {
        furnitureId: furnitureData.id,
        originalUrl: furnitureData.originalImageUrl,
        error: errorMessage
      });
    }

    return result;
  }

  /**
   * 画像バッファを取得
   */
  private async fetchImageBuffer(url: string): Promise<Buffer> {
    return AsyncUtils.retry(async () => {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return Buffer.from(response.data);
    }, 3, 2000);
  }

  /**
   * 画像を処理・最適化
   */
  private async processImage(buffer: Buffer): Promise<Buffer> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      // 画像形式チェック
      if (!metadata.format || !['jpeg', 'png', 'webp', 'gif'].includes(metadata.format)) {
        throw new Error(`サポートされていない画像形式: ${metadata.format}`);
      }

      // サイズ制限チェック（最大 2048x2048）
      const maxSize = 2048;
      let processedImage = image;

      if (metadata.width && metadata.height) {
        if (metadata.width > maxSize || metadata.height > maxSize) {
          processedImage = processedImage.resize(maxSize, maxSize, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }
      }

      // JPEG形式で統一、品質設定
      return await processedImage
        .jpeg({
          quality: 85,
          progressive: true
        })
        .toBuffer();

    } catch (error) {
      this.logger.warn('画像処理エラー、元の画像を使用', {
        error: (error as Error).message
      });
      return buffer;
    }
  }

  /**
   * 画像の寸法を取得
   */
  private async getImageDimensions(filePath: string): Promise<{ width: number; height: number } | undefined> {
    try {
      const metadata = await sharp(filePath).metadata();
      if (metadata.width && metadata.height) {
        return {
          width: metadata.width,
          height: metadata.height
        };
      }
    } catch (error) {
      this.logger.warn('画像寸法取得エラー', {
        filePath,
        error: (error as Error).message
      });
    }
    return undefined;
  }

  /**
   * ファイル名を生成
   */
  private generateFileName(furnitureData: FurnitureData): string {
    const sanitizedName = this.fileUtils.sanitizeFileName(furnitureData.name);
    const sanitizedBrand = this.fileUtils.sanitizeFileName(furnitureData.brand);
    const sanitizedCategory = this.fileUtils.sanitizeFileName(furnitureData.category);
    
    return `${furnitureData.id}_${sanitizedBrand}_${sanitizedCategory}_${sanitizedName}.jpg`;
  }

  /**
   * ダウンロード統計を計算
   */
  private calculateStats(results: ImageDownloadResult[]): {
    total: number;
    successful: number;
    failed: number;
    totalSize: number;
    averageSize: number;
  } {
    const total = results.length;
    const successful = results.filter(r => r.downloaded).length;
    const failed = total - successful;
    const totalSize = results
      .filter(r => r.fileSize)
      .reduce((sum, r) => sum + (r.fileSize || 0), 0);
    const averageSize = successful > 0 ? Math.round(totalSize / successful) : 0;

    return {
      total,
      successful,
      failed,
      totalSize,
      averageSize
    };
  }

  /**
   * 失敗したダウンロードをリトライ
   */
  async retryFailedDownloads(
    furnitureData: FurnitureData[],
    previousResults: ImageDownloadResult[]
  ): Promise<ImageDownloadResult[]> {
    const failedIds = previousResults
      .filter(r => !r.downloaded)
      .map(r => r.furnitureId);

    const failedData = furnitureData.filter(data => 
      failedIds.includes(data.id)
    );

    if (failedData.length === 0) {
      this.logger.info('リトライする失敗画像なし');
      return [];
    }

    this.logger.info('失敗画像のリトライ開始', { 
      retryCount: failedData.length 
    });

    return await this.downloadImages(failedData);
  }

  /**
   * ダウンロード済み画像の一覧を取得
   */
  async getDownloadedImages(): Promise<string[]> {
    const imagesDir = this.config.getAbsolutePath(this.config.ORIGINAL_IMAGES_PATH);
    
    if (!await this.fileUtils.exists(imagesDir)) {
      return [];
    }

    const files = await fs.readdir(imagesDir);
    return files.filter(file => 
      ['.jpg', '.jpeg', '.png'].includes(this.fileUtils.getExtension(file))
    );
  }

  /**
   * ストレージ使用量を取得
   */
  async getStorageInfo(): Promise<{
    imageCount: number;
    totalSize: number;
    averageSize: number;
  }> {
    const images = await this.getDownloadedImages();
    const imagesDir = this.config.getAbsolutePath(this.config.ORIGINAL_IMAGES_PATH);
    
    let totalSize = 0;
    
    for (const image of images) {
      const imagePath = path.join(imagesDir, image);
      try {
        const size = await this.fileUtils.getFileSize(imagePath);
        totalSize += size;
      } catch (error) {
        this.logger.warn('ファイルサイズ取得エラー', {
          imagePath,
          error: (error as Error).message
        });
      }
    }

    return {
      imageCount: images.length,
      totalSize,
      averageSize: images.length > 0 ? Math.round(totalSize / images.length) : 0
    };
  }
}
