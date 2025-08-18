/**
 * 最新記録表示コンポーネント
 * 時系列記録一覧と記録種別アイコン表示
 */

'use client';

import React from 'react';
import { RecordCard, RecordTypeIcon } from '@/components/ui';
import { useRecords } from '@/contexts/RecordsContext';
import type { Record, RecordType } from '@/types';

interface LatestRecordsProps {
  limit?: number;
  showTypeFilter?: boolean;
  className?: string;
}

export function LatestRecords({ 
  limit = 10, 
  showTypeFilter = true,
  className = '' 
}: LatestRecordsProps) {
  const { records, isLoading, error, getLatestRecords, getRecordsByType } = useRecords();
  const [selectedType, setSelectedType] = React.useState<RecordType | 'all'>('all');

  // フィルタリングされた記録を取得
  const getFilteredRecords = () => {
    if (selectedType === 'all') {
      return getLatestRecords(limit);
    }
    return getRecordsByType(selectedType).slice(0, limit);
  };

  const filteredRecords = getFilteredRecords();

  // 記録種別フィルター
  const recordTypes: Array<{ type: RecordType | 'all'; label: string; icon?: string }> = [
    { type: 'all', label: 'すべて', icon: '📋' },
    { type: 'milk', label: 'ミルク', icon: '🍼' },
    { type: 'diaper', label: 'おむつ', icon: '👶' },
    { type: 'sleep', label: '睡眠', icon: '💤' },
    { type: 'growth', label: '成長', icon: '📏' },
  ];

  // 時間の相対表示
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const recordTime = new Date(timestamp);
    const diffMs = now.getTime() - recordTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'たった今';
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    
    return recordTime.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    });
  };

  // 記録のメタデータを表示用に整形
  const formatRecordSummary = (record: Record) => {
    switch (record.type) {
      case 'milk':
        const milk = record.metadata as any;
        return `${milk.amount_ml || 0}ml${milk.milk_type ? ` (${milk.milk_type === 'breast' ? '母乳' : milk.milk_type === 'formula' ? 'ミルク' : '混合'})` : ''}`;
      
      case 'diaper':
        const diaper = record.metadata as any;
        const typeMap = { pee: 'おしっこ', poop: 'うんち', both: '両方' };
        return typeMap[diaper.diaper_type as keyof typeof typeMap] || 'おむつ';
      
      case 'sleep':
        const sleep = record.metadata as any;
        if (sleep.duration_minutes) {
          const hours = Math.floor(sleep.duration_minutes / 60);
          const mins = sleep.duration_minutes % 60;
          return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
        }
        return '睡眠記録';
      
      case 'growth':
        const growth = record.metadata as any;
        const measurements = [];
        if (growth.weight_g) measurements.push(`体重${(growth.weight_g / 1000).toFixed(1)}kg`);
        if (growth.height_cm) measurements.push(`身長${growth.height_cm}cm`);
        return measurements.length > 0 ? measurements.join(', ') : '成長記録';
      
      default:
        return '記録';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          最新の記録
        </h2>
        <div className="text-sm text-gray-500">
          {records.length > 0 && `全${records.length}件`}
        </div>
      </div>

      {/* 種別フィルター */}
      {showTypeFilter && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
          {recordTypes.map((type) => (
            <button
              key={type.type}
              onClick={() => setSelectedType(type.type)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedType === type.type
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              <span className="text-base">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* 記録一覧 */}
      <div className="space-y-3">
        {isLoading ? (
          /* ローディング状態 */
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRecords.length > 0 ? (
          /* 記録カード一覧 */
          filteredRecords.map((record) => (
            <div 
              key={record.id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* 記録種別アイコン */}
              <div className="flex-shrink-0">
                <RecordTypeIcon 
                  type={record.type} 
                  size="md" 
                  variant="emoji"
                />
              </div>

              {/* 記録内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">
                    {formatRecordSummary(record)}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {record.recorded_by === 'mama' ? 'ママ' : record.recorded_by === 'papa' ? 'パパ' : 'その他'}
                  </span>
                </div>
                
                {/* 時刻表示 */}
                <div className="text-sm text-gray-600">
                  {new Date(record.recorded_at).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {record.metadata?.note && (
                    <span className="ml-2 text-gray-500">
                      - {record.metadata.note}
                    </span>
                  )}
                </div>
              </div>

              {/* 相対時間 */}
              <div className="flex-shrink-0 text-right">
                <div className="text-xs text-gray-500">
                  {getRelativeTime(record.recorded_at)}
                </div>
              </div>
            </div>
          ))
        ) : (
          /* 空の状態 */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {selectedType === 'all' ? '📝' : recordTypes.find(t => t.type === selectedType)?.icon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedType === 'all' ? 'まだ記録がありません' : `${recordTypes.find(t => t.type === selectedType)?.label}の記録がありません`}
            </h3>
            <p className="text-gray-600 mb-6">
              記録を追加して赤ちゃんの成長を追跡しましょう
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <span className="mr-2">+</span>
              記録を追加
            </button>
          </div>
        )}
      </div>

      {/* もっと見るリンク */}
      {filteredRecords.length >= limit && records.length > limit && (
        <div className="text-center pt-4">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            もっと見る ({records.length - limit}件)
          </button>
        </div>
      )}
    </div>
  );
}

export default LatestRecords;