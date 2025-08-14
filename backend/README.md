# BabyLog - バックエンドAPI

夫婦間の育児記録をリアルタイムで共有し、育児の不安を解消するWebアプリケーションのバックエンドAPI

## 技術スタック

- **Framework**: Ruby on Rails 8.0.2 (API only)
- **Language**: Ruby 3.2.3
- **Database**: PostgreSQL 14.x
- **Authentication**: Devise + JWT
- **Authorization**: Pundit
- **CORS**: rack-cors
- **Deployment**: Render

## 開発環境セットアップ

### 前提条件
- Ruby 3.2.3
- PostgreSQL 14.x以上
- Bundler

### インストール
```bash
# 依存関係のインストール
bundle install

# データベースセットアップ
rails db:create
rails db:migrate
rails db:seed

# JWT秘密キーの設定
rails credentials:edit
# jwt_secret_key: your_jwt_secret_key を追加
```

## 開発フロー

### 1. API開発時の基本フロー

#### 手順:
1. **Rails開発サーバーを起動**
   ```bash
   rails server -p 3001
   ```
   - APIサーバーが`http://localhost:3001`で起動

2. **別ターミナルでフロントエンド開発サーバーを起動**
   ```bash
   cd ..
   npm run dev
   ```
   - フロントエンドが`http://localhost:3000`で起動

3. **API開発**
   - モデル、コントローラー、ルートを実装
   - OpenAPI仕様書(`../openapi.yaml`)に従って開発
   - PostmanやcURLでAPIテスト

### 2. モデル駆動開発

#### 手順:
1. **モデル生成**
   ```bash
   rails generate model ModelName field1:type field2:type
   ```

2. **マイグレーション実行**
   ```bash
   rails db:migrate
   ```

3. **コントローラー生成**
   ```bash
   rails generate controller Api::ModelNamesController
   ```

4. **ルート設定**
   ```ruby
   # config/routes.rb
   namespace :api do
     resources :model_names
   end
   ```

### 3. 認証・認可開発

#### JWT認証の実装:
1. **認証エンドポイントの実装**
   - POST `/api/auth/login`
   - POST `/api/auth/register`
   - DELETE `/api/auth/logout`
   - GET `/api/auth/me`

2. **Punditポリシーの実装**
   ```bash
   rails generate pundit:policy ModelName
   ```

## 利用可能なスクリプト

### 開発用
```bash
# 開発サーバー起動
rails server -p 3001

# Rails console
rails console

# ルート確認
rails routes

# データベースリセット
rails db:reset
```

### テスト
```bash
# テスト実行
rails test

# 特定のテストファイル実行
rails test test/models/user_test.rb

# テストカバレッジ
rails test:coverage
```

### マイグレーション
```bash
# マイグレーション作成
rails generate migration AddFieldToModel field:type

# マイグレーション実行
rails db:migrate

# マイグレーション巻き戻し
rails db:rollback

# マイグレーション状態確認
rails db:migrate:status
```

### データベース
```bash
# データベース作成
rails db:create

# データベース削除
rails db:drop

# シードデータ投入
rails db:seed

# データベース完全リセット
rails db:reset
```

## プロジェクト構造

```
app/
├── controllers/
│   ├── application_controller.rb
│   └── api/                    # API コントローラー
│       ├── auth_controller.rb  # 認証
│       ├── users_controller.rb # ユーザー管理
│       ├── records_controller.rb # 育児記録
│       └── partnerships_controller.rb # パートナーシップ
├── models/
│   ├── application_record.rb
│   ├── user.rb                 # ユーザーモデル
│   ├── partnership.rb          # パートナーシップモデル
│   └── record.rb               # 育児記録モデル
├── policies/                   # Pundit認可ポリシー
│   ├── application_policy.rb
│   ├── user_policy.rb
│   ├── partnership_policy.rb
│   └── record_policy.rb
├── serializers/                # JSONシリアライザー（必要に応じて）
└── jobs/                       # バックグラウンドジョブ

config/
├── routes.rb                   # ルート定義
├── database.yml               # データベース設定
├── application.rb             # アプリケーション設定
└── initializers/
    ├── devise.rb              # Devise設定
    ├── cors.rb                # CORS設定
    └── ...

db/
├── migrate/                   # マイグレーションファイル
├── schema.rb                  # データベーススキーマ
└── seeds.rb                   # シードデータ
```

## API仕様

