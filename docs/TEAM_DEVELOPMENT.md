# チーム開発ガイド

## 実務現場でのOpenAPI開発ワークフロー

### 🚀 クイックスタート

```bash
# 1. 環境構築
npm install
npm run install:all
cp frontend/.env.local.example frontend/.env.local

# 2. モック開発（フロントエンド先行）
npm run dev:mock

# 3. 実API開発（バックエンド連携）
npm run dev

# 4. 個別開発
npm run dev:frontend  # フロントのみ
npm run dev:backend   # バックのみ
```

### 🔧 環境切り替え

#### フロントエンド開発者
```bash
# .env.local
NEXT_PUBLIC_API_MODE=mock
NEXT_PUBLIC_FEATURE_OPTIMISTIC_UPDATES=false
NEXT_PUBLIC_FEATURE_DETAILED_LOGGING=true
```

#### バックエンド開発者
```bash
# .env.local  
NEXT_PUBLIC_API_MODE=real
NEXT_PUBLIC_FEATURE_OPTIMISTIC_UPDATES=true
NEXT_PUBLIC_FEATURE_DETAILED_LOGGING=true
```

#### 本番環境
```bash
# .env.production
NEXT_PUBLIC_API_MODE=real
NEXT_PUBLIC_FEATURE_OPTIMISTIC_UPDATES=true
NEXT_PUBLIC_FEATURE_DETAILED_LOGGING=false
```

### 👥 役割分担

#### フロントエンド開発者
- **責務**: UI/UX, 状態管理, モック環境での開発
- **使用環境**: `API_MODE=mock`
- **注意点**: 楽観的更新は無効、モックサーバーのレスポンスに依存

#### バックエンド開発者  
- **責務**: API実装, データベース設計, 認証・認可
- **使用環境**: `API_MODE=real`
- **注意点**: フロントエンドの楽観的更新を考慮したAPI設計

#### QA・テスター
- **責務**: 結合テスト, パフォーマンステスト
- **使用環境**: `API_MODE=real` + 各種フィーチャーフラグ組み合わせ

### 🐛 デバッグ支援

#### 開発者コンソール
```javascript
// ブラウザコンソールで実行可能
console.log(window.__FEATURE_FLAGS);  // 現在の設定確認
console.log(window.__API_MODE);       // APIモード確認
```

#### ログ出力例
```
✅ API Success [mock]: POST /api/records (201)
❌ API Error [real]: DELETE /api/records/temp-123 (422)
📝 Record added successfully in simple mode
```

### 🔄 ブランチ戦略

```
main
├── develop
│   ├── feature/frontend-records-ui     # フロント先行開発
│   ├── feature/backend-records-api     # バック並行開発
│   └── feature/integration-testing     # 結合テスト
└── release/v1.0.0
```

### 📋 タスク管理

#### フロントエンド優先タスク
- [ ] UI コンポーネント実装
- [ ] モックデータでの動作確認
- [ ] 状態管理の実装
- [ ] レスポンシブ対応

#### バックエンド優先タスク  
- [ ] OpenAPI仕様の詳細化
- [ ] データベース設計
- [ ] 認証・認可の実装
- [ ] エラーハンドリング

#### 結合テストタスク
- [ ] モック→実API切り替えテスト
- [ ] 楽観的更新の動作確認
- [ ] エラーケースの確認
- [ ] パフォーマンステスト

### 🎯 コードレビューポイント

#### フロントエンド
- フィーチャーフラグの適切な使用
- モックモードでの動作確認
- エラーハンドリングの実装

#### バックエンド
- OpenAPI仕様との整合性
- フロントエンドの楽観的更新を考慮した設計
- 適切なHTTPステータスコード

### 🚨 よくある問題と解決策

#### 問題1: 一時IDでの422エラー
```
❌ DELETE /api/records/temp-123 (422)
```
**解決**: `API_MODE=mock`に切り替えるか、楽観的更新を無効化

#### 問題2: CORS エラー
```
❌ Access-Control-Allow-Origin
```
**解決**: バックエンドのCORS設定確認、または`API_MODE=mock`で回避

#### 問題3: 認証トークンエラー
```
❌ 401 Unauthorized  
```
**解決**: モックモードでは認証不要、実APIモードではトークン確認

### 📈 段階的品質向上

#### Level 1: 基本動作
- [ ] モック環境での画面表示
- [ ] 基本的なCRUD操作
- [ ] エラー表示

#### Level 2: 実環境対応
- [ ] 実API環境での動作
- [ ] 楽観的更新の実装
- [ ] 認証・認可対応

#### Level 3: 最適化
- [ ] パフォーマンス改善
- [ ] ユーザビリティ向上
- [ ] 自動テスト追加