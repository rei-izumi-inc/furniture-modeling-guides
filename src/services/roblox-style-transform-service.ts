import OpenAI from 'openai';
import { Config } from '../utils/config';
import { Logger } from '../utils/logger';
import { RobloxStyleType, RobloxTransformConfig, OpenAIImageResponse, ImageTransformResult } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

/**
 * Roblox向け画像スタイル変換サービス
 */
export class RobloxStyleTransformService {
  private openai: OpenAI;
  private logger = Logger.getInstance();
  private config = Config.getInstance();
  
  // Robloxスタイルのプロンプトテンプレート
  private readonly stylePrompts: Record<RobloxStyleType, string> = {
    'roblox-cartoony': `
      Transform this furniture into a Roblox-style cartoony design:
      - Bright, vivid colors with high saturation
      - Simplified geometric shapes with rounded edges
      - Playful, fun aesthetic suitable for kids
      - Bold outlines and clean surfaces
      - Cartoon-like proportions, slightly exaggerated
      - Perfect for Roblox avatar scale and virtual spaces
      Style: cartoony, colorful, kid-friendly, blocky but smooth
    `,
    'roblox-realistic': `
      Transform this furniture into a Roblox-style realistic design:
      - More detailed textures while maintaining Roblox compatibility
      - Realistic proportions but slightly simplified
      - Natural color palette with good contrast
      - Clean, modern aesthetic
      - Suitable for sophisticated Roblox environments
      - Maintains recognizable furniture functionality
      Style: realistic but Roblox-optimized, clean, modern
    `,
    'roblox-minimalist': `
      Transform this furniture into a Roblox-style minimalist design:
      - Ultra-clean, simple geometric forms
      - Monochromatic or very limited color palette
      - No unnecessary details or decorations
      - Focus on essential functionality
      - Scandinavian-inspired simplicity
      - Perfect for modern Roblox builds
      Style: minimalist, clean, geometric, simple
    `,
    'roblox-fantasy': `
      Transform this furniture into a Roblox-style fantasy design:
      - Magical, enchanted appearance
      - Rich, mystical colors (purples, golds, deep blues)
      - Ornate details but Roblox-appropriate
      - Fantasy game aesthetic
      - Could have glowing or magical elements
      - Suitable for RPG-style Roblox games
      Style: fantasy, magical, ornate, mystical
    `,
    'roblox-modern': `
      Transform this furniture into a Roblox-style modern design:
      - Sleek, contemporary appearance
      - Clean lines and smooth surfaces
      - Neutral colors with metallic accents
      - High-tech, futuristic feel
      - Perfect for modern/sci-fi Roblox environments
      - Sophisticated but accessible design
      Style: modern, sleek, futuristic, clean
    `,
    'roblox-retro': `
      Transform this furniture into a Roblox-style retro design:
      - Vintage 70s-80s aesthetic
      - Warm, nostalgic color palette
      - Slightly oversized, comfortable proportions
      - Classic patterns or textures
      - Throwback appeal for nostalgic players
      - Fun, relaxed atmosphere
      Style: retro, vintage, nostalgic, warm
    `
  };

  constructor() {
    this.openai = new OpenAI({
      apiKey: this.config.OPENAI_API_KEY
    });
  }

