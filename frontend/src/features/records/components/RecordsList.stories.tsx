import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RecordsList } from './RecordsList';
import { RecordsProvider } from '@/contexts/RecordsContext';
import type { Record } from '@/types';

const meta: Meta<typeof RecordsList> = {
  title: 'Features/Records/RecordsList',
  component: RecordsList,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <RecordsProvider>
        <div className="min-h-screen bg-gray-50 p-6">
          <Story />
        </div>
      </RecordsProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    showFilters: {
      control: 'boolean',
      description: 'フィルター機能を表示するかどうか',
    },
    pageSize: {
      control: { type: 'number', min: 10, max: 100, step: 10 },
      description: 'ページあたりの表示件数',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// モックデータ生成
const generateMockRecords = (count: number): Record[] => {
  const types: Record['type'][] = ['milk', 'diaper', 'sleep', 'growth'];
  const recordedBy: Record['recorded_by'][] = ['mama', 'papa', 'unknown'];
  
  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const days = Math.floor(i / 8); // 1日8件として日付を分散
    const hours = (i % 8) * 2 + 6; // 6時から20時に分散
    const recordTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    recordTime.setHours(hours, Math.floor(Math.random() * 60));
    
    let metadata = {};
    
    switch (type) {
      case 'milk':
        metadata = {
          amount_ml: 100 + Math.floor(Math.random() * 100),
          milk_type: Math.random() > 0.5 ? 'breast' : 'formula',
          duration_minutes: 15 + Math.floor(Math.random() * 20),
          note: i % 10 === 0 ? 'よく飲みました' : undefined,
        };
        break;
      case 'diaper':
        metadata = {
          diaper_type: Math.random() > 0.7 ? 'poop' : Math.random() > 0.5 ? 'both' : 'pee',
          condition: Math.random() > 0.8 ? 'loose' : 'normal',
          note: i % 15 === 0 ? 'いつもと違う色でした' : undefined,
        };
        break;
      case 'sleep':
        const duration = 30 + Math.floor(Math.random() * 180);
        metadata = {
          start_time: new Date(recordTime.getTime() - duration * 60 * 1000).toISOString(),
          end_time: recordTime.toISOString(),
          duration_minutes: duration,
          quality: Math.random() > 0.6 ? 'good' : Math.random() > 0.3 ? 'normal' : 'poor',
          location: Math.random() > 0.5 ? 'crib' : 'arms',
          note: i % 12 === 0 ? 'ぐっすり眠りました' : undefined,
        };
        break;
      case 'growth':
        metadata = {
          weight_g: 4500 + Math.floor(Math.random() * 1500),
          height_cm: i % 4 === 0 ? 58 + Math.random() * 8 : undefined,
          head_circumference_cm: i % 6 === 0 ? 38 + Math.random() * 4 : undefined,
          note: i % 20 === 0 ? '順調に成長しています' : undefined,
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
  const mockContext = {
    records,
    isLoading,
    error,
    fetchRecords: async () => {},
    deleteRecord: async () => {},
    getRecordsByType: (type: Record['type']) => records.filter(r => r.type === type),
    getRecordsByRecordedBy: (recordedBy: Record['recorded_by']) => records.filter(r => r.recorded_by === recordedBy),
    // その他の必要なプロパティをモック
    createRecord: async () => ({}),
    updateRecord: async () => ({}),
    setRecords: () => {},
    addRecord: () => {},
    setLoading: () => {},
    setError: () => {},
    removeLocalRecord: () => {},
    getRecordsForDate: () => [],
    getLatestRecords: () => [],
  };

  return React.cloneElement(children as React.ReactElement);
}

export const Default: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(50)}>
      <RecordsList {...args} />
    </MockRecordsProvider>
  ),
};

export const WithFilters: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(80)}>
      <RecordsList {...args} showFilters={true} />
    </MockRecordsProvider>
  ),
};

export const NoFilters: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(30)}>
      <RecordsList {...args} showFilters={false} />
    </MockRecordsProvider>
  ),
};

export const SmallPageSize: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(100)}>
      <RecordsList {...args} pageSize={10} />
    </MockRecordsProvider>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <MockRecordsProvider records={[]} isLoading={true}>
      <RecordsList {...args} />
    </MockRecordsProvider>
  ),
};

