#!/usr/bin/env ts-node

import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({
  projectId: 'llm-furniture-coordinator',
  keyFilename: './credentials/service-account-key.json'
});

async function checkBigQuery() {
  try {
    console.log('🔍 BigQueryデータセットとテーブルを確認中...\n');

    // データセット一覧を取得
    const [datasets] = await bigquery.getDatasets();
    console.log('📊 利用可能なデータセット:');
    for (const dataset of datasets) {
      console.log(`  - ${dataset.id}`);
    }

    // furniture_catalog_v2データセットのテーブル一覧を取得
    console.log('\n📋 furniture_catalog_v2のテーブル一覧:');
    const dataset = bigquery.dataset('furniture_catalog_v2');
    const [tables] = await dataset.getTables();
    
    for (const table of tables) {
      console.log(`  - ${table.id}`);
      
      // 各テーブルの基本情報を取得
      try {
        const [metadata] = await table.getMetadata();
        console.log(`    レコード数: ${metadata.numRows || 'N/A'}`);
        console.log(`    作成日: ${metadata.creationTime ? new Date(parseInt(metadata.creationTime)).toISOString() : 'N/A'}`);
        
        // テーブルのスキーマを確認
        if (metadata.schema && metadata.schema.fields) {
          const fields = metadata.schema.fields.slice(0, 5); // 最初の5フィールドのみ表示
          console.log(`    主要フィールド: ${fields.map((f: any) => f.name).join(', ')}`);
        }
        console.log('');
      } catch (error) {
        console.log(`    ❌ メタデータ取得エラー: ${(error as Error).message}\n`);
      }
    }

    // 各テーブルの詳細を確認
    const tableNames = tables.map(table => table.id);
    
    for (const tableName of tableNames) {
      console.log(`\n🔬 ${tableName}テーブルの詳細:`);
      
      try {
        // 画像URL関連のフィールドがあるかチェック
        const [result] = await bigquery.query(`
          SELECT column_name, data_type
          FROM \`llm-furniture-coordinator.furniture_catalog_v2.INFORMATION_SCHEMA.COLUMNS\`
          WHERE table_name = '${tableName}'
          AND (LOWER(column_name) LIKE '%image%' OR LOWER(column_name) LIKE '%url%' OR LOWER(column_name) LIKE '%photo%')
        `);
        
        if (result.length > 0) {
          console.log('  📸 画像関連フィールド:');
          result.forEach((row: any) => {
            console.log(`    - ${row.column_name}: ${row.data_type}`);
          });
        } else {
          console.log('  ❌ 画像関連フィールドなし');
        }

        // データ件数を確認
        const [countResult] = await bigquery.query(`
          SELECT COUNT(*) as count
          FROM \`llm-furniture-coordinator.furniture_catalog_v2.${tableName}\`
        `);
        console.log(`  📊 データ件数: ${countResult[0].count}`);

      } catch (error) {
        console.log(`  ❌ 詳細取得エラー: ${(error as Error).message}`);
      }
    }

  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkBigQuery();
