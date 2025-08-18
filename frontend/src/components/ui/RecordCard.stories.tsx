import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RecordCard, RecordList } from './RecordCard';
import type { Record } from '@/types';

// サンプルデータ
const sampleRecords: Record[] = [
  {
    id: '1',
    user_id: 'user-1',
    type: 'milk',
    recorded_at: '2024-08-15T14:30:00Z',
    recorded_by: 'mama',
    created_at: '2024-08-15T14:30:00Z',
    updated_at: '2024-08-15T14:30:00Z',
    metadata: {
      amount_ml: 120,
      milk_type: 'formula',
      duration_minutes: 15,
      note: '機嫌よく飲みました',
    },
  },
  {
    id: '2',
    user_id: 'user-1',
    type: 'diaper',
    recorded_at: '2024-08-15T13:45:00Z',
    recorded_by: 'papa',
    created_at: '2024-08-15T13:45:00Z',
    updated_at: '2024-08-15T13:45:00Z',
    metadata: {
      diaper_type: 'both',
      condition: 'normal',
      note: 'おむつかぶれなし',
    },
  },
  {
    id: '3',
    user_id: 'user-1',
    type: 'sleep',
    recorded_at: '2024-08-15T12:00:00Z',
    recorded_by: 'mama',
    created_at: '2024-08-15T12:00:00Z',
    updated_at: '2024-08-15T12:00:00Z',
    metadata: {
      start_time: '2024-08-15T12:00:00Z',
      end_time: '2024-08-15T13:30:00Z',
      duration_minutes: 90,
      quality: 'good',
      location: 'crib',
      note: 'ぐっすり眠りました',
    },
  },
  {
    id: '4',
    user_id: 'user-1',
    type: 'growth',
    recorded_at: '2024-08-15T10:00:00Z',
    recorded_by: 'mama',
    created_at: '2024-08-15T10:00:00Z',
    updated_at: '2024-08-15T10:00:00Z',
    metadata: {
      weight_g: 5200,
      height_cm: 58.5,
      head_circumference_cm: 38.2,
      note: '順調に成長しています',
    },
  },
];

const meta: Meta<typeof RecordCard> = {
  title: 'UI/RecordCard',
  component: RecordCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
    },
    showActions: {
      control: 'boolean',
    },
    showMetadata: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    record: sampleRecords[0],
    onEdit: (record) => console.log('Edit:', record),
    onDelete: (record) => console.log('Delete:', record),
  },
  render: (args) => (
    <div className="w-96">
      <RecordCard {...args} />
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 w-96">
      {sampleRecords.map((record) => (
        <RecordCard
          key={record.id}
          record={record}
          onEdit={(record) => console.log('Edit:', record)}
          onDelete={(record) => console.log('Delete:', record)}
        />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Default</h3>
        <div className="w-96">
          <RecordCard record={sampleRecords[0]} />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Compact</h3>
        <div className="w-96">
          <RecordCard record={sampleRecords[0]} variant="compact" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-600">Detailed</h3>
        <div className="w-96">
          <RecordCard record={sampleRecords[0]} variant="detailed" />
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <h3 className="text-sm font-medium mb-3 text-gray-600 capitalize">{size}</h3>
          <div className="w-96">
            <RecordCard
              record={sampleRecords[0]}
              size={size}
              onEdit={(record) => console.log('Edit:', record)}
              onDelete={(record) => console.log('Delete:', record)}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const WithoutActions: Story = {
  render: () => (
    <div className="w-96">
      <RecordCard record={sampleRecords[0]} showActions={false} />
    </div>
  ),
};

export const WithoutMetadata: Story = {
  render: () => (
    <div className="w-96">
      <RecordCard record={sampleRecords[0]} showMetadata={false} />
    </div>
  ),
};

export const CompactList: Story = {
  render: () => (
    <div className="w-96">
      <div className="space-y-2">
        {sampleRecords.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            variant="compact"
            onEdit={(record) => console.log('Edit:', record)}
            onDelete={(record) => console.log('Delete:', record)}
          />
        ))}
      </div>
    </div>
  ),
};

// RecordList Stories
const ListMeta: Meta<typeof RecordList> = {
  title: 'UI/RecordList',
  component: RecordList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const List: StoryObj<typeof RecordList> = {
  args: {
    records: sampleRecords,
    onEdit: (record) => console.log('Edit:', record),
    onDelete: (record) => console.log('Delete:', record),
  },
  render: (args) => (
    <div className="w-96 max-h-96 overflow-y-auto">
      <RecordList {...args} />
    </div>
  ),
};

export const EmptyList: StoryObj<typeof RecordList> = {
  args: {
    records: [],
    emptyMessage: '今日の記録はまだありません',
  },
  render: (args) => (
    <div className="w-96">
      <RecordList {...args} />
    </div>
  ),
};

export const CompactListView: StoryObj<typeof RecordList> = {
  args: {
    records: sampleRecords,
    variant: 'compact',
    size: 'sm',
    onEdit: (record) => console.log('Edit:', record),
    onDelete: (record) => console.log('Delete:', record),
  },
  render: (args) => (
    <div className="w-96 max-h-96 overflow-y-auto">
      <RecordList {...args} />
    </div>
  ),
};