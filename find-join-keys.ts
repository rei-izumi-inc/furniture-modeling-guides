import { BigQuery } from '@google-cloud/bigquery';
import * as dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function findJoinKeys() {
  try {
    console.log('🔍 結合キーを探索中...\n');

    // multi_platform_imagesのplatform_product_idのサンプルを確認
    console.log('📋 multi_platform_images platform_product_id サンプル:');
    const imageIdQuery = `
      SELECT DISTINCT platform_product_id
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\`
      LIMIT 10
    `;
    
    const [imageIdRows] = await bigquery.query(imageIdQuery);
    imageIdRows.forEach((row: any, index: number) => {
      console.log(`  ${index + 1}: ${row.platform_product_id}`);
    });

    // mart_furniture_catalogのidサンプルを確認
    console.log('\n📋 mart_furniture_catalog id サンプル:');
    const martIdQuery = `
      SELECT DISTINCT id
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.mart_furniture_catalog\`
      LIMIT 10
    `;
    
    const [martIdRows] = await bigquery.query(martIdQuery);
    martIdRows.forEach((row: any, index: number) => {
      console.log(`  ${index + 1}: ${row.id}`);
    });

    // platform_skuとの関係を確認
    console.log('\n📋 mart_furniture_catalog platform_sku サンプル:');
    const skuQuery = `
      SELECT DISTINCT platform_sku
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.mart_furniture_catalog\`
      WHERE platform_sku IS NOT NULL
      LIMIT 10
    `;
    
    const [skuRows] = await bigquery.query(skuQuery);
    skuRows.forEach((row: any, index: number) => {
      console.log(`  ${index + 1}: ${row.platform_sku}`);
    });

    // 他の画像関連テーブルがあるかチェック
    console.log('\n🔍 データセット内の全テーブルを確認:');
    const dataset = bigquery.dataset(process.env.BIGQUERY_DATASET_ID!);
    const [tables] = await dataset.getTables();
    
    const imageRelatedTables = tables.filter(table => 
      table.id?.includes('image') || table.id?.includes('photo') || table.id?.includes('media')
    );
    
    console.log('画像関連テーブル:');
    imageRelatedTables.forEach((table, index) => {
      console.log(`  ${index + 1}: ${table.id}`);
    });

    // 商品関連テーブルも確認
    const productRelatedTables = tables.filter(table => 
      table.id?.includes('product') || table.id?.includes('item') || table.id?.includes('catalog')
    );
    
    console.log('\n商品関連テーブル:');
    productRelatedTables.forEach((table, index) => {
      console.log(`  ${index + 1}: ${table.id}`);
    });

    // multi_platform_productsテーブルがあるかチェック
    const platformProductTables = tables.filter(table => 
      table.id?.includes('platform') && (table.id?.includes('product') || table.id?.includes('item'))
    );
    
    console.log('\nプラットフォーム商品テーブル:');
    if (platformProductTables.length > 0) {
      platformProductTables.forEach((table, index) => {
        console.log(`  ${index + 1}: ${table.id}`);
      });

      // 最初のプラットフォーム商品テーブルのスキーマを確認
      if (platformProductTables[0]) {
        console.log(`\n📋 ${platformProductTables[0].id} テーブルスキーマ:`);
        const [metadata] = await platformProductTables[0].getMetadata();
        const schema = metadata.schema;
        
        if (schema && schema.fields) {
          schema.fields.forEach((field: any) => {
            console.log(`  - ${field.name}: ${field.type} ${field.mode || ''}`);
          });
        }
      }
    } else {
      console.log('  見つかりませんでした');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラー詳細:', error.message);
    }
  }
}

// スクリプト実行
findJoinKeys();