  /**
   * 家具画像をRobloxスタイルに変換
   */
  async transformForRoblox(
    imagePath: string, 
    style: RobloxStyleType,
    furnitureData: any
  ): Promise<ImageTransformResult> {
    const startTime = Date.now();
    
    try {
      this.logger.info('Roblox画像変換開始', {
        imagePath,
        style,
        furnitureName: furnitureData.name
      });

      // GPT-Image-1 を使用して画像生成
      const response = await this.openai.images.generate({
        model: "gpt-image-1",
        prompt: this.buildImageGenerationPrompt(style, furnitureData, imagePath),
        n: 1,
        size: "1024x1024",
        quality: "medium"  // gpt-image-1では "low", "medium", "high" を使用
      });

      this.logger.info('OpenAI画像生成成功', {
        hasData: !!response.data,
        dataLength: response.data?.length || 0,
        hasB64Json: !!response.data?.[0]?.b64_json
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('GPT-Image-1から画像が返されませんでした');
      }

      const imageData = response.data[0];
      
      // gpt-image-1はb64_jsonで画像データを返す
      if (!imageData.b64_json) {
        throw new Error('GPT-Image-1から画像データが返されませんでした');
      }

      // Base64画像データを直接保存
      const outputPath = this.generateOutputPath(imagePath, style);
      await this.saveBase64Image(imageData.b64_json, outputPath);
      
      // 結果を評価
      const marketability = this.evaluateMarketability(style, furnitureData);
      const robloxCompatibility = this.evaluateRobloxCompatibility(style);
      const designNotes = this.generateDesignNotes(style, furnitureData);

      const processingTime = Date.now() - startTime;

      this.logger.info('Roblox画像変換完了', {
        imagePath,
        outputPath,
        style,
        processingTime: `${processingTime}ms`,
        marketability,
        robloxCompatibility
      });

      return {
        success: true,
        originalPath: imagePath,
        transformedPath: outputPath,
        style,
        prompt: this.buildImageGenerationPrompt(style, furnitureData, imagePath),
        marketability,
        robloxCompatibility,
        designNotes,
        processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      this.logger.error('Roblox画像変換エラー', {
        imagePath,
        style,
        error: (error as Error).message,
        processingTime: `${processingTime}ms`
      });

      return {
        success: false,
        originalPath: imagePath,
        style,
        prompt: this.buildPrompt(style, furnitureData),
        error: (error as Error).message,
        processingTime
      };
    }
  }

  /**
   * プロンプトを構築
   */
  private buildPrompt(style: RobloxStyleType, furnitureData: any, imagePath?: string): string {
    const basePrompt = this.stylePrompts[style];
    const contextInfo = `
      Furniture details:
      - Name: ${furnitureData.name}
      - Category: ${furnitureData.category}
      - Brand: ${furnitureData.brand}
      - Description: ${furnitureData.metadata?.description || 'N/A'}
    `;
    
    return `${basePrompt}\n\n${contextInfo}\n\nCreate a Roblox-compatible ${style} version of this furniture piece.`;
  }

  /**
   * 出力パスを生成
   */
  private generateOutputPath(originalPath: string, style: RobloxStyleType): string {
    const fileName = path.basename(originalPath, path.extname(originalPath));
    const outputDir = this.config.ROBLOX_TRANSFORMED_PATH;
    
    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // gpt-image-1はPNG形式で出力するため拡張子を.pngに変更
    return path.join(outputDir, `${fileName}_${style}.png`);
  }

  /**
   * Base64画像データを保存
   */
  private async saveBase64Image(base64Data: string, outputPath: string): Promise<void> {
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(outputPath, buffer);
  }

  /**
   * 画像をダウンロード
   */
  private async downloadImage(url: string, outputPath: string): Promise<void> {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`画像ダウンロード失敗: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(outputPath, buffer);
  }

  /**
   * 画像生成用プロンプトを構築
   */
  private buildImageGenerationPrompt(style: RobloxStyleType, furnitureData: any, imagePath: string): string {
    const basePrompt = this.stylePrompts[style];
    
    return `
      Create a Roblox-style ${style.replace('roblox-', '')} version of this furniture:
      
      Original furniture: ${furnitureData.name} (${furnitureData.category})
      Brand: ${furnitureData.brand}
      
      ${basePrompt}
      
      Requirements:
      - Maintain the core functionality and recognizable features of the original furniture
      - Optimize for Roblox game environment and avatar scale
      - Use colors and materials appropriate for the ${style} aesthetic
      - Ensure the design is appealing to Roblox players
      - Keep geometric forms simple but attractive
      - Make it suitable for virtual interior design in Roblox
      
      Generate a high-quality image that 3D modelers can use as reference for creating Roblox furniture assets.
    `.trim();
  }

  /**
   * 販売魅力度を評価 (0-1)
   */
  private evaluateMarketability(style: RobloxStyleType, furnitureData: any): number {
    let score = 0.5; // ベーススコア
    
    // カテゴリごとの人気度
    const categoryPopularity: Record<string, number> = {
      'chair': 0.8,
      'table': 0.7,
      'bed': 0.9,
      'sofa': 0.8,
      'storage': 0.6
    };
    
    score += (categoryPopularity[furnitureData.category] || 0.5) * 0.3;
    
    // スタイルごとの人気度
    const stylePopularity: Record<RobloxStyleType, number> = {
      'roblox-cartoony': 0.9,
      'roblox-modern': 0.8,
      'roblox-realistic': 0.7,
      'roblox-fantasy': 0.8,
      'roblox-minimalist': 0.6,
      'roblox-retro': 0.7
    };
    
    score += stylePopularity[style] * 0.2;
    
    return Math.min(score, 1.0);
  }

  /**
   * Roblox適合度を評価 (0-1)
   */
  private evaluateRobloxCompatibility(style: RobloxStyleType): number {
    // スタイルごとのRoblox適合度
    const compatibility: Record<RobloxStyleType, number> = {
      'roblox-cartoony': 0.95,
      'roblox-modern': 0.85,
      'roblox-minimalist': 0.90,
      'roblox-fantasy': 0.85,
      'roblox-realistic': 0.75,
      'roblox-retro': 0.80
    };
    
    return compatibility[style];
  }

  /**
   * デザインノートを生成
   */
  private generateDesignNotes(style: RobloxStyleType, furnitureData: any): string {
    const styleNotes: Record<RobloxStyleType, string> = {
      'roblox-cartoony': '3Dモデリング時は角を丸く、色彩を鮮やかに。子供向けゲームに最適。',
      'roblox-realistic': '細部は簡略化しつつも質感を重視。大人向けロールプレイに適用。',
      'roblox-minimalist': '装飾を極力削り、基本形状に集中。モダンビルドに最適。',
      'roblox-fantasy': '魔法的要素を追加可能。RPGゲーム環境に最適。パーティクルエフェクト推奨。',
      'roblox-modern': '金属・ガラス質感を活用。未来的な環境に配置。',
      'roblox-retro': 'ヴィンテージ感を重視。暖色系カラーパレット推奨。'
    };
    
    return `${styleNotes[style]} カテゴリ「${furnitureData.category}」向けに最適化。`;
  }

  /**
   * 複数スタイルで一括変換
   */
  async transformMultipleStyles(
    imagePath: string,
    styles: RobloxStyleType[],
    furnitureData: any
  ): Promise<ImageTransformResult[]> {
    const results: ImageTransformResult[] = [];
    
    for (const style of styles) {
      const result = await this.transformForRoblox(imagePath, style, furnitureData);
      results.push(result);
      
      // API制限を考慮して少し待機
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }
}
