#!/bin/bash
# setup-docs-site.sh
# GitHub Pages用ドキュメントサイトの設定

echo "🌐 ドキュメントサイトを設定中..."

# package.json作成
cat > package.json << 'EOF'
{
  "name": "furniture-modeling-guides",
  "version": "1.0.0",
  "description": "Professional Roblox furniture modeling guides with project management integration",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "serve": "npm run build && npm run preview"
  },
  "keywords": [
    "roblox",
    "3d-modeling",
    "furniture",
    "blender",
    "game-development"
  ],
  "author": "Furniture Modeling Team",
  "license": "MIT",
  "devDependencies": {
    "vite": "^5.0.0",
    "marked": "^12.0.0",
    "prismjs": "^1.29.0",
    "vite-plugin-static-copy": "^1.0.0"
  },
  "dependencies": {}
}
EOF

# Vite設定
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/furniture-modeling-guides/',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'guides/**/*',
          dest: 'guides'
        },
        {
          src: 'images/**/*',
          dest: 'images'
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
});
EOF

# メインHTML
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎯 Roblox家具モデリングガイド</title>
    <meta name="description" content="プロフェッショナルな3Dモデラー向けの包括的な制作ガイドとプロジェクト管理システム">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Roblox家具モデリングガイド">
    <meta property="og:description" content="プロフェッショナルな3Dモデラー向けの包括的な制作ガイド">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://rei-izumi-inc.github.io/furniture-modeling-guides/">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Roblox家具モデリングガイド">
    <meta name="twitter:description" content="プロフェッショナルな3Dモデラー向けの包括的な制作ガイド">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="/src/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css">
