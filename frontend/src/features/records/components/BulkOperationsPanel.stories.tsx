import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BulkOperationsPanel } from './BulkOperationsPanel';
import type { Record } from '@/types';

const meta: Meta<typeof BulkOperationsPanel> = {
  title: 'Features/Records/BulkOperationsPanel',
  component: BulkOperationsPanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onBulkDelete: {
      action: 'bulkDeleted',
      description: '一括削除時のコールバック',
    },
    onBulkExport: {
      action: 'bulkExported',
      description: '一括エクスポート時のコールバック',
    },
    onSelectAll: {
      action: 'selectAll',
      description: '全選択時のコールバック',
    },
    onDeselectAll: {
      action: 'deselectAll',
      description: '全解除時のコールバック',
    },
    onClose: {
      action: 'closed',
      description: 'パネル閉じる時のコールバック',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// モック記録データ
const mockRecords: Record[] = [
  {
    id: 'milk-1',
    user_id: 'user1',
    type: 'milk',
    recorded_at: new Date().toISOString(),
    recorded_by: 'mama',
    metadata: { amount_ml: 150 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'diaper-1',
    user_id: 'user1',
    type: 'diaper',
    recorded_at: new Date().toISOString(),
    recorded_by: 'papa',
    metadata: { diaper_type: 'pee' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sleep-1',
    user_id: 'user1',
    type: 'sleep',
    recorded_at: new Date().toISOString(),
    recorded_by: 'mama',
    metadata: { duration_minutes: 120 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'growth-1',
    user_id: 'user1',
    type: 'growth',
    recorded_at: new Date().toISOString(),
    recorded_by: 'papa',
    metadata: { weight_g: 4500 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const SingleRecord: Story = {
  args: {
    selectedRecords: new Set(['milk-1']),
    records: mockRecords,
    onBulkDelete: async (ids) => {
      console.log('Deleting records:', ids);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onBulkExport: (records) => console.log('Exporting records:', records),
    onSelectAll: () => console.log('Select all'),
    onDeselectAll: () => console.log('Deselect all'),
    onClose: () => console.log('Close panel'),
  },
};

export const MultipleRecords: Story = {
  args: {
    selectedRecords: new Set(['milk-1', 'diaper-1', 'sleep-1']),
    records: mockRecords,
    onBulkDelete: async (ids) => {
      console.log('Deleting records:', ids);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onBulkExport: (records) => console.log('Exporting records:', records),
    onSelectAll: () => console.log('Select all'),
    onDeselectAll: () => console.log('Deselect all'),
    onClose: () => console.log('Close panel'),
  },
};

export const AllSelected: Story = {
  args: {
    selectedRecords: new Set(['milk-1', 'diaper-1', 'sleep-1', 'growth-1']),
    records: mockRecords,
    onBulkDelete: async (ids) => {
      console.log('Deleting records:', ids);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onBulkExport: (records) => console.log('Exporting records:', records),
    onSelectAll: () => console.log('Select all'),
    onDeselectAll: () => console.log('Deselect all'),
    onClose: () => console.log('Close panel'),
  },
};

export const WithoutExport: Story = {
  args: {
    selectedRecords: new Set(['milk-1', 'diaper-1']),
    records: mockRecords,
    onBulkDelete: async (ids) => {
      console.log('Deleting records:', ids);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    // onBulkExport を省略（エクスポートボタンが表示されない）
    onSelectAll: () => console.log('Select all'),
    onDeselectAll: () => console.log('Deselect all'),
    onClose: () => console.log('Close panel'),
  },
};

export const LargeSelection: Story = {
  args: {
    selectedRecords: new Set(Array.from({ length: 25 }, (_, i) => `record-${i}`)),
    records: Array.from({ length: 50 }, (_, i) => ({
      id: `record-${i}`,
      user_id: 'user1',
      type: ['milk', 'diaper', 'sleep', 'growth'][i % 4] as Record['type'],
      recorded_at: new Date().toISOString(),
      recorded_by: ['mama', 'papa'][i % 2] as Record['recorded_by'],
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
    onBulkDelete: async (ids) => {
      console.log('Deleting records:', ids);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onBulkExport: (records) => console.log('Exporting records:', records),
    onSelectAll: () => console.log('Select all'),
    onDeselectAll: () => console.log('Deselect all'),
    onClose: () => console.log('Close panel'),
  },
};

// インタラクティブなデモ
export const Interactive: Story = {
  render: (args) => {
    function InteractiveDemo() {
      const [selectedRecords, setSelectedRecords] = React.useState(new Set(['milk-1']));
      const [isLoading, setIsLoading] = React.useState(false);

      const handleBulkDelete = async (recordIds: string[]) => {
        setIsLoading(true);
        console.log('Deleting records:', recordIds);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSelectedRecords(new Set());
        setIsLoading(false);
      };

      const handleSelectAll = () => {
        setSelectedRecords(new Set(mockRecords.map(r => r.id)));
      };

      const handleDeselectAll = () => {
        setSelectedRecords(new Set());
      };

      const handleToggleRecord = (recordId: string) => {
        setSelectedRecords(prev => {
          const newSet = new Set(prev);
          if (newSet.has(recordId)) {
            newSet.delete(recordId);
          } else {
            newSet.add(recordId);
          }
          return newSet;
        });
      };

      return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <h3 className="text-lg font-semibold mb-4">インタラクティブデモ</h3>
          <p className="text-gray-600 mb-6">
            記録を選択してバルク操作パネルの動作を確認できます。
          </p>

          {/* 記録選択UI */}
          <div className="bg-white p-4 rounded-lg mb-6">
            <h4 className="font-medium mb-3">記録を選択:</h4>
            <div className="space-y-2">
              {mockRecords.map(record => (
                <label key={record.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRecords.has(record.id)}
                    onChange={() => handleToggleRecord(record.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">
                    {record.type === 'milk' ? '🍼 ミルク' :
                     record.type === 'diaper' ? '👶 おむつ' :
                     record.type === 'sleep' ? '💤 睡眠' :
                     record.type === 'growth' ? '📏 成長' : record.type} 
                    ({record.id})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <BulkOperationsPanel
            selectedRecords={selectedRecords}
            records={mockRecords}
            onBulkDelete={handleBulkDelete}
            onBulkExport={(records) => console.log('Exported:', records)}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onClose={() => setSelectedRecords(new Set())}
            {...args}
          />
        </div>
      );
    }

    return <InteractiveDemo />;
  },
};

// レスポンシブデザインテスト
export const MobileView: Story = {
  args: {
    selectedRecords: new Set(['milk-1', 'diaper-1', 'sleep-1']),
    records: mockRecords,
    onBulkDelete: async (ids) => console.log('Deleting records:', ids),
    onBulkExport: (records) => console.log('Exporting records:', records),
    onSelectAll: () => console.log('Select all'),
    onDeselectAll: () => console.log('Deselect all'),
    onClose: () => console.log('Close panel'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};