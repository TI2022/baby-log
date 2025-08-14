import { HTMLAttributes } from 'react';
import styled, { keyframes } from 'styled-components';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const StyledSkeleton = styled.div<SkeletonProps & { $variant?: 'text' | 'rectangular' | 'circular' }>`
  display: inline-block;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
  
  width: ${({ width }) => width || '100%'};
  height: ${({ height, $variant }) => {
    if (height) return height;
    switch ($variant) {
      case 'text':
        return '1em';
      case 'circular':
        return '40px';
      default:
        return '20px';
    }
  }};
  
  border-radius: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'circular':
        return '50%';
      case 'text':
        return theme.borderRadius.sm;
      default:
        return theme.borderRadius.md;
    }
  }};
`;

export function Skeleton({ 
  variant = 'rectangular', 
  width,
  height,
  ...props 
}: SkeletonProps) {
  return (
    <StyledSkeleton
      $variant={variant}
      width={width}
      height={height}
      {...props}
    />
  );
}