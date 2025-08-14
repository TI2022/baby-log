# Rails API コーディングルール

## 0. API設計優先開発（OpenAPI First）

**必須要件**: すべてのAPI開発は OpenAPI 仕様定義から開始すること

### OpenAPI開発フロー

1. **API仕様定義**: `openapi.yaml` でエンドポイント、リクエスト/レスポンス構造を定義
2. **仕様レビュー**: フロントエンド開発者と仕様を確認・合意
3. **モックサーバー**: OpenAPI仕様からモックサーバーを起動してフロントエンド開発を並行化
4. **実装**: 仕様に基づいて Rails API を実装
5. **検証**: 実装がOpenAPI仕様と一致することを確認

### OpenAPI 仕様例

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: Baby Log API
  version: 1.0.0
paths:
  /api/records:
    get:
      summary: 育児記録一覧取得
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Record'
    post:
      summary: 育児記録作成
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateRecord'
      responses:
        '201':
          description: 作成成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Record'

components:
  schemas:
    Record:
      type: object
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
        type:
          type: string
          enum: [milk, diaper, sleep, vaccination, growth]
        timestamp:
          type: string
          format: date-time
        metadata:
          type: object
```

### OpenAPI ツール活用

- **Swagger UI**: 仕様書の可視化とAPIテスト
- **Prism**: OpenAPI仕様からモックサーバー生成
- **OpenAPI Generator**: 型定義やクライアントコード自動生成
- **Committee**: Rails側でOpenAPI仕様との整合性チェック

## 1. 基本思想：責務の分離と依存関係の明確化

この設計の目的は、Railsの「Fat Model, Skinny Controller」が大規模化で破綻するのを防ぎ、各クラスの責務を明確に分離することです。

* **Controller**: HTTPリクエストとレスポンスにのみ責任を持つ
* **Usecase (Application)**: アプリケーション固有のビジネスロジック（ユースケース）に責任を持つ
* **Domain**: アプリケーションの核となるドメイン知識・ルールに責任を持つ
* **Repository (Infrastructure)**: データ永続化（DBアクセス）にのみ責任を持つ

**重要なルール**: 依存関係は必ず一方向（Controller → Usecase → Repository）

## 2. ディレクトリ構成

```
app
├── controllers
│   └── api
│       └── v1
│           └── users_controller.rb  # ① HTTPの関心事
├── models
│   └── user.rb                      # ② ドメインオブジェクト (ActiveRecord)
├── repositories
│   └── user_repository.rb           # ③ DBアクセスの抽象化
├── usecases
│   └── users
│       ├── create_user.rb           # ④ ビジネスロジック
│       └── update_user.rb
└── views
    └── api
        └── v1
            └── users
                ├── _user.json.jbuilder
                └── index.json.jbuilder # ⑤ レスポンスの整形
```

## 3. 実装例：ユーザー作成

### Step 1: ルーティング (config/routes.rb)
```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:create, :show, :index]
    end
  end
end
```

### Step 2: Controller (app/controllers/api/v1/users_controller.rb)
```ruby
module Api
  module V1
    class UsersController < ApplicationController
      def create
        # 1. Usecaseをインスタンス化
        usecase = Users::CreateUser.new

        # 2. Usecaseを実行し、結果を受け取る
        result = usecase.call(user_params: user_params)

        if result.success?
          # 3. 成功レスポンスを返す
          @user = result.user
          render :show, status: :created
        else
          # 4. 失敗レスポンスを返す
          render json: { errors: result.errors }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.require(:user).permit(:name, :email)
      end
    end
  end
end
```

### Step 3: Usecase (app/usecases/users/create_user.rb)
```ruby
module Users
  class CreateUser
    # DI（依存性注入）を可能にするため、initializeでRepositoryを受け取る
    def initialize(user_repository: UserRepository.new)
      @user_repository = user_repository
    end

    def call(user_params:)
      user = @user_repository.new_user(user_params)

      if @user_repository.save(user)
        # 成功した場合は、結果オブジェクトを返す
        OpenStruct.new(success?: true, user: user)
      else
        # 失敗した場合も、結果オブジェクトを返す
        OpenStruct.new(success?: false, errors: user.errors.full_messages)
      end
    end
  end
