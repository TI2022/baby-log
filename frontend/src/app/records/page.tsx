/**
 * 記録一覧ページ
 * すべての記録の表示・検索・フィルタリング
 */

import React from 'react';
import { RecordsList } from '@/features/records';
import { RecordsProvider } from '@/contexts/RecordsContext';

export default function RecordsPage() {
  return (
    <RecordsProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <RecordsList />
        </div>
      </div>
    </RecordsProvider>
  );
}

export const metadata = {
  title: '記録一覧 | Baby Log',
  description: '赤ちゃんの記録一覧 - 検索・フィルタリング・管理',
};