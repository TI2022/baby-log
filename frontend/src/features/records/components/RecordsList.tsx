/**
 * 記録一覧コンポーネント
 * ページネーション、記録カード表示
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecordTypeIcon, Icon } from '@/components/ui';
import { useRecords } from '@/contexts/RecordsContext';
import type { Record, RecordType, RecordedBy, RecordFilters } from '@/types';

interface RecordsListProps {
  className?: string;
  showFilters?: boolean;
  defaultFilters?: Partial<RecordFilters>;
  pageSize?: number;
}

export function RecordsList({ 
  className = '',
  showFilters = true,
  defaultFilters = {},
  pageSize = 20 
}: RecordsListProps) {
  const router = useRouter();
  const { 
    records, 
    isLoading, 
    error, 
    fetchRecords, 
    deleteRecord,
    getRecordsByType,
    getRecordsByRecordedBy 
  } = useRecords();

  const [filters, setFilters] = useState<RecordFilters>({
    page: 1,
    per_page: pageSize,
    ...defaultFilters,
  });

  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'recorded_at' | 'created_at'>('recorded_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 初回データ取得
  useEffect(() => {
    fetchRecords(filters);
  }, [filters, fetchRecords]);

  // フィルター更新
  const updateFilters = (newFilters: Partial<RecordFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // フィルター変更時はページをリセット
    }));
  };

  // ページネーション
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // ソート適用
  const sortedRecords = React.useMemo(() => {
    const sorted = [...records].sort((a, b) => {
      const aTime = new Date(a[sortBy]).getTime();
      const bTime = new Date(b[sortBy]).getTime();
      return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
    });
    return sorted;
  }, [records, sortBy, sortOrder]);

  // 記録詳細ページへ遷移
  const handleViewRecord = (recordId: string) => {
    router.push(`/records/${recordId}`);
  };

  // 記録削除
  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('この記録を削除しますか？')) {
      try {
        await deleteRecord(id);
        setSelectedRecords(prev => {
          const updated = new Set(prev);
          updated.delete(id);
          return updated;
        });
      } catch (error) {
        console.error('記録の削除に失敗しました:', error);
      }
    }
  };

  // 複数選択
  const handleSelectRecord = (id: string, selected: boolean) => {
    setSelectedRecords(prev => {
      const updated = new Set(prev);
      if (selected) {
        updated.add(id);
      } else {
        updated.delete(id);
      }
      return updated;
    });
  };

  // 全選択/全解除
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRecords(new Set(sortedRecords.map(r => r.id)));
    } else {
      setSelectedRecords(new Set());
    }
  };

  // 選択された記録の一括削除
  const handleDeleteSelected = async () => {
    if (selectedRecords.size === 0) return;
    
    if (window.confirm(`選択した${selectedRecords.size}件の記録を削除しますか？`)) {
      try {
        await Promise.all(Array.from(selectedRecords).map(id => deleteRecord(id)));
        setSelectedRecords(new Set());
      } catch (error) {
        console.error('記録の一括削除に失敗しました:', error);
      }
    }
  };

  // フィルターオプション
  const recordTypes: Array<{ value: RecordType | '', label: string }> = [
    { value: '', label: 'すべて' },
    { value: 'milk', label: 'ミルク' },
    { value: 'diaper', label: 'おむつ' },
    { value: 'sleep', label: '睡眠' },
    { value: 'growth', label: '成長' },
  ];

  const recordedByOptions: Array<{ value: RecordedBy | '', label: string }> = [
    { value: '', label: 'すべて' },
    { value: 'mama', label: 'ママ' },
    { value: 'papa', label: 'パパ' },
    { value: 'unknown', label: 'その他' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">記録一覧</h1>
          <p className="text-gray-600 mt-1">
            {records.length > 0 && `全${records.length}件の記録`}
          </p>
        </div>
        
        {selectedRecords.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {selectedRecords.size}件選択中
            </span>
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              削除
            </button>
          </div>
        )}
      </div>

      {/* フィルター */}
      {showFilters && (
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">フィルター</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 記録タイプ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                記録タイプ
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => updateFilters({ type: e.target.value as RecordType | undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {recordTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 担当者 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                担当者
              </label>
              <select
                value={filters.recorded_by || ''}
                onChange={(e) => updateFilters({ recorded_by: e.target.value as RecordedBy | undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {recordedByOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 開始日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開始日
              </label>
              <input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => updateFilters({ date_from: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 終了日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                終了日
              </label>
              <input
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => updateFilters({ date_to: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ソート・その他オプション */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">ソート:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recorded_at">記録日時</option>
                <option value="created_at">作成日時</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                {sortOrder === 'desc' ? (
                  <Icon name="arrow-down" size="sm" />
                ) : (
                  <Icon name="arrow-up" size="sm" />
                )}
              </button>
            </div>

            <button
              onClick={() => {
                setFilters({ page: 1, per_page: pageSize });
                setSelectedRecords(new Set());
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
            >
              フィルターをクリア
            </button>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* 記録一覧 */}
      <div className="space-y-4">
        {isLoading ? (
          /* ローディング状態 */
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : sortedRecords.length > 0 ? (
          <>
            {/* 一覧ヘッダー */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={selectedRecords.size === sortedRecords.length && sortedRecords.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                全て選択
              </span>
            </div>

            {/* 記録カード一覧 */}
            {sortedRecords.map((record) => (
              <div key={record.id} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedRecords.has(record.id)}
                  onChange={(e) => handleSelectRecord(record.id, e.target.checked)}
                  className="mt-4 rounded border-gray-300"
                />
                <div className="flex-1">
                  <div
                    onClick={() => handleViewRecord(record.id)}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <RecordTypeIcon type={record.type} size="md" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">
                              {record.type === 'milk' ? 'ミルク' :
                               record.type === 'diaper' ? 'おむつ' :
                               record.type === 'sleep' ? '睡眠' :
                               record.type === 'growth' ? '成長' : record.type}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {new Date(record.recorded_at).toLocaleTimeString('ja-JP', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {/* 記録タイプ別の詳細情報 */}
                            {record.type === 'milk' && record.metadata.amount_ml && (
                              <span className="font-medium text-blue-600">
                                {record.metadata.amount_ml} ml
                              </span>
                            )}
                            {record.type === 'diaper' && record.metadata.diaper_type && (
                              <span className="font-medium text-yellow-600">
                                {record.metadata.diaper_type === 'pee' ? 'おしっこ' :
                                 record.metadata.diaper_type === 'poop' ? 'うんち' :
                                 record.metadata.diaper_type === 'both' ? '両方' : ''}
                              </span>
                            )}
                            {record.type === 'sleep' && record.metadata.duration_minutes && (
                              <span className="font-medium text-purple-600">
                                {Math.floor(record.metadata.duration_minutes / 60)}時間
                                {record.metadata.duration_minutes % 60}分
                              </span>
                            )}
                            {record.type === 'growth' && record.metadata.weight_g && (
                              <span className="font-medium text-green-600">
                                {(record.metadata.weight_g / 1000).toFixed(2)} kg
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>
                              {record.recorded_by === 'mama' ? 'ママ' :
                               record.recorded_by === 'papa' ? 'パパ' : 'その他'}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(record.recorded_at).toLocaleDateString('ja-JP', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          {record.metadata.note && (
                            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {record.metadata.note.length > 50 
                                ? `${record.metadata.note.substring(0, 50)}...`
                                : record.metadata.note}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRecord(record.id);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="詳細を見る"
                        >
                          <Icon name="eye" size="sm" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecord(record.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="削除"
                        >
                          <Icon name="trash" size="sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          /* 空の状態 */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              記録が見つかりません
            </h3>
            <p className="text-gray-600 mb-6">
              {Object.keys(filters).some(key => filters[key as keyof RecordFilters] && key !== 'page' && key !== 'per_page')
                ? 'フィルター条件を変更してみてください'
                : '最初の記録を追加してみましょう'
              }
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <span className="mr-2">+</span>
              記録を追加
            </button>
          </div>
        )}
      </div>

      {/* ページネーション */}
      {sortedRecords.length > 0 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
            disabled={(filters.page || 1) <= 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            前へ
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-600">
            ページ {filters.page || 1}
          </span>
          
          <button
            onClick={() => handlePageChange((filters.page || 1) + 1)}
            disabled={sortedRecords.length < pageSize}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            次へ
          </button>
        </div>
      )}

      {/* ページサイズ設定 */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <span>表示件数:</span>
        <select
          value={pageSize}
          onChange={(e) => updateFilters({ per_page: parseInt(e.target.value) })}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value={10}>10件</option>
          <option value={20}>20件</option>
          <option value={50}>50件</option>
          <option value={100}>100件</option>
        </select>
      </div>
    </div>
  );
}

export default RecordsList;