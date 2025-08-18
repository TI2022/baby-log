/**
 * 削除確認ダイアログコンポーネント
 * 単一記録・複数記録の削除確認
 */

'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui';
import type { Record } from '@/types';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  records: Record[];
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  records,
  onConfirm,
  onCancel,
  title,
  message,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const [deleteReason, setDeleteReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);

  if (!isOpen) return null;

  const recordCount = records.length;
  const isMultiple = recordCount > 1;

  // 記録タイプ別の統計を計算
  const getTypeStats = () => {
    const stats = records.reduce((acc, record) => {
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

  // 最新の記録を取得（単一削除時の詳細表示用）
  const latestRecord = records.length > 0 ? records[0] : null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      setDeleteReason('');
      setShowReasonInput(false);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleCancel = () => {
    setDeleteReason('');
    setShowReasonInput(false);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="alert-triangle" size="md" className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {title || (isMultiple ? '記録を一括削除' : '記録を削除')}
              </h3>
              <p className="text-sm text-gray-600">
                この操作は取り消せません
              </p>
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              {message || (isMultiple 
                ? `選択された${recordCount}件の記録を削除しますか？`
                : 'この記録を削除しますか？'
              )}
            </p>

            {/* 削除対象の詳細 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                {isMultiple ? '削除対象:' : '削除する記録:'}
              </h4>

              {isMultiple ? (
                /* 複数記録の場合：タイプ別統計 */
                <div className="space-y-2">
                  {getTypeStats().map(({ type, count, label }) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium text-gray-900">{count}件</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-gray-900">合計</span>
                      <span className="text-gray-900">{recordCount}件</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* 単一記録の場合：詳細情報 */
                latestRecord && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {latestRecord.type === 'milk' ? '🍼' :
                         latestRecord.type === 'diaper' ? '👶' :
                         latestRecord.type === 'sleep' ? '💤' :
                         latestRecord.type === 'growth' ? '📏' : '📋'}
                      </span>
                      <span className="font-medium">
                        {latestRecord.type === 'milk' ? 'ミルク' :
                         latestRecord.type === 'diaper' ? 'おむつ' :
                         latestRecord.type === 'sleep' ? '睡眠' :
                         latestRecord.type === 'growth' ? '成長' : latestRecord.type}記録
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      記録日時: {new Date(latestRecord.recorded_at).toLocaleString('ja-JP')}
                    </div>
                    <div className="text-sm text-gray-600">
                      記録者: {latestRecord.recorded_by === 'mama' ? 'ママ' :
                               latestRecord.recorded_by === 'papa' ? 'パパ' : 'その他'}
                    </div>
                    {latestRecord.metadata.note && (
                      <div className="text-sm text-gray-600">
                        メモ: {latestRecord.metadata.note}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* 削除理由入力（オプション） */}
          {showReasonInput && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                削除理由（任意）
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="削除理由を入力してください..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          )}

          {/* 削除理由入力の切り替え */}
          {!showReasonInput && (
            <button
              onClick={() => setShowReasonInput(true)}
              className="text-sm text-blue-600 hover:text-blue-800 mb-6"
            >
              削除理由を記録する
            </button>
          )}
        </div>

        {/* フッター */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            {isLoading && <Icon name="loader" size="sm" className="animate-spin" />}
            {isLoading ? '削除中...' : isMultiple ? `${recordCount}件を削除` : '削除'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmDialog;