import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RecordTypeIcon, RecordTypeGrid } from './RecordTypeIcon';
import type { RecordType } from '@/types';

const meta: Meta<typeof RecordTypeIcon> = {
  title: 'UI/RecordTypeIcon',
  component: RecordTypeIcon,
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
      options: ['sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['emoji', 'outline', 'filled'],
    },
    showLabel: {
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
    variant: 'emoji',
    showLabel: false,
  },
};

export const WithLabel: Story = {
  args: {
    type: 'milk',
    size: 'md',
    variant: 'emoji',
    showLabel: true,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex gap-6">
      <RecordTypeIcon type="milk" size="lg" variant="emoji" showLabel />
      <RecordTypeIcon type="diaper" size="lg" variant="emoji" showLabel />
      <RecordTypeIcon type="sleep" size="lg" variant="emoji" showLabel />
      <RecordTypeIcon type="growth" size="lg" variant="emoji" showLabel />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Emoji</h3>
        <div className="flex gap-4">
          <RecordTypeIcon type="milk" size="lg" variant="emoji" />
          <RecordTypeIcon type="diaper" size="lg" variant="emoji" />
          <RecordTypeIcon type="sleep" size="lg" variant="emoji" />
          <RecordTypeIcon type="growth" size="lg" variant="emoji" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Outline</h3>
        <div className="flex gap-4">
          <RecordTypeIcon type="milk" size="lg" variant="outline" />
          <RecordTypeIcon type="diaper" size="lg" variant="outline" />
          <RecordTypeIcon type="sleep" size="lg" variant="outline" />
          <RecordTypeIcon type="growth" size="lg" variant="outline" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Filled</h3>
        <div className="flex gap-4">
          <RecordTypeIcon type="milk" size="lg" variant="filled" />
          <RecordTypeIcon type="diaper" size="lg" variant="filled" />
          <RecordTypeIcon type="sleep" size="lg" variant="filled" />
          <RecordTypeIcon type="growth" size="lg" variant="filled" />
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
        <div key={size}>
          <h3 className="text-sm font-medium mb-3 text-gray-600 capitalize">{size}</h3>
          <div className="flex gap-4 items-end">
            <RecordTypeIcon type="milk" size={size} variant="emoji" />
            <RecordTypeIcon type="diaper" size={size} variant="emoji" />
            <RecordTypeIcon type="sleep" size={size} variant="emoji" />
            <RecordTypeIcon type="growth" size={size} variant="emoji" />
          </div>
        </div>
      ))}
    </div>
  ),
};

// RecordTypeGrid の Story

export const Grid: StoryObj<typeof RecordTypeGrid> = {
  args: {
    types: ['milk', 'diaper', 'sleep', 'growth'] as RecordType[],
    selectedType: 'milk',
    size: 'md',
    variant: 'emoji',
    showLabels: true,
  },
  render: (args) => (
    <div className="w-64">
      <RecordTypeGrid {...args} />
    </div>
  ),
};

function GridInteractiveComponent() {
  const [selectedType, setSelectedType] = React.useState<RecordType>('milk');
  
  return (
    <div className="w-64">
      <RecordTypeGrid
        types={['milk', 'diaper', 'sleep', 'growth']}
        selectedType={selectedType}
        onTypeSelect={setSelectedType}
        size="lg"
        variant="emoji"
        showLabels={true}
      />
      <p className="mt-4 text-center text-sm text-gray-600">
        Selected: {selectedType}
      </p>
    </div>
  );
}

export const GridInteractive: StoryObj<typeof RecordTypeGrid> = {
  render: () => <GridInteractiveComponent />,
};