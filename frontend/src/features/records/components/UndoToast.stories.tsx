import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UndoToast } from './UndoToast';
import type { Record } from '@/types';

const meta: Meta<typeof UndoToast> = {
  title: 'Features/Records/UndoToast',
  component: UndoToast,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: { type: 'number', min: 1000, max: 10000, step: 1000 },
      description: 'トーストの表示時間（ミリ秒）',
    },
    onUndo: {
      action: 'undoClicked',
      description: '復元ボタンクリック時のコールバック',
    },
    onDismiss: {
      action: 'dismissed',
      description: 'トースト閉じる時のコールバック',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// モック記録データ
const singleRecord: Record[] = [
  {
    id: 'milk-1',
    user_id: 'user1',
    type: 'milk',
    recorded_at: new Date().toISOString(),
    recorded_by: 'mama',
    metadata: { amount_ml: 150, note: 'よく飲みました' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
];

const manyRecords: Record[] = Array.from({ length: 15 }, (_, i) => ({
  id: `record-${i}`,
  user_id: 'user1',
  type: ['milk', 'diaper', 'sleep', 'growth'][i % 4] as Record['type'],
  recorded_at: new Date().toISOString(),
  recorded_by: ['mama', 'papa'][i % 2] as Record['recorded_by'],
  metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export const SingleRecord: Story = {
  args: {
    isVisible: true,
    deletedRecords: singleRecord,
    onUndo: (records) => console.log('Undo single record:', records),
    onDismiss: () => console.log('Toast dismissed'),
    duration: 5000,
  },
};

export const MultipleRecords: Story = {
  args: {
    isVisible: true,
    deletedRecords: multipleRecords,
    onUndo: (records) => console.log('Undo multiple records:', records),
    onDismiss: () => console.log('Toast dismissed'),
    duration: 5000,
  },
};

export const ManyRecords: Story = {
  args: {
    isVisible: true,
    deletedRecords: manyRecords,
    onUndo: (records) => console.log('Undo many records:', records),
    onDismiss: () => console.log('Toast dismissed'),
    duration: 5000,
  },
};

export const ShortDuration: Story = {
  args: {
    isVisible: true,
    deletedRecords: multipleRecords,
    onUndo: (records) => console.log('Undo records:', records),
    onDismiss: () => console.log('Toast dismissed'),
    duration: 2000,
  },
};

export const LongDuration: Story = {
  args: {
    isVisible: true,
    deletedRecords: singleRecord,
    onUndo: (records) => console.log('Undo records:', records),
    onDismiss: () => console.log('Toast dismissed'),
    duration: 10000,
  },
};

export const Hidden: Story = {
  args: {
    isVisible: false,
    deletedRecords: singleRecord,
    onUndo: (records) => console.log('Undo records:', records),
    onDismiss: () => console.log('Toast dismissed'),
    duration: 5000,
  },
};

// インタラクティブなデモ
export const Interactive: Story = {
  render: (args) => {
    function InteractiveDemo() {
      const [isVisible, setIsVisible] = React.useState(false);
      const [deletedRecords, setDeletedRecords] = React.useState<Record[]>([]);

      const simulateDelete = (records: Record[]) => {
        setDeletedRecords(records);
        setIsVisible(true);
      };

      const handleUndo = (records: Record[]) => {
        console.log('Undoing deletion of:', records);
        setIsVisible(false);
        // 実際の実装では記録を復元
      };

      const handleDismiss = () => {
        setIsVisible(false);
      };

      return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <h3 className="text-lg font-semibold mb-4">インタラクティブデモ</h3>
          <p className="text-gray-600 mb-6">
            削除操作をシミュレートしてUndoトーストの動作を確認できます。
          </p>

          <div className="space-y-4">
            <button
              onClick={() => simulateDelete(singleRecord)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              単一記録を削除（シミュレート）
            </button>
            
            <button
              onClick={() => simulateDelete(multipleRecords)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ml-4"
            >
              複数記録を削除（シミュレート）
            </button>

            <button
              onClick={() => simulateDelete(manyRecords)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ml-4"
            >
              大量記録を削除（シミュレート）
            </button>
          </div>

          <UndoToast
            isVisible={isVisible}
            deletedRecords={deletedRecords}
            onUndo={handleUndo}
            onDismiss={handleDismiss}
            duration={5000}
            {...args}
          />
        </div>
      );
    }

    return <InteractiveDemo />;
  },
};

// 自動閉じるデモ
export const AutoDismiss: Story = {
  render: (args) => {
    function AutoDismissDemo() {
      const [isVisible, setIsVisible] = React.useState(false);
      const [countdown, setCountdown] = React.useState(0);

      const startDemo = () => {
        setIsVisible(true);
        setCountdown(3);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      };

      const handleDismiss = () => {
        setIsVisible(false);
        setCountdown(0);
      };

      return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <h3 className="text-lg font-semibold mb-4">自動閉じるデモ</h3>
          <p className="text-gray-600 mb-6">
            短い時間で自動的に閉じるトーストの動作を確認できます。
          </p>

          <button
            onClick={startDemo}
            disabled={isVisible}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isVisible ? `${countdown}秒後に閉じます` : '3秒デモを開始'}
          </button>

          <UndoToast
            isVisible={isVisible}
            deletedRecords={singleRecord}
            onUndo={(records) => {
              console.log('Undo:', records);
              handleDismiss();
            }}
            onDismiss={handleDismiss}
            duration={3000}
            {...args}
          />
        </div>
      );
    }

    return <AutoDismissDemo />;
  },
};