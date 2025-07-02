import { Config } from '../../utils/config';
import { Logger } from '../../utils/logger';
import { RobloxStyleTransformService } from '../../services/roblox-style-transform-service';
import { MarkdownGeneratorService } from '../../services/markdown-generator-service';
import { FurnitureData, RobloxStyleType, ImageTransformResult } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 並列処理制御用のセマフォクラス
 */
class Semaphore {
  private permits: number;
  private waitingQueue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      if (this.permits > 0) {
        this.permits--;
        resolve();
      } else {
        this.waitingQueue.push(resolve);
      }
    });
  }

  release(): void {
    if (this.waitingQueue.length > 0) {
      const resolve = this.waitingQueue.shift();
      if (resolve) resolve();
    } else {
      this.permits++;
    }
  }
}

/**
 * Roblox画像変換バッチ処理
 */
export class RobloxTransformBatch {
  private logger = Logger.getInstance();
  private transformService: RobloxStyleTransformService;
  private markdownService: MarkdownGeneratorService;
  private semaphore: Semaphore;
  
  // デフォルトの変換スタイル
  private readonly defaultStyles: RobloxStyleType[] = [
    'roblox-cartoony',
    'roblox-modern',
    'roblox-minimalist'
  ];

  constructor() {
    this.transformService = new RobloxStyleTransformService();
    this.markdownService = new MarkdownGeneratorService();
    this.semaphore = new Semaphore(Config.MAX_CONCURRENT_TRANSFORMS);
  }

  /**
   * バッチ実行
   */
  async execute(options: {
    limit?: number;
    styles?: RobloxStyleType[];
    furnitureIds?: string[];
  } = {}): Promise<void> {
    try {
      const startTime = Date.now();
      this.logger.info('Roblox画像変換バッチ開始', { options });

      // 変換対象の家具データを読み込み
      const furnitureDataPath = path.join(Config.DATA_OUTPUT_PATH, 'furniture-data.json');
      
      if (!fs.existsSync(furnitureDataPath)) {
        throw new Error('家具データファイルが見つかりません。先にデータ取得バッチを実行してください。');
      }

      const furnitureData: FurnitureData[] = JSON.parse(
        fs.readFileSync(furnitureDataPath, 'utf-8')
      );

      // 変換対象をフィルタリング
      let targetFurniture = furnitureData;
      
      if (options.furnitureIds) {
        targetFurniture = furnitureData.filter(item => 
          options.furnitureIds!.includes(item.id)
        );
      }
      
      if (options.limit) {
        targetFurniture = targetFurniture.slice(0, options.limit);
      }

      const styles = options.styles || this.defaultStyles;

      this.logger.info('変換対象確認', {
        totalFurniture: furnitureData.length,
        targetCount: targetFurniture.length,
        styles: styles,
        estimatedImages: targetFurniture.length * styles.length
      });

      // 各家具に対して変換実行
      const allResults: Array<{
        furnitureData: FurnitureData;
        results: ImageTransformResult[];
      }> = [];

      for (let i = 0; i < targetFurniture.length; i++) {
        const furniture = targetFurniture[i];
        const progress = `${i + 1}/${targetFurniture.length}`;
        
        this.logger.info('家具変換開始', {
          furnitureId: furniture.id,
          furnitureName: furniture.name,
          progress
        });

        try {
          // 元画像パスを特定
          const originalImagePath = this.findOriginalImagePath(furniture);
          
          if (!originalImagePath || !fs.existsSync(originalImagePath)) {
            this.logger.warn('元画像が見つかりません', {
              furnitureId: furniture.id,
              expectedPath: originalImagePath
            });
            continue;
          }

          // 各スタイルで並列変換
          const results = await this.transformStylesInParallel(
            originalImagePath,
            styles,
            furniture
          );

          allResults.push({
            furnitureData: furniture,
            results
          });

          // 成功した変換がある場合、マークダウン資料を生成
          const successfulResults = results.filter(r => r.success);
          if (successfulResults.length > 0) {
            try {
              const markdownResult = await this.markdownService.generateRobloxModelingGuide(
                furniture,
                successfulResults
              );
                
              if (markdownResult.success) {
                this.logger.info('マークダウン資料生成完了', {
                  furnitureId: furniture.id,
                  markdownPath: markdownResult.markdownPath
                });
              } else {
                this.logger.warn('マークダウン資料生成失敗', {
                  furnitureId: furniture.id,
                  error: markdownResult.error
                });
              }
            } catch (markdownError) {
              this.logger.error('マークダウン生成エラー', {
                furnitureId: furniture.id,
                error: (markdownError as Error).message
              });
            }
          }

          // 成功・失敗の集計
          const successCount = results.filter((r: ImageTransformResult) => r.success).length;
          const failCount = results.filter((r: ImageTransformResult) => !r.success).length;

          this.logger.info('家具変換完了', {
            furnitureId: furniture.id,
            progress,
            successCount,
            failCount,
            totalStyles: styles.length
          });

        } catch (error) {
          this.logger.error('家具変換エラー', {
            furnitureId: furniture.id,
            furnitureName: furniture.name,
            error: (error as Error).message
          });
        }
      }

      // 結果を保存
      await this.saveResults(allResults);
      
      const totalTime = Date.now() - startTime;
      const totalResults = allResults.reduce((sum, item) => sum + item.results.length, 0);
      const successResults = allResults.reduce(
        (sum, item) => sum + item.results.filter(r => r.success).length, 
        0
      );

      this.logger.info('Roblox画像変換バッチ完了', {
        totalFurniture: targetFurniture.length,
        totalImages: totalResults,
        successImages: successResults,
        failImages: totalResults - successResults,
        processingTime: `${totalTime}ms`,
        averagePerImage: totalResults > 0 ? `${Math.round(totalTime / totalResults)}ms` : '0ms'
      });

      console.log('✅ Roblox画像変換バッチ処理が完了しました');

    } catch (error) {
      this.logger.error('Roblox画像変換バッチエラー', {
        error: (error as Error).message
      });
      console.error('❌ Roblox画像変換バッチ処理でエラーが発生しました:', (error as Error).message);
      throw error;
    }
  }

