'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const StyledBody = styled.body`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  background-color: ${theme.colors.gray[50]};
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const AppContainer = styled.div`
  min-height: 100vh;
`;

export const Header = styled.header`
  background-color: ${theme.colors.background};
  box-shadow: ${theme.shadows.sm};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

export const HeaderContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  
  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing.xl};
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    padding: 0 ${theme.spacing['2xl']};
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg} 0;
`;

export const Title = styled.h1`
  font-size: ${theme.fontSize['2xl']};
  font-weight: bold;
  color: ${theme.colors.gray[900]};
  margin: 0;
`;

export const Nav = styled.nav`
  /* ナビゲーション - 後で認証機能と連携 */
`;

export const Main = styled.main`
  max-width: 80rem;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
  
  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing['2xl']} ${theme.spacing.xl};
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    padding: ${theme.spacing['2xl']} ${theme.spacing['2xl']};
  }
`;