/**
 * Undo機能付きトーストコンポーネント
 * 削除操作の取り消し機能
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui';
import type { Record } from '@/types';

interface UndoToastProps {
  isVisible: boolean;
  deletedRecords: Record[];
  onUndo: (records: Record[]) => void;
  onDismiss: () => void;
  duration?: number; // ミリ秒
  className?: string;
}

export function UndoToast({
  isVisible,
  deletedRecords,
  onUndo,
  onDismiss,
  duration = 5000,
  className = '',
}: UndoToastProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isVisible || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          onDismiss();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isVisible, isPaused, onDismiss]);

  useEffect(() => {
    if (isVisible) {
      setTimeLeft(duration);
    }
  }, [isVisible, duration]);

  if (!isVisible || deletedRecords.length === 0) return null;

  const handleUndo = () => {
    onUndo(deletedRecords);
    onDismiss();
  };

  const progressPercentage = (timeLeft / duration) * 100;
  const recordCount = deletedRecords.length;

  // 記録タイプ別の統計を計算
  const getTypeStats = () => {
    const stats = deletedRecords.reduce((acc, record) => {
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

  return (
    <div 
      className={`fixed top-6 right-6 bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 p-4 z-50 max-w-md ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* プログレスバー */}
      <div className="absolute top-0 left-0 h-1 bg-blue-500 rounded-t-lg transition-all duration-100 ease-linear"
           style={{ width: `${progressPercentage}%` }}
      />

      <div className="flex items-start gap-3">
        {/* アイコン */}
        <div className="flex-shrink-0 p-2 bg-green-600 rounded-full">
          <Icon name="check" size="sm" className="text-white" />
        </div>

        {/* メッセージ */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-white">
              {recordCount}件の記録を削除しました
            </h4>
            <button
              onClick={onDismiss}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Icon name="x" size="sm" />
            </button>
          </div>

          {/* 削除された記録の詳細 */}
          {getTypeStats().length > 1 && (
            <div className="text-sm text-gray-300 mb-3">
              {getTypeStats().map(({ label, count }, index) => (
                <span key={label}>
                  {label}: {count}件
                  {index < getTypeStats().length - 1 && ', '}
                </span>
              ))}
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleUndo}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
            >
              <Icon name="undo" size="sm" />
              元に戻す
            </button>
            
            <span className="text-xs text-gray-400">
              {Math.ceil(timeLeft / 1000)}秒後に自動で閉じます
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UndoToast;