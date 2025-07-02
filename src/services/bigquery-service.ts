import { BigQuery } from '@google-cloud/bigquery';
import { Config } from '../utils/config';
import { Logger } from '../utils/logger';
import { FurnitureData, FurnitureImage, QueryConfig } from '../types';

/**
 * BigQueryサービスクラス
 */
export class BigQueryService {
  private bigquery: BigQuery;
  private logger = Logger.getInstance();
  private projectId: string;
  private datasetId: string;

  constructor() {
    this.projectId = Config.GOOGLE_CLOUD_PROJECT_ID;
    this.datasetId = Config.BIGQUERY_DATASET_ID;
    
    this.bigquery = new BigQuery({
      projectId: this.projectId,
      keyFilename: Config.GOOGLE_APPLICATION_CREDENTIALS
    });
  }

  /**
   * 接続確認
   */
  async validateConnection(): Promise<boolean> {
    try {
      const datasets = await this.bigquery.getDatasets();
      this.logger.info('BigQuery接続確認成功', { 
        datasetCount: datasets[0].length 
      });
      return true;
    } catch (error) {
      this.logger.error('BigQuery接続エラー', { 
        error: (error as Error).message 
      });
      return false;
    }
  }

  /**
   * 家具データと画像を取得する
   */
  async fetchFurnitureData(config: QueryConfig = {}): Promise<FurnitureData[]> {
    try {
      const { limit = 100, offset = 0, category, brand, minDate, maxDate } = config;
      
      this.logger.info(`家具データを取得中... (limit: ${limit}, offset: ${offset})`);

      const query = `
        SELECT 
          p.platform_product_id,
          p.title as platform_title,
          p.description as platform_description,
          p.platform_name,
          p.price_current,
          p.currency_code,
          p.is_on_sale,
          p.stock_status,
          p.is_available,
          u.universal_product_id,
          u.canonical_title,
          u.canonical_description,
          u.furniture_type,
          u.canonical_category_path,
          u.style_tags,
          u.ai_category,
          u.ai_confidence,
          i.image_id,
          i.image_url,
          i.image_cdn_url,
          i.image_type,
          i.alt_text,
          i.position,
          i.width,
          i.height,
          i.file_size_bytes,
          i.format,
          i.color_profile,
          i.ai_tags,
          i.dominant_colors,
          i.image_quality_score,
          i.usage_context,
          i.room_context
        FROM \`${this.projectId}.${this.datasetId}.platform_products\` p
        INNER JOIN \`${this.projectId}.${this.datasetId}.multi_platform_images\` i
          ON p.platform_product_id = i.platform_product_id
        INNER JOIN \`${this.projectId}.${this.datasetId}.universal_products\` u
          ON p.universal_product_id = u.universal_product_id
        WHERE u.furniture_type IS NOT NULL
          AND i.image_url IS NOT NULL
          AND i.image_url != ''
          AND i.image_type = 'main'
          AND u.status = 'active'
          AND p.is_available = true
          ${category ? `AND u.furniture_type = '${category}'` : ''}
          ${brand ? `AND p.platform_name = '${brand}'` : ''}
          ${minDate ? `AND p.updated_at >= '${minDate}'` : ''}
          ${maxDate ? `AND p.updated_at <= '${maxDate}'` : ''}
        ORDER BY u.ai_confidence DESC, i.image_quality_score DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      const [rows] = await this.bigquery.query(query);
      
      // データを整形（メイン画像のみを扱うため、シンプルな構造）
      const result: FurnitureData[] = rows.map((row: any) => {
        const mainImage: FurnitureImage = {
          id: row.image_id,
          url: row.image_url,
          cdnUrl: row.image_cdn_url,
          type: row.image_type, // 常に'main'
          altText: row.alt_text,
          position: row.position,
          width: row.width,
          height: row.height,
          fileSizeBytes: row.file_size_bytes,
          format: row.format,
          colorProfile: row.color_profile,
          aiTags: row.ai_tags || [],
          dominantColors: row.dominant_colors || [],
          qualityScore: row.image_quality_score,
          usageContext: row.usage_context || [],
          roomContext: row.room_context
        };

        return {
          id: row.platform_product_id,
          name: row.canonical_title || row.platform_title,
          category: row.furniture_type,
          originalImageUrl: row.image_url, // メイン画像URLを直接設定
          brand: row.platform_name,
          metadata: {
            description: row.canonical_description || row.platform_description,
            categoryPath: row.canonical_category_path || [],
            styleTags: row.style_tags || [],
            price: row.price_current,
            currency: row.currency_code,
            isOnSale: row.is_on_sale,
            isAvailable: row.is_available,
            stockStatus: row.stock_status,
            universalProductId: row.universal_product_id,
            aiCategory: row.ai_category,
            aiConfidence: row.ai_confidence
          },
          images: [mainImage] // メイン画像のみを含む配列
        };
      });

      this.logger.info(`家具データを取得完了: ${result.length} 商品（全てメイン画像付き）`);
      
      return result;
    } catch (error) {
      this.logger.error('家具データの取得に失敗しました:', error);
      throw error;
    }
  }

  /**
   * データ統計を取得
   */
  async getDataStats(): Promise<{
    totalCount: number;
    categoryBreakdown: Record<string, number>;
    brandBreakdown: Record<string, number>;
  }> {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT p.platform_product_id) as total_count,
          u.furniture_type as category,
          p.platform_name as brand
        FROM \`${this.projectId}.${this.datasetId}.platform_products\` p
        INNER JOIN \`${this.projectId}.${this.datasetId}.universal_products\` u
          ON p.universal_product_id = u.universal_product_id
        WHERE u.furniture_type IS NOT NULL
          AND u.status = 'active'
          AND p.is_available = true
        GROUP BY u.furniture_type, p.platform_name
      `;

      const [rows] = await this.bigquery.query(query);
      
      let totalCount = 0;
      const categoryBreakdown: Record<string, number> = {};
      const brandBreakdown: Record<string, number> = {};

      for (const row of rows) {
        const count = parseInt(row.total_count);
        totalCount += count;
        
        categoryBreakdown[row.category] = (categoryBreakdown[row.category] || 0) + count;
        brandBreakdown[row.brand] = (brandBreakdown[row.brand] || 0) + count;
      }

      return { totalCount, categoryBreakdown, brandBreakdown };

    } catch (error) {
      this.logger.error('データ統計取得エラー', { 
        error: (error as Error).message 
      });
      throw error;
    }
  }