</head>
<body>
    <div id="app">
        <!-- Header -->
        <header class="header">
            <div class="container">
                <div class="header-content">
                    <div class="logo">
                        <h1>🎯 Roblox家具モデリングガイド</h1>
                        <p>プロフェッショナル向け統合制作システム</p>
                    </div>
                    <nav class="nav">
                        <a href="#home" class="nav-link active">ホーム</a>
                        <a href="#guides" class="nav-link">ガイド</a>
                        <a href="#gallery" class="nav-link">ギャラリー</a>
                        <a href="#about" class="nav-link">概要</a>
                        <a href="https://github.com/rei-izumi-inc/furniture-modeling-guides" class="nav-link" target="_blank">GitHub</a>
                    </nav>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section id="home" class="hero">
            <div class="container">
                <div class="hero-content">
                    <h2 class="hero-title">
                        効率的な3Dモデリングで<br>
                        <span class="highlight">プロ品質の家具</span>を制作
                    </h2>
                    <p class="hero-description">
                        Roblox向け家具3Dモデルの制作を効率化する包括的なガイドシステム。
                        20以上の詳細なガイド、3つのスタイル変換、完全なプロジェクト管理機能を提供。
                    </p>
                    <div class="hero-buttons">
                        <a href="#guides" class="btn btn-primary">ガイドを見る</a>
                        <a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/issues" class="btn btn-secondary" target="_blank">プロジェクト参加</a>
                    </div>
                </div>
                <div class="hero-stats">
                    <div class="stat">
                        <div class="stat-number">20+</div>
                        <div class="stat-label">制作ガイド</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">3</div>
                        <div class="stat-label">スタイル変換</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">100%</div>
                        <div class="stat-label">自動化運用</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features">
            <div class="container">
                <h2 class="section-title">🌟 主要機能</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">📖</div>
                        <h3>詳細な制作ガイド</h3>
                        <p>初心者から上級者まで対応した、段階的な制作手順とプロのテクニックを収録</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🎨</div>
                        <h3>3つのスタイル変換</h3>
                        <p>カートゥーン、モダン、ミニマルの3スタイルで多様なニーズに対応</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h3>プロジェクト管理</h3>
                        <p>GitHub Issues/Projectsと完全統合した進捗管理システム</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">⚡</div>
                        <h3>自動化システム</h3>
                        <p>PDF生成、パッケージ作成、品質チェックの完全自動化</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🌐</div>
                        <h3>美しいWebサイト</h3>
                        <p>GitHub Pagesによる高速で美しいドキュメントサイト</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🤝</div>
                        <h3>コミュニティ連携</h3>
                        <p>オープンソースでのコラボレーション環境を完備</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Guides Section -->
        <section id="guides" class="guides">
            <div class="container">
                <h2 class="section-title">📚 制作ガイド</h2>
                <div class="guides-filter">
                    <button class="filter-btn active" data-category="all">すべて</button>
                    <button class="filter-btn" data-category="chair">チェア</button>
                    <button class="filter-btn" data-category="table">テーブル</button>
                    <button class="filter-btn" data-category="storage">収納</button>
                    <button class="filter-btn" data-category="decoration">装飾</button>
                </div>
                <div id="guides-list" class="guides-grid">
                    <!-- ガイド一覧はJavaScriptで動的生成 -->
                </div>
            </div>
        </section>

        <!-- Gallery Section -->
        <section id="gallery" class="gallery">
            <div class="container">
                <h2 class="section-title">🎨 スタイルギャラリー</h2>
                <div class="gallery-tabs">
                    <button class="tab-btn active" data-style="cartoon">カートゥーン</button>
                    <button class="tab-btn" data-style="modern">モダン</button>
                    <button class="tab-btn" data-style="minimal">ミニマル</button>
                </div>
                <div id="gallery-content" class="gallery-grid">
                    <!-- ギャラリーはJavaScriptで動的生成 -->
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about">
            <div class="container">
                <div class="about-content">
                    <div class="about-text">
                        <h2 class="section-title">📖 プロジェクトについて</h2>
                        <p>
                            このプロジェクトは、Roblox向け家具3Dモデルの制作を効率化し、
                            プロフェッショナルな品質を実現するために開発された統合システムです。
                        </p>
                        <p>
                            経験豊富な3Dモデラーチームが、実際の制作現場で培ったノウハウを
                            体系化し、誰でもアクセス可能な形で提供しています。
                        </p>
                        <div class="workflow-steps">
                            <div class="step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h4>Issue作成</h4>
                                    <p>制作依頼・タスク登録</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h4>制作開始</h4>
                                    <p>ガイドに従ったモデリング</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h4>レビュー</h4>
                                    <p>品質チェックと改善</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">4</div>
                                <div class="step-content">
                                    <h4>公開</h4>
                                    <p>自動デプロイと配布</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="about-stats">
                        <h3>📊 プロジェクト統計</h3>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-value" id="guides-count">20+</div>
                                <div class="stat-label">制作ガイド</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value" id="images-count">60+</div>
                                <div class="stat-label">参考画像</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value" id="contributors-count">5+</div>
                                <div class="stat-label">コントリビューター</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value" id="downloads-count">1000+</div>
                                <div class="stat-label">ダウンロード</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta">
            <div class="container">
                <div class="cta-content">
                    <h2>🚀 プロジェクトに参加しませんか？</h2>
                    <p>オープンソースプロジェクトとして、皆様のコントリビューションをお待ちしています</p>
                    <div class="cta-buttons">
                        <a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/issues/new?template=new_furniture_guide.md" class="btn btn-primary" target="_blank">
                            新しいガイドを提案
                        </a>
                        <a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/fork" class="btn btn-secondary" target="_blank">
                            フォークして貢献
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h4>🎯 プロジェクト</h4>
                        <ul>
                            <li><a href="https://github.com/rei-izumi-inc/furniture-modeling-guides" target="_blank">GitHub リポジトリ</a></li>
                            <li><a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/issues" target="_blank">Issues</a></li>
                            <li><a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/projects" target="_blank">Projects</a></li>
                            <li><a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/releases" target="_blank">リリース</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>📚 リソース</h4>
                        <ul>
                            <li><a href="/guides">制作ガイド</a></li>
                            <li><a href="#gallery">ギャラリー</a></li>
                            <li><a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/blob/main/CONTRIBUTING.md" target="_blank">コントリビューションガイド</a></li>
                            <li><a href="/exports/pdf">PDF ダウンロード</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>🛠 ツール</h4>
                        <ul>
                            <li><a href="https://www.blender.org/" target="_blank">Blender</a></li>
                            <li><a href="https://create.roblox.com/" target="_blank">Roblox Studio</a></li>
                            <li><a href="https://github.com/" target="_blank">GitHub</a></li>
                            <li><a href="https://pages.github.com/" target="_blank">GitHub Pages</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>📞 サポート</h4>
                        <ul>
                            <li><a href="mailto:contact@example.com">メール</a></li>
                            <li><a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/discussions" target="_blank">ディスカッション</a></li>
                            <li><a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/issues/new?template=bug_report.md" target="_blank">バグ報告</a></li>
                            <li><a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/wiki" target="_blank">Wiki</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 Furniture Modeling Guides. Licensed under MIT License.</p>
                    <div class="footer-links">
                        <a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/blob/main/LICENSE" target="_blank">ライセンス</a>
                        <a href="https://github.com/rei-izumi-inc/furniture-modeling-guides/blob/main/CONTRIBUTING.md" target="_blank">コントリビューション</a>
                        <a href="#privacy">プライバシー</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <script type="module" src="/src/main.js"></script>
