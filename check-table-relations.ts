import { BigQuery } from '@google-cloud/bigquery';
import * as dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function checkTableRelations() {
  try {
    console.log('🔍 テーブル間の関係を調査中...\n');

    // mart_furniture_catalogのスキーマを確認
    console.log('📋 mart_furniture_catalog テーブルスキーマ:');
    const dataset = bigquery.dataset(process.env.BIGQUERY_DATASET_ID!);
    const martTable = dataset.table('mart_furniture_catalog');
    
    const [martMetadata] = await martTable.getMetadata();
    const martSchema = martMetadata.schema;
    
    if (martSchema && martSchema.fields) {
      martSchema.fields.forEach((field: any) => {
        console.log(`  - ${field.name}: ${field.type} ${field.mode || ''}`);
      });
    }

    // mart_furniture_catalogとmulti_platform_imagesの結合可能性をチェック
    console.log('\n🔗 テーブル結合可能性の調査:');
    
    // 1. idで結合可能かチェック
    const productIdCheckQuery = `
      SELECT 
        COUNT(*) as mart_products,
        COUNT(DISTINCT id) as unique_product_ids
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.mart_furniture_catalog\`
      WHERE id IS NOT NULL
    `;
    
    const [martProductRows] = await bigquery.query(productIdCheckQuery);
    console.log(`  mart_furniture_catalog: ${martProductRows[0].mart_products} 件, ユニークid: ${martProductRows[0].unique_product_ids} 件`);

    // 2. multi_platform_imagesのplatform_product_idと一致するか確認
    const matchCheckQuery = `
      SELECT COUNT(*) as matching_records
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.mart_furniture_catalog\` m
      INNER JOIN \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\` i
      ON m.id = i.platform_product_id
    `;
    
    const [matchRows] = await bigquery.query(matchCheckQuery);
    console.log(`  結合可能なレコード数: ${matchRows[0].matching_records} 件`);

    // 3. 結合データのサンプルを取得
    console.log('\n📝 結合データサンプル（最初の3件）:');
    const joinSampleQuery = `
      SELECT 
        m.id as product_id,
        m.name as product_name,
        m.category,
        m.primary_category,
        m.secondary_category,
        m.price,
        m.currency_code,
        i.image_id,
        i.image_url,
        i.image_type,
        i.width,
        i.height,
        i.format,
        i.room_context
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.mart_furniture_catalog\` m
      INNER JOIN \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\` i
      ON m.id = i.platform_product_id
      WHERE i.image_type = 'main'
      LIMIT 3
    `;
    
    const [joinSampleRows] = await bigquery.query(joinSampleQuery);
    joinSampleRows.forEach((row: any, index: number) => {
      console.log(`\n  📄 サンプル ${index + 1}:`);
      Object.keys(row).forEach(key => {
        const value = row[key];
        if (typeof value === 'string' && value.length > 80) {
          console.log(`    ${key}: ${value.substring(0, 80)}...`);
        } else {
          console.log(`    ${key}: ${value}`);
        }
      });
    });

    // 4. カテゴリ別の結合データ統計
    console.log('\n📊 カテゴリ別結合データ統計:');
    const categoryStatsQuery = `
      SELECT 
        m.primary_category,
        COUNT(DISTINCT m.id) as unique_products,
        COUNT(*) as total_images,
        COUNT(CASE WHEN i.image_type = 'main' THEN 1 END) as main_images,
        COUNT(CASE WHEN i.image_type = 'detail' THEN 1 END) as detail_images
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.mart_furniture_catalog\` m
      INNER JOIN \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\` i
      ON m.id = i.platform_product_id
      GROUP BY m.primary_category
      ORDER BY unique_products DESC
    `;
    
    const [categoryStatsRows] = await bigquery.query(categoryStatsQuery);
    categoryStatsRows.forEach((row: any) => {
      console.log(`  ${row.primary_category}: ${row.unique_products} 商品, ${row.total_images} 画像 (メイン: ${row.main_images}, 詳細: ${row.detail_images})`);
    });

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラー詳細:', error.message);
    }
  }
}

// スクリプト実行
checkTableRelations();
