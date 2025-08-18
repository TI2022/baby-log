import React from 'react';
import { Icon, type IconName } from './Icon';

export type RecordType = 'milk' | 'diaper' | 'sleep' | 'vaccination' | 'growth';

export interface RecordTypeIconProps {
  type: RecordType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const RecordTypeIcon: React.FC<RecordTypeIconProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  return (
    <Icon
      name={type as IconName}
      size={size}
      className={className}
      aria-label={`${type} record`}
    />
  );
};

export default RecordTypeIcon;