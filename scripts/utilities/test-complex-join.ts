import { BigQuery } from '@google-cloud/bigquery';
import * as dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function testComplexJoin() {
  try {
    console.log('🔍 3テーブル結合のテスト...\n');

    // platform_productsとmulti_platform_imagesの結合を確認
    console.log('📋 Step 1: platform_products × multi_platform_images');
    const step1Query = `
      SELECT COUNT(*) as join_count
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.platform_products\` p
      INNER JOIN \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\` i
      ON p.platform_product_id = i.platform_product_id
    `;
    
    const [step1Rows] = await bigquery.query(step1Query);
    console.log(`  結合可能件数: ${step1Rows[0].join_count} 件`);

    // universal_product_idを持つplatform_productsの確認
    console.log('\n📋 Step 2: universal_product_id 存在確認');
    const step2Query = `
      SELECT 
        COUNT(DISTINCT universal_product_id) as unique_universal_ids,
        COUNT(*) as platform_products_count
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.platform_products\`
      WHERE universal_product_id IS NOT NULL
    `;
    
    const [step2Rows] = await bigquery.query(step2Query);
    console.log(`  ユニークuniversal_product_id: ${step2Rows[0].unique_universal_ids} 件`);
    console.log(`  platform_products総数: ${step2Rows[0].platform_products_count} 件`);

    // universal_productsテーブルとの結合確認
    console.log('\n📋 Step 3: platform_products × universal_products');
    const step3Query = `
      SELECT COUNT(*) as join_count
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.platform_products\` p
      INNER JOIN \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.universal_products\` u
      ON p.universal_product_id = u.universal_product_id
    `;
    
    const [step3Rows] = await bigquery.query(step3Query);
    console.log(`  結合可能件数: ${step3Rows[0].join_count} 件`);

    // 3つのテーブルを結合してサンプルデータを取得
    console.log('\n📝 3テーブル結合サンプル（最初の5件）:');
    const fullJoinQuery = `
      SELECT 
        p.platform_product_id,
        p.title as platform_title,
        p.platform_name,
        p.price_current,
        p.currency_code,
        u.universal_product_id,
        u.canonical_title,
        u.furniture_type,
        u.canonical_category_path,
        i.image_id,
        i.image_url,
        i.image_type,
        i.width,
        i.height,
        i.format
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.platform_products\` p
      INNER JOIN \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\` i
        ON p.platform_product_id = i.platform_product_id
      INNER JOIN \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.universal_products\` u
        ON p.universal_product_id = u.universal_product_id
      WHERE i.image_type = 'main'
      LIMIT 5
    `;
    
    const [fullJoinRows] = await bigquery.query(fullJoinQuery);
    fullJoinRows.forEach((row: any, index: number) => {
      console.log(`\n  📄 サンプル ${index + 1}:`);
      Object.keys(row).forEach(key => {
        const value = row[key];
        if (typeof value === 'string' && value.length > 80) {
          console.log(`    ${key}: ${value.substring(0, 80)}...`);
        } else if (Array.isArray(value)) {
          console.log(`    ${key}: [${value.join(', ')}]`);
        } else {
          console.log(`    ${key}: ${value}`);
        }
      });
    });

    // カテゴリ別統計
    console.log('\n📊 家具タイプ別統計:');
    const categoryQuery = `
      SELECT 
        u.furniture_type,
        COUNT(DISTINCT p.platform_product_id) as unique_products,
        COUNT(DISTINCT i.image_id) as total_images,
        COUNT(CASE WHEN i.image_type = 'main' THEN 1 END) as main_images,
        COUNT(CASE WHEN i.image_type = 'detail' THEN 1 END) as detail_images
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.platform_products\` p
      INNER JOIN \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\` i
        ON p.platform_product_id = i.platform_product_id
      INNER JOIN \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.universal_products\` u
        ON p.universal_product_id = u.universal_product_id
      GROUP BY u.furniture_type
      ORDER BY unique_products DESC
    `;
    
    const [categoryRows] = await bigquery.query(categoryQuery);
    categoryRows.forEach((row: any) => {
      console.log(`  ${row.furniture_type}: ${row.unique_products} 商品, ${row.total_images} 画像 (メイン: ${row.main_images}, 詳細: ${row.detail_images})`);
    });

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラー詳細:', error.message);
    }
  }
}

// スクリプト実行
testComplexJoin();
