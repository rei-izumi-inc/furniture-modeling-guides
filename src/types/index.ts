/**
 * 家具画像の詳細情報
 */
export interface FurnitureImage {
  id: string;
  url: string;
  cdnUrl?: string;
  type: 'main' | 'detail' | 'lifestyle' | '360' | 'ar_view';
  altText?: string;
  position?: number;
  width?: number;
  height?: number;
  fileSizeBytes?: number;
  format?: string;
  colorProfile?: string;
  aiTags?: string[];
  dominantColors?: string[];
  qualityScore?: number;
  usageContext?: string[];
  roomContext?: string;
}

/**
 * 家具データの基本インターフェース
 */
export interface FurnitureData {
  id: string;
  name: string;
  category: string;
  originalImageUrl: string;
  brand: string;
  metadata: Record<string, any>;
  images?: FurnitureImage[];
}

/**
 * Robloxスタイル変換設定
 */
export interface RobloxTransformConfig {
  style: RobloxStyleType;
  prompt: string;
  quality: 'standard' | 'hd';
  size: '1024x1024' | '1792x1024' | '1024x1792';
}

/**
 * マークダウン生成のテンプレートデータ
 */
export interface MarkdownTemplateData {
  furnitureId: string;
  furnitureName: string;
  category: string;
  brand: string;
  date: string;
  originalImagePath: string;
  dimensions?: string;
  materials?: string;
  price?: string;
  description?: string;
  styles: StyleTemplateData[];
  suggestedPrice?: number;
  targetAudience?: string;
  sellingPoints?: string[];
}

/**
 * スタイル別テンプレートデータ
 */
export interface StyleTemplateData {
  style: RobloxStyleType;
  imagePath: string;
  compatibility: number;
  marketability: number;
  notes: string;
}

/**
 * マークダウン生成結果
 */
export interface MarkdownGenerationResult {
  success: boolean;
  markdownPath?: string;
  content?: string;
  error?: string;
  processingTime: number;
}

/**
 * OpenAI API レスポンス
 */
export interface OpenAIImageResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
}

/**
 * 画像変換結果
 */
export interface ImageTransformResult {
  success: boolean;
  originalPath: string;
  transformedPath?: string;
  style: RobloxStyleType;
  prompt: string;
  marketability?: number;
  robloxCompatibility?: number;
  designNotes?: string;
  error?: string;
  processingTime: number;
}

/**
 * Robloxスタイルの種類
 */
export type RobloxStyleType = 
  | 'roblox-cartoony'      // カートゥーン調
  | 'roblox-realistic'     // リアル調
  | 'roblox-minimalist'    // ミニマル
  | 'roblox-fantasy'       // ファンタジー
  | 'roblox-modern'        // モダン
  | 'roblox-retro';        // レトロ

/**
 * Robloxスタイル変換結果
 */
export interface RobloxVariation {
  style: RobloxStyleType;
  imagePath: string;
  marketability: number;        // 販売魅力度 (0-1)
  robloxCompatibility: number;  // Roblox適合度 (0-1)
  designNotes: string;          // 3Dモデリング指針
  transformPrompt: string;      // 使用した変換プロンプト
}

/**
 * 変換結果のまとめ
 */
export interface RobloxTransformResult {
  originalId: string;
  originalData: FurnitureData;
  originalImagePath: string;
  robloxVariations: RobloxVariation[];
  transformedAt: string;
}

/**
 * 最終的な出力レポート
 */
export interface RobloxAssetReport {
  metadata: {
    generatedAt: string;
    totalItems: number;
    targetPlatform: 'roblox';
    version: string;
  };
  furnitureItems: Array<{
    productInfo: FurnitureData;
    originalImage: string;
    robloxVariations: RobloxVariation[];
    designRecommendations: string[];
    marketingStrategy: string;
  }>;
  appendix: {
    robloxDesignGuidelines: string;
    sellingBestPractices: string;
    styleGuideReference: Record<RobloxStyleType, string>;
  };
}

/**
 * BigQueryからの取得設定
 */
export interface QueryConfig {
  limit?: number;
  offset?: number;
  category?: string;
  brand?: string;
  minDate?: string;
  maxDate?: string;
}

/**
 * バッチ処理の設定
 */
export interface BatchConfig {
  batchSize: number;
  maxConcurrentDownloads: number;
  maxConcurrentTransforms: number;
  outputFormat: 'markdown' | 'pdf' | 'both';
  targetStyles: RobloxStyleType[];
}

/**
 * 画像ダウンロード結果
 */
export interface ImageDownloadResult {
  furnitureId: string;
  originalUrl: string;
  localPath: string;
  downloaded: boolean;
  error?: string;
  fileSize?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

/**
 * エラー情報
 */
export interface ProcessingError {
  stage: 'data-fetch' | 'image-download' | 'style-transform' | 'markdown-generation' | 'pdf-conversion';
  furnitureId?: string;
  error: string;
  timestamp: string;
}
