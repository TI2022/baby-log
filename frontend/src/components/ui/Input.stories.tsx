import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import { Input } from './Input';
import { theme } from '@/styles/theme';

// Styled components for Storybook layouts
const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  width: 320px;
`;

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'datetime-local', 'date'],
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '入力してください',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'お名前',
    placeholder: '山田太郎',
  },
};

export const WithError: Story = {
  args: {
    label: 'メールアドレス',
    placeholder: 'example@example.com',
    error: '有効なメールアドレスを入力してください',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    label: 'メールアドレス',
    placeholder: 'your@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    label: 'パスワード',
    placeholder: '6文字以上で入力してください',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    label: '量 (ml)',
    placeholder: '120',
    min: 0,
    step: 10,
  },
};

export const DateTime: Story = {
  args: {
    type: 'datetime-local',
    label: '日時',
  },
};

export const Required: Story = {
  args: {
    label: '必須項目',
    placeholder: '必須項目です',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: '無効化',
    value: '編集できません',
    disabled: true,
  },
};

// 各種状態を一覧表示
export const AllStates: Story = {
  render: () => (
    <StoryContainer>
      <Input label="通常" placeholder="通常の入力フィールド" />
      <Input label="入力済み" value="入力されたテキスト" />
      <Input label="エラー" error="エラーメッセージ" />
      <Input label="必須" required placeholder="必須項目" />
      <Input label="無効化" disabled value="編集不可" />
      <Input type="email" label="メール" placeholder="email@example.com" />
      <Input type="password" label="パスワード" />
      <Input type="number" label="数値" placeholder="0" />
    </StoryContainer>
  ),
};