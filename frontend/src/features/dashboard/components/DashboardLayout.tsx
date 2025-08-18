/**
 * ダッシュボードレイアウト
 * 今日のサマリー表示とクイックアクションボタン配置
 */

'use client';

import React from 'react';
import { QuickActionButton, RecordCard } from '@/components/ui';
import { useRecords } from '@/contexts/RecordsContext';
import type { RecordType } from '@/types';

interface DashboardLayoutProps {
  className?: string;
}

// クイックアクション設定
const quickActions: Array<{
  type: RecordType;
  label: string;
  color: string;
  icon: string;
}> = [
  {
    type: 'milk',
    label: 'ミルク',
    color: 'bg-blue-500 hover:bg-blue-600',
    icon: '🍼',
  },
  {
    type: 'diaper',
    label: 'おむつ',
    color: 'bg-yellow-500 hover:bg-yellow-600',
    icon: '👶',
  },
  {
    type: 'sleep',
    label: '睡眠',
    color: 'bg-purple-500 hover:bg-purple-600',
    icon: '💤',
  },
  {
    type: 'growth',
    label: '成長',
    color: 'bg-green-500 hover:bg-green-600',
    icon: '📏',
  },
];

export function DashboardLayout({ className = '' }: DashboardLayoutProps) {
  const { records, isLoading, error, getRecordsForDate, getLatestRecords } = useRecords();

  // 今日の日付
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = getRecordsForDate(today);
  const latestRecords = getLatestRecords(5);

  // 今日の統計
  const todayStats = {
    total: todayRecords.length,
    milk: todayRecords.filter(r => r.type === 'milk').length,
    diaper: todayRecords.filter(r => r.type === 'diaper').length,
    sleep: todayRecords.filter(r => r.type === 'sleep').length,
    growth: todayRecords.filter(r => r.type === 'growth').length,
  };

  // クイックアクションハンドラー
  const handleQuickAction = (type: RecordType) => {
    // TODO: 記録作成モーダルまたはページへ遷移
    console.log(`Quick action: ${type}`);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              おはようございます！
            </h1>
            <p className="text-gray-600 mt-1">
              今日も赤ちゃんの記録をつけましょう
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* クイックアクションボタン */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          クイック記録
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickActionButton
              key={action.type}
              icon={action.icon}
              label={action.label}
              onClick={() => handleQuickAction(action.type)}
              className={`${action.color} text-white`}
            />
          ))}
        </div>
      </div>

      {/* 今日のサマリー */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          今日のサマリー
        </h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* 総記録数 */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {todayStats.total}
              </div>
              <div className="text-sm text-gray-600">総記録</div>
            </div>

            {/* ミルク記録 */}
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {todayStats.milk}
              </div>
              <div className="text-sm text-blue-600">🍼 ミルク</div>
            </div>

            {/* おむつ記録 */}
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {todayStats.diaper}
              </div>
              <div className="text-sm text-yellow-600">👶 おむつ</div>
            </div>

            {/* 睡眠記録 */}
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {todayStats.sleep}
              </div>
              <div className="text-sm text-purple-600">💤 睡眠</div>
            </div>

            {/* 成長記録 */}
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {todayStats.growth}
              </div>
              <div className="text-sm text-green-600">📏 成長</div>
            </div>
          </div>
        )}
      </div>

      {/* 最新の記録 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            最新の記録
          </h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            すべて見る →
          </button>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : latestRecords.length > 0 ? (
          <div className="space-y-3">
            {latestRecords.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onEdit={() => console.log('Edit record', record.id)}
                onDelete={() => console.log('Delete record', record.id)}
                showActions={false}
                compact={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>まだ記録がありません</p>
            <p className="text-sm">上のクイック記録から始めてみましょう</p>
          </div>
        )}
      </div>

      {/* 今日の詳細 */}
      {todayRecords.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            今日の記録詳細
          </h2>
          <div className="space-y-3">
            {todayRecords.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onEdit={() => console.log('Edit record', record.id)}
                onDelete={() => console.log('Delete record', record.id)}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;