# Baby Log 開発ワークフロー

## 🚨 開発着手前の必須手順

**全ての開発作業（新規セッション含む）で必ず実行してください**

### STEP 1: 開発ルール確認（絶対必須）
```bash
# 開発ルールの読み込み
cat docs/NEXTJS_CODING_RULES.md | head -100

# このドキュメントの読み込み  
cat docs/DEVELOPMENT_WORKFLOW.md
```

### STEP 2: プロジェクト状況把握
```bash
# プロジェクト全体構造確認
tree -L 3 ./

# Git状況確認
git status
git log --oneline -5
```

### STEP 3: 技術制約確認
- Next.js 15 App Router制約
- サーバーコンポーネント vs クライアントコンポーネント
- CSS-in-JS完全統一ルール

## 📋 ブランチ戦略

### ブランチ構成
| ブランチ | 用途 | 派生元 | 説明 |
|----------|------|--------|------|
| `main` | 本番用安定版 | - | プロダクション環境にデプロイされる安定版 |
| `develop` | 開発統合版 | `main` | 機能開発の統合先、次期リリースの準備 |
| `feature/*` | 新機能開発 | `develop` | 個別機能の開発用ブランチ |
| `bugfix/*` | バグ修正 | `develop` | 非緊急バグ修正用ブランチ |
| `hotfix/*` | 緊急修正 | `main` | 本番環境の緊急修正用ブランチ |

### ブランチ運用ルール

#### 1. feature/* ブランチ
```bash
# 新機能開発の流れ
git checkout develop
git pull origin develop
git checkout -b feature/task-x.x.x-feature-name

# 開発作業...

git add .
git commit -m "実装内容

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin feature/task-x.x.x-feature-name

# プルリクエスト作成
gh pr create --base develop --title "Task X.X.X: 機能名" --body "..."
```

#### 2. bugfix/* ブランチ
```bash
# バグ修正の流れ
git checkout develop
git pull origin develop
git checkout -b bugfix/issue-number-bug-description

# 修正作業...

git add .
git commit -m "fix: バグ修正内容

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin bugfix/issue-number-bug-description

# プルリクエスト作成
gh pr create --base develop --title "Fix: バグ修正内容" --body "..."
```

#### 3. hotfix/* ブランチ
```bash
# 緊急修正の流れ
git checkout main
git pull origin main
git checkout -b hotfix/emergency-fix-description

# 緊急修正作業...

git add .
git commit -m "hotfix: 緊急修正内容

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# main と develop 両方にマージ
git push origin hotfix/emergency-fix-description

# main 向けプルリクエスト
gh pr create --base main --title "Hotfix: 緊急修正内容" --body "..."

# develop 向けプルリクエスト  
gh pr create --base develop --title "Hotfix: 緊急修正内容" --body "..."
```

## 🔄 開発ワークフロー

### Phase 1: 企画・設計
1. **要件定義**
   - ユーザーストーリー作成
   - 機能要件・非機能要件整理
   - タスク分解・工数見積もり

2. **GitHub Issue作成**
   ```bash
   gh issue create --title "Task X.X.X: 機能名" --body "
   ## 概要
   機能の概要説明
   
   ## 実装内容
   - [ ] サブタスク1
   - [ ] サブタスク2
   
   ## 受け入れ条件
   - 条件1
   - 条件2
   
   ## 工数見積もり
   X日
   "
   ```

