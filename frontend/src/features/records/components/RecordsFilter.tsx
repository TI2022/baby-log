/**
 * 記録フィルタリングコンポーネント
 * 日付範囲選択、記録タイプ別絞り込み、担当者別絞り込み
 */

'use client';

import React, { useState } from 'react';
import { RecordTypeIcon, Icon } from '@/components/ui';
import type { RecordType, RecordedBy, RecordFilters } from '@/types';

interface RecordsFilterProps {
  filters: RecordFilters;
  onFiltersChange: (filters: Partial<RecordFilters>) => void;
  onReset: () => void;
  className?: string;
  compact?: boolean;
}

export function RecordsFilter({
  filters,
  onFiltersChange,
  onReset,
  className = '',
  compact = false,
}: RecordsFilterProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [quickDateFilter, setQuickDateFilter] = useState<string>('');

  // クイック日付フィルター
  const quickDateOptions = [
    { value: '', label: 'すべて' },
    { value: 'today', label: '今日' },
    { value: 'yesterday', label: '昨日' },
    { value: 'week', label: '過去7日' },
    { value: 'month', label: '過去30日' },
  ];

  // 記録タイプオプション
  const recordTypes: Array<{ value: RecordType | '', label: string; icon: string; color: string }> = [
    { value: '', label: 'すべて', icon: '📋', color: 'bg-gray-100 text-gray-700' },
    { value: 'milk', label: 'ミルク', icon: '🍼', color: 'bg-blue-100 text-blue-700' },
    { value: 'diaper', label: 'おむつ', icon: '👶', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'sleep', label: '睡眠', icon: '💤', color: 'bg-purple-100 text-purple-700' },
    { value: 'growth', label: '成長', icon: '📏', color: 'bg-green-100 text-green-700' },
  ];

  // 担当者オプション
  const recordedByOptions: Array<{ value: RecordedBy | '', label: string; icon: string; color: string }> = [
    { value: '', label: 'すべて', icon: '👥', color: 'bg-gray-100 text-gray-700' },
    { value: 'mama', label: 'ママ', icon: '👩', color: 'bg-pink-100 text-pink-700' },
    { value: 'papa', label: 'パパ', icon: '👨', color: 'bg-blue-100 text-blue-700' },
    { value: 'unknown', label: 'その他', icon: '👤', color: 'bg-gray-100 text-gray-700' },
  ];

  // クイック日付フィルター適用
  const handleQuickDateFilter = (value: string) => {
    setQuickDateFilter(value);
    
    const now = new Date();
    let dateFrom = '';
    let dateTo = '';

    switch (value) {
      case 'today':
        dateFrom = dateTo = now.toISOString().split('T')[0];
        break;
      case 'yesterday':
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        dateFrom = dateTo = yesterday.toISOString().split('T')[0];
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFrom = weekAgo.toISOString().split('T')[0];
        dateTo = now.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFrom = monthAgo.toISOString().split('T')[0];
        dateTo = now.toISOString().split('T')[0];
        break;
      default:
        dateFrom = dateTo = '';
    }

    onFiltersChange({ date_from: dateFrom, date_to: dateTo });
  };

  // アクティブなフィルター数を計算
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'page' || key === 'per_page') return false;
    return value !== undefined && value !== '' && value !== null;
  }).length;

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">フィルター</h3>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFiltersCount}件適用中
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                onReset();
                setQuickDateFilter('');
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              クリア
            </button>
          )}
          
          {compact && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size="sm" />
            </button>
          )}
        </div>
      </div>

      {/* フィルター内容 */}
      {(!compact || isExpanded) && (
        <div className="p-4 space-y-6">
          {/* クイック日付フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              期間
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {quickDateOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleQuickDateFilter(option.value)}
                  className={`
                    px-3 py-2 text-sm rounded-lg border transition-all
                    ${quickDateFilter === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 詳細日付範囲 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開始日
              </label>
              <input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => {
                  onFiltersChange({ date_from: e.target.value });
                  setQuickDateFilter(''); // カスタム日付選択時はクイックフィルターをクリア
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                終了日
              </label>
              <input
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => {
                  onFiltersChange({ date_to: e.target.value });
                  setQuickDateFilter(''); // カスタム日付選択時はクイックフィルターをクリア
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 記録タイプフィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              記録タイプ
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {recordTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => onFiltersChange({ type: type.value || undefined })}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm
                    ${(filters.type || '') === type.value
                      ? `border-current ${type.color}`
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-base">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 担当者フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              担当者
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {recordedByOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFiltersChange({ recorded_by: option.value || undefined })}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm
                    ${(filters.recorded_by || '') === option.value
                      ? `border-current ${option.color}`
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-base">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 追加オプション */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasNote"
                  checked={false} // TODO: メモありフィルターの実装
                  onChange={() => {}} // TODO: メモありフィルターの実装
                  className="rounded border-gray-300"
                />
                <label htmlFor="hasNote" className="text-gray-700">
                  メモあり
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="todayOnly"
                  checked={quickDateFilter === 'today'}
                  onChange={() => handleQuickDateFilter(quickDateFilter === 'today' ? '' : 'today')}
                  className="rounded border-gray-300"
                />
                <label htmlFor="todayOnly" className="text-gray-700">
                  今日のみ表示
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordsFilter;