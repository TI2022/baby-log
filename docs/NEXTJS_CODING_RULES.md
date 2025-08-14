# Next.js コーディングルール（App Router対応）

## 0. 開発原則：全体設計を最優先する

### 🎯 大規模開発における基本原則

**「動けばOK」から「適切な設計・責務分離」へ**

1. **全体アーキテクチャの理解を最優先**
   - 部分的な修正でも、必ずプロジェクト全体の構造を把握してから着手
   - 各ディレクトリ・ファイルの責任範囲を明確に理解
   - 依存関係の全体像をマッピング

2. **責務分離の徹底**
   ```
   ❌ 悪い例：動けばOKの短期視点
   /                          ← 設定ファイルが散在
   ├── openapi.yaml           ← API設計者の責任が不明確
   ├── frontend/
   │   └── package.json       ← "../openapi.yaml" 相対参照
   
   ✅ 良い例：責務分離された長期視点
   /
   ├── api/                   ← API設計者専用領域
   │   └── openapi.yaml       ← 明確な責任範囲
   ├── frontend/              ← フロント開発者専用領域
   ├── backend/               ← バックエンド開発者専用領域
   └── docs/                  ← ドキュメント管理専用領域
   ```

3. **チーム開発視点の必須確認項目**
   - ファイル配置：他の開発者が直感的に理解できるか？
   - 依存関係：変更時の影響範囲が明確か？
   - 拡張性：新機能追加時にディレクトリ構造が破綻しないか？
   - 保守性：6ヶ月後に他の開発者が修正できるか？

4. **🚨 開発着手前の必須手順（絶対遵守）**
   
   **STEP 1: 開発ルール読み込み（必須）**
   ```bash
   # 開発・修正作業前に必ず実行
   cat docs/NEXTJS_CODING_RULES.md | head -100
   ```
   
   **STEP 2: 技術仕様の完全理解**
   - Next.js 15 App Router仕様の確認
   - サーバーコンポーネント vs クライアントコンポーネントの区別
   - styled-components使用制約の理解
   
   **STEP 3: 全体構造把握**
   ```bash
   # プロジェクト全体構造の把握
   tree -L 3 ./
   
   # 設定ファイル間の依存関係確認
   find . -name "*.json" -o -name "*.yaml" -o -name "*.md"
   grep -r "../" . --exclude-dir=node_modules
   
   # 各ディレクトリの責任範囲確認
   ls -la */README.md  # 各領域のドキュメント確認
   ```
   
   **STEP 4: 類似問題の横展開確認**
   ```bash
   # 同じ修正が必要な箇所を事前特定
   find . -name "*.tsx" | xargs grep -l "問題のあるパターン"
   ```
   
   **⚠️ 重要**: この手順を省略した開発は禁止

5. **コードレビューでの必須観点**
   - 全体アーキテクチャとの整合性
   - 責務分離の適切性
   - 他コンポーネントへの影響範囲
   - チーム開発での可読性・保守性

## 1. 基本思想：サーバーコンポーネントを主軸に関心を分離する

この設計の根幹は、Next.js App Routerの思想である「サーバーファースト」を最大限に活用することです。

### 🚨 Next.js 15 App Router重要制約

**サーバーコンポーネント制約（厳守）**
- `app/layout.tsx`: サーバーコンポーネント（styled-components使用不可）
- `app/page.tsx`: サーバーコンポーネント（styled-components使用不可）
- `app/**/layout.tsx`: サーバーコンポーネント（styled-components使用不可）
- `app/**/page.tsx`: サーバーコンポーネント（styled-components使用不可）

**クライアントコンポーネント要件**
- styled-components使用時: 必ず`'use client'`を付与
- React Hooks使用時: 必ず`'use client'`を付与
- イベントハンドラ使用時: 必ず`'use client'`を付与

### コンポーネント分類

* **サーバーコンポーネント (RSC)**: デフォルトのコンポーネント。データ取得、ビジネスロジックの実行、UIの構造定義など、サーバーサイドで完結する処理を担当
* **クライアントコンポーネント (`"use client"`)**: useStateやuseEffect、イベントハンドラ、styled-componentsなど、ブラウザでのインタラクションが必要な部分のみを担当

## 2. ディレクトリ構成