  /**
   * カテゴリー一覧を取得
   */
  async getCategories(): Promise<string[]> {
    try {
      const query = `
        SELECT DISTINCT u.furniture_type as category
        FROM \`${this.projectId}.${this.datasetId}.universal_products\` u
        WHERE u.furniture_type IS NOT NULL
          AND u.status = 'active'
        ORDER BY u.furniture_type
      `;

      const [rows] = await this.bigquery.query(query);
      return rows.map((row: any) => row.category).filter(Boolean);

    } catch (error) {
      this.logger.error('カテゴリー取得エラー', { 
        error: (error as Error).message 
      });
      throw error;
    }
  }

  /**
   * ブランド一覧を取得
   */
  async getBrands(): Promise<string[]> {
    try {
      const query = `
        SELECT DISTINCT p.platform_name as brand
        FROM \`${this.projectId}.${this.datasetId}.platform_products\` p
        WHERE p.platform_name IS NOT NULL
          AND p.is_available = true
        ORDER BY p.platform_name
      `;

      const [rows] = await this.bigquery.query(query);
      return rows.map((row: any) => row.brand).filter(Boolean);

    } catch (error) {
      this.logger.error('ブランド取得エラー', { 
        error: (error as Error).message 
      });
      throw error;
    }
  }
}