end
```

### Step 4: Repository (app/repositories/user_repository.rb)
```ruby
class UserRepository
  def new_user(params)
    User.new(params)
  end

  def save(user)
    user.save
  end

  def find(id)
    User.find(id)
  end

  def all
    User.all
  end
end
```

### Step 5: Model (app/models/user.rb)
```ruby
class User < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
end
```

## 4. テスト戦略

### Usecaseのテスト例
```ruby
# spec/usecases/users/create_user_spec.rb
RSpec.describe Users::CreateUser do
  it 'ユーザー作成に成功した場合、成功結果とユーザーを返す' do
    user_params = { name: 'Test', email: 'test@example.com' }
    user = User.new(user_params)

    # Repositoryをモック化
    mock_repo = instance_double(UserRepository)
    allow(mock_repo).to receive(:new_user).with(user_params).and_return(user)
    allow(mock_repo).to receive(:save).with(user).and_return(true)

    usecase = described_class.new(user_repository: mock_repo)
    result = usecase.call(user_params: user_params)

    expect(result.success?).to be true
    expect(result.user).to eq user
  end
end
```

## 5. テストのメリット

* **Controllerのテスト**: Usecaseをモック化し、HTTPレスポンスのみテスト
* **Usecaseのテスト**: Repositoryをモック化し、ビジネスロジックを純粋にテスト（DBアクセス不要）
* **Repositoryのテスト**: 実際のDBアクセスをテスト

この構成により、責務が明確で、誰が見ても処理の流れを追いやすく、かつ各レイヤーが独立してテストできる、堅牢でメンテナンス性の高いAPIを構築できます。

## 6. パフォーマンス最適化戦略

### データベース（SQL）パフォーマンスの徹底最適化

**原則**: N+1問題の撲滅、インデックスの適切な利用、効率的なクエリの記述を徹底する

#### 1. N+1問題の徹底排除
- **必須ルール**: 関連データ取得時は`includes`, `preload`, `eager_load`を適切に利用
- **監視ツール**: Bullet gem導入でN+1クエリ自動検知・警告
- **確認習慣**: `rails dbconsole`や`ActiveRecord::Base.logger.level = :debug`でSQLログ確認

```ruby
# ❌ N+1問題を引き起こす
users = User.all
users.each { |user| puts user.posts.count }

# ✅ N+1問題を解決
users = User.includes(:posts)
users.each { |user| puts user.posts.size }
```

#### 2. インデックスの戦略的活用
- **必須ルール**: WHERE句、ORDER BY句、JOIN句頻用カラムには必ずインデックス
- **外部キー**: デフォルトでインデックス設定
- **確認方法**: `EXPLAIN ANALYZE`でクエリ実行計画確認、フルスキャン検出
- **注意事項**: 書き込み性能低下のため必要最小限に限定

#### 3. 効率的なクエリの記述
```ruby
# ✅ 必要なカラムのみ選択
User.select(:id, :name, :email)

# ✅ 大量レコード処理はバッチ処理
User.find_each(batch_size: 1000) { |user| process(user) }

# ✅ 効率的なカウント
User.size # キャッシュ活用
User.count(:id) # 特定カラムカウント

# ❌ Ruby側処理の多用を避ける
users.map(&:posts).flatten # DB側で集計すべき
```

#### 4. トランザクションの短縮と最適化
- **必須ルール**: 必要最小限の範囲で短時間実行
- **禁止事項**: トランザクション内での外部API呼び出し、時間のかかる処理
- **考慮事項**: デッドロックリスク回避

### アプリケーションコードの最適化

**原則**: 軽量なController、効率的なRubyコード、非同期処理の活用

#### 1. Controllerの軽量化（Skinny Controller）
```ruby
# ✅ 軽量なController
class Api::V1::UsersController < ApplicationController
  def create
    usecase = Users::CreateUser.new
    result = usecase.call(user_params: user_params)
    
    if result.success?
      render json: result.user, status: :created
    else
      render json: { errors: result.errors }, status: :unprocessable_entity
    end
  end
end
```

#### 2. 効率的なRubyコードの記述
```ruby
# ✅ 効率的なメソッド使用
array.filter_map(&:method)  # map.compact より高速
array.find(&:condition)     # select.first より高速

