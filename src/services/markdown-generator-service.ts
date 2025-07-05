import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Config } from '../utils/config';
import { Logger } from '../utils/logger';
import { 
  FurnitureData, 
  ImageTransformResult, 
  MarkdownTemplateData, 
  StyleTemplateData, 
  MarkdownGenerationResult,
  RobloxStyleType 
} from '../types';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

/**
 * マークダウン資料生成サービス
 */
export class MarkdownGeneratorService {
  private logger = Logger.getInstance();
  private config = Config.getInstance();
  private template: Handlebars.TemplateDelegate | null = null;

  constructor() {
    this.initializeTemplate();
  }

  /**
   * マークダウンテンプレートを初期化
   */
  private async initializeTemplate(): Promise<void> {
    try {
      const templateContent = this.getTemplateContent();
      this.template = Handlebars.compile(templateContent);
      
      // カスタムヘルパー関数を登録
      this.registerHelpers();
      
      this.logger.info('マークダウンテンプレート初期化完了');
    } catch (error) {
      this.logger.error('マークダウンテンプレート初期化エラー', { error: (error as Error).message });
    }
  }

  /**
   * Handlebarsヘルパー関数を登録
   */
  private registerHelpers(): void {
    // パーセンテージ表示ヘルパー
    Handlebars.registerHelper('percentage', (value: number) => {
      return Math.round(value * 100);
    });

    // 日付フォーマットヘルパー
    Handlebars.registerHelper('formatDate', (date: string) => {
      return new Date(date).toLocaleDateString('ja-JP');
    });

    // 価格フォーマットヘルパー
    Handlebars.registerHelper('formatPrice', (price: number) => {
      return price?.toLocaleString() || 'N/A';
    });

    // スタイル名を日本語に変換
    Handlebars.registerHelper('styleNameJa', (style: RobloxStyleType) => {
      const styleNames: Record<RobloxStyleType, string> = {
        'roblox-cartoony': 'カートゥーン',
        'roblox-realistic': 'リアル',
        'roblox-minimalist': 'ミニマル',
        'roblox-fantasy': 'ファンタジー',
        'roblox-modern': 'モダン',
        'roblox-retro': 'レトロ'
      };
      return styleNames[style] || style;
    });

    // 画像パスを相対パスに変換
    Handlebars.registerHelper('imageRelativePath', (imagePath: string) => {
      // output/markdown-reports/ から output/roblox-transformed/ への相対パス
      if (imagePath.startsWith('./output/roblox-transformed/')) {
        return '../roblox-transformed/' + path.basename(imagePath);
      }
      if (imagePath.startsWith('output/roblox-transformed/')) {
        return '../roblox-transformed/' + path.basename(imagePath);
      }
      // 古いパスの場合も対応
      if (imagePath.startsWith('./storage/roblox-transformed/')) {
        return '../roblox-transformed/' + path.basename(imagePath);
      }
      if (imagePath.startsWith('storage/roblox-transformed/')) {
        return '../roblox-transformed/' + path.basename(imagePath);
      }
      // ファイル名のみの場合
      return '../roblox-transformed/' + path.basename(imagePath);
    });

    // 元画像パスを相対パスに変換
    Handlebars.registerHelper('originalImagePath', (imagePath: string) => {
      // output/markdown-reports/ から output/original-images/ への相対パス
      if (imagePath.startsWith('./output/original-images/')) {
        return '../original-images/' + path.basename(imagePath);
      }
      if (imagePath.startsWith('output/original-images/')) {
        return '../original-images/' + path.basename(imagePath);
      }
      // 古いパスの場合は変換
      if (imagePath.startsWith('./storage/original-images/')) {
        return '../original-images/' + path.basename(imagePath);
      }
      return '../original-images/' + path.basename(imagePath);
    });
  }

