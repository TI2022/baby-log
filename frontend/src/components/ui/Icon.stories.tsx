import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'milk', 'diaper', 'sleep', 'growth',
        'plus', 'edit', 'trash', 'search', 'filter',
        'calendar', 'clock', 'user', 'settings',
        'check', 'alert', 'info', 'heart', 'star',
        'home', 'stats', 'records', 'logout'
      ],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: [
        'current', 'primary', 'secondary', 'accent',
        'milk', 'diaper', 'sleep', 'growth',
        'success', 'warning', 'error', 'muted'
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'milk',
    size: 'md',
    color: 'current',
  },
};

export const RecordTypes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Icon name="milk" size="lg" color="milk" />
      <Icon name="diaper" size="lg" color="diaper" />
      <Icon name="sleep" size="lg" color="sleep" />
      <Icon name="growth" size="lg" color="growth" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="heart" size="xs" color="error" />
      <Icon name="heart" size="sm" color="error" />
      <Icon name="heart" size="md" color="error" />
      <Icon name="heart" size="lg" color="error" />
      <Icon name="heart" size="xl" color="error" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <Icon name="star" size="lg" color="primary" />
      <Icon name="star" size="lg" color="secondary" />
      <Icon name="star" size="lg" color="accent" />
      <Icon name="star" size="lg" color="success" />
      <Icon name="star" size="lg" color="warning" />
      <Icon name="star" size="lg" color="error" />
      <Icon name="star" size="lg" color="muted" />
      <Icon name="star" size="lg" color="current" />
    </div>
  ),
};

export const Navigation: Story = {
  render: () => (
    <div className="flex gap-4">
      <Icon name="home" size="md" color="primary" />
      <Icon name="stats" size="md" color="primary" />
      <Icon name="records" size="md" color="primary" />
      <Icon name="settings" size="md" color="primary" />
      <Icon name="logout" size="md" color="error" />
    </div>
  ),
};

export const Actions: Story = {
  render: () => (
    <div className="flex gap-4">
      <Icon name="plus" size="md" color="success" />
      <Icon name="edit" size="md" color="primary" />
      <Icon name="trash" size="md" color="error" />
      <Icon name="search" size="md" color="muted" />
      <Icon name="filter" size="md" color="muted" />
    </div>
  ),
};