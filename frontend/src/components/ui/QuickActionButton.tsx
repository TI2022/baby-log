import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';

export interface QuickActionButtonProps {
  icon: IconName;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <ButtonContent>
        <Icon name={icon} size={size === 'sm' ? 'sm' : 'md'} />
        <span>{label}</span>
      </ButtonContent>
    </Button>
  );
};

export default QuickActionButton;