  /**
   * Roblox制作ガイドを生成
   */
  async generateRobloxModelingGuide(
    furnitureData: FurnitureData,
    transformResults: ImageTransformResult[]
  ): Promise<MarkdownGenerationResult> {
    const startTime = Date.now();

    try {
      this.logger.info('マークダウン資料生成開始', {
        furnitureId: furnitureData.id,
        furnitureName: furnitureData.name,
        styleCount: transformResults.length
      });

      if (!this.template) {
        await this.initializeTemplate();
        if (!this.template) {
          throw new Error('テンプレートの初期化に失敗しました');
        }
      }

      // テンプレートデータを構築
      const templateData = this.buildTemplateData(furnitureData, transformResults);
      
      // マークダウンコンテンツを生成
      const markdownContent = this.template(templateData);
      
      // ファイルパスを生成
      const outputPath = this.generateOutputPath(furnitureData);
      
      // ディレクトリが存在しない場合は作成
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // ファイルに保存
      await writeFile(outputPath, markdownContent, 'utf-8');
      
      const processingTime = Date.now() - startTime;

      this.logger.info('マークダウン資料生成完了', {
        furnitureId: furnitureData.id,
        outputPath,
        processingTime: `${processingTime}ms`,
        contentLength: markdownContent.length
      });

      return {
        success: true,
        markdownPath: outputPath,
        content: markdownContent,
        processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      this.logger.error('マークダウン資料生成エラー', {
        furnitureId: furnitureData.id,
        error: (error as Error).message,
        processingTime: `${processingTime}ms`
      });

      return {
        success: false,
        error: (error as Error).message,
        processingTime
      };
    }
  }

  /**
   * テンプレートデータを構築
   */
  private buildTemplateData(
    furnitureData: FurnitureData,
    transformResults: ImageTransformResult[]
  ): MarkdownTemplateData {
    // 成功した変換結果のみを使用
    const successfulResults = transformResults.filter(result => result.success);
    
    // スタイル別データを構築
    const styles: StyleTemplateData[] = successfulResults.map(result => ({
      style: result.style,
      imagePath: result.transformedPath || '',
      compatibility: result.robloxCompatibility || 0,
      marketability: result.marketability || 0,
      notes: result.designNotes || ''
    }));

    // 販売戦略データを生成
    const avgMarketability = styles.reduce((sum, style) => sum + style.marketability, 0) / styles.length;
    const suggestedPrice = this.calculateSuggestedPrice(furnitureData.category, avgMarketability);
    const targetAudience = this.determineTargetAudience(styles);
    const sellingPoints = this.generateSellingPoints(furnitureData, styles);

    return {
      furnitureId: furnitureData.id,
      furnitureName: furnitureData.name,
      category: furnitureData.category,
      brand: furnitureData.brand,
      date: new Date().toISOString(),
      originalImagePath: successfulResults[0]?.originalPath || furnitureData.originalImageUrl,
      dimensions: furnitureData.metadata?.dimensions || 'N/A',
      materials: furnitureData.metadata?.materials || 'N/A',
      price: furnitureData.metadata?.price || 'N/A',
      description: furnitureData.metadata?.description || 'N/A',
      styles,
      suggestedPrice,
      targetAudience,
      sellingPoints
    };
  }

  /**
   * 推奨価格を計算
   */
  private calculateSuggestedPrice(category: string, marketability: number): number {
    const basePrices: Record<string, number> = {
      'chair': 50,
      'table': 75,
      'bed': 100,
      'sofa': 125,
      'storage': 60,
      'default': 75
    };

    const basePrice = basePrices[category] || basePrices.default;
    const marketabilityMultiplier = 0.5 + (marketability * 1.5); // 0.5 - 2.0の範囲
    
    return Math.round(basePrice * marketabilityMultiplier);
  }

  /**
   * ターゲット層を決定
   */
  private determineTargetAudience(styles: StyleTemplateData[]): string {
    const styleAudiences: Record<RobloxStyleType, string> = {
      'roblox-cartoony': '子供・ファミリー層',
      'roblox-realistic': '大人・上級者',
      'roblox-minimalist': 'デザイン重視のプレイヤー',
      'roblox-fantasy': 'RPG・ファンタジー好き',
      'roblox-modern': '現代的・洗練されたユーザー',
      'roblox-retro': 'ノスタルジック・レトロ好き'
    };

    // 最も適合度の高いスタイルのターゲット層を返す
    const bestStyle = styles.reduce((best, current) => 
      current.compatibility > best.compatibility ? current : best
    );

    return styleAudiences[bestStyle.style] || '一般プレイヤー';
  }

  /**
   * 販売ポイントを生成
   */
  private generateSellingPoints(furnitureData: FurnitureData, styles: StyleTemplateData[]): string[] {
    const points: string[] = [];

    // ブランド価値
    if (furnitureData.brand && furnitureData.brand !== 'unknown') {
      points.push(`${furnitureData.brand}ブランドの高品質デザイン`);
    }

    // カテゴリ別の特徴
    const categoryPoints: Record<string, string> = {
      'chair': '快適な座り心地とスタイリッシュなデザイン',
      'table': '実用的で美しいテーブルデザイン',
      'bed': '安らぎの寝室空間を演出',
      'sofa': 'リビングルームの主役となる存在感',
      'storage': '整理整頓と美観を両立'
    };

    if (categoryPoints[furnitureData.category]) {
      points.push(categoryPoints[furnitureData.category]);
    }

    // スタイル数による価値
    if (styles.length >= 3) {
      points.push(`${styles.length}種類のRobloxスタイルで多様なニーズに対応`);
    }

    // 高適合度スタイルの強調
    const highCompatibilityStyles = styles.filter(style => style.compatibility >= 0.8);
    if (highCompatibilityStyles.length > 0) {
      points.push('Roblox環境に最適化された高品質な3Dアセット');
    }

    return points;
  }

  /**
   * 出力パスを生成
   */
  private generateOutputPath(furnitureData: FurnitureData): string {
    const sanitizedName = furnitureData.name.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '_');
    const fileName = `${furnitureData.id}_${sanitizedName}_roblox_modeling_guide.md`;
    
    const outputDir = this.config.MARKDOWN_OUTPUT_PATH || './output/markdown-reports';
    return path.join(outputDir, fileName);
  }