### 認証API
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `DELETE /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 認証ユーザー情報取得

### ユーザーAPI
- `GET /api/users/profile` - プロフィール取得
- `PUT /api/users/profile` - プロフィール更新

### 育児記録API
- `GET /api/records` - 記録一覧取得
- `POST /api/records` - 記録作成
- `GET /api/records/:id` - 記録詳細取得
- `PUT /api/records/:id` - 記録更新
- `DELETE /api/records/:id` - 記録削除

### パートナーシップAPI
- `GET /api/partnerships` - パートナーシップ一覧
- `POST /api/partnerships` - パートナーシップリクエスト送信
- `PUT /api/partnerships/:id` - パートナーシップ応答

詳細は[../openapi.yaml](../openapi.yaml)を参照

## データベース設計

### 主要テーブル

#### users
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `display_name` (String)
- `avatar_url` (String, Optional)
- `created_at`, `updated_at`

#### partnerships
- `id` (UUID, Primary Key)
- `user1_id` (UUID, Foreign Key)
- `user2_id` (UUID, Foreign Key)
- `status` (Enum: pending, accepted, declined)
- `created_at`

#### records
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `type` (Enum: milk, diaper, sleep, vaccination, growth)
- `timestamp` (DateTime)
- `metadata` (JSON)
- `created_at`, `updated_at`

## 認証・認可

### JWT認証
- ログイン時にJWTトークンを発行
- トークンの有効期限: 1日
- リフレッシュトークンなし（セキュリティ重視）

### Punditによる認可
```ruby
# 基本ポリシー例
class RecordPolicy < ApplicationPolicy
  def show?
    # 自分の記録またはパートナーの記録のみ閲覧可能
    user == record.user || user.partners.include?(record.user)
  end

  def create?
    # 認証済みユーザーは記録作成可能
    user.present?
  end

  def update?
    # 自分の記録のみ更新可能
    user == record.user
  end
end
```

## CORS設定

```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000', 'https://your-frontend-domain.com'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

## 環境変数

```bash
# データベース接続（本番環境）
DATABASE_URL=postgresql://user:password@host:port/database

# JWT秘密キー（Rails credentialsで管理推奨）
RAILS_MASTER_KEY=your_master_key

# その他の設定
RAILS_ENV=development
```

## テスト

### テスト構造
```
test/
├── controllers/        # コントローラーテスト
├── models/            # モデルテスト
├── integration/       # 統合テスト
├── fixtures/          # テストデータ
└── test_helper.rb     # テストヘルパー
```

### テスト実行例
```bash
# 全テスト実行
rails test

# モデルテストのみ
rails test test/models/

# 特定のテスト
rails test test/models/user_test.rb

# テスト詳細出力
rails test --verbose
```

## デプロイ

### Render（推奨）
1. **データベース設定**
   - Render PostgreSQLインスタンスを作成
   - DATABASE_URLを環境変数に設定

2. **Webサービス設定**
   - ビルドコマンド: `bundle install && rails db:migrate`
   - スタートコマンド: `rails server -p $PORT -e $RAILS_ENV`

3. **環境変数**
   - `RAILS_MASTER_KEY`
   - `DATABASE_URL`
   - その他必要な環境変数

### Docker
```dockerfile
# Dockerfile例
FROM ruby:3.2.3

WORKDIR /app
COPY Gemfile* ./
RUN bundle install

COPY . .

EXPOSE 3001
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3001"]
```

## トラブルシューティング

### よくある問題

1. **データベース接続エラー**
   ```bash
   # PostgreSQLサービス確認
   brew services list | grep postgresql
   
   # サービス開始
   brew services start postgresql
   ```

2. **Devise JWT設定エラー**
   ```bash
   # クレデンシャル再生成
   rm config/master.key config/credentials.yml.enc
   rails credentials:edit
   ```

3. **CORS エラー**
   - `config/initializers/cors.rb`の設定確認
   - フロントエンドのオリジン追加

4. **マイグレーションエラー**
   ```bash
   # データベースリセット
   rails db:drop db:create db:migrate db:seed
   ```

## 開発ガイドライン

### コーディング規約
- [RAILS_CODING_RULES.md](../RAILS_CODING_RULES.md) を参照
- RESTful API設計原則に従う
- 適切なHTTPステータスコードを使用
- エラーハンドリングの統一

### セキュリティ
- SQLインジェクション対策（Strong Parameters使用）
- XSS対策（適切なエスケープ）
- CSRF対策（API modeでは無効化）
- 認可チェックの徹底（Pundit使用）

### パフォーマンス
- N+1クエリの回避
- 適切なインデックス設定
- ページネーションの実装
- キャッシュ戦略

## 関連ドキュメント

- [../DEVELOPMENT_FLOW.md](../DEVELOPMENT_FLOW.md) - 全体の開発フロー
- [../RAILS_CODING_RULES.md](../RAILS_CODING_RULES.md) - コーディング規約
- [../openapi.yaml](../openapi.yaml) - API仕様書