/**
 * おむつ記録フォーム
 * 種類、状態、担当者入力とバリデーション
 */

'use client';

import React, { useState } from 'react';
import { 
  DatePicker, 
  TimePicker, 
  Button,
  RecordTypeIcon,
  Icon
} from '@/components/ui';
import type { DiaperMetadata, RecordedBy, DiaperType } from '@/types';

export interface DiaperRecordData {
  recorded_at: Date;
  recorded_by: RecordedBy;
  metadata: DiaperMetadata;
}

export interface DiaperRecordFormProps {
  initialData?: Partial<DiaperRecordData>;
  onSubmit: (data: DiaperRecordData) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

// バリデーションエラー型
interface ValidationErrors {
  recorded_at?: string;
  recorded_by?: string;
  diaper_type?: string;
  condition?: string;
  color?: string;
  note?: string;
}

// デフォルト値
const defaultData: DiaperRecordData = {
  recorded_at: new Date(),
  recorded_by: 'mama',
  metadata: {
    diaper_type: 'pee',
    condition: 'normal',
    color: '',
    note: '',
  },
};

export function DiaperRecordForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
}: DiaperRecordFormProps) {
  // フォーム状態
  const [formData, setFormData] = useState<DiaperRecordData>({
    ...defaultData,
    ...initialData,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // フィールド更新
  const updateField = <T extends keyof DiaperRecordData>(
    field: T,
    value: DiaperRecordData[T]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set(prev).add(field));
    
    // エラーをクリア
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // メタデータ更新
  const updateMetadata = <T extends keyof DiaperMetadata>(
    field: T,
    value: DiaperMetadata[T]
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

    // おむつの種類
    if (!formData.metadata.diaper_type) {
      newErrors.diaper_type = 'おむつの種類は必須です';
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
        'metadata.diaper_type',
        'metadata.condition',
        'metadata.color',
        'metadata.note',
      ]);
      setTouchedFields(allFields);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('おむつ記録の保存に失敗しました:', error);
    }
  };

  // 記録者選択肢
  const recordedByOptions: { value: RecordedBy; label: string }[] = [
    { value: 'mama', label: 'ママ' },
    { value: 'papa', label: 'パパ' },
    { value: 'unknown', label: 'その他' },
  ];

  // おむつ種類選択肢
  const diaperTypeOptions: { 
    value: DiaperType; 
    label: string; 
    icon: string;
    color: string;
  }[] = [
    { 
      value: 'pee', 
      label: 'おしっこ', 
      icon: '💧',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    { 
      value: 'poop', 
      label: 'うんち', 
      icon: '💩',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    },
    { 
      value: 'both', 
      label: 'おしっこ・うんち', 
      icon: '💧💩',
      color: 'bg-orange-50 border-orange-200 text-orange-800'
    },
  ];

  // 状態選択肢
  const conditionOptions: { 
    value: 'normal' | 'loose' | 'hard'; 
    label: string; 
    description: string;
  }[] = [
    { value: 'normal', label: '普通', description: '通常の状態' },
    { value: 'loose', label: '緩い', description: '下痢気味' },
    { value: 'hard', label: '硬い', description: '便秘気味' },
  ];

  // 色の選択肢（うんちの場合のみ）
  const colorOptions = [
    { value: '黄色', color: 'bg-yellow-300' },
    { value: '茶色', color: 'bg-yellow-700' },
    { value: '緑色', color: 'bg-green-500' },
    { value: '白色', color: 'bg-gray-200' },
    { value: '黒色', color: 'bg-gray-900' },
    { value: 'その他', color: 'bg-gray-400' },
  ];

  const showConditionAndColor = formData.metadata.diaper_type === 'poop' || formData.metadata.diaper_type === 'both';

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <RecordTypeIcon type="diaper" size="lg" variant="emoji" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">おむつ記録</h2>
          <p className="text-sm text-gray-600">おむつ交換の記録を残します</p>
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
                  ? 'border-diaper bg-diaper-light text-diaper-dark'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
                focus:outline-none focus:ring-2 focus:ring-diaper focus:ring-opacity-50
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

      {/* おむつの種類 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          おむつの種類 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {diaperTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateMetadata('diaper_type', option.value)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-center
                ${formData.metadata.diaper_type === option.value
                  ? `${option.color} border-current`
                  : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }
                focus:outline-none focus:ring-2 focus:ring-diaper focus:ring-opacity-50
              `}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-medium">{option.label}</div>
            </button>
          ))}
        </div>
        {touchedFields.has('metadata.diaper_type') && errors.diaper_type && (
          <p className="mt-1 text-sm text-red-600">{errors.diaper_type}</p>
        )}
      </div>

      {/* 状態・色（うんちの場合のみ表示） */}
      {showConditionAndColor && (
        <>
          {/* 状態 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              状態 [任意]
            </label>
            <div className="grid grid-cols-3 gap-3">
              {conditionOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateMetadata('condition', option.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200 text-center
                    ${formData.metadata.condition === option.value
                      ? 'border-diaper bg-diaper-light text-diaper-dark'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }
                    focus:outline-none focus:ring-2 focus:ring-diaper focus:ring-opacity-50
                  `}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              色 [任意]
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateMetadata('color', option.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200 text-center
                    ${formData.metadata.color === option.value
                      ? 'border-diaper bg-diaper-light'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                    focus:outline-none focus:ring-2 focus:ring-diaper focus:ring-opacity-50
                  `}
                >
                  <div className={`w-6 h-6 rounded-full mx-auto mb-2 ${option.color} border border-gray-300`}></div>
                  <div className="text-xs font-medium">{option.value}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* メモ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メモ [任意]
        </label>
        <textarea
          value={formData.metadata.note || ''}
          onChange={(e) => updateMetadata('note', e.target.value)}
          placeholder="おむつかぶれの状態や気づいたことを記録できます"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-diaper focus:border-diaper resize-none"
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

export default DiaperRecordForm;