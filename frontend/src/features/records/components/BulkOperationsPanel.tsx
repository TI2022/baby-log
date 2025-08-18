/**
 * バルク操作パネルコンポーネント
 * 複数記録の一括操作（削除、エクスポート等）
 */

'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui';
import type { Record } from '@/types';

interface BulkOperationsPanelProps {
  selectedRecords: Set<string>;
  records: Record[];
  onBulkDelete: (recordIds: string[]) => Promise<void>;
  onBulkExport?: (records: Record[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onClose: () => void;
  className?: string;
}

export function BulkOperationsPanel({
  selectedRecords,
  records,
  onBulkDelete,
  onBulkExport,
  onSelectAll,
  onDeselectAll,
  onClose,
  className = '',
}: BulkOperationsPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const selectedCount = selectedRecords.size;
  const allRecordsSelected = records.length > 0 && selectedRecords.size === records.length;
  const selectedRecordsList = records.filter(record => selectedRecords.has(record.id));

  // 一括削除処理
  const handleBulkDelete = async () => {
    setIsLoading(true);
    try {
      await onBulkDelete(Array.from(selectedRecords));
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete records:', error);
      // エラーハンドリング（実際の実装では適切なエラー表示を行う）
    } finally {
      setIsLoading(false);
    }
  };

  // エクスポート処理
  const handleExport = () => {
    if (onBulkExport) {
      onBulkExport(selectedRecordsList);
    }
  };

  // 記録タイプ別の統計を計算
  const getTypeStats = () => {
    const stats = selectedRecordsList.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([type, count]) => ({
      type,
      count,
      label: type === 'milk' ? 'ミルク' :
             type === 'diaper' ? 'おむつ' :
             type === 'sleep' ? '睡眠' :
             type === 'growth' ? '成長' : type
    }));
  };

  if (selectedCount === 0) return null;

  return (
    <>
      {/* バルク操作パネル */}
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-40 ${className}`}>
        <div className="flex items-center gap-4">
          {/* 選択状況 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Icon name="check-circle" size="sm" className="text-blue-500" />
              <span className="font-medium text-gray-900">
                {selectedCount}件選択中
              </span>
            </div>

            {/* 記録タイプ別統計 */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              {getTypeStats().map(({ type, count, label }) => (
                <span key={type} className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {label}: {count}
                </span>
              ))}
            </div>
          </div>

          {/* 選択操作 */}
          <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            <button
              onClick={allRecordsSelected ? onDeselectAll : onSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {allRecordsSelected ? '全て解除' : '全て選択'}
            </button>
          </div>

          {/* アクション */}
          <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            {onBulkExport && (
              <button
                onClick={handleExport}
                disabled={isLoading}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                title="エクスポート"
              >
                <Icon name="download" size="sm" />
                <span className="hidden sm:inline">エクスポート</span>
              </button>
            )}

            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg disabled:opacity-50"
              title="削除"
            >
              <Icon name="trash" size="sm" />
              <span className="hidden sm:inline">削除</span>
            </button>
          </div>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="閉じる"
          >
            <Icon name="x" size="sm" />
          </button>
        </div>
      </div>

      {/* 一括削除確認ダイアログ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="alert-triangle" size="lg" className="text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                記録を一括削除しますか？
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                選択された{selectedCount}件の記録を削除します。この操作は取り消せません。
              </p>

              {/* 削除対象の詳細 */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">削除対象:</h4>
                <div className="space-y-1">
                  {getTypeStats().map(({ type, count, label }) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium">{count}件</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading && <Icon name="loader" size="sm" className="animate-spin" />}
                {isLoading ? '削除中...' : `${selectedCount}件を削除`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BulkOperationsPanel;