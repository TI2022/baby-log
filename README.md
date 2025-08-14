# Baby Log - 育児記録アプリ<br>夫婦間育児記録共有プラットフォーム

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?logo=next.js)](https://nextjs.org/)
[![Rails](https://img.shields.io/badge/Rails-7.1.5-red?logo=ruby-on-rails)](https://rubyonrails.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

夫婦間の育児記録をリアルタイムで共有し、育児の不安を解消するWebアプリケーション

## 📱 アプリ概要

Baby Logは、新生児から幼児期までの大切な成長記録を夫婦間で簡単に共有できるWebアプリケーションです。ワンタップで記録でき、パートナーとリアルタイムで情報を共有することで、育児の負担軽減と成長の見える化を実現します。

### 🎯 主な機能

- 🍼 **ワンタップ記録**: ミルク、おむつ、睡眠、予防接種などの簡単記録
- 👨‍👩‍👧‍👦 **パートナー共有**: 夫婦間でのリアルタイム記録共有
- 📊 **成長の見える化**: 日別・週別・月別の統計とグラフ表示
- 📅 **今日のまとめ**: その日の記録をダッシュボードで一覧表示
- 🔔 **記録通知**: パートナーの記録更新を即座に通知
- 📝 **詳細記録**: 量、時間、メモなどの詳細情報追加機能

### 🏗 システム構成

```mermaid
graph TB
    subgraph "ユーザー"
        U1[👨 パパ]
        U2[👩 ママ]
    end
    
    subgraph "フロントエンド"
        FE[Next.js App<br/>localhost:3000]
    end
    
    subgraph "バックエンド"
        subgraph "開発環境"
            API[Rails API<br/>localhost:3001]
            MOCK[Mock Server<br/>Prism]
        end
        subgraph "本番環境"
            RAILS[Rails API<br/>Render/Railway]
        end
    end
    
    subgraph "データベース"
        DB[(PostgreSQL<br/>Records)]
    end
    
    subgraph "外部サービス"
        AUTH[JWT認証]
        PUSH[プッシュ通知]
    end
    
    U1 --> FE
    U2 --> FE
    FE -.->|開発時| MOCK
    FE -->|本番時| API
    FE -->|本番時| RAILS
    API --> DB
    RAILS --> DB
    API --> AUTH
    RAILS --> AUTH
    API --> PUSH
    RAILS --> PUSH
    
    style FE fill:#0070f3,color:#fff
    style API fill:#dc2626,color:#fff
    style RAILS fill:#dc2626,color:#fff
    style DB fill:#336791,color:#fff
    style MOCK fill:#10b981,color:#fff
```

### 💫 ユーザーフロー

```mermaid
journey
    title 育児記録の1日
    section 朝の記録
      起床時間記録: 5: パパ, ママ
      ミルク記録: 5: パパ
      おむつ交換: 4: ママ
    section 日中の記録
      昼寝時間: 5: ママ
      離乳食記録: 4: ママ
      遊び時間: 5: パパ, ママ
    section 夜の記録
      お風呂時間: 5: パパ
      就寝時間: 5: パパ, ママ
      夜泣き記録: 3: ママ
    section データ確認
      今日のまとめ: 5: パパ, ママ
      成長グラフ: 4: パパ, ママ
```

## 🚀 クイックスタート

```bash
# プロジェクトクローン
git clone https://github.com/your-username/baby-log.git
cd baby-log

# 依存関係のインストール
npm install
npm run install:all

# 環境設定
cp frontend/.env.local.example frontend/.env.local
# 必要に応じて環境変数を編集

# 開発サーバー起動（フロント＋バック）
npm run dev

# または、モック開発（フロントエンドのみ）
npm run dev:mock
```

**アクセスURL:**
- 🌐 **アプリケーション**: [http://localhost:3000](http://localhost:3000)  
- 🔧 **API サーバー**: [http://localhost:3001](http://localhost:3001)  
- 📖 **Storybook**: [http://localhost:6006](http://localhost:6006)

## 🛠 開発コマンド

### 全体開発
```bash
npm run dev           # フロント＋バック同時起動
npm run dev:mock      # フロント＋モック同時起動
npm run build         # ビルド
npm run test          # テスト実行
npm run lint          # リント実行
```

### 個別開発
```bash
npm run dev:frontend  # フロントエンドのみ
npm run dev:backend   # バックエンドのみ
npm run storybook     # Storybook起動
npm run mock-server   # モックサーバーのみ
```

### メンテナンス
```bash
npm run install:all   # 全依存関係インストール
npm run clean        # キャッシュクリア
```

## 📚 技術スタック

### フロントエンド技術

| 技術 | バージョン | 用途 | 選定理由 |
|------|------------|------|----------|
| **Next.js** | 15.4.6 | React フレームワーク | App Router、SSR/SSG対応、優秀な開発体験 |
| **TypeScript** | 5.8.3 | 型安全性 | 大規模開発での品質向上、IDE支援 |
| **Styled Components** | 6.1.0 | CSS-in-JS | 動的スタイリング、テーマ管理 |
| **Storybook** | 8.4.0 | コンポーネント開発 | UI コンポーネントの独立開発・テスト |

### バックエンド技術

| 技術 | バージョン | 用途 | 選定理由 |
|------|------------|------|----------|
| **Ruby on Rails** | 7.1.5 | API フレームワーク | 成熟した MVC、規約による高速開発 |
| **PostgreSQL** | 15+ | データベース | ACID準拠、JSON対応、スケーラビリティ |
| **JWT + Devise** | - | 認証・認可 | ステートレス認証、セキュア |
| **OpenAPI** | 3.0 | API仕様管理 | 契約ファースト開発、自動ドキュメント生成 |

### 開発・インフラ

- **開発環境**: Docker Compose、Prism (モックサーバー)
- **CI/CD**: GitHub Actions
- **インフラ**: Vercel (フロント)、Render/Railway (バック)
- **監視**: OpenTelemetry対応

### 🗄️ データベース設計

```mermaid
erDiagram
    users {
        bigint id PK
        string email UK "ログイン用メール"
        string display_name "表示名"
        string avatar_url "アバター画像URL"
        datetime created_at
        datetime updated_at
    }
    
    partnerships {
        bigint id PK
        bigint user1_id FK
        bigint user2_id FK
        enum status "pending/accepted/declined"
        datetime created_at
        datetime updated_at
    }
    
    records {
        bigint id PK
        bigint user_id FK
        enum type "milk/diaper/sleep/vaccination/growth"
        datetime timestamp "記録日時"
        json metadata "詳細データ"
        datetime created_at
        datetime updated_at
    }
    
    users ||--o{ partnerships : "user1_id"
    users ||--o{ partnerships : "user2_id"
    users ||--o{ records : "creates"
    
    partnerships }o--|| users : "partner1"
    partnerships }o--|| users : "partner2"
```

### 📊 記録データ構造

```mermaid
graph TD
    R[Record] --> T[Type]
    R --> M[Metadata JSON]
    
    T --> T1[🍼 milk<br/>ミルク]
    T --> T2[👶 diaper<br/>おむつ]
    T --> T3[😴 sleep<br/>睡眠]
    T --> T4[💉 vaccination<br/>予防接種]
    T --> T5[📏 growth<br/>成長記録]
    
    M --> M1[量: amount<br/>時間: duration<br/>メモ: note]
    M --> M2[種類: type<br/>状態: condition<br/>メモ: note]
    M --> M3[開始: start_time<br/>終了: end_time<br/>質: quality]
    M --> M4[種類: vaccine_type<br/>病院: hospital<br/>次回: next_date]
    M --> M5[身長: height<br/>体重: weight<br/>頭囲: head_circumference]
    
    style T1 fill:#fef3c7
    style T2 fill:#dbeafe
    style T3 fill:#e0e7ff
    style T4 fill:#fce7f3
    style T5 fill:#d1fae5
```

## 📷 スクリーンショット

> **Note**: 現在開発中のため、以下は予定されているUI/UXのモックアップです

### メイン画面
今日の記録一覧とワンタップ記録ボタン
```
[📱 ワンタップ記録] [📊 今日のまとめ] [👥 パートナー共有]
```

### 記録入力画面
直感的な記録入力インターフェース
```
🍼 ミルク | 👶 おむつ | 😴 睡眠 | 💉 予防接種 | 📏 成長記録
```

### 統計・グラフ画面
成長の可視化とトレンド分析
```
📊 [日別] [週別] [月別] 統計グラフ
📈 成長曲線チャート
```

## 📁 プロジェクト構造

```
baby-log/                          # 🏠 プロジェクトルート
├── frontend/                      # 🌐 Next.js フロントエンド
│   ├── src/
│   │   ├── app/                  # 📄 Next.js App Router
│   │   │   ├── (main)/          # メインアプリケーション
│   │   │   │   ├── RecordsContainer.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── auth/             # 認証関連ページ
│   │   │   ├── dashboard/        # ダッシュボード
│   │   │   ├── records/          # 記録管理
│   │   │   ├── statistics/       # 統計・グラフ
│   │   │   └── settings/         # 設定
│   │   ├── components/          # 🧩 再利用可能UIコンポーネント
│   │   │   ├── ui/              # Button, Input, Card等
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Skeleton.tsx
│   │   │   ├── charts/          # グラフコンポーネント
│   │   │   ├── forms/           # フォームコンポーネント
│   │   │   └── navigation/      # ナビゲーション
│   │   ├── contexts/            # ⚛️ React Context
│   │   │   ├── AuthContext.tsx  # 認証状態管理
│   │   │   └── RecordsContext.tsx # 記録データ管理
│   │   ├── features/            # 🎯 機能別コード
│   │   │   └── records/         # 育児記録機能
│   │   │       ├── components/  # AddRecordForm, RecordsList等
│   │   │       ├── hooks/       # useRecords等
│   │   │       └── index.ts
│   │   ├── lib/                 # 🛠 ユーティリティライブラリ
│   │   │   ├── api.ts          # API通信設定
│   │   │   ├── feature-flags.ts # フィーチャーフラグ
│   │   │   ├── utils.ts        # 汎用ユーティリティ
│   │   │   └── validators.ts   # バリデーション定義
│   │   └── styles/             # 🎨 スタイル関連
│   │       ├── theme.ts        # テーマ設定
│   │       └── styled-components.d.ts
│   ├── public/                 # 📦 静的ファイル
│   ├── .storybook/            # 📖 Storybook設定
│   ├── .env.local             # 🔐 環境変数
│   └── package.json           # 📋 フロントエンド依存関係
├── backend/                   # 🚂 Rails API
│   ├── app/
│   │   ├── controllers/       # API エンドポイント
│   │   │   └── api/v1/       # v1 API
│   │   ├── models/           # データモデル
│   │   │   ├── user.rb       # ユーザー (Devise)
│   │   │   ├── record.rb     # 育児記録
│   │   │   └── partnership.rb # パートナーシップ
│   │   └── serializers/      # JSON レスポンス
│   ├── config/              # Rails 設定
│   │   ├── routes.rb        # API ルーティング
│   │   └── database.yml     # DB設定
│   ├── db/                  # データベース
│   │   ├── migrate/         # マイグレーション
│   │   └── seeds.rb         # 初期データ
│   ├── spec/               # 🧪 RSpec テスト
│   └── Gemfile             # 💎 Ruby 依存関係
├── docs/                   # 📚 プロジェクトドキュメント
│   ├── DEVELOPMENT_FLOW.md     # 開発ワークフロー
│   ├── TEAM_DEVELOPMENT.md     # チーム開発ガイド
│   ├── MIGRATION_PLAN.md       # 段階的移行計画
│   ├── NEXTJS_CODING_RULES.md  # フロントエンド規約
│   └── RAILS_CODING_RULES.md   # バックエンド規約
├── openapi.yaml            # 📋 OpenAPI 3.0 仕様書
├── package.json            # 🎛 モノレポ管理
├── docker-compose.yml      # 🐳 Docker Compose設定
└── README.md               # 📄 このファイル
```

### コンポーネント構成図

```mermaid
graph TD
    App[App Component] --> Layout[Layout]
    App --> Pages[Pages]
    
    Layout --> Header[Header]
    Layout --> Footer[Footer]
    Layout --> Sidebar[Sidebar]
    
    Pages --> Dashboard[Dashboard]
    Pages --> Records[Records]
    Pages --> Statistics[Statistics]
    Pages --> Settings[Settings]
    
    Records --> RecordsList[RecordsList]
    Records --> AddRecordForm[AddRecordForm]
    Records --> RecordCard[RecordCard]
    
    AddRecordForm --> Button[Button]
    AddRecordForm --> Input[Input]
    AddRecordForm --> Select[Select]
    
    RecordCard --> Card[Card]
    RecordCard --> Badge[Badge]
    RecordCard --> Avatar[Avatar]
    
    Statistics --> Charts[Charts]
    Charts --> LineChart[LineChart]
    Charts --> BarChart[BarChart]
    Charts --> PieChart[PieChart]
    
    style App fill:#0070f3,color:#fff
    style Records fill:#10b981,color:#fff
    style Statistics fill:#f59e0b,color:#fff
    style Charts fill:#8b5cf6,color:#fff
```

## API通信

### 設定
API通信はAxiosを使用し、`src/lib/api.ts`で設定しています。

```typescript
// 自動的にJWTトークンをヘッダーに付与
// 401エラー時は自動ログアウト処理
// ベースURL: process.env.NEXT_PUBLIC_RAILS_API_URL
```

### 認証フロー
1. ログイン時にJWTトークンを取得
2. localStorage/sessionStorageに保存
3. 以降のAPI リクエストで自動付与
4. トークン有効期限切れ時は自動ログアウト

## 🚨 開発開始前の必須手順

**新規ターミナル・新規Claudeセッションで必ず実行してください**

```bash
# 開発ルールの確認（必須）
npm run rules

# または直接実行
cat docs/DEVELOPMENT_WORKFLOW.md
cat docs/NEXTJS_CODING_RULES.md | head -150
```

## 開発ガイドライン

### コーディング規約
- [Next.js コーディング規約](./docs/NEXTJS_CODING_RULES.md) を参照
- TypeScriptの型安全性を最大限活用
- CSS-in-JSでレスポンシブデザイン
- ESLintルールに従ったコード品質維持

### コンポーネント開発
1. **Storybook**でコンポーネントを開発
2. **TypeScript**で型安全性を確保
3. **styled-components**でCSS-in-JSスタイリング
4. **Zod**でバリデーション

### 状態管理
- **React Context**: 認証状態、グローバル状態
- **useState/useReducer**: コンポーネントローカル状態
- **カスタムフック**: ロジックの再利用

## 環境変数

```bash
# API接続先（モック/実際のAPI切り替え）
NEXT_PUBLIC_RAILS_API_URL=http://localhost:3001

# その他の設定（必要に応じて）
NEXT_PUBLIC_APP_ENV=development
```

## トラブルシューティング

### よくある問題

1. **モックサーバーが起動しない**
   ```bash
   # Prismの再インストール
   npm install -D @stoplight/prism-cli
   ```

2. **API接続エラー**
   - 環境変数の確認
   - CORS設定の確認
   - バックエンドサーバーの起動確認

3. **型エラー**
   ```bash
   # 型チェック実行
   npx tsc --noEmit
   ```

## デプロイ

### Vercel（推奨）
```bash
# Vercel CLIでデプロイ
npm install -g vercel
vercel

# 環境変数の設定
vercel env add NEXT_PUBLIC_RAILS_API_URL
```

### 静的エクスポート
```bash
# next.config.tsでoutput: 'export'を設定後
npm run build
```

## 📋 要件仕様

### 機能要件

```mermaid
mindmap
  root((Baby Log))
    認証機能
      ユーザー登録
      ログイン・ログアウト
      JWT認証
      パートナー招待
    記録機能
      ワンタップ記録
        ミルク
        おむつ
        睡眠
        予防接種
        成長記録
      詳細入力
        時間・量
        メモ・写真
        場所・状況
      記録編集・削除
    共有機能
      パートナーとの記録共有
      リアルタイム同期
      プッシュ通知
    分析機能
      統計グラフ
      成長曲線
      トレンド分析
    管理機能
      設定・プロフィール
      データエクスポート
      バックアップ
```

### 非機能要件

| カテゴリ | 要件 | 目標値 |
|----------|------|--------|
| **パフォーマンス** | ページ読み込み時間 | < 3秒 |
| **パフォーマンス** | API レスポンス時間 | < 500ms |
| **可用性** | アップタイム | > 99.5% |
| **セキュリティ** | データ暗号化 | TLS 1.3+ |
| **セキュリティ** | 認証方式 | JWT + リフレッシュトークン |
| **ユーザビリティ** | 操作完了時間 (記録追加) | < 10秒 |
| **互換性** | ブラウザ対応 | Chrome, Safari, Firefox |
| **互換性** | モバイル対応 | iOS Safari, Android Chrome |

## 🎯 開発ロードマップ

```mermaid
gantt
    title Baby Log 開発スケジュール
    dateFormat  YYYY-MM-DD
    section Phase 1 MVP
    環境構築          :done, env, 2024-08-01, 2024-08-07
    認証機能          :done, auth, 2024-08-08, 2024-08-14
    基本記録機能      :active, records, 2024-08-15, 2024-08-28
    API統合          :api, 2024-08-29, 2024-09-05
    
    section Phase 2 機能拡張
    パートナー共有    :share, 2024-09-06, 2024-09-20
    統計・グラフ     :stats, 2024-09-21, 2024-10-05
    プッシュ通知     :push, 2024-10-06, 2024-10-15
    
    section Phase 3 最適化
    パフォーマンス改善 :perf, 2024-10-16, 2024-10-30
    テスト充実        :test, 2024-10-31, 2024-11-10
    本番デプロイ      :deploy, 2024-11-11, 2024-11-20
```

### 現在の進捗状況

- ✅ **Phase 1.1**: プロジェクト環境構築完了
- ✅ **Phase 1.2**: フィーチャーフラグシステム導入完了
- 🔄 **Phase 1.3**: 基本記録機能開発中（60%完了）
- ⏳ **Phase 1.4**: API統合 (待機中)
- ⏳ **Phase 2.1**: パートナー共有機能 (設計中)

## 🏗️ プロジェクト管理

### 開発フロー

```mermaid
flowchart TD
    A[Issue作成] --> B{機能種別}
    B -->|新機能| C[feature/xxx ブランチ]
    B -->|バグ修正| D[bugfix/xxx ブランチ]
    B -->|緊急修正| E[hotfix/xxx ブランチ]
    
    C --> F[開発・テスト]
    D --> F
    E --> F
    
    F --> G[プルリクエスト]
    G --> H[コードレビュー]
    H --> I{承認?}
    I -->|Yes| J[main へマージ]
    I -->|No| K[修正]
    K --> F
    
    J --> L[自動デプロイ]
    L --> M[本番確認]
```

### ブランチ戦略

| ブランチ | 用途 | マージ先 |
|----------|------|----------|
| `main` | 本番用安定版 | - |
| `develop` | 開発統合版 | `main` |
| `feature/*` | 新機能開発 | `develop` |
| `bugfix/*` | バグ修正 | `develop` |
| `hotfix/*` | 緊急修正 | `main` + `develop` |

## 📖 ドキュメント

### 🔧 開発者向け
- [開発フロー](./docs/DEVELOPMENT_FLOW.md) - 全体の開発ワークフロー
- [チーム開発ガイド](./docs/TEAM_DEVELOPMENT.md) - 実務チーム開発手法
- [段階的移行計画](./docs/MIGRATION_PLAN.md) - OpenAPI改善計画

### 📏 コーディング規約
- [Next.js コーディング規約](./docs/NEXTJS_CODING_RULES.md) - フロントエンド規約
- [Rails コーディング規約](./docs/RAILS_CODING_RULES.md) - バックエンド規約

### 📋 仕様書
- [API仕様書](./openapi.yaml) - OpenAPI 3.0仕様
- [データベース設計](#️-データベース設計) - ER図とテーブル定義

## 🤝 コントリビューション

Baby Logプロジェクトへの貢献を歓迎します！

### 貢献方法

1. **Issue の確認**: [Issues](https://github.com/your-username/baby-log/issues) で既存の課題を確認
2. **フォーク**: このリポジトリをフォーク
3. **ブランチ作成**: `feature/your-feature-name` でブランチ作成
4. **開発**: コーディング規約に従って開発
5. **テスト**: 必要なテストを追加・実行
6. **プルリクエスト**: 詳細な説明とともにPR作成

### 開発環境の確認

```bash
# 必要な環境
node --version  # >= 18.18.0
npm --version   # >= 8.0.0
docker --version # >= 20.0.0
```

### コミットメッセージ規約

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type例:**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: コードフォーマット
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: その他の作業

## 📄 ライセンス

このプロジェクトは [MIT License](./LICENSE) の下で公開されています。

---

<div align="center">

**Baby Log** - 夫婦間育児記録共有プラットフォーム

Made with ❤️ for parents everywhere

[🏠 Home](#baby-log---育児記録アプリ夫婦間育児記録共有プラットフォーム) • [🚀 Getting Started](#🚀-クイックスタート) • [📖 Docs](#📖-ドキュメント) • [🤝 Contributing](#🤝-コントリビューション)

</div>