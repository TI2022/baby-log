# OpenAPI コード生成 使用ガイド

## 🎉 導入完了！

OpenAPIスキーマからTypeScriptクライアントコードの自動生成が導入されました。

## 📁 生成されたファイル

```
frontend/src/
├── api/generated/           # 自動生成されたAPIクライアント
│   ├── api.ts              # API関数とinterface定義
│   ├── base.ts             # 基底クラス
│   ├── common.ts           # 共通ユーティリティ
│   ├── configuration.ts    # 設定クラス
│   └── index.ts            # エクスポート
├── lib/
│   └── api-client.ts       # カスタムクライアントラッパー
├── types/
│   ├── api.ts              # 自動生成された型定義
│   └── index.ts            # 統合型定義
```

## 🚀 基本的な使用方法

### 1. 記録の取得

```typescript
import { recordsService } from '@/lib/api-client';

// 記録一覧を取得
const records = await recordsService.getRecords({
  page: 1,
  perPage: 20,
  type: 'milk',
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31'
});

// 特定の記録を取得
const record = await recordsService.getRecord('record-id');
```

### 2. 記録の作成・更新・削除

```typescript
import { recordsService } from '@/lib/api-client';
import type { RecordCreateRequest } from '@/types';

// 新しい記録を作成
const newRecord: RecordCreateRequest = {
  type: 'milk',
  timestamp: new Date().toISOString(),
  metadata: {
    amount: 150,
    unit: 'ml',
    notes: 'よく飲みました'
  }
};
const createdRecord = await recordsService.createRecord(newRecord);

// 記録を更新
const updatedRecord = await recordsService.updateRecord('record-id', {
  metadata: {
    amount: 180,
    notes: '追記: さらに30ml飲みました'
  }
});

// 記録を削除
await recordsService.deleteRecord('record-id');
```

### 3. 認証

```typescript
import { authService } from '@/lib/api-client';

// ログイン
const authResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// 現在のユーザー情報を取得
const user = await authService.getCurrentUser();

// ログアウト
await authService.logout();

// 認証状態をチェック
if (authService.isAuthenticated()) {
  console.log('User is authenticated');
}
```

## 🔄 開発ワークフロー

### 1. OpenAPIスキーマを更新した場合

```bash
# APIクライアントを再生成
npm run api:all
```

### 2. スキーマの検証

```bash
# OpenAPIスキーマが有効かチェック
npm run api:validate
```

### 3. 生成されたファイルのクリーンアップ

```bash
# 生成されたファイルを削除して再生成
npm run api:clean
npm run api:generate
```

## 🛠️ React Hooks での使用例

### カスタムフック例

```typescript
// hooks/useRecords.ts
import { useState, useEffect } from 'react';
import { recordsService } from '@/lib/api-client';
import type { Record, RecordFilters, ApiError } from '@/types';

export const useRecords = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchRecords = async (filters?: RecordFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await recordsService.getRecords(filters);
      setRecords(response.records || []);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (recordData: RecordCreateRequest) => {
    try {
      const newRecord = await recordsService.createRecord(recordData);
      setRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await recordsService.deleteRecord(id);
      setRecords(prev => prev.filter(record => record.id !== id));
    } catch (err) {
      setError(err as ApiError);
      throw err;
    }
  };

  return {
    records,
    loading,
    error,
    fetchRecords,
    createRecord,
    deleteRecord,
  };
};
```

### コンポーネントでの使用

```typescript
// components/RecordsList.tsx
import React, { useEffect } from 'react';
import { useRecords } from '@/hooks/useRecords';

export const RecordsList: React.FC = () => {
  const { records, loading, error, fetchRecords } = useRecords();

  useEffect(() => {
    fetchRecords({ page: 1, perPage: 20 });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {records.map(record => (
        <div key={record.id}>
          <h3>{record.type}</h3>
          <p>{new Date(record.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};
```

## 🎯 型安全性の利点

