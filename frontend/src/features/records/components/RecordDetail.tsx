/**
 * 記録詳細表示・編集コンポーネント
 * 個別記録の詳細表示、編集、削除機能
 */

'use client';

import React, { useState } from 'react';
import { RecordTypeIcon, Icon } from '@/components/ui';
import type { Record, RecordType, RecordedBy } from '@/types';

interface RecordDetailProps {
  record: Record;
  onUpdate?: (record: Record) => Promise<void>;
  onDelete?: (recordId: string) => Promise<void>;
  onClose?: () => void;
  isEditing?: boolean;
  className?: string;
}

export function RecordDetail({
  record,
  onUpdate,
  onDelete,
  onClose,
  isEditing: initialIsEditing = false,
  className = '',
}: RecordDetailProps) {
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [editedRecord, setEditedRecord] = useState<Record>(record);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // 記録時刻のフォーマット
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }),
      time: date.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  // 担当者の表示名取得
  const getRecordedByLabel = (recordedBy: RecordedBy) => {
    const labels = {
      mama: 'ママ',
      papa: 'パパ',
      unknown: 'その他',
    };
    return labels[recordedBy] || 'その他';
  };

  // 記録タイプの表示名取得
  const getRecordTypeLabel = (type: RecordType) => {
    const labels = {
      milk: 'ミルク',
      diaper: 'おむつ',
      sleep: '睡眠',
      growth: '成長',
    };
    return labels[type];
  };

  // メタデータの表示内容を生成
  const renderMetadata = (record: Record, editing = false) => {
    const { type, metadata } = record;

    switch (type) {
      case 'milk':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                量 (ml)
              </label>
              {editing ? (
                <input
                  type="number"
                  value={metadata.amount_ml || ''}
                  onChange={(e) => setEditedRecord(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, amount_ml: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-lg font-semibold text-blue-600">
                  {metadata.amount_ml || 0} ml
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                種類
              </label>
              {editing ? (
                <select
                  value={metadata.milk_type || 'breast'}
                  onChange={(e) => setEditedRecord(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, milk_type: e.target.value as 'breast' | 'formula' }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="breast">母乳</option>
                  <option value="formula">ミルク</option>
                </select>
              ) : (
                <p className="text-gray-900">
                  {metadata.milk_type === 'breast' ? '母乳' : 'ミルク'}
                </p>
              )}
            </div>

            {metadata.duration_minutes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所要時間
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={metadata.duration_minutes || ''}
                    onChange={(e) => setEditedRecord(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, duration_minutes: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{metadata.duration_minutes}分</p>
                )}
              </div>
            )}
          </div>
        );

      case 'diaper':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                種類
              </label>
              {editing ? (
                <select
                  value={metadata.diaper_type || 'pee'}
                  onChange={(e) => setEditedRecord(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, diaper_type: e.target.value as 'pee' | 'poop' | 'both' }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pee">おしっこ</option>
                  <option value="poop">うんち</option>
                  <option value="both">両方</option>
                </select>
              ) : (
                <p className="text-gray-900">
                  {metadata.diaper_type === 'pee' ? 'おしっこ' : 
                   metadata.diaper_type === 'poop' ? 'うんち' : 
                   metadata.diaper_type === 'both' ? '両方' : 'おしっこ'}
                </p>
              )}
            </div>

            {metadata.condition && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状態
                </label>
                {editing ? (
                  <select
                    value={metadata.condition || 'normal'}
                    onChange={(e) => setEditedRecord(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, condition: e.target.value as 'normal' | 'loose' | 'hard' }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">普通</option>
                    <option value="loose">ゆるい</option>
                    <option value="hard">硬い</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {metadata.condition === 'normal' ? '普通' : 
                     metadata.condition === 'loose' ? 'ゆるい' : 
                     metadata.condition === 'hard' ? '硬い' : '普通'}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 'sleep':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metadata.start_time && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  開始時刻
                </label>
                {editing ? (
                  <input
                    type="datetime-local"
                    value={metadata.start_time ? new Date(metadata.start_time).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditedRecord(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, start_time: e.target.value ? new Date(e.target.value).toISOString() : undefined }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {formatDateTime(metadata.start_time).time}
                  </p>
                )}
              </div>
            )}

            {metadata.end_time && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  終了時刻
                </label>
                {editing ? (
                  <input
                    type="datetime-local"
                    value={metadata.end_time ? new Date(metadata.end_time).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditedRecord(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, end_time: e.target.value ? new Date(e.target.value).toISOString() : undefined }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {formatDateTime(metadata.end_time).time}
                  </p>
                )}
              </div>
            )}

            {metadata.duration_minutes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  睡眠時間
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={metadata.duration_minutes || ''}
                    onChange={(e) => setEditedRecord(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, duration_minutes: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-semibold text-purple-600">
                    {Math.floor(metadata.duration_minutes / 60)}時間 {metadata.duration_minutes % 60}分
                  </p>
                )}
              </div>
            )}

            {metadata.quality && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  睡眠の質
                </label>
                {editing ? (
                  <select
                    value={metadata.quality || 'normal'}
                    onChange={(e) => setEditedRecord(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, quality: e.target.value as 'good' | 'normal' | 'poor' }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="good">良い</option>
                    <option value="normal">普通</option>
                    <option value="poor">悪い</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {metadata.quality === 'good' ? '良い' : 
                     metadata.quality === 'poor' ? '悪い' : '普通'}
                  </p>
                )}
              </div>
            )}

            {metadata.location && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  場所
                </label>
                {editing ? (
                  <select
                    value={metadata.location || 'crib'}
                    onChange={(e) => setEditedRecord(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, location: e.target.value as 'crib' | 'arms' | 'stroller' | 'other' }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="crib">ベビーベッド</option>
                    <option value="arms">抱っこ</option>
                    <option value="stroller">ベビーカー</option>
                    <option value="other">その他</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {metadata.location === 'crib' ? 'ベビーベッド' : 
                     metadata.location === 'arms' ? '抱っこ' : 
                     metadata.location === 'stroller' ? 'ベビーカー' : 'その他'}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 'growth':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metadata.weight_g && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  体重 (g)
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={metadata.weight_g || ''}
                    onChange={(e) => setEditedRecord(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, weight_g: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-semibold text-green-600">
                    {(metadata.weight_g / 1000).toFixed(2)} kg
                  </p>
                )}
              </div>
            )}

            {metadata.height_cm && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  身長 (cm)
                </label>
                {editing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={metadata.height_cm || ''}
                    onChange={(e) => setEditedRecord(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, height_cm: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-semibold text-green-600">
                    {metadata.height_cm} cm
                  </p>
                )}
              </div>
            )}

            {metadata.head_circumference_cm && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  頭囲 (cm)
                </label>
                {editing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={metadata.head_circumference_cm || ''}
                    onChange={(e) => setEditedRecord(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, head_circumference_cm: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-semibold text-green-600">
                    {metadata.head_circumference_cm} cm
                  </p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // 保存処理
  const handleSave = async () => {
    if (!onUpdate) return;
    
    setIsLoading(true);
    try {
      await onUpdate(editedRecord);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update record:', error);
      // エラーハンドリング（実際の実装では適切なエラー表示を行う）
    } finally {
      setIsLoading(false);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsLoading(true);
    try {
      await onDelete(record.id);
      onClose?.();
    } catch (error) {
      console.error('Failed to delete record:', error);
      // エラーハンドリング（実際の実装では適切なエラー表示を行う）
    } finally {
      setIsLoading(false);
      setDeleteConfirm(false);
    }
  };

  const { date, time } = formatDateTime(record.recorded_at);

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <RecordTypeIcon type={record.type} size="lg" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {getRecordTypeLabel(record.type)}記録
            </h2>
            <p className="text-sm text-gray-600">
              {date} {time}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? '保存中...' : '保存'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Icon name="edit" size="sm" />
              </button>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <Icon name="trash" size="sm" />
              </button>
            </>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Icon name="x" size="sm" />
            </button>
          )}
        </div>
      </div>

      {/* コンテンツ */}
      <div className="p-6 space-y-6">
        {/* 基本情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              記録者
            </label>
            {isEditing ? (
              <select
                value={editedRecord.recorded_by}
                onChange={(e) => setEditedRecord(prev => ({
                  ...prev,
                  recorded_by: e.target.value as RecordedBy
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="mama">ママ</option>
                <option value="papa">パパ</option>
                <option value="unknown">その他</option>
              </select>
            ) : (
              <p className="text-gray-900">{getRecordedByLabel(record.recorded_by)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              記録時刻
            </label>
            {isEditing ? (
              <input
                type="datetime-local"
                value={new Date(editedRecord.recorded_at).toISOString().slice(0, 16)}
                onChange={(e) => setEditedRecord(prev => ({
                  ...prev,
                  recorded_at: new Date(e.target.value).toISOString()
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{date} {time}</p>
            )}
          </div>
        </div>

        {/* 記録タイプ別詳細 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">詳細情報</h3>
          {renderMetadata(isEditing ? editedRecord : record, isEditing)}
        </div>

        {/* メモ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メモ
          </label>
          {isEditing ? (
            <textarea
              value={editedRecord.metadata.note || ''}
              onChange={(e) => setEditedRecord(prev => ({
                ...prev,
                metadata: { ...prev.metadata, note: e.target.value }
              }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="メモを入力してください..."
            />
          ) : (
            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[100px]">
              {record.metadata.note || 'メモはありません'}
            </p>
          )}
        </div>

        {/* 作成・更新日時 */}
        <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>作成: {formatDateTime(record.created_at).date} {formatDateTime(record.created_at).time}</span>
            <span>更新: {formatDateTime(record.updated_at).date} {formatDateTime(record.updated_at).time}</span>
          </div>
        </div>
      </div>

      {/* 削除確認ダイアログ */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              記録を削除しますか？
            </h3>
            <p className="text-gray-600 mb-6">
              この操作は取り消せません。本当に削除しますか？
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isLoading ? '削除中...' : '削除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordDetail;