#!/usr/bin/env ts-node

import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  projectId: 'llm-furniture-coordinator',
  keyFilename: './credentials/service-account-key.json'
});

async function checkMultiPlatformImages() {
  try {
    console.log('🔍 multi-platform-imagesテーブルを確認中...\n');

    // テーブルのスキーマを取得
    const [table] = await bigquery
      .dataset('furniture_catalog_v2')
      .table('multi-platform-images')
      .getMetadata();

    console.log('📋 テーブルスキーマ:');
    table.schema.fields.forEach((field: any) => {
      console.log(`  - ${field.name}: ${field.type} ${field.mode || ''} ${field.description || ''}`);
    });

    // データ件数を確認
    const [countResult] = await bigquery.query(`
      SELECT COUNT(*) as total_count
      FROM \`llm-furniture-coordinator.furniture_catalog_v2.multi-platform-images\`
    `);
    console.log(`\n📊 総データ件数: ${countResult[0].total_count}`);

    // 画像URLがあるデータの件数を確認
    const [imageCountResult] = await bigquery.query(`
      SELECT 
        COUNT(*) as total_count,
        COUNT(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 END) as with_image_url,
        COUNT(CASE WHEN platform = 'original' THEN 1 END) as original_platform,
        COUNT(CASE WHEN platform = 'roblox' THEN 1 END) as roblox_platform
      FROM \`llm-furniture-coordinator.furniture_catalog_v2.multi-platform-images\`
    `);
    
    const stats = imageCountResult[0];
    console.log('\n📈 画像データ統計:');
    console.log(`  - 総レコード数: ${stats.total_count}`);
    console.log(`  - 画像URL有り: ${stats.with_image_url}`);
    console.log(`  - originalプラットフォーム: ${stats.original_platform}`);
    console.log(`  - robloxプラットフォーム: ${stats.roblox_platform}`);

    // プラットフォーム別の詳細
    const [platformResult] = await bigquery.query(`
      SELECT 
        platform,
        COUNT(*) as count,
        COUNT(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 END) as with_url
      FROM \`llm-furniture-coordinator.furniture_catalog_v2.multi-platform-images\`
      GROUP BY platform
      ORDER BY count DESC
    `);

    console.log('\n🎮 プラットフォーム別統計:');
    platformResult.forEach((row: any) => {
      console.log(`  - ${row.platform}: ${row.count}件 (画像URL: ${row.with_url}件)`);
    });

    // サンプルデータを表示
    const [sampleResult] = await bigquery.query(`
      SELECT 
        furniture_id,
        platform,
        image_url,
        metadata,
        created_at
      FROM \`llm-furniture-coordinator.furniture_catalog_v2.multi-platform-images\`
      WHERE image_url IS NOT NULL AND image_url != ''
      LIMIT 5
    `);

    console.log('\n🔬 サンプルデータ:');
    sampleResult.forEach((row: any, index: number) => {
      console.log(`  ${index + 1}. ID: ${row.furniture_id}, Platform: ${row.platform}`);
      console.log(`     URL: ${row.image_url}`);
      console.log(`     Metadata: ${JSON.stringify(row.metadata)}`);
      console.log(`     Created: ${row.created_at}\n`);
    });

    // furniture_idの関連を確認
    const [relationResult] = await bigquery.query(`
      SELECT 
        mpi.furniture_id,
        mfc.name,
        mfc.category,
        mfc.brand,
        COUNT(mpi.image_url) as image_count
      FROM \`llm-furniture-coordinator.furniture_catalog_v2.multi-platform-images\` mpi
      LEFT JOIN \`llm-furniture-coordinator.furniture_catalog_v2.mart_furniture_catalog\` mfc
        ON mpi.furniture_id = mfc.id
      WHERE mpi.image_url IS NOT NULL AND mpi.image_url != ''
      GROUP BY mpi.furniture_id, mfc.name, mfc.category, mfc.brand
      LIMIT 5
    `);

    console.log('🔗 家具データとの関連:');
    relationResult.forEach((row: any, index: number) => {
      console.log(`  ${index + 1}. ID: ${row.furniture_id}`);
      console.log(`     名前: ${row.name || 'N/A'}`);
      console.log(`     カテゴリ: ${row.category || 'N/A'}`);
      console.log(`     ブランド: ${row.brand || 'N/A'}`);
      console.log(`     画像数: ${row.image_count}\n`);
    });

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkMultiPlatformImages();
