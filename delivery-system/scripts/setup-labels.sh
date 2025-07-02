#!/bin/bash
# setup-labels.sh
# GitHub リポジトリのラベル設定

echo "🏷️ GitHubラベルを設定中..."

# 既存のデフォルトラベルを削除
echo "🗑️ デフォルトラベルを削除中..."
gh label list --json name --jq '.[].name' | while read label; do
    case "$label" in
        "bug"|"documentation"|"duplicate"|"enhancement"|"good first issue"|"help wanted"|"invalid"|"question"|"wontfix")
            gh label delete "$label" --yes 2>/dev/null || true
            ;;
    esac
done

# Priority ラベル
echo "📈 Priority ラベルを作成中..."
gh label create "p-critical" --description "Critical priority - immediate attention required" --color "B60205"
gh label create "p-high" --description "High priority - should be addressed soon" --color "D93F0B"
gh label create "p-medium" --description "Medium priority - normal timeline" --color "FBCA04"
gh label create "p-low" --description "Low priority - can be addressed later" --color "0E8A16"

# Status ラベル
echo "📊 Status ラベルを作成中..."
gh label create "status-planning" --description "In planning phase" --color "1D76DB"
gh label create "status-in-progress" --description "Currently being worked on" --color "0052CC"
gh label create "status-review" --description "Ready for review" --color "5319E7"
gh label create "status-testing" --description "In testing phase" --color "7057FF"
gh label create "status-done" --description "Completed and merged" --color "0E8A16"
gh label create "status-blocked" --description "Blocked by dependencies" --color "B60205"
gh label create "status-on-hold" --description "Temporarily paused" --color "FBCA04"

# Type ラベル
echo "🔧 Type ラベルを作成中..."
gh label create "type-bug" --description "Something isn't working correctly" --color "D73A4A"
gh label create "type-feature" --description "New feature or enhancement" --color "A2EEEF"
gh label create "type-guide" --description "New modeling guide" --color "7057FF"
gh label create "type-improvement" --description "Improvement to existing functionality" --color "A2EEEF"
gh label create "type-documentation" --description "Documentation updates" --color "0075CA"
gh label create "type-maintenance" --description "Code maintenance and refactoring" --color "E4E669"
gh label create "type-question" --description "Question or discussion" --color "D876E3"

# Category ラベル
echo "🪑 Category ラベルを作成中..."
gh label create "category-chair" --description "Chair modeling guides" --color "C2E0C6"
gh label create "category-table" --description "Table modeling guides" --color "BFDADC"
gh label create "category-storage" --description "Storage furniture guides" --color "F9D0C4"
gh label create "category-decoration" --description "Decorative items guides" --color "FEF2C0"
gh label create "category-lighting" --description "Lighting fixtures guides" --color "FAD8C7"
gh label create "category-seating" --description "Seating furniture guides" --color "D4EDDA"
gh label create "category-bedroom" --description "Bedroom furniture guides" --color "E2E3E5"
gh label create "category-kitchen" --description "Kitchen furniture guides" --color "CCE5FF"

# Style ラベル
echo "🎨 Style ラベルを作成中..."
gh label create "style-cartoon" --description "Cartoon style implementation" --color "FF69B4"
gh label create "style-modern" --description "Modern style implementation" --color "00CED1"
gh label create "style-minimal" --description "Minimal style implementation" --color "708090"
gh label create "style-vintage" --description "Vintage style implementation" --color "DEB887"
gh label create "style-futuristic" --description "Futuristic style implementation" --color "9370DB"

# Difficulty ラベル
echo "⭐ Difficulty ラベルを作成中..."
gh label create "difficulty-beginner" --description "Suitable for beginners" --color "0E8A16"
gh label create "difficulty-intermediate" --description "Requires some experience" --color "FBCA04"
gh label create "difficulty-advanced" --description "For experienced modelers" --color "D93F0B"
gh label create "difficulty-expert" --description "Expert level challenge" --color "B60205"

# Size ラベル (for PRs)
echo "📏 Size ラベルを作成中..."
gh label create "size-xs" --description "Extra small change (< 10 lines)" --color "3CBF00"
gh label create "size-small" --description "Small change (10-29 lines)" --color "5D9801"
gh label create "size-medium" --description "Medium change (30-99 lines)" --color "7F7203"
gh label create "size-large" --description "Large change (100-499 lines)" --color "A14C00"
gh label create "size-xl" --description "Extra large change (500+ lines)" --color "B60205"

# Review ラベル
echo "👀 Review ラベルを作成中..."
gh label create "needs-review" --description "Waiting for code review" --color "FBCA04"
gh label create "review-approved" --description "Review approved" --color "0E8A16"
gh label create "changes-requested" --description "Changes requested by reviewer" --color "D93F0B"
gh label create "ready-to-merge" --description "Approved and ready to merge" --color "0E8A16"

# Special ラベル
echo "✨ Special ラベルを作成中..."
gh label create "good-first-issue" --description "Good for newcomers" --color "7057FF"
gh label create "help-wanted" --description "Extra attention is needed" --color "008672"
gh label create "hacktoberfest" --description "Hacktoberfest eligible" --color "FF8C00"
gh label create "duplicate" --description "This issue or pull request already exists" --color "CFD3D7"
gh label create "wontfix" --description "This will not be worked on" --color "FFFFFF"
gh label create "invalid" --description "This doesn't seem right" --color "E4E669"

# Platform ラベル
echo "🎮 Platform ラベルを作成中..."
gh label create "platform-roblox" --description "Roblox specific implementation" --color "00A2FF"
gh label create "platform-unity" --description "Unity compatible" --color "000000"
gh label create "platform-blender" --description "Blender specific tools/guides" --color "F5792A"

# Workflow ラベル
echo "⚡ Workflow ラベルを作成中..."
gh label create "auto-update" --description "Automated update from scripts" --color "E4E669"
gh label create "breaking-change" --description "Breaking change - major version bump" --color "B60205"
gh label create "dependencies" --description "Pull requests that update dependencies" --color "0366D6"

echo "✅ ラベル設定が完了しました！"

# ラベル一覧表示
echo "📋 作成されたラベル一覧:"
gh label list --json name,description,color --jq '.[] | "• \(.name): \(.description)"'
