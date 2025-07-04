#!/usr/bin/env ts-node

import { BigQuery } from '@google-cloud/bigquery';
import { Config } from '../utils/config';

/**
 * BigQuery接続テストスクリプト
 */
async function testBigQueryConnection() {
  try {
    console.log('🔍 BigQuery接続テスト開始...');
    console.log('設定:', {
      projectId: Config.GOOGLE_CLOUD_PROJECT_ID,
      credentialsPath: Config.GOOGLE_APPLICATION_CREDENTIALS
    });

    const bigquery = new BigQuery({
      projectId: Config.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: Config.GOOGLE_APPLICATION_CREDENTIALS
    });

    // データセット一覧を取得
    console.log('\n📊 利用可能なデータセット一覧:');
    const [datasets] = await bigquery.getDatasets();
    
    if (datasets.length === 0) {
      console.log('❌ データセットが見つかりません');
      return;
    }

    for (const dataset of datasets) {
      console.log(`  - ${dataset.id}`);
      
      // 各データセットのテーブル一覧を取得
      try {
        const [tables] = await dataset.getTables();
        for (const table of tables) {
          console.log(`    └── ${table.id}`);
        }
      } catch (error) {
        console.log(`    └── テーブル取得エラー: ${(error as Error).message}`);
      }
    }

    // 特定のデータセットが存在するかチェック
    const targetDataset = bigquery.dataset(Config.BIGQUERY_DATASET_ID);
    console.log(`\n🎯 ターゲットデータセット '${Config.BIGQUERY_DATASET_ID}' の確認:`);
    
    try {
      const [exists] = await targetDataset.exists();
      if (exists) {
        console.log('✅ データセットが存在します');
        
        // テーブルの確認
        const targetTable = targetDataset.table(Config.BIGQUERY_TABLE_ID);
        const [tableExists] = await targetTable.exists();
        
        if (tableExists) {
          console.log(`✅ テーブル '${Config.BIGQUERY_TABLE_ID}' が存在します`);
          
          // テーブルのスキーマを取得
          const [metadata] = await targetTable.getMetadata();
          console.log('\n📋 テーブルスキーマ:');
          for (const field of metadata.schema.fields) {
            console.log(`  - ${field.name}: ${field.type} (${field.mode || 'NULLABLE'})`);
          }
          
          // レコード数を取得
          const countQuery = `
            SELECT COUNT(*) as total_count
            FROM \`${Config.GOOGLE_CLOUD_PROJECT_ID}.${Config.BIGQUERY_DATASET_ID}.${Config.BIGQUERY_TABLE_ID}\`
          `;
          
          const [rows] = await bigquery.query(countQuery);
          console.log(`\n📈 総レコード数: ${rows[0].total_count}`);
          
          // 画像URLありのレコード数を取得
          const imageCountQuery = `
            SELECT COUNT(*) as image_count
            FROM \`${Config.GOOGLE_CLOUD_PROJECT_ID}.${Config.BIGQUERY_DATASET_ID}.${Config.BIGQUERY_TABLE_ID}\`
            WHERE original_image_url IS NOT NULL AND original_image_url != ''
          `;
          
          const [imageRows] = await bigquery.query(imageCountQuery);
          console.log(`📸 画像URL付きレコード数: ${imageRows[0].image_count}`);
          
        } else {
          console.log(`❌ テーブル '${Config.BIGQUERY_TABLE_ID}' が存在しません`);
        }
      } else {
        console.log(`❌ データセット '${Config.BIGQUERY_DATASET_ID}' が存在しません`);
      }
    } catch (error) {
      console.log(`❌ データセット確認エラー: ${(error as Error).message}`);
    }

    console.log('\n✅ BigQuery接続テスト完了');

  } catch (error) {
    console.error('❌ BigQuery接続エラー:', (error as Error).message);
    console.error('スタック:', (error as Error).stack);
  }
}

// 実行
testBigQueryConnection();
