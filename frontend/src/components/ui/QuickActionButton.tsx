/**
 * QuickActionButton - 記録追加のクイックアクションボタン
 * Tailwind CSS使用（サーバーコンポーネント対応）
 */

import React from 'react';
import { Icon, RecordTypeIcon } from '@/components/ui';
import type { RecordType } from '@/types';

export interface QuickActionButtonProps {
  type: RecordType;
  label?: string;
  icon?: 'record-type' | 'plus';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline' | 'ghost';
  showLabel?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

// 記録タイプ別のスタイル設定
const typeStyles: Record<RecordType, {
  filled: string;
  outline: string;
  ghost: string;
}> = {
  milk: {
    filled: 'bg-milk text-white hover:bg-milk-dark focus:ring-milk/50',
    outline: 'border-milk text-milk hover:bg-milk-light focus:ring-milk/50',
    ghost: 'text-milk hover:bg-milk-light focus:ring-milk/50',
  },
  diaper: {
    filled: 'bg-diaper text-white hover:bg-diaper-dark focus:ring-diaper/50',
    outline: 'border-diaper text-diaper hover:bg-diaper-light focus:ring-diaper/50',
    ghost: 'text-diaper hover:bg-diaper-light focus:ring-diaper/50',
  },
  sleep: {
    filled: 'bg-sleep text-white hover:bg-sleep-dark focus:ring-sleep/50',
    outline: 'border-sleep text-sleep hover:bg-sleep-light focus:ring-sleep/50',
    ghost: 'text-sleep hover:bg-sleep-light focus:ring-sleep/50',
  },
  growth: {
    filled: 'bg-growth text-white hover:bg-growth-dark focus:ring-growth/50',
    outline: 'border-growth text-growth hover:bg-growth-light focus:ring-growth/50',
    ghost: 'text-growth hover:bg-growth-light focus:ring-growth/50',
  },
};

// サイズ別のスタイル
const sizeStyles = {
  sm: {
    button: 'px-3 py-2 text-sm gap-1.5',
    icon: 'sm' as const,
    recordIcon: 'sm' as const,
  },
  md: {
    button: 'px-4 py-3 text-base gap-2',
    icon: 'md' as const,
    recordIcon: 'md' as const,
  },
  lg: {
    button: 'px-6 py-4 text-lg gap-3',
    icon: 'lg' as const,
    recordIcon: 'lg' as const,
  },
};

// バリエーション別の基本スタイル
const variantBaseStyles = {
  filled: '',
  outline: 'border-2 bg-white',
  ghost: 'border-0 bg-transparent',
};

export function QuickActionButton({
  type,
  label,
  icon = 'record-type',
  size = 'md',
  variant = 'filled',
  showLabel = true,
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}: QuickActionButtonProps) {
  const sizeStyle = sizeStyles[size];
  const typeStyle = typeStyles[type][variant];
  const variantBaseStyle = variantBaseStyles[variant];
  
  // デフォルトラベル
  const recordLabels: Record<RecordType, string> = {
    milk: 'ミルク',
    diaper: 'おむつ',
    sleep: '睡眠',
    growth: '成長',
  };
  
  const displayLabel = label || recordLabels[type];
  
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-xl
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-95
    ${sizeStyle.button}
    ${variantBaseStyle}
    ${typeStyle}
    ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClick = () => {
    if (!disabled && !isLoading && onClick) {
      onClick();
    }
  };

  const renderIcon = () => {
    if (isLoading) {
      return (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${
          size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
        }`} />
      );
    }

    if (icon === 'record-type') {
      return (
        <RecordTypeIcon
          type={type}
          size={sizeStyle.recordIcon}
          variant="emoji"
        />
      );
    }

    return (
      <Icon
        name="plus"
        size={sizeStyle.icon}
        color="current"
      />
    );
  };

  const content = (
    <>
      {renderIcon()}
      {showLabel && (
        <span className={isLoading ? 'opacity-0' : ''}>
          {displayLabel}
        </span>
      )}
      {isLoading && showLabel && (
        <span className="absolute">記録中...</span>
      )}
    </>
  );

  return (
    <button
      type="button"
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-label={`${displayLabel}を記録`}
      {...props}
    >
      {content}
    </button>
  );
}

// 記録タイプのグリッド表示コンポーネント
interface QuickActionGridProps {
  onActionClick: (type: RecordType) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline' | 'ghost';
  showLabels?: boolean;
  loadingStates?: Partial<Record<RecordType, boolean>>;
  disabledTypes?: RecordType[];
  className?: string;
}

export function QuickActionGrid({
  onActionClick,
  size = 'md',
  variant = 'filled',
  showLabels = true,
  loadingStates = {},
  disabledTypes = [],
  className = '',
}: QuickActionGridProps) {
  const recordTypes: RecordType[] = ['milk', 'diaper', 'sleep', 'growth'];

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {recordTypes.map((type) => (
        <QuickActionButton
          key={type}
          type={type}
          size={size}
          variant={variant}
          showLabel={showLabels}
          isLoading={loadingStates[type] || false}
          disabled={disabledTypes.includes(type)}
          onClick={() => onActionClick(type)}
          className="w-full"
        />
      ))}
    </div>
  );
}

// 水平レイアウト版
export function QuickActionRow({
  onActionClick,
  size = 'sm',
  variant = 'outline',
  showLabels = false,
  loadingStates = {},
  disabledTypes = [],
  className = '',
}: QuickActionGridProps) {
  const recordTypes: RecordType[] = ['milk', 'diaper', 'sleep', 'growth'];

  return (
    <div className={`flex gap-2 overflow-x-auto ${className}`}>
      {recordTypes.map((type) => (
        <QuickActionButton
          key={type}
          type={type}
          size={size}
          variant={variant}
          showLabel={showLabels}
          isLoading={loadingStates[type] || false}
          disabled={disabledTypes.includes(type)}
          onClick={() => onActionClick(type)}
          className="flex-shrink-0"
        />
      ))}
    </div>
  );
}

export default QuickActionButton;