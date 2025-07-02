import { BigQuery } from '@google-cloud/bigquery';
import * as dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function checkMultiPlatformImages() {
  try {
    console.log('🔍 BigQuery multi_platform_images テーブルを調査中...\n');

    const dataset = bigquery.dataset(process.env.BIGQUERY_DATASET_ID!);
    const table = dataset.table('multi_platform_images');

    // テーブルのメタデータを取得
    console.log('📋 テーブルスキーマ:');
    const [metadata] = await table.getMetadata();
    const schema = metadata.schema;
    
    if (schema && schema.fields) {
      schema.fields.forEach((field: any) => {
        console.log(`  - ${field.name}: ${field.type} ${field.mode || ''}`);
        if (field.description) {
          console.log(`    説明: ${field.description}`);
        }
      });
    }

    // データ件数を確認
    console.log('\n📊 データ件数:');
    const countQuery = `
      SELECT COUNT(*) as total_count
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\`
    `;
    
    const [countRows] = await bigquery.query(countQuery);
    console.log(`  総件数: ${countRows[0].total_count} 件`);

    // 画像タイプ別の件数を確認
    console.log('\n🎯 画像タイプ別件数:');
    const imageTypeQuery = `
      SELECT 
        image_type,
        COUNT(*) as count
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\`
      GROUP BY image_type
      ORDER BY count DESC
    `;
    
    const [imageTypeRows] = await bigquery.query(imageTypeQuery);
    imageTypeRows.forEach((row: any) => {
      console.log(`  ${row.image_type}: ${row.count} 件`);
    });

    // 画像URL別の件数を確認
    console.log('\n🖼️ 画像URL存在確認:');
    const urlQuery = `
      SELECT 
        CASE 
          WHEN image_url IS NOT NULL AND image_url != '' THEN '画像URLあり'
          ELSE '画像URLなし'
        END as url_status,
        COUNT(*) as count
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\`
      GROUP BY url_status
      ORDER BY count DESC
    `;
    
    const [urlRows] = await bigquery.query(urlQuery);
    urlRows.forEach((row: any) => {
      console.log(`  ${row.url_status}: ${row.count} 件`);
    });

    // サンプルデータを確認（最初の5件）
    console.log('\n📝 サンプルデータ（最初の5件）:');
    const sampleQuery = `
      SELECT *
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\`
      WHERE image_url IS NOT NULL AND image_url != ''
      LIMIT 5
    `;
    
    const [sampleRows] = await bigquery.query(sampleQuery);
    sampleRows.forEach((row: any, index: number) => {
      console.log(`\n  📄 サンプル ${index + 1}:`);
      Object.keys(row).forEach(key => {
        const value = row[key];
        if (typeof value === 'string' && value.length > 100) {
          console.log(`    ${key}: ${value.substring(0, 100)}...`);
        } else {
          console.log(`    ${key}: ${value}`);
        }
      });
    });

    // platform_product_idがあるかチェック
    console.log('\n🔗 関連テーブルとの結合可能性:');
    const relationQuery = `
      SELECT 
        COUNT(DISTINCT platform_product_id) as unique_product_ids,
        COUNT(*) as total_records
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.multi_platform_images\`
      WHERE platform_product_id IS NOT NULL
    `;
    
    const [relationRows] = await bigquery.query(relationQuery);
    console.log(`  ユニークplatform_product_id数: ${relationRows[0].unique_product_ids}`);
    console.log(`  platform_product_idを持つレコード数: ${relationRows[0].total_records}`);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラー詳細:', error.message);
    }
  }
}

// スクリプト実行
checkMultiPlatformImages();
