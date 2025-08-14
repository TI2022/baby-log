import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Button } from './Button';
import { theme } from '@/styles/theme';

// Styled components for Storybook layouts
const StoryWrapper = styled.div`
  width: 384px; // w-96 equivalent
`;

const CardTitleWithIcon = styled(CardTitle)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const RecordDate = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.sm};
`;

const RecordDetails = styled.div`
  font-size: ${theme.fontSize.sm};
`;

const RecordNote = styled.p`
  margin-top: ${theme.spacing.sm};
  font-style: italic;
  color: ${theme.colors.gray[700]};
`;

const ActionContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const EmptyText = styled.p`
  text-align: center;
  color: ${theme.colors.gray[500]};
  padding: ${theme.spacing['2xl']} 0;
`;

const LoadingBar = styled.div<{ $width: string; $height: string; $marginBottom?: string }>`
  height: ${props => props.$height};
  background-color: ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.default};
  width: ${props => props.$width};
  margin-bottom: ${props => props.$marginBottom || '0'};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const MultipleCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <p>基本的なカードです。</p>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>カードタイトル</CardTitle>
      </CardHeader>
      <CardContent>
        <p>ヘッダー付きのカードです。タイトルが設定されています。</p>
      </CardContent>
    </Card>
  ),
};

export const RecordCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitleWithIcon>
          <span>🍼</span>
          ミルク
        </CardTitleWithIcon>
      </CardHeader>
      <CardContent>
        <RecordDate>
          2024年1月15日 10:30
        </RecordDate>
        <RecordDetails>
          <p>量: 120 ml</p>
          <RecordNote>
            メモ: 順調に飲みました
          </RecordNote>
        </RecordDetails>
      </CardContent>
    </Card>
  ),
};

export const ActionCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>設定</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ marginBottom: theme.spacing.lg }}>アカウント設定を管理します。</p>
        <ActionContainer>
          <Button variant="primary" size="sm">編集</Button>
          <Button variant="outline" size="sm">キャンセル</Button>
        </ActionContainer>
      </CardContent>
    </Card>
  ),
};

export const LoadingCard: Story = {
  render: () => (
    <Card>
      <CardContent>
        <LoadingBar $width="25%" $height="1rem" $marginBottom={theme.spacing.sm} />
        <LoadingBar $width="50%" $height="1.5rem" />
      </CardContent>
    </Card>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Card>
      <CardContent>
        <EmptyText>
          まだ記録がありません
        </EmptyText>
      </CardContent>
    </Card>
  ),
};

// 複数カードのレイアウト例
export const MultipleCards: Story = {
  render: () => (
    <MultipleCardsContainer>
      <Card>
        <CardHeader>
          <CardTitleWithIcon>
            <span>🍼</span>
            ミルク
          </CardTitleWithIcon>
        </CardHeader>
        <CardContent>
          <RecordDate>2024年1月15日 10:30</RecordDate>
          <RecordDetails>量: 120 ml</RecordDetails>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitleWithIcon>
            <span>👶</span>
            おむつ
          </CardTitleWithIcon>
        </CardHeader>
        <CardContent>
          <RecordDate>2024年1月15日 08:15</RecordDate>
          <RecordDetails>種類: おしっこ</RecordDetails>
        </CardContent>
      </Card>
    </MultipleCardsContainer>
  ),
};