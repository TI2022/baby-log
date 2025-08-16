import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RecordDetail } from './RecordDetail';
import type { Record } from '@/types';

const meta: Meta<typeof RecordDetail> = {
  title: 'Features/Records/RecordDetail',
  component: RecordDetail,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isEditing: {
      control: 'boolean',
      description: '編集モードで開始するかどうか',
    },
    onUpdate: {
      action: 'recordUpdated',
      description: '記録更新時のコールバック',
    },
    onDelete: {
      action: 'recordDeleted',
      description: '記録削除時のコールバック',
    },
    onClose: {
      action: 'closed',
      description: '閉じるボタンクリック時のコールバック',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// モック記録データ
const milkRecord: Record = {
  id: 'milk-1',
  user_id: 'user1',
  type: 'milk',
  recorded_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2時間前
  recorded_by: 'mama',
  metadata: {
    amount_ml: 150,
    milk_type: 'breast',
    duration_minutes: 20,
    note: '最初は嫌がっていましたが、途中からよく飲んでくれました。',
  },
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
};

const diaperRecord: Record = {
  id: 'diaper-1',
  user_id: 'user1',
  type: 'diaper',
  recorded_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30分前
  recorded_by: 'papa',
  metadata: {
    diaper_type: 'both',
    condition: 'normal',
    note: '普通の状態でした。',
  },
  created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
};

const sleepRecord: Record = {
  id: 'sleep-1',
  user_id: 'user1',
  type: 'sleep',
  recorded_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4時間前
  recorded_by: 'mama',
  metadata: {
    start_time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6時間前開始
    end_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4時間前終了
    duration_minutes: 120,
    quality: 'good',
    location: 'crib',
    note: 'ぐっすりと眠っていました。途中で起きることもありませんでした。',
  },
  created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
};

const growthRecord: Record = {
  id: 'growth-1',
  user_id: 'user1',
  type: 'growth',
  recorded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1日前
  recorded_by: 'papa',
  metadata: {
    weight_g: 4850,
    height_cm: 58.5,
    head_circumference_cm: 39.2,
    note: '順調に成長しています。前回から100g増えました。',
  },
  created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
};

const minimalRecord: Record = {
  id: 'minimal-1',
  user_id: 'user1',
  type: 'milk',
  recorded_at: new Date().toISOString(),
  recorded_by: 'unknown',
  metadata: {
    amount_ml: 100,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MilkRecord: Story = {
  args: {
    record: milkRecord,
    onUpdate: async (record) => {
      console.log('Updated record:', record);
      // 実際の実装では API 呼び出し
    },
    onDelete: async (id) => {
      console.log('Deleted record:', id);
      // 実際の実装では API 呼び出し
    },
    onClose: () => console.log('Closed'),
  },
};

export const DiaperRecord: Story = {
  args: {
    record: diaperRecord,
    onUpdate: async (record) => console.log('Updated record:', record),
    onDelete: async (id) => console.log('Deleted record:', id),
    onClose: () => console.log('Closed'),
  },
};

export const SleepRecord: Story = {
  args: {
    record: sleepRecord,
    onUpdate: async (record) => console.log('Updated record:', record),
    onDelete: async (id) => console.log('Deleted record:', id),
    onClose: () => console.log('Closed'),
  },
};

export const GrowthRecord: Story = {
  args: {
    record: growthRecord,
    onUpdate: async (record) => console.log('Updated record:', record),
    onDelete: async (id) => console.log('Deleted record:', id),
    onClose: () => console.log('Closed'),
  },
};

export const EditingMode: Story = {
  args: {
    record: milkRecord,
    isEditing: true,
    onUpdate: async (record) => console.log('Updated record:', record),
    onDelete: async (id) => console.log('Deleted record:', id),
    onClose: () => console.log('Closed'),
  },
};

export const MinimalData: Story = {
  args: {
    record: minimalRecord,
    onUpdate: async (record) => console.log('Updated record:', record),
    onDelete: async (id) => console.log('Deleted record:', id),
    onClose: () => console.log('Closed'),
  },
};

export const WithoutActions: Story = {
  args: {
    record: milkRecord,
    // onUpdate, onDelete, onClose を省略
  },
};

export const ReadOnlyMode: Story = {
  args: {
    record: sleepRecord,
    onClose: () => console.log('Closed'),
    // onUpdate, onDelete を省略（編集・削除ボタンが表示されない）
  },
};

// インタラクティブなデモ
export const Interactive: Story = {
  render: (args) => {
    function InteractiveDemo() {
      const [currentRecord, setCurrentRecord] = React.useState<Record>(milkRecord);
      const [isLoading, setIsLoading] = React.useState(false);

      const handleUpdate = async (updatedRecord: Record) => {
        setIsLoading(true);
        // 実際の API 呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentRecord(updatedRecord);
        setIsLoading(false);
        console.log('Record updated:', updatedRecord);
      };

      const handleDelete = async (recordId: string) => {
        setIsLoading(true);
        // 実際の API 呼び出しをシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        console.log('Record deleted:', recordId);
        alert('記録が削除されました');
      };

      const switchRecord = (record: Record) => {
        setCurrentRecord(record);
      };

      return (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">インタラクティブデモ</h3>
            <p className="text-sm text-gray-600 mb-4">
              異なる記録タイプを切り替えて編集・削除機能を試すことができます。
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => switchRecord(milkRecord)}
                className={`px-3 py-1 rounded text-sm ${
                  currentRecord.type === 'milk' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-gray-300'
                }`}
              >
                ミルク記録
              </button>
              <button
                onClick={() => switchRecord(diaperRecord)}
                className={`px-3 py-1 rounded text-sm ${
                  currentRecord.type === 'diaper' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-white border border-gray-300'
                }`}
              >
                おむつ記録
              </button>
              <button
                onClick={() => switchRecord(sleepRecord)}
                className={`px-3 py-1 rounded text-sm ${
                  currentRecord.type === 'sleep' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white border border-gray-300'
                }`}
              >
                睡眠記録
              </button>
              <button
                onClick={() => switchRecord(growthRecord)}
                className={`px-3 py-1 rounded text-sm ${
                  currentRecord.type === 'growth' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white border border-gray-300'
                }`}
              >
                成長記録
              </button>
            </div>
          </div>

          <RecordDetail
            record={currentRecord}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onClose={() => console.log('Closed')}
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
    record: sleepRecord,
    onUpdate: async (record) => console.log('Updated record:', record),
    onDelete: async (id) => console.log('Deleted record:', id),
    onClose: () => console.log('Closed'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  args: {
    record: growthRecord,
    onUpdate: async (record) => console.log('Updated record:', record),
    onDelete: async (id) => console.log('Deleted record:', id),
    onClose: () => console.log('Closed'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// エラー状態のシミュレーション
export const UpdateError: Story = {
  args: {
    record: milkRecord,
    onUpdate: async (record) => {
      // エラーをシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('Update failed');
    },
    onDelete: async (id) => console.log('Deleted record:', id),
    onClose: () => console.log('Closed'),
  },
};

export const DeleteError: Story = {
  args: {
    record: milkRecord,
    onUpdate: async (record) => console.log('Updated record:', record),
    onDelete: async (id) => {
      // エラーをシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('Delete failed');
    },
    onClose: () => console.log('Closed'),
  },
};