#!/usr/bin/env node

import { RobloxTransformBatch } from './src/batch/roblox-transform';
import { RobloxStyleType } from './src/types';

/**
 * Roblox画像変換バッチのCLIエントリポイント
 */
async function main() {
  // コマンドライン引数をパース
  const args = process.argv.slice(2);
  const options: any = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--limit' && i + 1 < args.length) {
      options.limit = parseInt(args[i + 1]);
      i++;
    } else if (arg === '--styles' && i + 1 < args.length) {
      options.styles = args[i + 1].split(',') as RobloxStyleType[];
      i++;
    } else if (arg === '--furniture-ids' && i + 1 < args.length) {
      options.furnitureIds = args[i + 1].split(',');
      i++;
    }
  }

  try {
    console.log('🎨 Roblox画像変換バッチを開始します...');
    console.log('オプション:', options);

    const batch = new RobloxTransformBatch();
    await batch.execute(options);

    console.log('✅ Roblox画像変換が正常に完了しました');
    process.exit(0);

  } catch (error) {
    console.error('❌ Roblox画像変換でエラーが発生しました:', error);
    process.exit(1);
  }
}

main();
