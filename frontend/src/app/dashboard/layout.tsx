/**
 * ダッシュボードレイアウト
 * ダッシュボード関連ページの共通レイアウト
 */

import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーションヘッダー（将来実装） */}
      {/* <DashboardNavigation /> */}
      
      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
      
      {/* フッター（将来実装） */}
      {/* <DashboardFooter /> */}
    </div>
  );
}