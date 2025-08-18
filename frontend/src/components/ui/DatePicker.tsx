/**
 * DatePicker - 日付・時刻選択コンポーネント
 * Tailwind CSS使用（サーバーコンポーネント対応）
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  includeTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// 曜日ラベル
const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

// 月ラベル
const months = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

// サイズ別スタイル
const sizeStyles = {
  sm: {
    input: 'px-3 py-2 text-sm',
    button: 'h-8 w-8 text-sm',
    calendar: 'text-sm',
  },
  md: {
    input: 'px-4 py-3 text-base',
    button: 'h-10 w-10 text-base',
    calendar: 'text-base',
  },
  lg: {
    input: 'px-5 py-4 text-lg',
    button: 'h-12 w-12 text-lg',
    calendar: 'text-lg',
  },
};

export function DatePicker({
  value,
  onChange,
  includeTime = false,
  minDate,
  maxDate,
  placeholder = '日付を選択',
  disabled = false,
  error,
  label,
  className = '',
  size = 'md',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value.getFullYear(), value.getMonth()) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState({
    hours: value?.getHours() || 12,
    minutes: value?.getMinutes() || 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const sizeStyle = sizeStyles[size];

  // 外部クリックでカレンダーを閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // 日付フォーマット
  const formatDate = (date: Date) => {
    if (includeTime) {
      return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // 月の日数を取得
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // 月の最初の日の曜日を取得
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // 日付選択ハンドラー
  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      selectedTime.hours,
      selectedTime.minutes
    );

    // 日付制限チェック
    if (minDate && newDate < minDate) return;
    if (maxDate && newDate > maxDate) return;

    onChange?.(newDate);
    if (!includeTime) {
      setIsOpen(false);
    }
  };

  // 時刻変更ハンドラー
  const handleTimeChange = (type: 'hours' | 'minutes', value: number) => {
    const newTime = { ...selectedTime, [type]: value };
    setSelectedTime(newTime);

    if (value) {
      const newDate = new Date(
        value?.getFullYear() || currentMonth.getFullYear(),
        value?.getMonth() || currentMonth.getMonth(),
        value?.getDate() || 1,
        newTime.hours,
        newTime.minutes
      );
      onChange?.(newDate);
    }
  };

  // カレンダーの日付生成
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // 前月の日付
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 当月の日付
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isDisabled = 
        (minDate && date < minDate) || 
        (maxDate && date > maxDate);
      const isSelected = 
        value && 
        date.toDateString() === value.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();

      days.push({
        day,
        date,
        isDisabled,
        isSelected,
        isToday,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {/* 入力フィールド */}
      <div className="relative">
        <input
          type="text"
          value={value ? formatDate(value) : ''}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full border rounded-lg bg-white cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${sizeStyle.input}
          `}
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Icon name="calendar" size={size === 'lg' ? 'md' : 'sm'} />
        </button>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* カレンダードロップダウン */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Icon name="chevron-left" size="sm" />
            </button>
            
            <h3 className="text-lg font-semibold">
              {currentMonth.getFullYear()}年{months[currentMonth.getMonth()]}
            </h3>
            
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Icon name="chevron-right" size="sm" />
            </button>
          </div>

          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* カレンダーグリッド */}
          <div className="grid grid-cols-7">
            {calendarDays.map((dayData, index) => (
              <div key={index} className="aspect-square">
                {dayData && (
                  <button
                    type="button"
                    onClick={() => handleDateSelect(dayData.day)}
                    disabled={dayData.isDisabled}
                    className={`
                      w-full h-full flex items-center justify-center text-sm
                      hover:bg-gray-100 transition-colors
                      ${dayData.isSelected ? 'bg-primary-500 text-white hover:bg-primary-600' : ''}
                      ${dayData.isToday && !dayData.isSelected ? 'bg-gray-100 font-semibold' : ''}
                      ${dayData.isDisabled ? 'text-gray-300 cursor-not-allowed hover:bg-transparent' : ''}
                    `}
                  >
                    {dayData.day}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 時刻選択 */}
          {includeTime && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">時:</label>
                  <select
                    value={selectedTime.hours}
                    onChange={(e) => handleTimeChange('hours', parseInt(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">分:</label>
                  <select
                    value={selectedTime.minutes}
                    onChange={(e) => handleTimeChange('minutes', parseInt(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                  確定
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 時刻のみのピッカー
export interface TimePickerProps {
  value?: { hours: number; minutes: number };
  onChange?: (time: { hours: number; minutes: number }) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TimePicker({
  value = { hours: 12, minutes: 0 },
  onChange,
  disabled = false,
  error,
  label,
  className = '',
  size = 'md',
}: TimePickerProps) {
  const sizeStyle = sizeStyles[size];

  const handleChange = (type: 'hours' | 'minutes', newValue: number) => {
    const newTime = { ...value, [type]: newValue };
    onChange?.(newTime);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">時:</label>
          <select
            value={value.hours}
            onChange={(e) => handleChange('hours', parseInt(e.target.value))}
            disabled={disabled}
            className={`
              border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : ''}
              ${sizeStyle.input}
            `}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">分:</label>
          <select
            value={value.minutes}
            onChange={(e) => handleChange('minutes', parseInt(e.target.value))}
            disabled={disabled}
            className={`
              border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : ''}
              ${sizeStyle.input}
            `}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default DatePicker;