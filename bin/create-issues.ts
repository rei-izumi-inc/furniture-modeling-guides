#!/usr/bin/env node

import { GitHubIssueService } from '../src/services/github-issue-service';
import { Config } from '../src/utils/config';
import * as path from 'path';

/**
 * GitHub Issues作成のCLIエントリポイント
 */
async function main() {
  // コマンドライン引数をパース
  const args = process.argv.slice(2);
  const options: any = {
    dryRun: false,
    limit: undefined,
    labels: ['furniture-guide', 'roblox'],
    assignees: [],
    owner: undefined,
    repo: undefined
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--limit' && i + 1 < args.length) {
      options.limit = parseInt(args[i + 1]);
      i++;
    } else if (arg === '--labels' && i + 1 < args.length) {
      options.labels = args[i + 1].split(',');
      i++;
    } else if (arg === '--assignees' && i + 1 < args.length) {
      options.assignees = args[i + 1].split(',');
      i++;
    } else if (arg === '--owner' && i + 1 < args.length) {
      options.owner = args[i + 1];
      i++;
    } else if (arg === '--repo' && i + 1 < args.length) {
      options.repo = args[i + 1];
      i++;
    } else if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    }
  }

  try {
    const config = Config.getInstance();
    
    // GitHub設定の確認
    const owner = options.owner || config.getGitHubOwner();
    const repo = options.repo || config.getGitHubRepo();
    
    if (!owner || !repo) {
      console.error('❌ GitHub owner/repo が設定されていません。');
      console.error('   環境変数 GITHUB_OWNER, GITHUB_REPO を設定するか、');
      console.error('   --owner, --repo オプションを指定してください。');
      process.exit(1);
    }

    if (!config.getGitHubToken()) {
      console.error('❌ GitHub token が設定されていません。');
      console.error('   環境変数 GITHUB_TOKEN を設定してください。');
      process.exit(1);
    }

    console.log('📝 GitHub Issues作成を開始します...');
    console.log(`   対象: ${owner}/${repo}`);
    console.log(`   オプション:`, {
      dryRun: options.dryRun,
      limit: options.limit,
      labels: options.labels,
      assignees: options.assignees
    });

    const issueService = new GitHubIssueService();
    const markdownDir = config.MARKDOWN_OUTPUT_PATH;

    const result = await issueService.createIssuesFromMarkdownBatch(
      markdownDir,
      owner,
      repo,
      {
        limit: options.limit,
        labels: options.labels,
        assignees: options.assignees,
        dryRun: options.dryRun
      }
    );

    console.log('\n📊 実行結果:');
    console.log(`   成功: ${result.success}`);
    console.log(`   失敗: ${result.failed}`);
    console.log(`   合計: ${result.results.length}`);

    if (result.failed > 0) {
      console.log('\n❌ 失敗したissue:');
      result.results
        .filter(r => !r.success)
        .forEach((r, index) => {
          console.log(`   ${index + 1}. エラー: ${r.error}`);
        });
    }

    if (result.success > 0 && !options.dryRun) {
      console.log('\n✅ 作成されたissue:');
      result.results
        .filter(r => r.success && r.issueUrl)
        .forEach((r, index) => {
          console.log(`   ${index + 1}. #${r.issueNumber}: ${r.issueUrl}`);
        });
    }

    process.exit(result.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ GitHub Issues作成でエラーが発生しました:', error);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
GitHub Issues作成ツール

使用方法:
  npm run create:issues [options]

オプション:
  --dry-run              実際の作成は行わず、プレビューのみ表示
  --limit <number>       作成するissue数の上限
  --labels <labels>      カンマ区切りのラベル (デフォルト: furniture-guide,roblox)
  --assignees <users>    カンマ区切りの担当者
  --owner <owner>        GitHubオーナー名
  --repo <repo>          GitHubリポジトリ名
  --help, -h             このヘルプを表示

環境変数:
  GITHUB_TOKEN          GitHub Personal Access Token (必須)
  GITHUB_OWNER          GitHubオーナー名 (デフォルト)
  GITHUB_REPO           GitHubリポジトリ名 (デフォルト)

例:
  npm run create:issues --dry-run
  npm run create:issues --limit 5 --labels "furniture,guide"
  npm run create:issues --owner myorg --repo myrepo
`);
}

main();
