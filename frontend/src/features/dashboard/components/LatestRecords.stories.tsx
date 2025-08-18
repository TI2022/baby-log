import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LatestRecords } from './LatestRecords';
import { RecordsProvider } from '@/contexts/RecordsContext';
import type { Record } from '@/types';

const meta: Meta<typeof LatestRecords> = {
  title: 'Features/Dashboard/LatestRecords',
  component: LatestRecords,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <RecordsProvider>
        <div className="max-w-4xl mx-auto bg-gray-50 p-6">
          <Story />
        </div>
      </RecordsProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// モックデータ生成
const generateMockRecords = (count: number): Record[] => {
  const types: Record['type'][] = ['milk', 'diaper', 'sleep', 'growth'];
  const recordedBy: Record['recorded_by'][] = ['mama', 'papa', 'unknown'];
  
  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const recordTime = new Date(Date.now() - i * 45 * 60 * 1000); // 45分間隔
    
    let metadata = {};
    
    switch (type) {
      case 'milk':
        metadata = {
          amount_ml: 120 + Math.floor(Math.random() * 80),
          milk_type: Math.random() > 0.5 ? 'breast' : Math.random() > 0.5 ? 'formula' : 'mixed',
          duration_minutes: 15 + Math.floor(Math.random() * 20),
          note: i % 5 === 0 ? 'よく飲みました' : undefined,
        };
        break;
      case 'diaper':
        metadata = {
          diaper_type: Math.random() > 0.7 ? 'poop' : Math.random() > 0.5 ? 'both' : 'pee',
          condition: Math.random() > 0.8 ? 'loose' : 'normal',
          note: i % 7 === 0 ? 'においが気になりました' : undefined,
        };
        break;
      case 'sleep':
        const duration = 60 + Math.floor(Math.random() * 120);
        metadata = {
          start_time: new Date(recordTime.getTime() - duration * 60 * 1000).toISOString(),
          end_time: recordTime.toISOString(),
          duration_minutes: duration,
          quality: Math.random() > 0.6 ? 'good' : Math.random() > 0.3 ? 'normal' : 'poor',
          location: Math.random() > 0.5 ? 'crib' : 'arms',
          note: i % 6 === 0 ? 'ぐっすり眠りました' : undefined,
        };
        break;
      case 'growth':
        metadata = {
          weight_g: 4800 + Math.floor(Math.random() * 1000),
          height_cm: 58 + Math.random() * 8,
          head_circumference_cm: i % 4 === 0 ? 38 + Math.random() * 4 : undefined,
          note: i % 8 === 0 ? '順調に成長しています' : undefined,
        };
        break;
    }

    return {
      id: `record-${i}`,
      user_id: 'user1',
      type,
      recorded_at: recordTime.toISOString(),
      recorded_by: recordedBy[i % recordedBy.length],
      metadata,
      created_at: recordTime.toISOString(),
      updated_at: recordTime.toISOString(),
    };
  });
};

// モックプロバイダー
function MockRecordsProvider({ 
  children, 
  records = [], 
  isLoading = false, 
  error = null 
}: { 
  children: React.ReactNode; 
  records?: Record[];
  isLoading?: boolean;
  error?: string | null;
}) {
  const getLatestRecords = (limit = 10) => {
    return records
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
      .slice(0, limit);
  };

  const getRecordsByType = (type: Record['type']) => {
    return records
      .filter(record => record.type === type)
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
  };

  const mockContext = {
    records,
    isLoading,
    error,
    getLatestRecords,
    getRecordsByType,
    // その他の必要なプロパティをモック
    fetchRecords: async () => {},
    createRecord: async () => ({}),
    updateRecord: async () => ({}),
    deleteRecord: async () => {},
    setRecords: () => {},
    addRecord: () => {},
    setLoading: () => {},
    setError: () => {},
    removeLocalRecord: () => {},
    getRecordsForDate: () => [],
  };

  return React.cloneElement(children as React.ReactElement);
}

export const Default: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(15)}>
      <LatestRecords {...args} />
    </MockRecordsProvider>
  ),
};

export const WithTypeFilter: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(20)}>
      <LatestRecords {...args} showTypeFilter={true} />
    </MockRecordsProvider>
  ),
};

