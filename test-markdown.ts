import { MarkdownGeneratorService } from './src/services/markdown-generator-service';
import { FurnitureData, ImageTransformResult } from './src/types';

// テスト用データ
const furnitureData: FurnitureData = {
  id: '22d925f4-bc72-45ab-baf1-fc7321edd247',
  name: 'レーヌ ベッド シングル',
  category: 'bed',
  brand: 'francfranc',
  originalImageUrl: 'output/original-images/22d925f4-bc72-45ab-baf1-fc7321edd247_francfranc_bed_レーヌ_ベッド_シングル.jpg',
  metadata: {
    price: 29800,
    description: '人気のレーヌシリーズにお求めになりやすい価格のベッドフレームが登場しました。シンプルな形状ながら寝具を掛けても覗くゴールドの脚が程よいアクセントとなり、高級感のあるお部屋を演出します。'
  }
};

const transformResults: ImageTransformResult[] = [
  {
    success: true,
    originalPath: 'output/original-images/22d925f4-bc72-45ab-baf1-fc7321edd247_francfranc_bed_レーヌ_ベッド_シングル.jpg',
    transformedPath: 'output/roblox-transformed/22d925f4-bc72-45ab-baf1-fc7321edd247_francfranc_bed_レーヌ_ベッド_シングル_roblox-cartoony.png',
    style: 'roblox-cartoony',
    prompt: 'Test prompt',
    marketability: 0.95,
    robloxCompatibility: 0.95,
    designNotes: '3Dモデリング時は角を丸く、色彩を鮮やかに。子供向けゲームに最適。 カテゴリ「bed」向けに最適化。',
    processingTime: 25000
  }
];

async function testMarkdownGeneration() {
  console.log('🧪 マークダウン生成テスト開始...');
  
  const service = new MarkdownGeneratorService();
  const result = await service.generateRobloxModelingGuide(furnitureData, transformResults);
  
  if (result.success) {
    console.log('✅ マークダウン生成成功:', result.markdownPath);
    console.log('📄 内容長:', result.content?.length || 0, '文字');
  } else {
    console.log('❌ マークダウン生成失敗:', result.error);
  }
}

testMarkdownGeneration().catch(console.error);