</body>
</html>
EOF

# CSS作成
mkdir -p src
cat > src/style.css << 'EOF'
/* Reset & Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    background-color: #ffffff;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Header */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e5e7eb;
    z-index: 1000;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
}

.logo h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e40af;
}

.logo p {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
}

.nav {
    display: flex;
    gap: 2rem;
}

.nav-link {
    text-decoration: none;
    color: #4b5563;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
    color: #1e40af;
}

/* Hero */
.hero {
    padding: 8rem 0 4rem;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    margin-top: 80px;
}

.hero-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    color: #1e293b;
}

.highlight {
    color: #1e40af;
}

.hero-description {
    font-size: 1.25rem;
    color: #475569;
    margin-bottom: 2.5rem;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 4rem;
}

.btn {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 2rem;
    font-weight: 600;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: #1e40af;
    color: white;
}

.btn-primary:hover {
    background-color: #1d4ed8;
    transform: translateY(-2px);
}

.btn-secondary {
    background-color: white;
    color: #1e40af;
    border: 2px solid #1e40af;
}

.btn-secondary:hover {
    background-color: #1e40af;
    color: white;
    transform: translateY(-2px);
}

.hero-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 600px;
    margin: 0 auto;
}

.stat {
    text-align: center;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e40af;
}

.stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
}

/* Sections */
.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    color: #1e293b;
}

/* Features */
.features {
    padding: 6rem 0;
    background-color: #f8fafc;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1e293b;
}

.feature-card p {
    color: #64748b;
}

/* Guides */
.guides {
    padding: 6rem 0;
}

.guides-filter {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.5rem 1.5rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 2rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
    background-color: #1e40af;
    color: white;
    border-color: #1e40af;
}

.guides-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.guide-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.guide-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

.guide-image {
    height: 200px;
    background-size: cover;
    background-position: center;
}

.guide-content {
    padding: 1.5rem;
}

.guide-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1e293b;
}

.guide-description {
    color: #64748b;
    margin-bottom: 1rem;
}

.guide-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: #6b7280;
}