export const NoTypeFilter: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(10)}>
      <LatestRecords {...args} showTypeFilter={false} />
    </MockRecordsProvider>
  ),
};

export const LimitedRecords: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(25)}>
      <LatestRecords {...args} limit={5} />
    </MockRecordsProvider>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <MockRecordsProvider records={[]} isLoading={true}>
      <LatestRecords {...args} />
    </MockRecordsProvider>
  ),
};

export const Error: Story = {
  render: (args) => (
    <MockRecordsProvider 
      records={[]} 
      error="記録の取得に失敗しました。ネットワーク接続を確認してください。"
    >
      <LatestRecords {...args} />
    </MockRecordsProvider>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <MockRecordsProvider records={[]}>
      <LatestRecords {...args} />
    </MockRecordsProvider>
  ),
};

export const MilkOnly: Story = {
  render: (args) => {
    const milkRecords = generateMockRecords(50).filter(r => r.type === 'milk');
    return (
      <MockRecordsProvider records={milkRecords}>
        <LatestRecords {...args} />
      </MockRecordsProvider>
    );
  },
};

export const RecentActivity: Story = {
  render: (args) => {
    // 最近1時間以内の記録
    const recentRecords = Array.from({ length: 8 }, (_, i) => {
      const recordTime = new Date(Date.now() - i * 5 * 60 * 1000); // 5分間隔
      const types: Record['type'][] = ['milk', 'diaper', 'sleep'];
      const type = types[i % types.length];
      
      return {
        id: `recent-${i}`,
        user_id: 'user1',
        type,
        recorded_at: recordTime.toISOString(),
        recorded_by: i % 2 === 0 ? 'mama' as const : 'papa' as const,
        metadata: type === 'milk' ? { amount_ml: 150 } : type === 'diaper' ? { diaper_type: 'pee' } : { duration_minutes: 30 },
        created_at: recordTime.toISOString(),
        updated_at: recordTime.toISOString(),
      };
    });

    return (
      <MockRecordsProvider records={recentRecords}>
        <LatestRecords {...args} />
      </MockRecordsProvider>
    );
  },
};

export const WithNotes: Story = {
  render: (args) => {
    const recordsWithNotes = generateMockRecords(8).map((record, i) => ({
      ...record,
      metadata: {
        ...record.metadata,
        note: [
          'とてもよく飲みました',
          'いつもより少し少なめ',
          'ご機嫌でした',
          'ちょっと眠そうでした',
          '元気いっぱいです',
          '少し熱があるかも',
          '順調に成長中',
          'とても活発でした',
        ][i],
      },
    }));

    return (
      <MockRecordsProvider records={recordsWithNotes}>
        <LatestRecords {...args} />
      </MockRecordsProvider>
    );
  },
};

export const MobileView: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(10)}>
      <LatestRecords {...args} />
    </MockRecordsProvider>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const InteractiveDemo: Story = {
  render: (args) => {
    function InteractiveLatestRecords() {
      const [records, setRecords] = React.useState(generateMockRecords(5));
      const [isLoading, setIsLoading] = React.useState(false);

      const addNewRecord = () => {
        setIsLoading(true);
        
        setTimeout(() => {
          const types: Record['type'][] = ['milk', 'diaper', 'sleep', 'growth'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          
          const newRecord: Record = {
            id: `demo-${Date.now()}`,
            user_id: 'user1',
            type: randomType,
            recorded_at: new Date().toISOString(),
            recorded_by: Math.random() > 0.5 ? 'mama' : 'papa',
            metadata: randomType === 'milk' ? { amount_ml: 150 } : {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          setRecords(prev => [newRecord, ...prev]);
          setIsLoading(false);
        }, 1000);
      };

      const clearRecords = () => {
        setRecords([]);
      };

      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-3">インタラクティブデモ</h3>
            <div className="flex gap-2">
              <button
                onClick={addNewRecord}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isLoading ? '追加中...' : '新しい記録を追加'}
              </button>
              <button
                onClick={clearRecords}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                クリア
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              記録を追加/削除して動作を確認できます
            </p>
          </div>
          
          <MockRecordsProvider records={records} isLoading={isLoading}>
            <LatestRecords {...args} />
          </MockRecordsProvider>
        </div>
      );
    }

    return <InteractiveLatestRecords />;
  },
};