import React from 'react';
import styled from 'styled-components';

// 基本的なアイコンマップ
export const iconMap = {
  // 記録タイプアイコン
  milk: '🍼',
  diaper: '👶',
  sleep: '😴',
  vaccination: '💉',
  growth: '📏',
  
  // アクションアイコン
  add: '➕',
  edit: '✏️',
  delete: '🗑️',
  filter: '🔽',
  search: '🔍',
  sort: '↕️',
  check: '✅',
  close: '❌',
  undo: '↶',
  
  // 状態アイコン
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  
  // ナビゲーションアイコン
  home: '🏠',
  records: '📝',
  analytics: '📊',
  settings: '⚙️',
  profile: '👤',
  
  // その他
  calendar: '📅',
  time: '🕐',
  baby: '👶',
  heart: '💕',
} as const;

export type IconName = keyof typeof iconMap;

export interface IconProps {
  name: IconName;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  'aria-label'?: string;
}

const StyledIcon = styled.span.withConfig({
  shouldForwardProp: (prop) => !['size'].includes(prop),
})<{ size: 'sm' | 'md' | 'lg' | 'xl' }>`
  display: inline-block;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `font-size: 0.875rem;`;
      case 'lg':
        return `font-size: 1.125rem;`;
      case 'xl':
        return `font-size: 1.25rem;`;
      default:
        return `font-size: 1rem;`;
    }
  }}
`;

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md',
  'aria-label': ariaLabel,
  ...props 
}) => {
  return (
    <StyledIcon 
      size={size}
      role="img"
      aria-label={ariaLabel || `${name} icon`}
      {...props}
    >
      {iconMap[name]}
    </StyledIcon>
  );
};

export default Icon;