```
/src
├── app/
│   └── (main)/
│       ├── users/
│       │   └── [userId]/
│       │       ├── page.tsx         # ① ルートページ (サーバーコンポーネント)
│       │       └── layout.tsx       # ① レイアウト (サーバーコンポーネント)
│       └── layout.tsx
│
├── components/
│   ├── ui/                        # ② 汎用的なUIパーツ (Presentational)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   └── icons/                     # アイコンコンポーネント
│
├── features/
│   └── user/                      # ③ 機能単位のコンポーネント・ロジック (Container)
│       ├── components/
│       │   ├── UserProfile.tsx      # ユーザープロフィール表示 (サーバー)
│       │   └── EditUserForm.tsx     # ユーザー編集フォーム (クライアント)
│       ├── hooks/
│       │   └── useUserActions.ts  # ユーザー関連のカスタムフック
│       └── index.ts                 # Barrel File (外部への公開を制御)
│
├── lib/
│   ├── api.ts                     # APIクライアント (サーバーサイド用)
│   ├── utils.ts                   # 汎用的なヘルパー関数
│   └── validators.ts              # バリデーションスキーマ (Zodなど)
│
├── hooks/
│   └── useMediaQuery.ts           # グローバルで再利用可能なカスタムフック
│
└── store/
    └── userStore.ts               # ⑤ グローバルな状態管理 (Zustandなど)
```

### 各ディレクトリの責務

1. **`/app`**: ルーティングとレイアウト。原則サーバーコンポーネント、データ取得、features・componentsからのコンポーネント配置
2. **`/components/ui`**: 再利用可能な「ダム（Dumb）」コンポーネント。状態を持たず、propsのみ。**Storybook実装が必須**
3. **`/features`**: 特定機能の「スマート（Smart）」コンポーネント群。ドメインごとに分割
4. **`/lib`**: 横断的な関心事。純粋なビジネスロジックやAPIクライアント
5. **`/store`**: グローバルなクライアントサイドの状態（外部ライブラリ使用時のみ）

### UIコンポーネント開発ルール

**`/components/ui`** の共通コンポーネントは以下の手順で開発すること：

1. **Storybookでの設計**: 実装前に必ずStorybookでコンポーネントの仕様を定義
2. **Stories作成**: 各種パターン（variant、size、state）をStoriesで網羅
3. **実装**: Storybookで確認しながら実装
4. **テスト**: Storybookでビジュアルテスト、Jestで単体テスト

```typescript
// Button.stories.tsx の例
export default {
  title: 'UI/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Primary: ComponentStory<typeof Button> = (args) => <Button {...args} />;
Primary.args = {
  variant: 'primary',
  children: 'ボタン',
};

export const Secondary: ComponentStory<typeof Button> = (args) => <Button {...args} />;
Secondary.args = {
  variant: 'secondary', 
  children: 'ボタン',
};
```

## 3. コンポーネント設計手法

「サーバーコンポーネントで可能な限り仕事をし、インタラクションが必要な部分だけをクライアントコンポーネントに切り出す」

### 例：ユーザー詳細ページ

#### page.tsx (サーバーコンポーネント)
```tsx
// /app/users/[userId]/page.tsx
import { UserProfile } from '@/features/user/components/UserProfile';

const UserDetailPage = async ({ params }) => {
  const user = await fetchUser(params.userId); // サーバーサイドでデータ取得
  return <UserProfile user={user} />;
};
export default UserDetailPage;
```

#### UserProfile.tsx (サーバーコンポーネント)
```tsx
// /features/user/components/UserProfile.tsx
import { Card } from '@/components/ui/Card';
import { EditUserButton } from './EditUserButton'; // クライアントコンポーネント

export const UserProfile = ({ user }) => {
  return (
    <Card>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <EditUserButton userId={user.id} /> {/* インタラクション部分を委譲 */}
    </Card>
  );
};
```

#### EditUserButton.tsx (クライアントコンポーネント)
```tsx
// /features/user/components/EditUserButton.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EditUserForm } from './EditUserForm';

export const EditUserButton = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>編集</Button>
      {isOpen && <EditUserForm userId={userId} />}
    </>
  );
};
```

## 4. 状態管理設計手法

**基本方針**: React標準APIを最優先とし、外部状態管理ライブラリは最後の手段とする

### 状態管理の意思決定フロー

1. **URLで管理できるか？**
   - フィルタ、ソート、タブ選択 → URL State（useSearchParams）

2. **サーバーから取得するデータか？**
   - サーバーの状態 → サーバーコンポーネントでの`fetch`
   - クライアントでの再取得 → SWRやReact Query

3. **コンポーネント固有のUIの状態か？**
   - モーダル、フォーム入力値 → `useState`や`useReducer`