# ✅ オブジェクト生成抑制
CONSTANT_ARRAY = [1, 2, 3].freeze  # ループ外で定数定義
```

#### 3. 外部API呼び出しの最適化
```ruby
# ✅ タイムアウトとリトライ戦略
HTTP.timeout(connect: 5, read: 30)
    .get(url)
    .then { |response| handle_success(response) }
    .rescue(HTTP::TimeoutError) { |e| handle_timeout(e) }
```

### API設計とシリアライゼーションの最適化

**原則**: クライアント必要データのみを効率的な形式で提供

#### 1. 必要なデータのみを返す
```ruby
# app/views/api/v1/users/_user.json.jbuilder
json.extract! user, :id, :name, :email, :created_at

# 条件付き関連データ
if params[:include_posts]
  json.posts user.posts, :id, :title, :created_at
end
```

#### 2. ページネーションの導入
```ruby
# ✅ オフセットベースページネーション
users = User.page(params[:page]).per(20)

# ✅ カーソルベースページネーション（大規模データ向け）
users = User.where('id > ?', params[:last_id]).limit(20)
```

### キャッシュ戦略の活用

**原則**: 頻繁アクセス・低更新頻度データの積極的キャッシュ

#### 1. HTTPキャッシュの活用
```ruby
def show
  @user = User.find(params[:id])
  
  if stale?(etag: @user, last_modified: @user.updated_at)
    render json: @user
  end
end
```

#### 2. Rails.cacheの活用
```ruby
def expensive_calculation
  Rails.cache.fetch("calculation_#{user.id}", expires_in: 1.hour) do
    # コストの高い計算処理
    perform_expensive_operation
  end
end
```

### 非同期処理の活用

**原則**: 時間のかかる処理はすべてバックグラウンドジョブにオフロード

#### 1. Active Jobの積極的利用
```ruby
# ✅ メール送信の非同期化
class UserMailerJob < ApplicationJob
  queue_as :default
  
  def perform(user_id)
    user = User.find(user_id)
    UserMailer.welcome_email(user).deliver_now
  end
end

# Controller内
UserMailerJob.perform_later(user.id)
```

#### 2. ジョブの冪等性確保
```ruby
class ProcessPaymentJob < ApplicationJob
  def perform(payment_id)
    payment = Payment.find(payment_id)
    
    # 冪等性チェック
    return if payment.processed?
    
    process_payment(payment)
  end
end
```

### 継続的監視とプロファイリング

**原則**: パフォーマンスは測定なくして改善なし

#### 1. APMツール導入
- **推奨ツール**: New Relic, Datadog, Scout APM
- **監視対象**: 遅いリクエスト, DBクエリ, 外部API呼び出し
- **運用**: 異常検知時の即座なトレース確認・原因特定

#### 2. DBクエリ監視
```sql
-- PostgreSQL pg_stat_statements活用例
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

#### 3. ベンチマークテスト実施
```ruby
require 'benchmark/ips'

Benchmark.ips do |x|
  x.report('current_method') { current_implementation }
  x.report('optimized_method') { optimized_implementation }
  x.compare!
end
```

### インフラとデプロイの最適化

**原則**: 実行環境もパフォーマンスを意識した設計

#### 1. 適切なDBサイジングとチューニング
- **リソース**: CPU, RAM, IOPSの適切サイジング
- **推奨**: マネージドDBサービス（AWS RDS, GCP Cloud SQL）活用
- **チューニング**: DBパラメータ最適化

#### 2. リードレプリカの活用
```ruby
# config/database.yml
production:
  primary:
    <<: *default
    database: myapp_production
  
  reading:
    <<: *default
    database: myapp_production
    replica: true

# ActiveRecord使用例
User.connected_to(role: :reading) do
  User.where(active: true).count
end
```

#### 3. Webサーバーのチューニング
```ruby
# config/puma.rb
workers ENV.fetch("WEB_CONCURRENCY") { 2 }
threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
threads threads_count, threads_count

preload_app!
```

### パフォーマンス開発フロー

1. **設計段階**: インデックス設計、クエリ計画、キャッシュ戦略検討
2. **開発段階**: N+1問題チェック、効率的コード記述
3. **テスト段階**: ベンチマークテスト、ロードテスト実施
4. **デプロイ段階**: APM監視設定、アラート設定
5. **運用段階**: 継続的監視、定期的ボトルネック分析・改善