  /**
   * 元画像のパスを特定
   */
  private findOriginalImagePath(furniture: FurnitureData): string | null {
    const originalImagesDir = Config.ORIGINAL_IMAGES_PATH;
    
    // ファイル名パターンを生成（image-download-serviceと同じロジック）
    const sanitizedName = furniture.name
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .toLowerCase();
    const sanitizedBrand = furniture.brand
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .toLowerCase();
    const sanitizedCategory = furniture.category
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .toLowerCase();
    
    const fileName = `${furniture.id}_${sanitizedBrand}_${sanitizedCategory}_${sanitizedName}.jpg`;
    const fullPath = path.join(originalImagesDir, fileName);
    
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
    
    // 拡張子違いも試す
    const possibleExtensions = ['.jpeg', '.png', '.gif'];
    const baseName = `${furniture.id}_${sanitizedBrand}_${sanitizedCategory}_${sanitizedName}`;
    
    for (const ext of possibleExtensions) {
      const altPath = path.join(originalImagesDir, baseName + ext);
      if (fs.existsSync(altPath)) {
        return altPath;
      }
    }
    
    return null;
  }

  /**
   * 変換結果を保存
   */
  private async saveResults(results: Array<{
    furnitureData: FurnitureData;
    results: ImageTransformResult[];
  }>): Promise<void> {
    try {
      // 詳細結果の保存
      const detailedResults = {
        generatedAt: new Date().toISOString(),
        totalFurniture: results.length,
        totalImages: results.reduce((sum, item) => sum + item.results.length, 0),
        successImages: results.reduce(
          (sum, item) => sum + item.results.filter(r => r.success).length, 
          0
        ),
        results: results
      };

      // ディレクトリが存在しない場合は作成
      if (!fs.existsSync(Config.REPORTS_OUTPUT_PATH)) {
        fs.mkdirSync(Config.REPORTS_OUTPUT_PATH, { recursive: true });
      }

      const detailedPath = path.join(Config.REPORTS_OUTPUT_PATH, 'roblox-transform-detailed.json');
      fs.writeFileSync(detailedPath, JSON.stringify(detailedResults, null, 2));

      // サマリレポートの生成
      const summary = {
        generatedAt: new Date().toISOString(),
        statistics: {
          totalFurniture: results.length,
          totalImages: detailedResults.totalImages,
          successImages: detailedResults.successImages,
          failImages: detailedResults.totalImages - detailedResults.successImages,
          successRate: detailedResults.totalImages > 0 
            ? Math.round((detailedResults.successImages / detailedResults.totalImages) * 100) 
            : 0
        },
        categoryBreakdown: this.generateCategoryBreakdown(results),
        styleBreakdown: this.generateStyleBreakdown(results),
        topPerformers: this.identifyTopPerformers(results)
      };

      const summaryPath = path.join(Config.REPORTS_OUTPUT_PATH, 'roblox-transform-summary.json');
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

      this.logger.info('変換結果保存完了', {
        detailedPath,
        summaryPath,
        totalResults: results.length
      });

    } catch (error) {
      this.logger.error('結果保存エラー', {
        error: (error as Error).message
      });
      throw error;
    }
  }

