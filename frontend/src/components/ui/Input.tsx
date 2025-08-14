import { InputHTMLAttributes, forwardRef } from 'react';
import styled from 'styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ $hasError, theme }) => 
    $hasError ? theme.colors.error : theme.colors.gray[300]
  };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  font-size: ${({ theme }) => theme.fontSize.base};
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error : theme.colors.primary[500]
    };
    ring: 2px;
    ring-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.error : theme.colors.primary[500]
    };
    ring-opacity: 0.2;
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
  
  transition: border-color ${({ theme }) => theme.transitions.default},
              box-shadow ${({ theme }) => theme.transitions.default};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <InputContainer>
        {label && (
          <Label htmlFor={props.id}>
            {label}
          </Label>
        )}
        <StyledInput
          ref={ref}
          $hasError={!!error}
          {...props}
        />
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';