export const Error: Story = {
  render: (args) => (
    <MockRecordsProvider 
      records={[]} 
      error="記録の取得に失敗しました。ネットワーク接続を確認してください。"
    >
      <RecordsList {...args} />
    </MockRecordsProvider>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <MockRecordsProvider records={[]}>
      <RecordsList {...args} />
    </MockRecordsProvider>
  ),
};

export const MilkOnly: Story = {
  render: (args) => {
    const milkRecords = generateMockRecords(100).filter(r => r.type === 'milk');
    return (
      <MockRecordsProvider records={milkRecords}>
        <RecordsList {...args} defaultFilters={{ type: 'milk' }} />
      </MockRecordsProvider>
    );
  },
};

export const RecentWeek: Story = {
  render: (args) => {
    // 過去1週間の記録
    const recentRecords = Array.from({ length: 60 }, (_, i) => {
      const days = Math.floor(i / 8);
      const recordTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const types: Record['type'][] = ['milk', 'diaper', 'sleep', 'growth'];
      const type = types[i % types.length];
      
      return {
        id: `recent-${i}`,
        user_id: 'user1',
        type,
        recorded_at: recordTime.toISOString(),
        recorded_by: i % 3 === 0 ? 'papa' as const : 'mama' as const,
        metadata: type === 'milk' ? { amount_ml: 150 } : {},
        created_at: recordTime.toISOString(),
        updated_at: recordTime.toISOString(),
      };
    });

    return (
      <MockRecordsProvider records={recentRecords}>
        <RecordsList {...args} defaultFilters={{ 
          date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }} />
      </MockRecordsProvider>
    );
  },
};

export const HighVolume: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(500)}>
      <RecordsList {...args} pageSize={50} />
    </MockRecordsProvider>
  ),
};

export const MobileView: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(25)}>
      <RecordsList {...args} />
    </MockRecordsProvider>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  render: (args) => (
    <MockRecordsProvider records={generateMockRecords(40)}>
      <RecordsList {...args} />
    </MockRecordsProvider>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const InteractiveDemo: Story = {
  render: (args) => {
    function InteractiveRecordsList() {
      const [records, setRecords] = React.useState(generateMockRecords(20));
      const [isLoading, setIsLoading] = React.useState(false);

      const addRandomRecord = () => {
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
                onClick={addRandomRecord}
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
                すべてクリア
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              記録を追加/削除して一覧表示の動作を確認できます
            </p>
          </div>
          
          <MockRecordsProvider records={records} isLoading={isLoading}>
            <RecordsList {...args} />
          </MockRecordsProvider>
        </div>
      );
    }

    return <InteractiveRecordsList />;
  },
};

export const FilteringDemo: Story = {
  render: (args) => {
    function FilteringDemo() {
      const allRecords = generateMockRecords(100);
      const [activeFilter, setActiveFilter] = React.useState<Record['type'] | 'all'>('all');

      const filteredRecords = activeFilter === 'all' 
        ? allRecords 
        : allRecords.filter(r => r.type === activeFilter);

      const filterButtons: Array<{ type: Record['type'] | 'all'; label: string; color: string }> = [
        { type: 'all', label: 'すべて', color: 'bg-gray-500' },
        { type: 'milk', label: 'ミルク', color: 'bg-blue-500' },
        { type: 'diaper', label: 'おむつ', color: 'bg-yellow-500' },
        { type: 'sleep', label: '睡眠', color: 'bg-purple-500' },
        { type: 'growth', label: '成長', color: 'bg-green-500' },
      ];

      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-3">フィルタリングデモ</h3>
            <div className="flex gap-2 flex-wrap">
              {filterButtons.map(filter => (
                <button
                  key={filter.type}
                  onClick={() => setActiveFilter(filter.type)}
                  className={`px-3 py-1 rounded-lg text-white text-sm ${filter.color} ${
                    activeFilter === filter.type ? 'ring-2 ring-offset-2 ring-blue-400' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {filter.label} ({filter.type === 'all' ? allRecords.length : allRecords.filter(r => r.type === filter.type).length})
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              フィルターボタンをクリックして記録種別で絞り込みできます
            </p>
          </div>
          
          <MockRecordsProvider records={filteredRecords}>
            <RecordsList {...args} defaultFilters={{ type: activeFilter === 'all' ? undefined : activeFilter }} />
          </MockRecordsProvider>
        </div>
      );
    }

    return <FilteringDemo />;
  },
};