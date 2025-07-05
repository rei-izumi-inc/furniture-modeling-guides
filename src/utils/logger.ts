import winston from 'winston';
import { Config } from './config';
import path from 'path';
import fs from 'fs-extra';

/**
 * ログ機能の設定・初期化
 */
export class Logger {
  private static instance: winston.Logger;
  private static config = Config.getInstance();

  /**
   * ログインスタンスを取得
   */
  static getInstance(): winston.Logger {
    if (!this.instance) {
      this.instance = this.createLogger();
    }
    return this.instance;
  }

  /**
   * ログ設定を作成
   */
  private static createLogger(): winston.Logger {
    // ログディレクトリを作成
    const logDir = this.config.getAbsolutePath(this.config.LOG_PATH);
    fs.ensureDirSync(logDir);

    // ログフォーマット設定
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );

    // コンソール用フォーマット
    const consoleFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] ${level}: ${message}${metaStr}`;
      })
    );

    return winston.createLogger({
      level: this.config.LOG_LEVEL,
      format: logFormat,
      transports: [
        // コンソール出力
        new winston.transports.Console({
          format: consoleFormat
        }),
        // エラーログファイル
        new winston.transports.File({
          filename: path.join(logDir, 'error.log'),
          level: 'error'
        }),
        // 全体ログファイル
        new winston.transports.File({
          filename: path.join(logDir, 'combined.log')
        }),
        // バッチ処理専用ログファイル
        new winston.transports.File({
          filename: path.join(logDir, 'batch.log'),
          level: 'info'
        })
      ]
    });
  }

  /**
   * バッチ処理開始ログ
   */
  static logBatchStart(batchName: string, config: any): void {
    const logger = this.getInstance();
    logger.info('バッチ処理開始', {
      batchName,
      config,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * バッチ処理完了ログ
   */
  static logBatchComplete(batchName: string, stats: any): void {
    const logger = this.getInstance();
    logger.info('バッチ処理完了', {
      batchName,
      stats,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * バッチ処理エラーログ
   */
  static logBatchError(batchName: string, error: Error): void {
    const logger = this.getInstance();
    logger.error('バッチ処理エラー', {
      batchName,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 処理統計ログ
   */
  static logProcessingStats(stage: string, stats: {
    total: number;
    processed: number;
    successful: number;
    failed: number;
    duration?: number;
  }): void {
    const logger = this.getInstance();
    logger.info('処理統計', {
      stage,
      stats,
      timestamp: new Date().toISOString()
    });
  }
}