  /**
   * カテゴリ別集計
   */
  private generateCategoryBreakdown(results: Array<{
    furnitureData: FurnitureData;
    results: ImageTransformResult[];
  }>): Record<string, any> {
    const breakdown: Record<string, any> = {};

    results.forEach(item => {
      const category = item.furnitureData.category;
      if (!breakdown[category]) {
        breakdown[category] = {
          count: 0,
          successCount: 0,
          avgMarketability: 0,
          avgCompatibility: 0
        };
      }

      breakdown[category].count += item.results.length;
      breakdown[category].successCount += item.results.filter(r => r.success).length;
      
      const marketabilities = item.results
        .filter(r => r.success && r.marketability)
        .map(r => r.marketability!);
      
      const compatibilities = item.results
        .filter(r => r.success && r.robloxCompatibility)
        .map(r => r.robloxCompatibility!);

      if (marketabilities.length > 0) {
        breakdown[category].avgMarketability = 
          marketabilities.reduce((sum, val) => sum + val, 0) / marketabilities.length;
      }

      if (compatibilities.length > 0) {
        breakdown[category].avgCompatibility = 
          compatibilities.reduce((sum, val) => sum + val, 0) / compatibilities.length;
      }
    });

    return breakdown;
  }

  /**
   * スタイル別集計
   */
  private generateStyleBreakdown(results: Array<{
    furnitureData: FurnitureData;
    results: ImageTransformResult[];
  }>): Record<string, any> {
    const breakdown: Record<string, any> = {};

    results.forEach(item => {
      item.results.forEach(result => {
        const style = result.style;
        if (!breakdown[style]) {
          breakdown[style] = {
            count: 0,
            successCount: 0,
            avgMarketability: 0,
            avgCompatibility: 0
          };
        }

        breakdown[style].count++;
        if (result.success) {
          breakdown[style].successCount++;
        }
      });
    });

    return breakdown;
  }

  /**
   * トップパフォーマーの特定
   */
  private identifyTopPerformers(results: Array<{
    furnitureData: FurnitureData;
    results: ImageTransformResult[];
  }>): Array<any> {
    return results
      .map(item => {
        const successfulResults = item.results.filter(r => r.success);
        const avgMarketability = successfulResults.length > 0
          ? successfulResults.reduce((sum, r) => sum + (r.marketability || 0), 0) / successfulResults.length
          : 0;

        return {
          furnitureId: item.furnitureData.id,
          furnitureName: item.furnitureData.name,
          category: item.furnitureData.category,
          successCount: successfulResults.length,
          totalAttempts: item.results.length,
          avgMarketability,
          brand: item.furnitureData.brand
        };
      })
      .sort((a, b) => b.avgMarketability - a.avgMarketability)
      .slice(0, 10);
  }

  /**
   * 複数スタイルを並列で変換
   */
  private async transformStylesInParallel(
    originalImagePath: string,
    styles: RobloxStyleType[],
    furniture: FurnitureData
  ): Promise<ImageTransformResult[]> {
    const startTime = Date.now();
    
    this.logger.info('並列スタイル変換開始', {
      furnitureId: furniture.id,
      totalStyles: styles.length,
      maxConcurrency: Config.MAX_CONCURRENT_TRANSFORMS
    });

    const transformPromises = styles.map(async (style) => {
      const styleStartTime = Date.now();
      
      // セマフォを取得（並列数制限）
      await this.semaphore.acquire();
      
      try {
        this.logger.info('スタイル変換開始', {
          furnitureId: furniture.id,
          style,
          imagePath: originalImagePath
        });

        const result = await this.transformService.transformForRoblox(
          originalImagePath,
          style,
          furniture
        );

        const styleEndTime = Date.now();
        const processingTime = styleEndTime - styleStartTime;

        this.logger.info('スタイル変換完了', {
          furnitureId: furniture.id,
          style,
          success: result.success,
          outputPath: result.success ? result.transformedPath : undefined,
          error: result.success ? undefined : result.error,
          processingTime: `${processingTime}ms`
        });

        return {
          ...result,
          processingTime
        };
      } catch (error) {
        const styleEndTime = Date.now();
        const processingTime = styleEndTime - styleStartTime;
        
        this.logger.error('スタイル変換中にエラー', {
          furnitureId: furniture.id,
          style,
          error: (error as Error).message,
          processingTime: `${processingTime}ms`
        });

        return {
          success: false,
          originalPath: originalImagePath,
          style,
          prompt: '',
          error: (error as Error).message,
          processingTime
        } as ImageTransformResult;
      } finally {
        // セマフォを解放
        this.semaphore.release();
      }
    });

    // すべての変換を並列実行
    const results = await Promise.all(transformPromises);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const successCount = results.filter(r => r.success).length;
    
    this.logger.info('並列スタイル変換完了', {
      furnitureId: furniture.id,
      totalStyles: styles.length,
      successCount,
      failCount: results.length - successCount,
      totalTime: `${totalTime}ms`,
      averagePerStyle: `${Math.round(totalTime / styles.length)}ms`
    });

    return results;
  }
}
