'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing['2xl']};
`;

export const WelcomeSection = styled.div`
  text-align: center;
`;

export const WelcomeTitle = styled.h2`
  font-size: ${theme.fontSize['3xl']};
  font-weight: bold;
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.sm};
`;

export const WelcomeText = styled.p`
  color: ${theme.colors.gray[600]};
  margin: 0;
`;