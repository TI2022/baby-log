/**
 * 成長記録フォーム
 * 体重、身長、頭囲入力とバリデーション
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
import type { GrowthMetadata, RecordedBy } from '@/types';

export interface GrowthRecordData {
  recorded_at: Date;
  recorded_by: RecordedBy;
  metadata: GrowthMetadata;
}

export interface GrowthRecordFormProps {
  initialData?: Partial<GrowthRecordData>;
  onSubmit: (data: GrowthRecordData) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

// バリデーションエラー型
interface ValidationErrors {
  recorded_at?: string;
  recorded_by?: string;
  weight_g?: string;
  height_cm?: string;
  head_circumference_cm?: string;
  chest_circumference_cm?: string;
  note?: string;
}

// デフォルト値
const defaultData: GrowthRecordData = {
  recorded_at: new Date(),
  recorded_by: 'mama',
  metadata: {
    weight_g: undefined,
    height_cm: undefined,
    head_circumference_cm: undefined,
    chest_circumference_cm: undefined,
    note: '',
  },
};

// 年齢別の標準値（参考値）
const standardValues = {
  newborn: { weight: 3000, height: 50, head: 35 },
  '1month': { weight: 4000, height: 54, head: 37 },
  '3months': { weight: 6000, height: 60, head: 40 },
  '6months': { weight: 8000, height: 67, head: 43 },
  '12months': { weight: 9500, height: 75, head: 46 },
};

export function GrowthRecordForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
}: GrowthRecordFormProps) {
  // フォーム状態
  const [formData, setFormData] = useState<GrowthRecordData>({
    ...defaultData,
    ...initialData,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // フィールド更新
  const updateField = <T extends keyof GrowthRecordData>(
    field: T,
    value: GrowthRecordData[T]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set(prev).add(field));
    
    // エラーをクリア
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // メタデータ更新
  const updateMetadata = <T extends keyof GrowthMetadata>(
    field: T,
    value: GrowthMetadata[T]
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

    // 少なくとも1つの測定値が必要
    const hasAnyMeasurement = 
      formData.metadata.weight_g ||
      formData.metadata.height_cm ||
      formData.metadata.head_circumference_cm ||
      formData.metadata.chest_circumference_cm;

    if (!hasAnyMeasurement) {
      newErrors.weight_g = '体重、身長、頭囲、胸囲のいずれかは必須です';
    }

    // 体重のバリデーション
    if (formData.metadata.weight_g !== undefined) {
      if (formData.metadata.weight_g <= 0) {
        newErrors.weight_g = '体重は0より大きい値を入力してください';
      } else if (formData.metadata.weight_g > 50000) { // 50kg
        newErrors.weight_g = '体重は50kg以下で入力してください';
      }
    }

    // 身長のバリデーション
    if (formData.metadata.height_cm !== undefined) {
      if (formData.metadata.height_cm <= 0) {
        newErrors.height_cm = '身長は0より大きい値を入力してください';
      } else if (formData.metadata.height_cm > 200) {
        newErrors.height_cm = '身長は200cm以下で入力してください';
      }
    }

    // 頭囲のバリデーション
    if (formData.metadata.head_circumference_cm !== undefined) {
      if (formData.metadata.head_circumference_cm <= 0) {
        newErrors.head_circumference_cm = '頭囲は0より大きい値を入力してください';
      } else if (formData.metadata.head_circumference_cm > 100) {
        newErrors.head_circumference_cm = '頭囲は100cm以下で入力してください';
      }
    }

    // 胸囲のバリデーション
    if (formData.metadata.chest_circumference_cm !== undefined) {
      if (formData.metadata.chest_circumference_cm <= 0) {
        newErrors.chest_circumference_cm = '胸囲は0より大きい値を入力してください';
      } else if (formData.metadata.chest_circumference_cm > 100) {
        newErrors.chest_circumference_cm = '胸囲は100cm以下で入力してください';
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
        'metadata.weight_g',
        'metadata.height_cm',
        'metadata.head_circumference_cm',
        'metadata.chest_circumference_cm',
        'metadata.note',
      ]);
      setTouchedFields(allFields);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('成長記録の保存に失敗しました:', error);
    }
  };

  // 単位変換ヘルパー
  const formatWeight = (grams?: number) => {
    if (!grams) return '';
    return `${(grams / 1000).toFixed(2)}kg`;
  };

  // 記録者選択肢
  const recordedByOptions: { value: RecordedBy; label: string }[] = [
    { value: 'mama', label: 'ママ' },
    { value: 'papa', label: 'パパ' },
    { value: 'unknown', label: 'その他' },
  ];

  // 測定項目
  const measurementFields = [
    {
      key: 'weight_g' as const,
      label: '体重',
      unit: 'g',
      displayUnit: 'kg',
      placeholder: '5000',
      step: '10',
      icon: '⚖️',
      converter: (value: number) => formatWeight(value),
      description: 'グラム単位で入力',
    },
    {
      key: 'height_cm' as const,
      label: '身長',
      unit: 'cm',
      displayUnit: 'cm',
      placeholder: '60.0',
      step: '0.1',
      icon: '📏',
      converter: (value: number) => `${value}cm`,
      description: 'センチメートル単位で入力',
    },
    {
      key: 'head_circumference_cm' as const,
      label: '頭囲',
      unit: 'cm',
      displayUnit: 'cm',
      placeholder: '40.0',
      step: '0.1',
      icon: '👶',
      converter: (value: number) => `${value}cm`,
      description: 'センチメートル単位で入力',
    },
    {
      key: 'chest_circumference_cm' as const,
      label: '胸囲',
      unit: 'cm',
      displayUnit: 'cm',
      placeholder: '35.0',
      step: '0.1',
      icon: '📐',
      converter: (value: number) => `${value}cm`,
      description: 'センチメートル単位で入力',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <RecordTypeIcon type="growth" size="lg" variant="emoji" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">成長記録</h2>
          <p className="text-sm text-gray-600">体重や身長などの成長を記録します</p>
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
                  ? 'border-growth bg-growth-light text-growth-dark'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
                focus:outline-none focus:ring-2 focus:ring-growth focus:ring-opacity-50
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

      {/* 測定値入力 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-medium text-gray-900">測定値</h3>
          <span className="text-sm text-gray-500">（いずれか1つ以上は必須）</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {measurementFields.map((field) => {
            const value = formData.metadata[field.key];
            const error = touchedFields.has(`metadata.${field.key}`) ? errors[field.key] : undefined;
            
            return (
              <div key={field.key} className="space-y-3">
                {/* 入力フィールド */}
                <div className="relative">
                  <Input
                    type="number"
                    label={`${field.label} (${field.unit})`}
                    value={value || ''}
                    onChange={(e) => {
                      const val = e.target.value ? parseFloat(e.target.value) : undefined;
                      updateMetadata(field.key, val);
                    }}
                    placeholder={field.placeholder}
                    step={field.step}
                    min="0"
                    error={error}
                  />
                  <div className="absolute right-3 top-8 text-gray-400">
                    <span className="text-lg">{field.icon}</span>
                  </div>
                </div>
                
                {/* 説明とプレビュー */}
                <div className="px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">{field.description}</div>
                  {value && (
                    <div className="text-sm font-medium text-growth">
                      表示: {field.converter(value)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 全体エラー表示 */}
        {touchedFields.has('metadata.weight_g') && errors.weight_g && !formData.metadata.weight_g && (
          <p className="mt-2 text-sm text-red-600">{errors.weight_g}</p>
        )}
      </div>

      {/* 測定値サマリー */}
      {(formData.metadata.weight_g || formData.metadata.height_cm || formData.metadata.head_circumference_cm || formData.metadata.chest_circumference_cm) && (
        <div className="p-4 bg-growth-light rounded-lg">
          <h4 className="font-medium text-growth-dark mb-3 flex items-center gap-2">
            <Icon name="stats" size="sm" />
            測定値サマリー
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {formData.metadata.weight_g && (
              <div>
                <div className="text-gray-600">体重</div>
                <div className="font-semibold text-growth-dark">{formatWeight(formData.metadata.weight_g)}</div>
              </div>
            )}
            {formData.metadata.height_cm && (
              <div>
                <div className="text-gray-600">身長</div>
                <div className="font-semibold text-growth-dark">{formData.metadata.height_cm}cm</div>
              </div>
            )}
            {formData.metadata.head_circumference_cm && (
              <div>
                <div className="text-gray-600">頭囲</div>
                <div className="font-semibold text-growth-dark">{formData.metadata.head_circumference_cm}cm</div>
              </div>
            )}
            {formData.metadata.chest_circumference_cm && (
              <div>
                <div className="text-gray-600">胸囲</div>
                <div className="font-semibold text-growth-dark">{formData.metadata.chest_circumference_cm}cm</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 参考値表示 */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
          <Icon name="info" size="sm" />
          月齢別参考値
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {Object.entries(standardValues).map(([age, values]) => (
            <div key={age} className="text-center p-2 bg-white rounded border">
              <div className="font-medium text-blue-900 mb-1">
                {age === 'newborn' ? '新生児' : 
                 age === '1month' ? '1ヶ月' :
                 age === '3months' ? '3ヶ月' :
                 age === '6months' ? '6ヶ月' : '12ヶ月'}
              </div>
              <div className="space-y-1 text-gray-600">
                <div>{(values.weight / 1000).toFixed(1)}kg</div>
                <div>{values.height}cm</div>
                <div>{values.head}cm</div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-blue-700">
          ※ 参考値です。個人差があるため、心配な場合は医師にご相談ください。
        </p>
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メモ [任意]
        </label>
        <textarea
          value={formData.metadata.note || ''}
          onChange={(e) => updateMetadata('note', e.target.value)}
          placeholder="測定時の様子や気づいたことを記録できます"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-growth focus:border-growth resize-none"
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

export default GrowthRecordForm;