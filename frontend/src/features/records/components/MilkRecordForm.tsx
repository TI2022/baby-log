/**
 * ミルク記録フォーム
 * 量、種類、担当者入力とバリデーション
 */

'use client';

import React, { useState } from 'react';
import { 
  DatePicker, 
  TimePicker, 
  Input, 
  Button,
  RecordTypeIcon,
  Icon
} from '@/components/ui';
import type { MilkMetadata, RecordedBy, MilkType } from '@/types';

export interface MilkRecordData {
  recorded_at: Date;
  recorded_by: RecordedBy;
  metadata: MilkMetadata;
}

export interface MilkRecordFormProps {
  initialData?: Partial<MilkRecordData>;
  onSubmit: (data: MilkRecordData) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

// バリデーションエラー型
interface ValidationErrors {
  recorded_at?: string;
  recorded_by?: string;
  amount_ml?: string;
  milk_type?: string;
  duration_minutes?: string;
  note?: string;
}

// デフォルト値
const defaultData: MilkRecordData = {
  recorded_at: new Date(),
  recorded_by: 'mama',
  metadata: {
    amount_ml: 120,
    milk_type: 'formula',
    duration_minutes: undefined,
    note: '',
  },
};

export function MilkRecordForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
}: MilkRecordFormProps) {
  // フォーム状態
  const [formData, setFormData] = useState<MilkRecordData>({
    ...defaultData,
    ...initialData,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // フィールド更新
  const updateField = <T extends keyof MilkRecordData>(
    field: T,
    value: MilkRecordData[T]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set(prev).add(field));
    
    // エラーをクリア
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // メタデータ更新
  const updateMetadata = <T extends keyof MilkMetadata>(
    field: T,
    value: MilkMetadata[T]
  ) => {
    setFormData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value },
    }));
    setTouchedFields(prev => new Set(prev).add(`metadata.${field}`));
    
    // エラーをクリア
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // 記録日時
    if (!formData.recorded_at) {
      newErrors.recorded_at = '記録日時は必須です';
    } else if (formData.recorded_at > new Date()) {
      newErrors.recorded_at = '未来の日時は指定できません';
    }

    // 担当者
    if (!formData.recorded_by) {
      newErrors.recorded_by = '担当者の選択は必須です';
    }

    // ミルク量
    if (!formData.metadata.amount_ml || formData.metadata.amount_ml <= 0) {
      newErrors.amount_ml = 'ミルク量は1ml以上で入力してください';
    } else if (formData.metadata.amount_ml > 500) {
      newErrors.amount_ml = 'ミルク量は500ml以下で入力してください';
    }

    // ミルクの種類
    if (!formData.metadata.milk_type) {
      newErrors.milk_type = 'ミルクの種類は必須です';
    }

    // 授乳時間（任意だが、指定する場合は妥当性チェック）
    if (formData.metadata.duration_minutes !== undefined) {
      if (formData.metadata.duration_minutes < 1) {
        newErrors.duration_minutes = '授乳時間は1分以上で入力してください';
      } else if (formData.metadata.duration_minutes > 120) {
        newErrors.duration_minutes = '授乳時間は120分以下で入力してください';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // 全フィールドをタッチ済みにしてエラー表示
      const allFields = new Set([
        'recorded_at',
        'recorded_by', 
        'metadata.amount_ml',
        'metadata.milk_type',
        'metadata.duration_minutes',
        'metadata.note',
      ]);
      setTouchedFields(allFields);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('ミルク記録の保存に失敗しました:', error);
    }
  };

  // 記録者選択肢
  const recordedByOptions: { value: RecordedBy; label: string }[] = [
    { value: 'mama', label: 'ママ' },
    { value: 'papa', label: 'パパ' },
    { value: 'unknown', label: 'その他' },
  ];

  // ミルク種類選択肢
  const milkTypeOptions: { value: MilkType; label: string; description: string }[] = [
    { value: 'breast', label: '母乳', description: '母乳のみ' },
    { value: 'formula', label: 'ミルク', description: '粉ミルク・液体ミルク' },
    { value: 'mixed', label: '混合', description: '母乳+ミルク' },
  ];

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <RecordTypeIcon type="milk" size="lg" variant="emoji" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">ミルク記録</h2>
          <p className="text-sm text-gray-600">ミルクの量や種類を記録します</p>
        </div>
      </div>

      {/* 記録日時 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePicker
          value={formData.recorded_at}
          onChange={(date) => updateField('recorded_at', date)}
          label="記録日"
          placeholder="日付を選択"
          maxDate={new Date()}
          error={touchedFields.has('recorded_at') ? errors.recorded_at : undefined}
        />
        
        <TimePicker
          value={{
            hours: formData.recorded_at.getHours(),
            minutes: formData.recorded_at.getMinutes(),
          }}
          onChange={(time) => {
            const newDate = new Date(formData.recorded_at);
            newDate.setHours(time.hours, time.minutes);
            updateField('recorded_at', newDate);
          }}
          label="記録時刻"
          error={touchedFields.has('recorded_at') ? errors.recorded_at : undefined}
        />
      </div>

      {/* 担当者選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          担当者 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {recordedByOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField('recorded_by', option.value)}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200 text-center
                ${formData.recorded_by === option.value
                  ? 'border-milk bg-milk-light text-milk-dark'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
                focus:outline-none focus:ring-2 focus:ring-milk focus:ring-opacity-50
              `}
            >
              <div className="font-medium">{option.label}</div>
            </button>
          ))}
        </div>
        {touchedFields.has('recorded_by') && errors.recorded_by && (
          <p className="mt-1 text-sm text-red-600">{errors.recorded_by}</p>
        )}
      </div>

      {/* ミルクの種類 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          ミルクの種類 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {milkTypeOptions.map((option) => (
            <label
              key={option.value}
              className={`
                flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${formData.metadata.milk_type === option.value
                  ? 'border-milk bg-milk-light'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                name="milk_type"
                value={option.value}
                checked={formData.metadata.milk_type === option.value}
                onChange={(e) => updateMetadata('milk_type', e.target.value as MilkType)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
              {formData.metadata.milk_type === option.value && (
                <Icon name="check" size="sm" className="text-milk" />
              )}
            </label>
          ))}
        </div>
        {touchedFields.has('metadata.milk_type') && errors.milk_type && (
          <p className="mt-1 text-sm text-red-600">{errors.milk_type}</p>
        )}
      </div>

      {/* ミルク量 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            type="number"
            label="ミルク量 (ml)"
            value={formData.metadata.amount_ml}
            onChange={(e) => updateMetadata('amount_ml', parseInt(e.target.value) || 0)}
            placeholder="120"
            min="1"
            max="500"
            step="5"
            error={touchedFields.has('metadata.amount_ml') ? errors.amount_ml : undefined}
            required
          />
        </div>
        
        <div>
          <Input
            type="number"
            label="授乳時間 (分) [任意]"
            value={formData.metadata.duration_minutes || ''}
            onChange={(e) => updateMetadata('duration_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="15"
            min="1"
            max="120"
            error={touchedFields.has('metadata.duration_minutes') ? errors.duration_minutes : undefined}
          />
        </div>
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メモ [任意]
        </label>
        <textarea
          value={formData.metadata.note || ''}
          onChange={(e) => updateMetadata('note', e.target.value)}
          placeholder="機嫌や様子など、気づいたことを記録できます"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-milk focus:border-milk resize-none"
          maxLength={500}
        />
        <div className="mt-1 text-right text-xs text-gray-500">
          {(formData.metadata.note?.length || 0)}/500文字
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            キャンセル
          </Button>
        )}
        
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              記録中...
            </div>
          ) : (
            '記録する'
          )}
        </Button>
      </div>
    </form>
  );
}

export default MilkRecordForm;