4. **複数コンポーネントで共有するUIの状態か？**
   - 2〜3階層以上のpropsバケツリレー → **React Context API** を使用

5. **外部状態管理ライブラリが必要か？**
   - React Context APIでパフォーマンス課題が発生する場合のみ検討
   - **事前に確認が必要** - 使用理由をドキュメントに明記
   - 候補: Zustand, Jotai（Reduxは避ける）

### 外部状態管理ライブラリ使用時の要件

外部状態管理ライブラリを使用する場合は、以下を満たすこと：

1. **事前承認**: 使用前に確認を取る
2. **理由の明記**: なぜReact標準APIでは不十分かを文書化
3. **軽量性**: Redux系の重いライブラリは避け、Zustand/Jotaiなどの軽量ライブラリを選択
4. **段階的導入**: 必要最小限の範囲から開始

## 5. スタイリング戦略（CSS-in-JS完全統一）

**基本方針**: CSS-in-JSを使用し、TailwindCSSは一切使用しない

### CSS-in-JS完全統一ルール

1. **styled-components**: 唯一のスタイリングライブラリとして使用
2. **TailwindCSS完全廃止**: classNameでのユーティリティクラス使用禁止
3. **動的スタイル**: propsベースの条件分岐スタイルを積極活用
4. **テーマ管理**: `/src/styles/theme.ts`を使用したグローバルテーマ管理
5. **TypeScript対応**: styled-componentsの型安全性を活用
6. **transient props**: DOMに渡されないpropsは`$`プレフィックス必須

### 実装例

```tsx
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const StyledButton = styled.button<{ 
  $variant: 'primary' | 'secondary'; 
  $size: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
}>`
  padding: ${({ $size }) => 
    $size === 'sm' ? theme.spacing.sm + ' ' + theme.spacing.md :
    $size === 'lg' ? theme.spacing.md + ' ' + theme.spacing.xl : 
    theme.spacing.sm + ' ' + theme.spacing.lg
  };
  
  background-color: ${({ $variant }) => 
    $variant === 'primary' ? theme.colors.primary[500] : theme.colors.gray[200]
  };
  
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.gray[300]};
  font-size: ${theme.fontSize.base};
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
    transition: ${theme.transitions.default};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary[500]}33;
  }
`;
```

### 禁止事項

- ❌ **TailwindCSSクラス使用禁止**: `className="flex items-center"`等は一切使用不可
- ❌ **インラインstyle使用禁止**: `style={{ display: 'flex' }}`等は一切使用不可
- ❌ **CSS Modules使用禁止**: `.module.css`ファイルは使用不可

### 必須事項

- ✅ **styled-components必須**: 全てのスタイルはstyled-componentsで実装
- ✅ **themeファイル使用必須**: 色・サイズ・間隔は全て`theme.ts`から参照
- ✅ **transient props必須**: DOM属性でないpropsは`$`プレフィックス
- ✅ **レスポンシブ対応**: `theme.breakpoints`を使用したメディアクエリ実装

### テーマファイル活用例

```tsx
// ✅ 正しい実装
const Container = styled.div`
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.xl};
  }
`;

// ❌ 禁止された実装
const Container = styled.div`
  padding: 1.5rem;  // theme.spacing.lgを使用すべき
  background-color: #ffffff;  // theme.colors.backgroundを使用すべき
`;
```

## 6. テスト戦略

- **`/components/ui`**: Storybookで見た目とインタラクションをテスト
- **`/lib`**: Jest/Vitestで純粋関数のユニットテスト
- **`/features`**: React Testing Libraryでカスタムフック・インタラクションテスト
- **`/app`**: E2Eテスト（Playwright, Cypress）で実際のユーザーフローテスト

この構成により、責務が明確で、テストしやすく、スケールしやすい堅牢なNext.jsアプリケーションを構築できます。

## 7. パフォーマンス最適化戦略

### レンダリング戦略の最適化と適切な使い分け

**原則**: 最も静的なレンダリング方法を優先する

1. **デフォルトはサーバーコンポーネント (Server Components)**
   - **理由**: クライアントJavaScriptバンドルサイズを最小化、初期ロード時間短縮、ウォーターフォール問題回避
   - **適用**: ユーザーインタラクション不要な静的コンテンツ、初期データ取得、SEO重要ページ

2. **SSG (Static Site Generation) を最大限活用**
   - **理由**: ビルド時HTML生成、CDN高速配信、最高パフォーマンス
   - **適用**: ブログ記事、マーケティングページ、規約ページなど更新頻度が低いコンテンツ

