import { BigQuery } from '@google-cloud/bigquery';
import * as dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function checkUniversalProducts() {
  try {
    console.log('🔍 universal_products テーブルを調査中...\n');

    const dataset = bigquery.dataset(process.env.BIGQUERY_DATASET_ID!);
    const table = dataset.table('universal_products');

    // テーブルのスキーマを確認
    console.log('📋 universal_products テーブルスキーマ:');
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

    // サンプルデータを確認
    console.log('\n📝 サンプルデータ（最初の3件）:');
    const sampleQuery = `
      SELECT *
      FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.${process.env.BIGQUERY_DATASET_ID}.universal_products\`
      LIMIT 3
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

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('エラー詳細:', error.message);
    }
  }
}

// スクリプト実行
checkUniversalProducts();