.difficulty {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.difficulty-stars {
    color: #fbbf24;
}

/* Gallery */
.gallery {
    padding: 6rem 0;
    background-color: #f8fafc;
}

.gallery-tabs {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
}

.tab-btn {
    padding: 0.75rem 2rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab-btn:hover,
.tab-btn.active {
    background-color: #1e40af;
    color: white;
    border-color: #1e40af;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.gallery-item {
    position: relative;
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.gallery-item:hover {
    transform: scale(1.05);
}

.gallery-image {
    height: 250px;
    background-size: cover;
    background-position: center;
}

.gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    color: white;
    padding: 1rem;
}

.gallery-title {
    font-weight: 600;
}

.gallery-style {
    font-size: 0.875rem;
    opacity: 0.8;
}

/* About */
.about {
    padding: 6rem 0;
}

.about-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: start;
}

.about-text p {
    font-size: 1.125rem;
    color: #475569;
    margin-bottom: 1.5rem;
}

.workflow-steps {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 3rem;
}

.step {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background-color: #1e40af;
    color: white;
    border-radius: 50%;
    font-weight: 600;
    flex-shrink: 0;
}

.step-content h4 {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
}

.step-content p {
    font-size: 0.875rem;
    color: #64748b;
}

.about-stats {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    height: fit-content;
}

.about-stats h3 {
    margin-bottom: 1.5rem;
    color: #1e293b;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

.stat-item {
    text-align: center;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1e40af;
}

.stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
}

/* CTA */
.cta {
    padding: 6rem 0;
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
}

.cta-content {
    text-align: center;
}

.cta h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.cta p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.cta .btn {
    background-color: white;
    color: #1e40af;
}

.cta .btn:hover {
    background-color: #f1f5f9;
    transform: translateY(-2px);
}

.cta .btn-secondary {
    background-color: transparent;
    color: white;
    border-color: white;
}

.cta .btn-secondary:hover {
    background-color: white;
    color: #1e40af;
}

/* Footer */
.footer {
    background-color: #1e293b;
    color: #cbd5e1;
    padding: 3rem 0 1rem;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-section h4 {
    color: white;
    font-weight: 600;
    margin-bottom: 1rem;
}

.footer-section ul {
    list-style: none;
}

.footer-section ul li {
    margin-bottom: 0.5rem;
}

.footer-section ul li a {
    color: #cbd5e1;
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-section ul li a:hover {
    color: #3b82f6;
}

.footer-bottom {
    border-top: 1px solid #334155;
    padding-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
}

.footer-links {
    display: flex;
    gap: 1.5rem;
}

.footer-links a {
    color: #cbd5e1;
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-links a:hover {
    color: #3b82f6;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }
    
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .hero-stats {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .features-grid,
    .guides-grid {
        grid-template-columns: 1fr;
    }
    
    .about-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .workflow-steps {
        grid-template-columns: 1fr;
    }
    
    .footer-content {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .header-content {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
}

/* Loading Animation */
.loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #1e40af;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Smooth transitions */
* {
    transition: all 0.3s ease;
}

a, button {
    transition: all 0.3s ease;
}
EOF

# JavaScript作成
cat > src/main.js << 'EOF'
// メインJavaScript
import './style.css';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーションのスムーススクロール
    setupSmoothScrolling();
    
    // ガイド一覧の読み込み
    loadGuides();
    
    // ギャラリーの初期化
    setupGallery();
    
    // フィルター機能
    setupFilters();
    
    // 統計データの更新
    updateStats();
    
    // アクティブナビゲーションの管理
    setupActiveNavigation();
});

// スムーススクロール設定
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ガイド一覧の読み込み
async function loadGuides() {
    const guidesContainer = document.getElementById('guides-list');
    
    // サンプルデータ（実際の実装では、guides/フォルダから動的に読み込み）
    const guides = [
        {
            title: 'オフィスチェア制作ガイド',
            category: 'chair',
            difficulty: 3,
            duration: '4時間',
            description: 'モダンなオフィスチェアの制作手順を詳しく解説',
            image: '/images/sample/office-chair.jpg'
        },
        {
            title: 'ダイニングテーブル制作ガイド',
            category: 'table',
            difficulty: 4,
            duration: '6時間',
            description: '家族で使えるダイニングテーブルの制作テクニック',
            image: '/images/sample/dining-table.jpg'
        },
        {
            title: 'ブックシェルフ制作ガイド',
            category: 'storage',
            difficulty: 2,
            duration: '3時間',
            description: 'シンプルで実用的なブックシェルフの制作方法',
            image: '/images/sample/bookshelf.jpg'
        },
        {
            title: 'デコレーションランプ制作ガイド',
            category: 'decoration',
            difficulty: 2,
            duration: '2時間',
            description: '雰囲気を演出するデコレーションランプの制作',
            image: '/images/sample/lamp.jpg'
        }
    ];
    
    guidesContainer.innerHTML = guides.map(guide => `
        <div class="guide-card" data-category="${guide.category}">
            <div class="guide-image" style="background-image: url('${guide.image}')"></div>
            <div class="guide-content">
                <h3 class="guide-title">${guide.title}</h3>
                <p class="guide-description">${guide.description}</p>
                <div class="guide-meta">
                    <div class="difficulty">
                        <span>難易度:</span>
                        <span class="difficulty-stars">${'★'.repeat(guide.difficulty)}${'☆'.repeat(5-guide.difficulty)}</span>
                    </div>
                    <div class="duration">
                        <span>⏱️ ${guide.duration}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ギャラリー設定
function setupGallery() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const galleryContent = document.getElementById('gallery-content');
    
    const galleryData = {
        cartoon: [
            { title: 'カートゥーンチェア', image: '/images/cartoon/chair-01.jpg' },
            { title: 'カートゥーンテーブル', image: '/images/cartoon/table-01.jpg' },
            { title: 'カートゥーンランプ', image: '/images/cartoon/lamp-01.jpg' }
        ],
        modern: [
            { title: 'モダンチェア', image: '/images/modern/chair-01.jpg' },
            { title: 'モダンテーブル', image: '/images/modern/table-01.jpg' },
            { title: 'モダンランプ', image: '/images/modern/lamp-01.jpg' }
        ],
        minimal: [
            { title: 'ミニマルチェア', image: '/images/minimal/chair-01.jpg' },
            { title: 'ミニマルテーブル', image: '/images/minimal/table-01.jpg' },
            { title: 'ミニマルランプ', image: '/images/minimal/lamp-01.jpg' }
        ]
    };
    
    function showGallery(style) {
        const items = galleryData[style] || [];
        galleryContent.innerHTML = items.map(item => `
            <div class="gallery-item">
                <div class="gallery-image" style="background-image: url('${item.image}')"></div>
                <div class="gallery-overlay">
                    <div class="gallery-title">${item.title}</div>
                    <div class="gallery-style">${style} スタイル</div>
                </div>
            </div>
        `).join('');
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブボタンの管理
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // ギャラリー表示
            const style = button.getAttribute('data-style');
            showGallery(style);
        });
    });
    
    // 初期表示
    showGallery('cartoon');
}

// フィルター機能
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブボタンの管理
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            const guideCards = document.querySelectorAll('.guide-card');
            
            guideCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 統計データの更新
function updateStats() {
    // カウントアップアニメーション
    function animateCount(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 50);
    }
    
    // 各統計要素を更新（実際の値は API から取得）
    const guidesCount = document.getElementById('guides-count');
    const imagesCount = document.getElementById('images-count');
    const contributorsCount = document.getElementById('contributors-count');
    const downloadsCount = document.getElementById('downloads-count');
    
    if (guidesCount) animateCount(guidesCount, 20);
    if (imagesCount) animateCount(imagesCount, 60);
    if (contributorsCount) animateCount(contributorsCount, 5);
    if (downloadsCount) animateCount(downloadsCount, 1000);
}

// アクティブナビゲーション管理
function setupActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // 初期実行
}

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('Application error:', e);
});

// パフォーマンス監視
window.addEventListener('load', () => {
    if ('performance' in window) {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    }
});
EOF

# Favicon作成
cat > favicon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#1e40af"/>
  <text x="16" y="22" text-anchor="middle" fill="white" font-size="20" font-family="Arial">🎯</text>
</svg>
EOF

echo "✅ ドキュメントサイトの設定が完了しました！"

# 設定ファイル一覧表示
echo "📋 作成されたファイル:"
echo "• package.json - Node.js依存関係管理"
echo "• vite.config.js - Viteビルド設定"
echo "• index.html - メインHTMLページ"
echo "• src/style.css - スタイルシート"
echo "• src/main.js - メインJavaScript"
echo "• favicon.svg - サイトアイコン"
