/**
 * 記録関連ページの共通レイアウト
 */

import React from 'react';

interface RecordsLayoutProps {
  children: React.ReactNode;
}

export default function RecordsLayout({ children }: RecordsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 記録関連のナビゲーション（将来実装） */}
      {/* <RecordsNavigation /> */}
      
      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}