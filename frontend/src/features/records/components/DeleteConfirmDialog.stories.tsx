import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import type { Record } from '@/types';

const meta: Meta<typeof DeleteConfirmDialog> = {
  title: 'Features/Records/DeleteConfirmDialog',
  component: DeleteConfirmDialog,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'ダイアログの表示状態',
    },
    isLoading: {
      control: 'boolean',
      description: '削除処理中の状態',
    },
    onConfirm: {
      action: 'confirmed',
      description: '削除確認時のコールバック',
    },
    onCancel: {
      action: 'cancelled',
      description: 'キャンセル時のコールバック',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// モック記録データ
const singleMilkRecord: Record[] = [
  {
    id: 'milk-1',
    user_id: 'user1',
    type: 'milk',
    recorded_at: new Date('2024-01-15T10:30:00').toISOString(),
    recorded_by: 'mama',
    metadata: { 
      amount_ml: 150, 
      milk_type: 'breast',
      duration_minutes: 20,
      note: 'よく飲んでくれました。途中で少し嫌がりましたが最後まで飲み切りました。'
    },
    created_at: new Date('2024-01-15T10:30:00').toISOString(),
    updated_at: new Date('2024-01-15T10:30:00').toISOString(),
  },
];

const singleSleepRecord: Record[] = [
  {
    id: 'sleep-1',
    user_id: 'user1',
    type: 'sleep',
    recorded_at: new Date('2024-01-15T14:00:00').toISOString(),
    recorded_by: 'papa',
    metadata: { 
      duration_minutes: 120,
      start_time: new Date('2024-01-15T12:00:00').toISOString(),
      end_time: new Date('2024-01-15T14:00:00').toISOString(),
      quality: 'good',
      location: 'crib'
    },
    created_at: new Date('2024-01-15T14:00:00').toISOString(),
    updated_at: new Date('2024-01-15T14:00:00').toISOString(),
  },
];

const multipleRecords: Record[] = [
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
    metadata: { diaper_type: 'both' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sleep-1',
    user_id: 'user1',
    type: 'sleep',
    recorded_at: new Date().toISOString(),
    recorded_by: 'mama',
    metadata: { duration_minutes: 90 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const manyRecords: Record[] = Array.from({ length: 25 }, (_, i) => ({
  id: `record-${i}`,
  user_id: 'user1',
  type: ['milk', 'diaper', 'sleep', 'growth'][i % 4] as Record['type'],
  recorded_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
  recorded_by: ['mama', 'papa'][i % 2] as Record['recorded_by'],
  metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export const SingleRecord: Story = {
  args: {
    isOpen: true,
    records: singleMilkRecord,
    onConfirm: async () => {
      console.log('Confirming delete for single record');
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => console.log('Delete cancelled'),
    isLoading: false,
  },
};

export const SingleRecordWithNote: Story = {
  args: {
    isOpen: true,
    records: singleSleepRecord,
    onConfirm: async () => {
      console.log('Confirming delete for sleep record');
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => console.log('Delete cancelled'),
    isLoading: false,
  },
};

export const MultipleRecords: Story = {
  args: {
    isOpen: true,
    records: multipleRecords,
    onConfirm: async () => {
      console.log('Confirming delete for multiple records');
      await new Promise(resolve => setTimeout(resolve, 1500));
    },
    onCancel: () => console.log('Delete cancelled'),
    isLoading: false,
  },
};

export const ManyRecords: Story = {
  args: {
    isOpen: true,
    records: manyRecords,
    onConfirm: async () => {
      console.log('Confirming delete for many records');
      await new Promise(resolve => setTimeout(resolve, 2000));
    },
    onCancel: () => console.log('Delete cancelled'),
    isLoading: false,
  },
};

export const LoadingState: Story = {
  args: {
    isOpen: true,
    records: multipleRecords,
    onConfirm: async () => {
      console.log('Delete in progress...');
    },
    onCancel: () => console.log('Delete cancelled'),
    isLoading: true,
  },
};

export const CustomMessage: Story = {
  args: {
    isOpen: true,
    records: singleMilkRecord,
    title: 'データを完全に削除',
    message: 'この記録は復元できません。本当に削除してもよろしいですか？',
    onConfirm: async () => {
      console.log('Confirming custom delete');
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onCancel: () => console.log('Delete cancelled'),
    isLoading: false,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    records: singleMilkRecord,
    onConfirm: async () => console.log('Confirm'),
    onCancel: () => console.log('Cancel'),
    isLoading: false,
  },
};

// インタラクティブなデモ
export const Interactive: Story = {
  render: (args) => {
    function InteractiveDemo() {
      const [isOpen, setIsOpen] = React.useState(false);
      const [selectedRecords, setSelectedRecords] = React.useState<Record[]>(singleMilkRecord);
      const [isLoading, setIsLoading] = React.useState(false);

      const handleDelete = (records: Record[]) => {
        setSelectedRecords(records);
        setIsOpen(true);
      };

      const handleConfirm = async () => {
        setIsLoading(true);
        console.log('Deleting records:', selectedRecords);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        setIsOpen(false);
        alert(`${selectedRecords.length}件の記録を削除しました`);
      };

      const handleCancel = () => {
        setIsOpen(false);
        setIsLoading(false);
      };

      const recordOptions = [
        { label: '単一記録（ミルク）', records: singleMilkRecord },
        { label: '単一記録（睡眠）', records: singleSleepRecord },
        { label: '複数記録（3件）', records: multipleRecords },
        { label: '大量記録（25件）', records: manyRecords },
      ];

      return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <h3 className="text-lg font-semibold mb-4">インタラクティブデモ</h3>
          <p className="text-gray-600 mb-6">
            異なる記録パターンで削除確認ダイアログの動作を確認できます。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recordOptions.map(({ label, records }) => (
              <button
                key={label}
                onClick={() => handleDelete(records)}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {records.length}件の記録を削除
                </div>
              </button>
            ))}
          </div>

          <DeleteConfirmDialog
            isOpen={isOpen}
            records={selectedRecords}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isLoading={isLoading}
            {...args}
          />
        </div>
      );
    }

    return <InteractiveDemo />;
  },
};

// エラーシミュレーション
export const ErrorSimulation: Story = {
  render: (args) => {
    function ErrorDemo() {
      const [isOpen, setIsOpen] = React.useState(true);
      const [isLoading, setIsLoading] = React.useState(false);

      const handleConfirm = async () => {
        setIsLoading(true);
        console.log('Simulating delete error...');
        
        try {
          await new Promise((_, reject) => {
            setTimeout(() => reject(new Error('削除に失敗しました')), 2000);
          });
        } catch (error) {
          alert('削除に失敗しました: ' + (error as Error).message);
        } finally {
          setIsLoading(false);
        }
      };

      const handleCancel = () => {
        setIsOpen(false);
        setIsLoading(false);
      };

      return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <h3 className="text-lg font-semibold mb-4">エラーシミュレーション</h3>
          <p className="text-gray-600 mb-6">
            削除処理でエラーが発生した場合の動作を確認できます。
          </p>

          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              エラーテストを再実行
            </button>
          )}

          <DeleteConfirmDialog
            isOpen={isOpen}
            records={multipleRecords}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isLoading={isLoading}
            {...args}
          />
        </div>
      );
    }

    return <ErrorDemo />;
  },
};