3. **ISR (Incremental Static Regeneration) 活用**
   - **理由**: SSGの高速性とコンテンツ鮮度の両立
   - **適用**: ニュース記事、商品一覧、FAQ等、数分〜数時間単位更新コンテンツ

4. **SSR (Server-Side Rendering) は必要時に限定**
   - **理由**: リクエスト毎サーバーHTML生成、最新情報表示可能だがパフォーマンス劣化
   - **適用**: パーソナライズされたダッシュボード、認証ページなど動的コンテンツ

5. **CSR (Client-Side Rendering) はインタラクションに限定**
   - **理由**: クライアントサイドJS実行後表示のため初期ロード遅延
   - **適用**: フォーム入力、リアルタイムチャット、複雑なグラフ操作等

### コンポーネントアーキテクチャと責務分離の徹底

**原則**: サーバーコンポーネントで可能な限り処理完結、クライアントコンポーネントは最小限

1. **サーバーコンポーネントをデフォルトとする**
   - 明示的な`"use client"`宣言以外は全てサーバーコンポーネント
   - データ取得、ビジネスロジック、UI構造定義はサーバーサイドで実行

2. **クライアントコンポーネントは「インタラクションの境界」**
   - useState, useEffect, イベントハンドラ等ブラウザインタラクション必須部分のみ
   - サーバーコンポーネントからpropsでデータを受け取り

3. **適切なコンポーネント粒度維持**
   - 大規模コンポーネントは責務別に分割、再利用性向上・再レンダリング抑制
   - `"use client"`は最小範囲に限定、子にサーバーコンポーネント含有可

4. **`next/dynamic`による遅延ロード活用**
   ```tsx
   const MyComponent = dynamic(() => import('./MyComponent'));
   ```
   - 初期表示不要、ユーザー操作時のみ表示コンポーネント対象

### データ取得の最適化

**原則**: データ取得場所・タイミング最適化、ウォーターフォール回避

1. **サーバーコンポーネントでデータ取得**
   - クライアントリクエスト数削減、初期ロード高速化
   - Next.js fetchの自動キャッシュ活用

2. **並列データフェッチング徹底**
   ```tsx
   const [data1, data2] = await Promise.all([fetchData1(), fetchData2()]);
   ```

3. **クライアントサイドはSWR/React Query管理**
   - 動的データ再取得、キャッシュ・再検証・エラーハンドリング・ローディング状態管理
   - ユーザー操作応答データ、リアルタイム性要求データ対象

### アセット最適化

**原則**: Next.js組み込み最適化機能を最大活用

1. **`next/image`コンポーネント常時使用**
   - 遅延ロード、自動サイズ最適化、WebP変換、CLS防止

2. **`next/font`によるフォント最適化**
   - フォント読み込み最適化、CLS防止

3. **`next/script`によるサードパーティスクリプト最適化**
   - `strategy="beforeInteractive"` (最優先)
   - `strategy="afterInteractive"` (インタラクション後)
   - `strategy="lazyOnload"` (アイドル時)

### コード最適化とバンドルサイズ削減

**原則**: クライアント送信コード量最小化

1. **不要ライブラリ削除と代替検討**
   - 必要性の再検討、部分機能のみ使用時は軽量代替検討

2. **Tree Shaking意識したインポート**
   ```tsx
   import { someFunction } from 'lodash/someFunction';
   ```

3. **CSS最適化**
   - CSS Modules、Tailwind CSS等スコープ化CSS使用
   - PurgeCSS等による未使用CSS削除

### ユーザー体験と体感速度向上

**原則**: 実際速度と体感速度の両方最適化

1. **適切なローディングUI表示**
   - スケルトンスクリーン、プログレスバー、スピナー

2. **オプティミスティックUI導入**
   - ユーザーアクション即座反映、後からサーバー応答で確定

3. **`next/link`による自動プリフェッチ**
   - ホバー時のバックグラウンドプリフェッチ

### 継続的監視と測定

**原則**: 継続的監視・改善サイクル確立

1. **Core Web Vitals定期測定改善**
   - LCP, FID, CLS指標継続監視
   - Lighthouse, PageSpeed Insights, Google Search Console活用

2. **パフォーマンスモニタリングツール導入**
   - Vercel Analytics, Sentry, Datadog, New Relic等
   - 本番環境問題早期発見・ボトルネック特定