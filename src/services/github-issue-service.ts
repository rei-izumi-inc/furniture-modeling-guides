import * as fs from 'fs';
import * as path from 'path';
import { Config } from '../utils/config';
import { Logger } from '../utils/logger';

export interface GitHubIssueOptions {
  title: string;
  body: string;
  labels?: string[];
  assignees?: string[];
  milestone?: number;
}

export interface IssueCreationResult {
  success: boolean;
  issueNumber?: number;
  issueUrl?: string;
  error?: string;
}

/**
 * GitHub Issues API サービス
 */
export class GitHubIssueService {
  private octokit: any; // 動的インポートのため型をanyに
  private logger = Logger.getInstance();
  private config = Config.getInstance();

  constructor() {
    // 動的インポートは初期化時ではなく使用時に行う
  }

  /**
   * Octokitインスタンスを初期化（動的インポート）
   */
  private async initializeOctokit(): Promise<void> {
    if (this.octokit) return;

    const githubToken = this.config.getGitHubToken();
    if (!githubToken) {
      throw new Error('GitHub token が設定されていません。GITHUB_TOKEN環境変数を設定してください。');
    }

    try {
      const { Octokit } = await import('@octokit/rest');
      this.octokit = new Octokit({
        auth: githubToken,
      });
    } catch (error) {
      throw new Error(`Octokitの初期化に失敗しました: ${error}`);
    }
  }

  /**
   * GitHubのissueを作成
   */
  async createIssue(
    owner: string,
    repo: string,
    options: GitHubIssueOptions
  ): Promise<IssueCreationResult> {
    try {
      await this.initializeOctokit(); // Octokit初期化

      this.logger.info('GitHub issue作成開始', {
        owner,
        repo,
        title: options.title
      });

      const response = await this.octokit.rest.issues.create({
        owner,
        repo,
        title: options.title,
        body: options.body,
        labels: options.labels,
        assignees: options.assignees,
        milestone: options.milestone,
      });

      this.logger.info('GitHub issue作成成功', {
        issueNumber: response.data.number,
        issueUrl: response.data.html_url
      });

      return {
        success: true,
        issueNumber: response.data.number,
        issueUrl: response.data.html_url,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('GitHub issue作成エラー', { error: errorMessage });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * markdownファイルからissueを作成
   */
  async createIssueFromMarkdown(
    markdownPath: string,
    owner: string,
    repo: string,
    options: Partial<GitHubIssueOptions> = {}
  ): Promise<IssueCreationResult> {
    try {
      // markdownファイルを読み込み
      const markdownContent = fs.readFileSync(markdownPath, 'utf-8');
      
      // タイトルを抽出（最初のh1から）
      const titleMatch = markdownContent.match(/^# (.+)$/m);
      const title = options.title || (titleMatch ? titleMatch[1] : path.basename(markdownPath, '.md'));

      // 画像パスを修正（GitHub用の相対パス）
      const bodyContent = this.processMarkdownForGitHub(markdownContent);

      const issueOptions: GitHubIssueOptions = {
        title,
        body: bodyContent,
        labels: options.labels || ['furniture-guide', 'roblox'],
        assignees: options.assignees,
        milestone: options.milestone,
      };

      return await this.createIssue(owner, repo, issueOptions);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('markdownからissue作成エラー', { 
        markdownPath, 
        error: errorMessage 
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * GitHub用にmarkdownを処理
   */
  private processMarkdownForGitHub(content: string): string {
    // 相対パス画像をGitHubのrawコンテンツURLに変換
    const owner = this.config.getGitHubOwner() || 'rei-izumi-inc';
    const repo = this.config.getGitHubRepo() || 'furniture-modeling-guides';
    const branch = this.config.getGitHubBranch() || 'main';

    const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/output`;

    // 画像パスを変換
    let processedContent = content
      .replace(/!\[([^\]]*)\]\(\.\.\/original-images\/([^)]+)\)/g, 
        `![$1](${baseUrl}/original-images/$2)`)
      .replace(/!\[([^\]]*)\]\(\.\.\/roblox-transformed\/([^)]+)\)/g, 
        `![$1](${baseUrl}/roblox-transformed/$2)`);

    // GitHub issue用のフッターを追加
    processedContent += `\n\n---\n\n🤖 *このissueは自動生成されました* - [furniture-modeling-guides](https://github.com/${owner}/${repo})`;

    return processedContent;
  }

  /**
   * バッチでmarkdownファイルからissueを作成
   */
  async createIssuesFromMarkdownBatch(
    markdownDir: string,
    owner: string,
    repo: string,
    options: {
      limit?: number;
      labels?: string[];
      assignees?: string[];
      dryRun?: boolean;
    } = {}
  ): Promise<{ success: number; failed: number; results: IssueCreationResult[] }> {
    const results: IssueCreationResult[] = [];
    let success = 0;
    let failed = 0;

    try {
      // markdownファイルを取得
      const files = fs.readdirSync(markdownDir)
        .filter(file => file.endsWith('.md'))
        .slice(0, options.limit || Infinity);

      this.logger.info('バッチissue作成開始', {
        totalFiles: files.length,
        limit: options.limit,
        dryRun: options.dryRun
      });

      for (const file of files) {
        const filePath = path.join(markdownDir, file);
        
        if (options.dryRun) {
          this.logger.info('DRY RUN: issue作成予定', { file });
          results.push({ success: true });
          success++;
          continue;
        }

        const result = await this.createIssueFromMarkdown(
          filePath,
          owner,
          repo,
          {
            labels: options.labels,
            assignees: options.assignees,
          }
        );

        results.push(result);
        
        if (result.success) {
          success++;
        } else {
          failed++;
        }

        // API rate limitを考慮して少し待機
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      this.logger.error('バッチissue作成エラー', { error: error instanceof Error ? error.message : String(error) });
    }

    this.logger.info('バッチissue作成完了', { success, failed, total: results.length });

    return { success, failed, results };
  }
}
