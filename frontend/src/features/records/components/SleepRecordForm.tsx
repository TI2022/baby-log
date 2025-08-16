/**
 * 睡眠記録フォーム
 * 開始・終了時刻、質、場所入力とバリデーション
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  DatePicker, 
  TimePicker, 
  Button,
  RecordTypeIcon,
  Icon
} from '@/components/ui';
import type { SleepMetadata, RecordedBy, SleepQuality, SleepLocation } from '@/types';

export interface SleepRecordData {
  recorded_at: Date;
  recorded_by: RecordedBy;
  metadata: SleepMetadata;
}

export interface SleepRecordFormProps {
  initialData?: Partial<SleepRecordData>;
  onSubmit: (data: SleepRecordData) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

// バリデーションエラー型
interface ValidationErrors {
  recorded_at?: string;
  recorded_by?: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: string;
  quality?: string;
  location?: string;
  note?: string;
}

// デフォルト値
const defaultData: SleepRecordData = {
  recorded_at: new Date(),
  recorded_by: 'mama',
  metadata: {
    start_time: new Date().toISOString(),
    end_time: undefined,
    duration_minutes: undefined,
    quality: 'normal',
    location: 'crib',
    note: '',
  },
};

export function SleepRecordForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
}: SleepRecordFormProps) {
  // フォーム状態
  const [formData, setFormData] = useState<SleepRecordData>(() => {
    const initial = { ...defaultData, ...initialData };
    // 初期データの処理
    if (initial.metadata.start_time && typeof initial.metadata.start_time === 'string') {
      initial.metadata.start_time = initial.metadata.start_time;
    }
    if (initial.metadata.end_time && typeof initial.metadata.end_time === 'string') {
      initial.metadata.end_time = initial.metadata.end_time;
    }
    return initial;
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isOngoing, setIsOngoing] = useState(!formData.metadata.end_time);

  // 睡眠時間を自動計算
  useEffect(() => {
    if (formData.metadata.start_time && formData.metadata.end_time) {
      const startTime = new Date(formData.metadata.start_time);
      const endTime = new Date(formData.metadata.end_time);
      const diffMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      
      if (diffMinutes > 0) {
        updateMetadata('duration_minutes', diffMinutes);
      }
    }
  }, [formData.metadata.start_time, formData.metadata.end_time]);

  // フィールド更新
  const updateField = <T extends keyof SleepRecordData>(
    field: T,
    value: SleepRecordData[T]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set(prev).add(field));
    
    // エラーをクリア
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // メタデータ更新
  const updateMetadata = <T extends keyof SleepMetadata>(
    field: T,
    value: SleepMetadata[T]
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

  // 進行中睡眠の切り替え
  const handleOngoingToggle = (ongoing: boolean) => {
    setIsOngoing(ongoing);
    if (ongoing) {
      updateMetadata('end_time', undefined);
      updateMetadata('duration_minutes', undefined);
    } else {
      // 現在時刻を終了時刻として設定
      const now = new Date();
      updateMetadata('end_time', now.toISOString());
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

    // 開始時刻
    if (!formData.metadata.start_time) {
      newErrors.start_time = '開始時刻は必須です';
    } else {
      const startTime = new Date(formData.metadata.start_time);
      if (startTime > new Date()) {
        newErrors.start_time = '未来の時刻は指定できません';
      }
    }

    // 終了時刻（進行中でない場合）
    if (!isOngoing) {
      if (!formData.metadata.end_time) {
        newErrors.end_time = '終了時刻は必須です';
      } else {
        const endTime = new Date(formData.metadata.end_time);
        const startTime = new Date(formData.metadata.start_time);
        
        if (endTime > new Date()) {
          newErrors.end_time = '未来の時刻は指定できません';
        } else if (endTime <= startTime) {
          newErrors.end_time = '終了時刻は開始時刻より後にしてください';
        }
      }
    }

    // 睡眠の質
    if (!formData.metadata.quality) {
      newErrors.quality = '睡眠の質の選択は必須です';
    }

    // 睡眠場所
    if (!formData.metadata.location) {
      newErrors.location = '睡眠場所の選択は必須です';
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
        'metadata.start_time',
        'metadata.end_time',
        'metadata.quality',
        'metadata.location',
        'metadata.note',
      ]);
      setTouchedFields(allFields);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('睡眠記録の保存に失敗しました:', error);
    }
  };

  // 睡眠時間のフォーマット
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins}分`;
  };

  // 記録者選択肢
  const recordedByOptions: { value: RecordedBy; label: string }[] = [
    { value: 'mama', label: 'ママ' },
    { value: 'papa', label: 'パパ' },
    { value: 'unknown', label: 'その他' },
  ];

  // 睡眠の質選択肢
  const qualityOptions: { 
    value: SleepQuality; 
    label: string; 
    description: string;
    icon: string;
    color: string;
  }[] = [
    { 
      value: 'good', 
      label: 'よく眠れた', 
      description: 'ぐっすり眠った',
      icon: '😴',
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    { 
      value: 'normal', 
      label: '普通', 
      description: '普通に眠った',
      icon: '😊',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    { 
      value: 'poor', 
      label: 'あまり眠れず', 
      description: '途中で起きた',
      icon: '😵',
      color: 'bg-orange-50 border-orange-200 text-orange-800'
    },
  ];

  // 睡眠場所選択肢
  const locationOptions: { 
    value: SleepLocation; 
    label: string; 
    icon: string;
  }[] = [
    { value: 'crib', label: 'ベビーベッド', icon: '🛏️' },
    { value: 'arms', label: '抱っこ', icon: '🤱' },
    { value: 'stroller', label: 'ベビーカー', icon: '🚼' },
    { value: 'other', label: 'その他', icon: '📍' },
  ];

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <RecordTypeIcon type="sleep" size="lg" variant="emoji" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">睡眠記録</h2>
          <p className="text-sm text-gray-600">睡眠時間や質を記録します</p>
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
                  ? 'border-sleep bg-sleep-light text-sleep-dark'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
                focus:outline-none focus:ring-2 focus:ring-sleep focus:ring-opacity-50
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

      {/* 進行中の睡眠切り替え */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Icon name="clock" size="sm" className="text-sleep" />
          <span className="font-medium text-gray-900">睡眠状態</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOngoingToggle(true)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 text-center
              ${isOngoing
                ? 'border-sleep bg-sleep-light text-sleep-dark'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }
            `}
          >
            <div className="font-medium">進行中</div>
            <div className="text-xs mt-1">まだ寝ている</div>
          </button>
          <button
            type="button"
            onClick={() => handleOngoingToggle(false)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 text-center
              ${!isOngoing
                ? 'border-sleep bg-sleep-light text-sleep-dark'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }
            `}
          >
            <div className="font-medium">完了</div>
            <div className="text-xs mt-1">起きた</div>
          </button>
        </div>
      </div>

      {/* 睡眠時刻 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 開始時刻 */}
        <div>
          <DatePicker
            value={formData.metadata.start_time ? new Date(formData.metadata.start_time) : undefined}
            onChange={(date) => updateMetadata('start_time', date.toISOString())}
            includeTime
            label="開始時刻"
            placeholder="睡眠開始時刻を選択"
            maxDate={new Date()}
            error={touchedFields.has('metadata.start_time') ? errors.start_time : undefined}
          />
        </div>

        {/* 終了時刻 */}
        <div>
          <DatePicker
            value={formData.metadata.end_time ? new Date(formData.metadata.end_time) : undefined}
            onChange={(date) => updateMetadata('end_time', date.toISOString())}
            includeTime
            label="終了時刻"
            placeholder="睡眠終了時刻を選択"
            maxDate={new Date()}
            disabled={isOngoing}
            error={touchedFields.has('metadata.end_time') ? errors.end_time : undefined}
          />
          {isOngoing && (
            <p className="mt-1 text-sm text-gray-500">進行中のため終了時刻は設定されません</p>
          )}
        </div>
      </div>

      {/* 睡眠時間表示 */}
      {formData.metadata.duration_minutes && (
        <div className="p-4 bg-sleep-light rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="moon" size="sm" className="text-sleep" />
            <span className="font-medium text-sleep-dark">
              睡眠時間: {formatDuration(formData.metadata.duration_minutes)}
            </span>
          </div>
        </div>
      )}

      {/* 睡眠の質 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          睡眠の質 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {qualityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateMetadata('quality', option.value)}
              className={`
                w-full flex items-center p-4 rounded-lg border-2 transition-all duration-200
                ${formData.metadata.quality === option.value
                  ? `${option.color} border-current`
                  : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }
                focus:outline-none focus:ring-2 focus:ring-sleep focus:ring-opacity-50
              `}
            >
              <div className="text-2xl mr-3">{option.icon}</div>
              <div className="flex-1 text-left">
                <div className="font-medium">{option.label}</div>
                <div className="text-sm opacity-75">{option.description}</div>
              </div>
              {formData.metadata.quality === option.value && (
                <Icon name="check" size="sm" className="text-current" />
              )}
            </button>
          ))}
        </div>
        {touchedFields.has('metadata.quality') && errors.quality && (
          <p className="mt-1 text-sm text-red-600">{errors.quality}</p>
        )}
      </div>

      {/* 睡眠場所 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          睡眠場所 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {locationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateMetadata('location', option.value)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-center
                ${formData.metadata.location === option.value
                  ? 'border-sleep bg-sleep-light text-sleep-dark'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
                focus:outline-none focus:ring-2 focus:ring-sleep focus:ring-opacity-50
              `}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-medium text-sm">{option.label}</div>
            </button>
          ))}
        </div>
        {touchedFields.has('metadata.location') && errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
        )}
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メモ [任意]
        </label>
        <textarea
          value={formData.metadata.note || ''}
          onChange={(e) => updateMetadata('note', e.target.value)}
          placeholder="寝つきの様子や夜泣きの有無など、気づいたことを記録できます"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sleep focus:border-sleep resize-none"
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

export default SleepRecordForm;