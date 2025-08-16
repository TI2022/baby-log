import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  QuickActionButton, 
  QuickActionGrid, 
  QuickActionRow 
} from './QuickActionButton';
import type { RecordType } from '@/types';

const meta: Meta<typeof QuickActionButton> = {
  title: 'UI/QuickActionButton',
  component: QuickActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['milk', 'diaper', 'sleep', 'growth'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['filled', 'outline', 'ghost'],
    },
    icon: {
      control: 'select',
      options: ['record-type', 'plus'],
    },
    showLabel: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'milk',
    size: 'md',
    variant: 'filled',
    showLabel: true,
    onClick: () => console.log('Button clicked'),
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex gap-4">
      <QuickActionButton 
        type="milk" 
        onClick={() => console.log('Milk clicked')} 
      />
      <QuickActionButton 
        type="diaper" 
        onClick={() => console.log('Diaper clicked')} 
      />
      <QuickActionButton 
        type="sleep" 
        onClick={() => console.log('Sleep clicked')} 
      />
      <QuickActionButton 
        type="growth" 
        onClick={() => console.log('Growth clicked')} 
      />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Filled</h3>
        <div className="flex gap-4">
          <QuickActionButton type="milk" variant="filled" />
          <QuickActionButton type="diaper" variant="filled" />
          <QuickActionButton type="sleep" variant="filled" />
          <QuickActionButton type="growth" variant="filled" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Outline</h3>
        <div className="flex gap-4">
          <QuickActionButton type="milk" variant="outline" />
          <QuickActionButton type="diaper" variant="outline" />
          <QuickActionButton type="sleep" variant="outline" />
          <QuickActionButton type="growth" variant="outline" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Ghost</h3>
        <div className="flex gap-4">
          <QuickActionButton type="milk" variant="ghost" />
          <QuickActionButton type="diaper" variant="ghost" />
          <QuickActionButton type="sleep" variant="ghost" />
          <QuickActionButton type="growth" variant="ghost" />
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <div key={size}>
          <h3 className="text-sm font-medium mb-3 text-gray-600 capitalize">{size}</h3>
          <div className="flex gap-4 items-end">
            <QuickActionButton type="milk" size={size} />
            <QuickActionButton type="diaper" size={size} />
            <QuickActionButton type="sleep" size={size} />
            <QuickActionButton type="growth" size={size} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const WithoutLabels: Story = {
  render: () => (
    <div className="flex gap-4">
      <QuickActionButton type="milk" showLabel={false} />
      <QuickActionButton type="diaper" showLabel={false} />
      <QuickActionButton type="sleep" showLabel={false} />
      <QuickActionButton type="growth" showLabel={false} />
    </div>
  ),
};

export const PlusIcon: Story = {
  render: () => (
    <div className="flex gap-4">
      <QuickActionButton type="milk" icon="plus" />
      <QuickActionButton type="diaper" icon="plus" />
      <QuickActionButton type="sleep" icon="plus" />
      <QuickActionButton type="growth" icon="plus" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Normal</h3>
        <div className="flex gap-4">
          <QuickActionButton type="milk" />
          <QuickActionButton type="diaper" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Loading</h3>
        <div className="flex gap-4">
          <QuickActionButton type="milk" isLoading />
          <QuickActionButton type="diaper" isLoading />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Disabled</h3>
        <div className="flex gap-4">
          <QuickActionButton type="milk" disabled />
          <QuickActionButton type="diaper" disabled />
        </div>
      </div>
    </div>
  ),
};

// Grid Stories
const GridMeta: Meta<typeof QuickActionGrid> = {
  title: 'UI/QuickActionGrid',
  component: QuickActionGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

function GridComponent() {
  const [loadingStates, setLoadingStates] = React.useState<Partial<Record<RecordType, boolean>>>({});

  const handleActionClick = (type: RecordType) => {
    console.log(`${type} clicked`);
    setLoadingStates(prev => ({ ...prev, [type]: true }));
    
    // Simulate API call
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  return (
    <div className="w-80">
      <QuickActionGrid
        onActionClick={handleActionClick}
        loadingStates={loadingStates}
        size="md"
        variant="filled"
        showLabels={true}
      />
    </div>
  );
}

export const Grid: StoryObj<typeof QuickActionGrid> = {
  render: () => <GridComponent />,
};

export const GridOutline: StoryObj<typeof QuickActionGrid> = {
  args: {
    onActionClick: (type) => console.log(`${type} clicked`),
    variant: 'outline',
    size: 'lg',
  },
  render: (args) => (
    <div className="w-80">
      <QuickActionGrid {...args} />
    </div>
  ),
};

export const Row: StoryObj<typeof QuickActionRow> = {
  args: {
    onActionClick: (type) => console.log(`${type} clicked`),
    size: 'sm',
    variant: 'outline',
    showLabels: false,
  },
  render: (args) => (
    <div className="w-80">
      <QuickActionRow {...args} />
    </div>
  ),
};