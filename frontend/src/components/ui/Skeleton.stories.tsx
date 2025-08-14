import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'rectangular', 'circular'],
    },
    width: {
      control: 'text',
    },
    height: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant: 'text',
    width: '200px',
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: '200px',
    height: '100px',
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: '60px',
    height: '60px',
  },
};

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ width: '300px', padding: '24px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <Skeleton variant="circular" width="40px" height="40px" />
        <div style={{ marginLeft: '12px', flex: 1 }}>
          <Skeleton variant="text" width="60%" height="16px" style={{ marginBottom: '8px' }} />
          <Skeleton variant="text" width="40%" height="14px" />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height="80px" style={{ marginBottom: '12px' }} />
      <Skeleton variant="text" width="80%" height="14px" style={{ marginBottom: '8px' }} />
      <Skeleton variant="text" width="60%" height="14px" />
    </div>
  ),
};

export const ListSkeleton: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ 
          padding: '16px', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Skeleton variant="circular" width="48px" height="48px" />
          <div style={{ marginLeft: '16px', flex: 1 }}>
            <Skeleton variant="text" width="70%" height="16px" style={{ marginBottom: '8px' }} />
            <Skeleton variant="text" width="50%" height="14px" />
          </div>
        </div>
      ))}
    </div>
  ),
};