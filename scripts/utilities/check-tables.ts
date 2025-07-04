#!/usr/bin/env ts-node

import { BigQuery } from '@google-cloud/bigquery';
import { Config } from '../utils/config';

/**
 * テーブル詳細確認スクリプト
 */
async function checkTableDetails() {
  try {
    const bigquery = new BigQuery({
      projectId: Config.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: Config.GOOGLE_APPLICATION_CREDENTIALS
    });

    const dataset = bigquery.dataset(Config.BIGQUERY_DATASET_ID);
    
    // 確認するテーブル一覧
    const tablesToCheck = [
      'universal_products',
      'mart_furniture_catalog',
      'mart_furniture_search_optimized'
    ];

    for (const tableName of tablesToCheck) {
      console.log(`\n🔍 テーブル '${tableName}' の詳細:`);
      console.log('='.repeat(50));
      
      try {
        const table = dataset.table(tableName);
        const [exists] = await table.exists();
        
        if (!exists) {
          console.log('❌ テーブルが存在しません');
          continue;
        }

        // スキーマ取得
        const [metadata] = await table.getMetadata();
        console.log('📋 スキーマ:');
        for (const field of metadata.schema.fields) {
          console.log(`  - ${field.name}: ${field.type} (${field.mode || 'NULLABLE'})`);
        }

        // レコード数取得
        const countQuery = `
          SELECT COUNT(*) as total_count
          FROM \`${Config.GOOGLE_CLOUD_PROJECT_ID}.${Config.BIGQUERY_DATASET_ID}.${tableName}\`
        `;
        const [countRows] = await bigquery.query(countQuery);
        console.log(`\n📊 総レコード数: ${countRows[0].total_count}`);

        // 画像URL関連のカラムをチェック
        const imageColumns = metadata.schema.fields
          .map((f: any) => f.name)
          .filter((name: string) => 
            name.toLowerCase().includes('image') || 
            name.toLowerCase().includes('url') ||
            name.toLowerCase().includes('photo')
          );

        if (imageColumns.length > 0) {
          console.log(`\n🖼️  画像関連カラム: ${imageColumns.join(', ')}`);
          
          // 画像URLありのレコード数をチェック
          for (const column of imageColumns) {
            try {
              const imageCountQuery = `
                SELECT COUNT(*) as count
                FROM \`${Config.GOOGLE_CLOUD_PROJECT_ID}.${Config.BIGQUERY_DATASET_ID}.${tableName}\`
                WHERE ${column} IS NOT NULL AND ${column} != ''
              `;
              const [imageRows] = await bigquery.query(imageCountQuery);
              console.log(`   - ${column}: ${imageRows[0].count} 件`);
            } catch (error) {
              console.log(`   - ${column}: チェックエラー`);
            }
          }
        }

        // サンプルデータを3件取得
        const sampleQuery = `
          SELECT *
          FROM \`${Config.GOOGLE_CLOUD_PROJECT_ID}.${Config.BIGQUERY_DATASET_ID}.${tableName}\`
          LIMIT 3
        `;
        const [sampleRows] = await bigquery.query(sampleQuery);
        
        console.log('\n📝 サンプルデータ:');
        sampleRows.forEach((row, index) => {
          console.log(`\n  サンプル ${index + 1}:`);
          Object.keys(row).slice(0, 10).forEach(key => {
            const value = row[key];
            const displayValue = typeof value === 'string' && value.length > 50 
              ? value.substring(0, 47) + '...'
              : value;
            console.log(`    ${key}: ${displayValue}`);
          });
        });

      } catch (error) {
        console.log(`❌ エラー: ${(error as Error).message}`);
      }
    }

  } catch (error) {
    console.error('❌ 全体エラー:', (error as Error).message);
  }
}

// 実行
checkTableDetails();