### 1. コンパイル時の型チェック

```typescript
// ❌ TypeScriptコンパイラがエラーを検出
const record = await recordsService.createRecord({
  type: 'invalid-type', // RecordTypeにない値
  timestamp: 'invalid-date', // 無効な日付形式
});

// ✅ 正しい型を使用
const record = await recordsService.createRecord({
  type: 'milk', // 有効なRecordType
  timestamp: new Date().toISOString(), // 正しい形式
  metadata: {
    amount: 150,
    unit: 'ml'
  }
});
```

### 2. IDEでの自動補完

```typescript
// recordsService. と入力するとメソッドが自動補完される
recordsService.getRecords()
recordsService.createRecord()
recordsService.updateRecord()
recordsService.deleteRecord()

// パラメータも自動補完される
recordsService.getRecords({
  page: 1,        // number
  perPage: 20,    // number
  type: 'milk',   // RecordType
  dateFrom: '',   // string (date format)
  dateTo: '',     // string (date format)
});
```

## 📊 既存コードの移行

### Before: 手動実装

```typescript
// 従来の手動実装
const fetchRecords = async () => {
  const response = await fetch('/api/records', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  const data = await response.json();
  return data;
};
```

### After: 自動生成されたクライアント

```typescript
// 自動生成されたクライアントを使用
import { recordsService } from '@/lib/api-client';

const records = await recordsService.getRecords();
```

## 🐛 エラーハンドリング

```typescript
import { recordsService } from '@/lib/api-client';
import type { ApiError } from '@/types';

try {
  const record = await recordsService.createRecord(recordData);
  console.log('Record created:', record);
} catch (error) {
  const apiError = error as ApiError;
  console.error('API Error:', apiError.message);
  
  if (apiError.status === 422) {
    console.log('Validation errors:', apiError.errors);
  } else if (apiError.status === 401) {
    // 認証エラー - ログイン画面にリダイレクト
    window.location.href = '/login';
  }
}
```

## 🔧 設定のカスタマイズ

### API Base URL

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001  # 開発環境
NEXT_PUBLIC_API_URL=https://api.babylog.com  # 本番環境
```

### 認証トークンの管理

```typescript
// lib/api-client.ts で自動的にlocalStorageからトークンを取得
// 手動でトークンを設定する場合：
localStorage.setItem('auth_token', 'your-jwt-token');
```

## ⚡ パフォーマンスの最適化

### 1. Tree Shaking
```typescript
// ✅ 必要な機能のみインポート
import { recordsService } from '@/lib/api-client';

// ❌ 全体をインポートしない
import * as apiClient from '@/lib/api-client';
```

### 2. コード分割
```typescript
// 動的インポートでバンドルサイズを削減
const { recordsService } = await import('@/lib/api-client');
```

## 🔄 継続的インテグレーション

### GitHub Actions での自動生成

```yaml
# .github/workflows/api-codegen.yml
name: API Code Generation
on:
  push:
    paths:
      - 'api/openapi.yaml'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Generate API client
        run: cd frontend && npm run api:all
      - name: Commit generated files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git diff --staged --quiet || git commit -m "chore: update generated API client"
          git push
```

## 📚 次のステップ

1. **モックサーバーとの連携**
   ```bash
   # モックサーバーを起動
   npm run mock-server
   ```

2. **テストの作成**
   ```typescript
   // APIクライアントのテスト
   import { recordsService } from '@/lib/api-client';
   
   jest.mock('@/lib/api-client');
   ```

3. **Storybook連携**
   - API応答のモックデータ作成
   - コンポーネントのAPI呼び出しテスト

4. **SWR/React Query との統合**
   ```typescript
   import useSWR from 'swr';
   import { recordsService } from '@/lib/api-client';
   
   const { data, error } = useSWR('/api/records', () => 
     recordsService.getRecords()
   );
   ```

OpenAPIコード生成の導入により、型安全性と開発効率が大幅に向上しました！🚀