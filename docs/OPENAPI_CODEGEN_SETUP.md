# OpenAPI コード生成セットアップ

## 概要
OpenAPIスキーマからTypeScriptクライアントコードを自動生成する手順

## 1. 依存関係のインストール

```bash
cd frontend
npm install --save-dev @openapitools/openapi-generator-cli
# または
npm install --save-dev openapi-typescript-codegen
```

## 2. 生成スクリプトの追加

### package.jsonに追加するスクリプト

```json
{
  "scripts": {
    "api:generate": "openapi-generator-cli generate -i ../api/openapi.yaml -g typescript-axios -o src/api/generated --additional-properties=useSingleRequestParameter=true,withoutPrefixEnums=true",
    "api:generate-types": "openapi-typescript ../api/openapi.yaml --output src/types/api.ts",
    "api:validate": "openapi-generator-cli validate -i ../api/openapi.yaml",
    "api:clean": "rm -rf src/api/generated",
    "api:all": "npm run api:clean && npm run api:generate && npm run api:generate-types"
  }
}
```

## 3. 生成されるファイル構造

```
frontend/src/
├── api/
│   └── generated/
│       ├── api.ts           # API Client
│       ├── base.ts          # Base classes
│       ├── common.ts        # Common types
│       ├── configuration.ts # Configuration
│       └── index.ts         # Exports
├── types/
│   └── api.ts              # TypeScript types
└── lib/
    └── api-client.ts       # Custom client wrapper
```

## 4. カスタムクライアントの作成

### src/lib/api-client.ts

```typescript
import { Configuration, DefaultApi } from '@/api/generated';

const config = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  accessToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || '';
    }
    return '';
  },
});

export const apiClient = new DefaultApi(config);

// Custom hooks
export const useApiClient = () => {
  return apiClient;
};
```

## 5. 使用例

### 記録一覧の取得

```typescript
import { apiClient } from '@/lib/api-client';
import { RecordListResponse } from '@/types/api';

const useRecords = () => {
  const [records, setRecords] = useState<RecordListResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async (params?: {
    page?: number;
    per_page?: number;
    type?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    setLoading(true);
    try {
      const response = await apiClient.apiRecordsGet(params);
      setRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setLoading(false);
    }
  };

  return { records, loading, fetchRecords };
};
```

### 記録の作成

```typescript
import { apiClient } from '@/lib/api-client';
import { RecordCreateRequest } from '@/types/api';

const createRecord = async (data: RecordCreateRequest) => {
  try {
    const response = await apiClient.apiRecordsPost(data);
    return response.data;
  } catch (error) {
    console.error('Failed to create record:', error);
    throw error;
  }
};
```

## 6. 開発ワークフロー

### 1. OpenAPIスキーマ更新時
```bash
npm run api:all
```

### 2. 型安全性の確保
- 自動生成された型を使用
- API変更時にコンパイルエラーで検出
- Zodによるランタイム検証も追加推奨

### 3. CI/CDでの自動化
```yaml
# .github/workflows/frontend.yml
- name: Generate API Client
  run: |
    cd frontend
    npm run api:generate
    npm run build
```

## 7. 利点

1. **型安全性**: OpenAPIスキーマから正確な型を生成
2. **自動同期**: API変更時の自動反映
3. **開発効率**: 手動でのAPI実装が不要
4. **ドキュメント連携**: スキーマがドキュメントも兼ねる
5. **バグ削減**: 型チェックによるランタイムエラー防止

## 8. 現在の実装との統合

### RecordsContextの更新
```typescript
// 現在の手動実装を自動生成クライアントに置き換え
const { records, fetchRecords } = useRecords();

// 自動生成されたクライアントを使用
const response = await apiClient.apiRecordsGet({
  page: 1,
  per_page: 20,
  type: 'milk'
});
```

## 次のステップ

1. 依存関係のインストール
2. 生成スクリプトの設定
3. 既存の手動API実装を自動生成に移行
4. 型定義の統一
5. CI/CDでの自動生成設定