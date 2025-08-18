/**
 * バルク操作機能付き記録一覧コンポーネント
 * Phase 4の全機能を統合したメインコンポーネント
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecordTypeIcon, Icon } from '@/components/ui';
import { BulkOperationsPanel } from './BulkOperationsPanel';
import { UndoToast } from './UndoToast';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useRecords } from '@/contexts/RecordsContext';
import type { Record, RecordType, RecordedBy, RecordFilters } from '@/types';

interface RecordsListWithBulkOpsProps {
  className?: string;
  showFilters?: boolean;
  defaultFilters?: Partial<RecordFilters>;
  pageSize?: number;
}

export function RecordsListWithBulkOps({ 
  className = '',
  showFilters = true,
  defaultFilters = {},
  pageSize = 20 
}: RecordsListWithBulkOpsProps) {
  const router = useRouter();
  const { 
    records, 
    isLoading, 
    error, 
    deleteRecord,
    createRecord, // 復元に使用
    getRecordsByType,
    getRecordsByRecordedBy
  } = useRecords();

  // 状態管理
  const [filters, setFilters] = useState<RecordFilters>({
    page: 1,
    per_page: pageSize,
    date_from: '',
    date_to: '',
    type: undefined,
    recorded_by: undefined,
    search: '',
    sort_by: 'recorded_at',
    sort_order: 'desc',
    ...defaultFilters,
  });

  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'recorded_at' | 'created_at'>('recorded_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // バルク操作の状態
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recordsToDelete, setRecordsToDelete] = useState<Record[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Undo機能の状態
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [deletedRecords, setDeletedRecords] = useState<Record[]>([]);

  // 記録タイプオプション
  const recordTypeOptions = [
    { value: '', label: 'すべて' },
    { value: 'milk', label: 'ミルク' },
    { value: 'diaper', label: 'おむつ' },
    { value: 'sleep', label: '睡眠' },
    { value: 'growth', label: '成長' },
  ];

  // 担当者オプション
  const recordedByOptions = [
    { value: '', label: 'すべて' },
    { value: 'mama', label: 'ママ' },
    { value: 'papa', label: 'パパ' },
    { value: 'unknown', label: 'その他' },
  ];

  // フィルタ更新
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

  // 選択操作
  const handleSelectRecord = (recordId: string, isSelected: boolean) => {
    setSelectedRecords(prev => {
      const updated = new Set(prev);
      if (isSelected) {
        updated.add(recordId);
      } else {
        updated.delete(recordId);
      }
      return updated;
    });
  };

  const handleSelectAll = () => {
    setSelectedRecords(new Set(sortedRecords.map(r => r.id)));
  };

  const handleDeselectAll = () => {
    setSelectedRecords(new Set());
  };

  // バルク削除
  const handleBulkDelete = async (recordIds: string[]) => {
    const recordsToDelete = records.filter(r => recordIds.includes(r.id));
    setRecordsToDelete(recordsToDelete);
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      // 削除実行前に記録をバックアップ
      const recordsBackup = [...recordsToDelete];
      
      // 実際の削除処理
      await Promise.all(recordsToDelete.map(record => deleteRecord(record.id)));
      
      // 成功時の処理
      setDeletedRecords(recordsBackup);
      setSelectedRecords(new Set());
      setShowDeleteConfirm(false);
      setShowBulkPanel(false);
      setShowUndoToast(true);
      
    } catch (error) {
      console.error('Failed to delete records:', error);
      // エラーハンドリング（実際の実装では適切なエラー表示を行う）
    } finally {
      setIsDeleting(false);
    }
  };

  // 復元機能
  const handleUndo = async (records: Record[]) => {
    try {
      // 記録を復元（実際の実装では適切なAPI呼び出し）
      await Promise.all(records.map(record => createRecord(record)));
      setShowUndoToast(false);
      setDeletedRecords([]);
    } catch (error) {
      console.error('Failed to restore records:', error);
    }
  };

  // バルクエクスポート
  const handleBulkExport = (records: Record[]) => {
    const exportData = records.map(record => ({
      id: record.id,
      type: record.type,
      recorded_at: record.recorded_at,
      recorded_by: record.recorded_by,
      ...record.metadata,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baby-records-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 選択状態に応じてバルクパネルの表示を制御
  useEffect(() => {
    setShowBulkPanel(selectedRecords.size > 0);
  }, [selectedRecords.size]);

  // ローディング状態
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">記録を読み込んでいます...</span>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          記録の読み込みに失敗しました
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          再読み込み
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* フィルター */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">フィルター・検索</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* 検索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                検索
              </label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="メモを検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
                {recordTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                <Icon name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} size="sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 記録一覧 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {sortedRecords.length > 0 ? (
          <>
            {/* ヘッダー */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                記録一覧 ({sortedRecords.length}件)
              </h3>
              
              {/* 全選択チェックボックス */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sortedRecords.length > 0 && selectedRecords.size === sortedRecords.length}
                  onChange={(e) => e.target.checked ? handleSelectAll() : handleDeselectAll()}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">
                  全て選択
                </span>
              </div>
            </div>

            {/* 記録カード一覧 */}
            <div className="p-4 space-y-3">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* 空の状態 */
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              記録がありません
            </h3>
            <p className="text-gray-600">
              フィルター条件を変更するか、新しい記録を追加してください。
            </p>
          </div>
        )}
      </div>

      {/* バルク操作パネル */}
      {showBulkPanel && (
        <BulkOperationsPanel
          selectedRecords={selectedRecords}
          records={sortedRecords}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onClose={() => {
            setSelectedRecords(new Set());
            setShowBulkPanel(false);
          }}
        />
      )}

      {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        records={recordsToDelete}
        onConfirm={confirmBulkDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeleting}
      />

      {/* Undoトースト */}
      <UndoToast
        isVisible={showUndoToast}
        deletedRecords={deletedRecords}
        onUndo={handleUndo}
        onDismiss={() => {
          setShowUndoToast(false);
          setDeletedRecords([]);
        }}
        duration={8000}
      />
    </div>
  );
}

export default RecordsListWithBulkOps;