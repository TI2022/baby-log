/**
 * ダッシュボードページ
 * メインダッシュボードレイアウトを表示
 */

import React from 'react';
import { DashboardLayout } from '@/features/dashboard';
import { RecordsProvider } from '@/contexts/RecordsContext';

export default function DashboardPage() {
  return (
    <RecordsProvider>
      <DashboardLayout />
    </RecordsProvider>
  );
}

export const metadata = {
  title: 'ダッシュボード | Baby Log',
  description: '赤ちゃんの記録ダッシュボード - 今日のサマリーと最新記録',
};