# BabyLog 開発フロー

## プロジェクト概要
夫婦間の育児記録をリアルタイムで共有し、育児の不安を解消するWebアプリケーション

## 技術スタック
- **フロントエンド**: Next.js (SPA) + TypeScript + Tailwind CSS
- **バックエンド**: Ruby on Rails API + Devise + JWT
- **データベース**: PostgreSQL
- **認証**: JWT Bearer Token
- **API仕様**: OpenAPI 3.0
- **ホスティング**: Vercel (フロントエンド), Render (バックエンド)

## 実施済み開発ステップ

### 1. プロジェクト初期化 ✅

#### 1.1 Next.jsプロジェクトの作成
```bash
# Next.jsプロジェクトをTypeScript、Tailwind CSS、ESLintで初期化
npx create-next-app@latest baby-log --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**選択したオプション:**
- `--typescript`: TypeScript対応
- `--tailwind`: Tailwind CSS統合
- `--eslint`: ESLint設定
- `--app`: App Routerを使用
- `--src-dir`: src/ディレクトリ構造
- `--import-alias "@/*"`: インポートエイリアス設定
- Turbopack: No (安定性重視)

#### 1.2 Rails APIバックエンドプロジェクトの作成
```bash
# Rails APIプロジェクトをPostgreSQLで作成
rails new backend --api --database=postgresql --skip-git
```

### 2. バックエンドAPI開発環境構築 ✅

#### 2.1 認証・認可システムのセットアップ
```bash
# Gemfileに必要な依存関係を追加
gem "devise"      # 認証
gem "devise-jwt"  # JWT トークン
gem "pundit"      # 認可
gem "rack-cors"   # CORS
gem "bcrypt"      # パスワード暗号化

bundle install
```

#### 2.2 Deviseの設定
```bash
# Devise設定ファイル生成
rails generate devise:install

# JWT設定を追加
# config/initializers/devise.rb にJWT設定を追加
```

#### 2.3 Userモデルの作成
```bash
# DeviseでUserモデル生成
rails generate devise User
```

#### 2.4 データベースマイグレーション実行
```bash
# データベース作成とマイグレーション実行
rails db:create
rails db:migrate
```

### 3. OpenAPIモックサーバー設定 ✅

#### 3.1 Prism CLIのインストール
```bash
# OpenAPIモックサーバー用ツールをインストール
npm install -D @stoplight/prism-cli
```

#### 3.2 モックサーバースクリプトの追加
**package.jsonに追加:**
```json
{
  "scripts": {
    "mock-server": "prism mock openapi.yaml --host 0.0.0.0 --port 3001",
    "mock-server:validate": "prism mock openapi.yaml --host 0.0.0.0 --port 3001 --validate-request --validate-response"
  }
}
```

#### 3.3 API仕様書の準備
**ファイル:** `openapi.yaml`

**主要エンドポイント:**
1. **認証API**: `/api/auth/*` (login, register, logout, me)
2. **ユーザーAPI**: `/api/users/*` (profile)
3. **育児記録API**: `/api/records/*` (CRUD operations)
4. **パートナーシップAPI**: `/api/partnerships/*` (partnership management)

**記録可能なデータ型:**
- `milk`: ミルク・授乳記録
- `diaper`: おむつ替え記録
- `sleep`: 睡眠記録
- `vaccination`: 予防接種記録
- `growth`: 成長記録

## プロジェクト構造

```
baby-log/
├── frontend/                 # Next.js フロントエンド
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx      # メインページ
│   │   ├── components/       # UIコンポーネント
│   │   ├── contexts/         # React Context
│   │   ├── features/         # 機能別コード
│   │   └── lib/
│   │       └── api.ts        # API通信設定
│   ├── public/               # 静的ファイル
│   ├── .storybook/           # Storybook設定
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
├── backend/                  # Rails API
│   ├── app/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── ...
│   ├── config/
│   │   ├── database.yml
│   │   ├── routes.rb
│   │   └── initializers/
│   │       └── devise.rb
│   └── Gemfile
├── openapi.yaml             # API仕様書
├── package.json             # モノレポ管理用
├── DEVELOPMENT_FLOW.md
├── TEAM_DEVELOPMENT.md
└── MIGRATION_PLAN.md
```

## 開発ワークフロー

### フロントエンド開発時（モック使用）
```bash
# ルートディレクトリから実行
npm run dev:mock
# または個別に実行
npm run mock-server    # ターミナル1
npm run dev:frontend   # ターミナル2
```

### バックエンド開発時（実API使用）
```bash
# ルートディレクトリから実行
npm run dev
# または個別に実行
npm run dev:backend    # ターミナル1（Rails API）
npm run dev:frontend   # ターミナル2（Next.js）
```

### フロントエンドのみ開発
```bash
npm run dev:frontend
```

## 次の開発ステップ（TODO）

### 1. Rails APIモデル・コントローラー実装
- [ ] Userモデルの拡張（display_name, avatar_url等）
- [ ] Partnershipモデルの作成
- [ ] Recordモデルの作成
- [ ] 各APIコントローラーの実装

### 2. 認証・認可の実装
- [ ] JWT認証エンドポイントの実装
- [ ] Punditによる認可ポリシーの設定
- [ ] CORS設定の調整

### 3. フロントエンド機能実装
- [ ] ユーザー登録・ログイン画面
- [ ] 認証状態管理
- [ ] ワンタップ記録機能（ミルク・うんちボタン）
- [ ] 今日のまとめダッシュボード

### 4. 高度な機能
- [ ] パートナー招待機能
- [ ] 記録詳細設定（量、色、状態など）
- [ ] データの可視化（グラフ表示）

## 開発時の注意点

1. **セキュリティ**
   - JWT秘密キーはRails credentialsで管理
   - Punditによる適切な認可設定
   - CORS設定でフロントエンドドメインのみ許可

2. **コーディング規約**
   - TypeScriptの型安全性を活用
   - Tailwind CSSでレスポンシブデザイン  
   - ESLintルールに従ったコード品質維持
   - RailsのRESTful設計原則に従う

3. **開発プロセス**
   - OpenAPI仕様書を基にした契約ファースト開発
   - モックサーバーを活用したフロントエンド先行開発
   - 機能単位でのイテレーション開発

## 実行コマンド

### 全体（ルートから実行）
```bash
# フロント＋バック同時開発
npm run dev

# フロント＋モック同時開発
npm run dev:mock

# フロントエンドのみ
npm run dev:frontend

# バックエンドのみ
npm run dev:backend

# ビルド
npm run build

# テスト
npm run test

# リント
npm run lint

# Storybook起動
npm run storybook
```

### フロントエンド個別（frontend/から実行）
```bash
cd frontend

# 開発サーバー起動
npm run dev

# モックサーバー起動
npm run mock-server

# ビルド
npm run build

# リント実行
npm run lint

# Storybook起動
npm run storybook
```

### バックエンド
```bash
# 開発サーバー起動
cd backend
rails server -p 3001

# データベースマイグレーション
rails db:migrate

# テスト実行
rails test

# Rails console
rails console
```