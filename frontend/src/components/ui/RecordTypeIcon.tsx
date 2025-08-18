/**
 * 記録タイプ専用アイコンコンポーネント
 * 視覚的に分かりやすい絵文字 + SVGアイコンの組み合わせ
 */

import React from 'react';
import { Baby, Droplets, Moon, TrendingUp } from 'lucide-react';
import type { RecordType } from '@/types';

export type RecordIconSize = 'sm' | 'md' | 'lg' | 'xl';
export type RecordIconVariant = 'emoji' | 'outline' | 'filled';

interface RecordTypeIconProps {
  type: RecordType;
  size?: RecordIconSize;
  variant?: RecordIconVariant;
  className?: string;
  showLabel?: boolean;
}

// 記録タイプ別の絵文字
const emojiMap: Record<RecordType, string> = {
  milk: '🍼',
  diaper: '👶',
  sleep: '💤',
  growth: '📏',
};

// 記録タイプ別のラベル
const labelMap: Record<RecordType, string> = {
  milk: 'ミルク',
  diaper: 'おむつ',
  sleep: '睡眠',
  growth: '成長',
};

// 記録タイプ別のアウトラインアイコン
const outlineIconMap: Record<RecordType, React.ComponentType<{ className?: string }>> = {
  milk: Baby,
  diaper: Droplets,
  sleep: Moon,
  growth: TrendingUp,
};

// サイズマッピング
const sizeMap: Record<RecordIconSize, { 
  emoji: string; 
  icon: string; 
  container: string;
  text: string;
}> = {
  sm: {
    emoji: 'text-sm',
    icon: 'w-4 h-4',
    container: 'w-6 h-6',
    text: 'text-xs',
  },
  md: {
    emoji: 'text-lg',
    icon: 'w-5 h-5',
    container: 'w-8 h-8',
    text: 'text-sm',
  },
  lg: {
    emoji: 'text-xl',
    icon: 'w-6 h-6',
    container: 'w-10 h-10',
    text: 'text-base',
  },
  xl: {
    emoji: 'text-2xl',
    icon: 'w-8 h-8',
    container: 'w-12 h-12',
    text: 'text-lg',
  },
};

export function RecordTypeIcon({
  type,
  size = 'md',
  variant = 'emoji',
  className = '',
  showLabel = false,
  ...props
}: RecordTypeIconProps) {
  const sizes = sizeMap[size];
  
  // 記録タイプ別のカラークラス
  const colorClass = `text-${type}`;
  const bgColorClass = `bg-${type}-light`;
  
  const renderIcon = () => {
    if (variant === 'emoji') {
      return (
        <div 
          className={`${sizes.container} ${bgColorClass} rounded-full flex items-center justify-center ${className}`}
          {...props}
        >
          <span className={sizes.emoji} role="img" aria-label={labelMap[type]}>
            {emojiMap[type]}
          </span>
        </div>
      );
    }
    
    if (variant === 'outline') {
      const IconComponent = outlineIconMap[type];
      return (
        <div 
          className={`${sizes.container} border-2 border-${type} rounded-full flex items-center justify-center ${className}`}
          {...props}
        >
          <IconComponent className={`${sizes.icon} ${colorClass}`} />
        </div>
      );
    }
    
    if (variant === 'filled') {
      const IconComponent = outlineIconMap[type];
      return (
        <div 
          className={`${sizes.container} ${bgColorClass} rounded-full flex items-center justify-center ${className}`}
          {...props}
        >
          <IconComponent className={`${sizes.icon} ${colorClass}`} />
        </div>
      );
    }
    
    return null;
  };

  if (showLabel) {
    return (
      <div className="flex flex-col items-center gap-1">
        {renderIcon()}
        <span className={`${sizes.text} ${colorClass} font-medium`}>
          {labelMap[type]}
        </span>
      </div>
    );
  }

  return renderIcon();
}

// 便利関数: 記録タイプから絵文字を取得
export function getRecordTypeEmoji(type: RecordType): string {
  return emojiMap[type];
}

// 便利関数: 記録タイプからラベルを取得
export function getRecordTypeLabel(type: RecordType): string {
  return labelMap[type];
}

// 記録タイプ一覧表示用コンポーネント
interface RecordTypeGridProps {
  types: RecordType[];
  selectedType?: RecordType;
  onTypeSelect?: (type: RecordType) => void;
  size?: RecordIconSize;
  variant?: RecordIconVariant;
  showLabels?: boolean;
  className?: string;
}

export function RecordTypeGrid({
  types,
  selectedType,
  onTypeSelect,
  size = 'md',
  variant = 'emoji',
  showLabels = true,
  className = '',
}: RecordTypeGridProps) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeSelect?.(type)}
          className={`
            p-3 rounded-lg border-2 transition-all duration-200
            ${selectedType === type 
              ? `border-${type} bg-${type}-light shadow-md scale-105` 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }
            focus:outline-none focus:ring-2 focus:ring-${type} focus:ring-opacity-50
          `}
        >
          <RecordTypeIcon
            type={type}
            size={size}
            variant={variant}
            showLabel={showLabels}
            className="mx-auto"
          />
        </button>
      ))}
    </div>
  );
}

export default RecordTypeIcon;