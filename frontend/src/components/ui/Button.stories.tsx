import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import { Button } from './Button';
import { theme } from '@/styles/theme';

// Styled components for Storybook layouts
const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  align-items: center;
`;

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'ボタン',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'ボタン',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: '削除',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'キャンセル',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: '小サイズ',
  },
};

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: '中サイズ',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: '大サイズ',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: '無効化',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: '読み込み中...',
    disabled: true,
  },
};

// すべてのバリエーションを一覧表示
export const AllVariants: Story = {
  render: () => (
    <StoryContainer>
      <ButtonRow>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="outline">Outline</Button>
      </ButtonRow>
      <ButtonRow>
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </ButtonRow>
      <ButtonRow>
        <Button variant="primary" disabled>Disabled</Button>
      </ButtonRow>
    </StoryContainer>
  ),
};