### Phase 2: 開発
1. **開発ブランチ作成**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/task-x.x.x-feature-name
   ```

2. **実装作業**
   - コーディング
   - テスト作成
   - ドキュメント更新

3. **コミット**
   ```bash
   git add .
   git commit -m "実装: 機能の説明

   詳細な実装内容の説明

   🤖 Generated with [Claude Code](https://claude.ai/code)

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

### Phase 3: レビュー・統合
1. **プルリクエスト作成**
   ```bash
   git push origin feature/task-x.x.x-feature-name
   
   gh pr create --base develop --title "Task X.X.X: 機能名" --body "$(cat <<'EOF'
   ## 概要
   実装した機能の概要

   ## 変更内容
   - 変更点1
   - 変更点2

   ## テスト内容
   - テスト項目1
   - テスト項目2

   ## スクリーンショット
   [必要に応じて画像添付]

   🤖 Generated with [Claude Code](https://claude.ai/code)
   EOF
   )"
   ```

2. **コードレビュー**
   - レビュー対応
   - 修正・追加コミット

3. **マージ**
   - develop ブランチにマージ
   - feature ブランチ削除

### Phase 4: リリース
1. **リリース準備**
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git tag v1.x.x
   git push origin main --tags
   ```

2. **デプロイ**
   - 本番環境へのデプロイ
   - 動作確認

## 💻 日常開発フロー

### 1. 朝の作業開始
```bash
# 最新状態に更新
git checkout develop
git pull origin develop

# 作業中ブランチがある場合
git checkout feature/current-task
git rebase develop  # 必要に応じて
```

### 2. 新しいタスク開始
```bash
# Issue確認・作成
gh issue list --state open
gh issue create --title "Task X.X.X: 新機能" --body "..."

# 開発ブランチ作成
git checkout -b feature/task-x.x.x-new-feature

# 開発開始
```

### 3. 作業中のコミット
```bash
# 頻繁な中間コミット
git add .
git commit -m "wip: 作業途中の状態"

# 機能完成時
git add .
git commit -m "feat: 新機能実装完了

機能の詳細説明

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### 4. プルリクエスト作成
```bash
git push origin feature/task-x.x.x-new-feature

gh pr create --base develop --title "Task X.X.X: 新機能" --body "$(cat <<'EOF'
## 概要
新機能の概要説明

## 実装内容
- [x] サブタスク1
- [x] サブタスク2

## テスト手順
1. 手順1
2. 手順2

🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

## 📋 現在の開発状況

### 完了したタスク
- [x] **Phase 1**: 基盤・環境構築
  - [x] Task 1.1.1-1.1.4: 環境セットアップ
  - [x] Task 1.2.1-1.2.3: 認証システム

- [x] **Phase 2**: UIコンポーネント
  - [x] Task 2.1.1-2.1.3: デザインシステム
  - [x] Task 2.2.1-2.2.3: 複合UIコンポーネント

- [x] **Phase 3**: 記録機能
  - [x] Task 3.1.1-3.1.4: 記録入力フォーム
  - [x] Task 3.2.1-3.2.2: 記録データ管理

### 現在の作業ブランチ
- `feature/task-3.2.1-records-context` (Phase 3 完了、マージ準備中)

### 次のタスク
- **Phase 4**: ダッシュボード・一覧
  - [ ] Task 4.1.1: ダッシュボードレイアウト
  - [ ] Task 4.1.2: 最新記録表示
  - [ ] Task 4.1.3: 今日の統計

## 🎯 新規セッションでの確認事項

### Claude Code新規起動時
1. このファイル（DEVELOPMENT_WORKFLOW.md）を必ず読む
2. NEXTJS_CODING_RULES.mdを必ず読む
3. プロジェクト状況を把握してから作業開始

### ターミナル新規起動時
1. cdでプロジェクトディレクトリに移動
2. 上記の必須手順を実行
3. 現在のブランチ・作業状況を確認

## 🛠 開発ツール・コマンド

### よく使うコマンド
```bash
# ブランチ確認
git branch -a
git status

# リモート同期
git fetch --all
git pull origin develop

# 不要ブランチ削除
git branch -d feature/completed-task
git push origin --delete feature/completed-task

# Issue・PR管理
gh issue list
gh pr list
gh pr status

# 開発サーバー
npm run dev
npm run storybook

# テスト・ビルド
npm run test
npm run build
npm run lint
```

### Git設定
```bash
# コミットテンプレート設定
git config commit.template .gitmessage

# エディタ設定
git config core.editor "code --wait"

# ブランチの自動セットアップ
git config push.autoSetupRemote true
```

## 📚 ドキュメント管理

### ドキュメント構成
```
docs/
├── DEVELOPMENT_WORKFLOW.md    # このファイル
├── FRONTEND_DEVELOPMENT_TASKS.md  # フロントエンド開発タスク
├── APPLICATION_SPECIFICATION.md   # アプリ仕様書
└── API_SPECIFICATION.md       # API仕様書 (予定)
```

### ドキュメント更新ルール
- 新機能追加時：仕様書更新
- ワークフロー変更時：本ファイル更新
- タスク完了時：進捗状況更新

## 🚀 リリース管理

### バージョニング
- セマンティックバージョニング採用 (vX.Y.Z)
- X: メジャーバージョン (破壊的変更)
- Y: マイナーバージョン (新機能追加)
- Z: パッチバージョン (バグ修正)

### リリースサイクル
- **Weekly Release**: 毎週金曜日に develop → main
- **Hotfix Release**: 緊急時は随時
- **Major Release**: 大きな機能追加時

## ⚠️ 重要な注意事項

- **この手順を省略した開発は絶対に禁止**
- **「前回の続き」でも必ず再確認**
- **エラーが発生したら類似箇所を全て確認**

## 🔄 継続的改善

このワークフローは随時更新されます。セッション開始時に必ず最新版を確認してください。

---

**Document Version**: 2.0  
**Last Updated**: 2024-08-16  
**Next Review**: Phase 4 完了時