/**
 * RecordCard - 記録データ表示カード
 * Tailwind CSS使用（サーバーコンポーネント対応）
 */

import React from 'react';
import { Icon, RecordTypeIcon } from '@/components/ui';
import type { Record, RecordType, RecordedBy } from '@/types';

export interface RecordCardProps {
  record: Record;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  showMetadata?: boolean;
  onEdit?: (record: Record) => void;
  onDelete?: (record: Record) => void;
  className?: string;
}

// 記録タイプ別のメタデータレンダリング
function renderMetadata(record: Record): React.ReactNode {
  switch (record.type) {
    case 'milk':
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon name="droplet" size="xs" />
            <span>{record.metadata.amount_ml}ml</span>
            <span className="text-gray-400">•</span>
            <span>{record.metadata.milk_type === 'breast' ? '母乳' : 
                   record.metadata.milk_type === 'formula' ? 'ミルク' : '混合'}</span>
          </div>
          {record.metadata.duration_minutes && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="clock" size="xs" />
              <span>{record.metadata.duration_minutes}分</span>
            </div>
          )}
        </div>
      );
    
    case 'diaper':
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{record.metadata.diaper_type === 'pee' ? 'おしっこ' : 
                   record.metadata.diaper_type === 'poop' ? 'うんち' : 'おしっこ・うんち'}</span>
          </div>
          {record.metadata.condition && (
            <div className="text-sm text-gray-600">
              状態: {record.metadata.condition === 'normal' ? '普通' :
                    record.metadata.condition === 'loose' ? '緩い' : '硬い'}
            </div>
          )}
        </div>
      );
    
    case 'sleep':
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon name="clock" size="xs" />
            <span>
              {new Date(record.metadata.start_time).toLocaleTimeString('ja-JP', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              {record.metadata.end_time && (
                <> - {new Date(record.metadata.end_time).toLocaleTimeString('ja-JP', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</>
              )}
            </span>
          </div>
          {record.metadata.duration_minutes && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="moon" size="xs" />
              <span>{Math.floor(record.metadata.duration_minutes / 60)}時間{record.metadata.duration_minutes % 60}分</span>
            </div>
          )}
          <div className="text-sm text-gray-600">
            質: {record.metadata.quality === 'good' ? '良い' :
                record.metadata.quality === 'normal' ? '普通' : '悪い'}
          </div>
        </div>
      );
    
    case 'growth':
      return (
        <div className="space-y-1">
          {record.metadata.weight_g && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="ruler" size="xs" />
              <span>体重: {(record.metadata.weight_g / 1000).toFixed(2)}kg</span>
            </div>
          )}
          {record.metadata.height_cm && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="ruler" size="xs" />
              <span>身長: {record.metadata.height_cm}cm</span>
            </div>
          )}
          {record.metadata.head_circumference_cm && (
            <div className="text-sm text-gray-600">
              頭囲: {record.metadata.head_circumference_cm}cm
            </div>
          )}
        </div>
      );
    
    default:
      return null;
  }
}

// 記録者表示
function renderRecordedBy(recordedBy: RecordedBy): React.ReactNode {
  const labels: Record<RecordedBy, string> = {
    mama: 'ママ',
    papa: 'パパ',
    unknown: '不明',
  };
  
  const colors: Record<RecordedBy, string> = {
    mama: 'text-pink-600 bg-pink-50',
    papa: 'text-blue-600 bg-blue-50',
    unknown: 'text-gray-600 bg-gray-50',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[recordedBy]}`}>
      {labels[recordedBy]}
    </span>
  );
}

// サイズ別スタイル
const sizeStyles = {
  sm: {
    card: 'p-3',
    title: 'text-sm',
    time: 'text-xs',
    metadata: 'text-xs',
  },
  md: {
    card: 'p-4',
    title: 'text-base',
    time: 'text-sm',
    metadata: 'text-sm',
  },
  lg: {
    card: 'p-6',
    title: 'text-lg',
    time: 'text-base',
    metadata: 'text-base',
  },
};

export function RecordCard({
  record,
  size = 'md',
  variant = 'default',
  showActions = true,
  showMetadata = true,
  onEdit,
  onDelete,
  className = '',
}: RecordCardProps) {
  const sizeStyle = sizeStyles[size];
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const baseClasses = `
    bg-white rounded-xl border shadow-sm
    hover:shadow-md transition-all duration-200
    ${sizeStyle.card}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  if (variant === 'compact') {
    return (
      <div className={baseClasses}>
        <div className="flex items-center gap-3">
          <RecordTypeIcon
            type={record.type}
            size="sm"
            variant="emoji"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={`font-medium text-gray-900 ${sizeStyle.title}`}>
                {record.type === 'milk' ? 'ミルク' :
                 record.type === 'diaper' ? 'おむつ' :
                 record.type === 'sleep' ? '睡眠' : '成長'}
              </span>
              <span className={`text-gray-500 ${sizeStyle.time}`}>
                {formatTime(record.recorded_at)}
              </span>
            </div>
            {showMetadata && (
              <div className="mt-1">
                {renderMetadata(record)}
              </div>
            )}
          </div>
          {showActions && (
            <div className="flex gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(record)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  aria-label="編集"
                >
                  <Icon name="edit" size="xs" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(record)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  aria-label="削除"
                >
                  <Icon name="trash" size="xs" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <RecordTypeIcon
            type={record.type}
            size={size === 'lg' ? 'lg' : 'md'}
            variant="emoji"
          />
          <div>
            <h3 className={`font-semibold text-gray-900 ${sizeStyle.title}`}>
              {record.type === 'milk' ? 'ミルク' :
               record.type === 'diaper' ? 'おむつ交換' :
               record.type === 'sleep' ? '睡眠' : '成長記録'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-gray-500 ${sizeStyle.time}`}>
                {formatTime(record.recorded_at)}
              </span>
              {renderRecordedBy(record.recorded_by)}
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(record)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="編集"
              >
                <Icon name="edit" size="sm" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(record)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="削除"
              >
                <Icon name="trash" size="sm" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* メタデータ */}
      {showMetadata && (
        <div className="space-y-2">
          {renderMetadata(record)}
        </div>
      )}

      {/* ノート */}
      {variant === 'detailed' && record.metadata.note && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-start gap-2">
            <Icon name="info" size="xs" className="mt-0.5 text-gray-400" />
            <p className={`text-gray-600 ${sizeStyle.metadata}`}>
              {record.metadata.note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// 記録リスト表示用コンポーネント
interface RecordListProps {
  records: Record[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  onEdit?: (record: Record) => void;
  onDelete?: (record: Record) => void;
  emptyMessage?: string;
  className?: string;
}

export function RecordList({
  records,
  size = 'md',
  variant = 'default',
  showActions = true,
  onEdit,
  onDelete,
  emptyMessage = '記録がありません',
  className = '',
}: RecordListProps) {
  if (records.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <Icon name="records" size="xl" className="mx-auto mb-3 text-gray-300" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {records.map((record) => (
        <RecordCard
          key={record.id}
          record={record}
          size={size}
          variant={variant}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default RecordCard;