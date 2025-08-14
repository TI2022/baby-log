import { ButtonHTMLAttributes, forwardRef } from 'react';
import styled from 'styled-components';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size'].includes(prop),
})<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  border: none;
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }
  
  /* Size variants */
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        `;
      case 'lg':
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1.125rem;
        `;
      default:
        return `
          padding: 0.5rem 1rem;
          font-size: 1rem;
        `;
    }
  }}
  
  /* Color variants */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return `
          background-color: ${theme.colors.gray[200]};
          color: ${theme.colors.gray[900]};
          &:hover {
            background-color: ${theme.colors.gray[300]};
          }
          &:focus {
            ring-color: ${theme.colors.gray[500]};
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.error};
          color: white;
          &:hover {
            background-color: #dc2626;
          }
          &:focus {
            ring-color: ${theme.colors.error};
          }
        `;
      case 'outline':
        return `
          background-color: ${theme.colors.background};
          color: ${theme.colors.gray[700]};
          border: 1px solid ${theme.colors.gray[300]};
          &:hover {
            background-color: ${theme.colors.gray[50]};
          }
          &:focus {
            ring-color: ${theme.colors.primary[500]};
          }
        `;
      default:
        return `
          background-color: ${theme.colors.primary[600]};
          color: white;
          &:hover {
            background-color: ${theme.colors.primary[700]};
            transform: translateY(-1px);
          }
          &:focus {
            ring-color: ${theme.colors.primary[500]};
          }
        `;
    }
  }}
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';