  /**
   * マークダウンテンプレートのコンテンツを取得
   */
  private getTemplateContent(): string {
    return `# Roblox向け家具制作ガイド: {{furnitureName}}

## 基本情報

- **家具ID**: {{furnitureId}}
- **家具名**: {{furnitureName}}
- **カテゴリ**: {{category}}
- **ブランド**: {{brand}}
- **制作日**: {{formatDate date}}

## 元家具仕様

![元画像]({{originalImagePath originalImagePath}})

- **寸法**: {{dimensions}}
- **素材**: {{materials}}
- **価格**: {{price}}
- **説明**: {{description}}

## Robloxスタイル変換

{{#each styles}}
### {{styleNameJa style}} Style

![{{styleNameJa style}}]({{imageRelativePath imagePath}})

- **適合度**: {{percentage compatibility}}%
- **販売性**: {{percentage marketability}}%
- **制作ノート**: {{notes}}

{{/each}}

## 3Dモデリング指針

### 推奨ポリゴン数
- **Low**: 100-500 polygons
- **Medium**: 500-1500 polygons
- **High**: 1500-3000 polygons

### Roblox制約
- **最大テクスチャサイズ**: 1024x1024
- **LOD**: 3段階推奨
- **マテリアル**: PBR対応

### 販売戦略
- **推奨価格**: {{formatPrice suggestedPrice}} Robux
- **ターゲット層**: {{targetAudience}}
- **販売ポイント**:
{{#each sellingPoints}}
  - {{this}}
{{/each}}

## チェックリスト
- [ ] 基本形状モデリング完了
- [ ] テクスチャ適用完了
- [ ] LOD作成完了
- [ ] Roblox Studio動作確認完了
- [ ] マーケットプレイス申請準備完了

---

**制作ガイド生成日**: {{formatDate date}}  
**制作支援システム**: Roblox向け家具画像スタイル変換バッチシステム  
`;
  }
}
