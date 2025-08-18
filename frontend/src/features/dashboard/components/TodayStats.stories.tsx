import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TodayStats } from './TodayStats';
import { RecordsProvider } from '@/contexts/RecordsContext';
import type { Record } from '@/types';

const meta: Meta<typeof TodayStats> = {
  title: 'Features/Dashboard/TodayStats',
  component: TodayStats,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <RecordsProvider>
        <div className="max-w-6xl mx-auto bg-gray-50 p-6">
          <Story />
        </div>
      </RecordsProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    showDetailed: {
      control: 'boolean',
      description: '詳細統計を表示するかどうか',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 今日のモックデータ生成
const generateTodayRecords = (count: number): Record[] => {
  const types: Record['type'][] = ['milk', 'diaper', 'sleep', 'growth'];
  const recordedBy: Record['recorded_by'][] = ['mama', 'papa', 'unknown'];
  const today = new Date();
  
  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const hour = 6 + (i * 2) % 18; // 6時から24時の間で分散
    const recordTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, Math.floor(Math.random() * 60));
    
    let metadata = {};
    
    switch (type) {
      case 'milk':
        metadata = {
          amount_ml: 100 + Math.floor(Math.random() * 100), // 100-200ml
          milk_type: Math.random() > 0.5 ? 'breast' : 'formula',
          duration_minutes: 15 + Math.floor(Math.random() * 20),
        };
        break;
      case 'diaper':
        metadata = {
          diaper_type: Math.random() > 0.7 ? 'poop' : Math.random() > 0.5 ? 'both' : 'pee',
          condition: Math.random() > 0.8 ? 'loose' : 'normal',
        };
        break;
      case 'sleep':
        const duration = 30 + Math.floor(Math.random() * 180); // 30-210分
        metadata = {
          start_time: new Date(recordTime.getTime() - duration * 60 * 1000).toISOString(),
          end_time: recordTime.toISOString(),
          duration_minutes: duration,
          quality: Math.random() > 0.6 ? 'good' : Math.random() > 0.3 ? 'normal' : 'poor',
          location: Math.random() > 0.5 ? 'crib' : 'arms',
        };
        break;
      case 'growth':
        metadata = {
          weight_g: 5000 + Math.floor(Math.random() * 1000),
          height_cm: 60 + Math.random() * 5,
          head_circumference_cm: Math.random() > 0.7 ? 38 + Math.random() * 4 : undefined,
        };
        break;
    }

    return {
      id: `today-${i}`,
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

// 昨日のモックデータ生成（比較用）
const generateYesterdayRecords = (count: number): Record[] => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const types: Record['type'][] = ['milk', 'diaper', 'sleep', 'growth'];
  
  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const hour = 6 + (i * 2) % 18;
    const recordTime = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), hour, Math.floor(Math.random() * 60));
    
    return {
      id: `yesterday-${i}`,
      user_id: 'user1',
      type,
      recorded_at: recordTime.toISOString(),
      recorded_by: 'mama',
      metadata: type === 'milk' ? { amount_ml: 150 } : {},
      created_at: recordTime.toISOString(),
      updated_at: recordTime.toISOString(),
    };
  });
};

// モックプロバイダー
function MockStatsProvider({ 
  children, 
  todayRecords = [], 
  yesterdayRecords = [],
  isLoading = false, 
  error = null 
}: { 
  children: React.ReactNode; 
  todayRecords?: Record[];
  yesterdayRecords?: Record[];
  isLoading?: boolean;
  error?: string | null;
}) {
  const allRecords = [...todayRecords, ...yesterdayRecords];

  const getRecordsForDate = (date: string) => {
    const targetDate = new Date(date).toDateString();
    return allRecords.filter(record => 
      new Date(record.recorded_at).toDateString() === targetDate
    );
  };

  const mockContext = {
    records: allRecords,
    isLoading,
    error,
    getRecordsForDate,
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
    getRecordsByType: () => [],
    getLatestRecords: () => [],
  };

  return React.cloneElement(children as React.ReactElement);
}

export const Default: Story = {
  render: (args) => (
    <MockStatsProvider 
      todayRecords={generateTodayRecords(15)}
      yesterdayRecords={generateYesterdayRecords(12)}
    >
      <TodayStats {...args} />
    </MockStatsProvider>
  ),
};

export const BasicStats: Story = {
  render: (args) => (
    <MockStatsProvider 
      todayRecords={generateTodayRecords(8)}
      yesterdayRecords={generateYesterdayRecords(10)}
    >
      <TodayStats {...args} showDetailed={false} />
    </MockStatsProvider>
  ),
};

export const DetailedStats: Story = {
  render: (args) => (
    <MockStatsProvider 
      todayRecords={generateTodayRecords(20)}
      yesterdayRecords={generateYesterdayRecords(15)}
    >
      <TodayStats {...args} showDetailed={true} />
    </MockStatsProvider>
  ),
};

export const BusyDay: Story = {
  render: (args) => {
    // 忙しい一日のデータ
    const busyDayRecords = [
      // ミルク記録 (8回)
      ...Array.from({ length: 8 }, (_, i) => {
        const today = new Date();
        const hour = 6 + i * 2; // 2時間間隔
        return {
          id: `milk-${i}`,
          user_id: 'user1',
          type: 'milk' as const,
          recorded_at: new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, 0).toISOString(),
          recorded_by: i % 2 === 0 ? 'mama' as const : 'papa' as const,
          metadata: {
            amount_ml: 120 + Math.floor(Math.random() * 80),
            milk_type: Math.random() > 0.6 ? 'breast' : 'formula',
            duration_minutes: 15 + Math.floor(Math.random() * 15),
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }),
      // おむつ記録 (12回)
      ...Array.from({ length: 12 }, (_, i) => {
        const today = new Date();
        const hour = 6 + Math.floor(i * 1.5); // 1.5時間間隔
        return {
          id: `diaper-${i}`,
          user_id: 'user1',
          type: 'diaper' as const,
          recorded_at: new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, i * 5).toISOString(),
          recorded_by: i % 3 === 0 ? 'papa' as const : 'mama' as const,
          metadata: {
            diaper_type: Math.random() > 0.7 ? 'poop' : Math.random() > 0.4 ? 'both' : 'pee',
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }),
      // 睡眠記録 (6回)
      ...Array.from({ length: 6 }, (_, i) => {
        const today = new Date();
        const hour = 7 + i * 3; // 3時間間隔
        const duration = 60 + Math.floor(Math.random() * 120);
        return {
          id: `sleep-${i}`,
          user_id: 'user1',
          type: 'sleep' as const,
          recorded_at: new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, 0).toISOString(),
          recorded_by: 'mama' as const,
          metadata: {
            duration_minutes: duration,
            quality: Math.random() > 0.6 ? 'good' : 'normal',
            location: Math.random() > 0.5 ? 'crib' : 'arms',
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }),
    ];

    return (
      <MockStatsProvider 
        todayRecords={busyDayRecords}
        yesterdayRecords={generateYesterdayRecords(18)}
      >
        <TodayStats {...args} />
      </MockStatsProvider>
    );
  },
};

export const QuietDay: Story = {
  render: (args) => {
    const quietDayRecords = [
      ...generateTodayRecords(3), // 少ない記録数
    ];

    return (
      <MockStatsProvider 
        todayRecords={quietDayRecords}
        yesterdayRecords={generateYesterdayRecords(8)}
      >
        <TodayStats {...args} />
      </MockStatsProvider>
    );
  },
};

export const Loading: Story = {
  render: (args) => (
    <MockStatsProvider isLoading={true}>
      <TodayStats {...args} />
    </MockStatsProvider>
  ),
};

export const Error: Story = {
  render: (args) => (
    <MockStatsProvider 
      error="統計データの取得に失敗しました。しばらく時間をおいてから再度お試しください。"
    >
      <TodayStats {...args} />
    </MockStatsProvider>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <MockStatsProvider todayRecords={[]} yesterdayRecords={[]}>
      <TodayStats {...args} />
    </MockStatsProvider>
  ),
};

export const MilkFocused: Story = {
  render: (args) => {
    // ミルク中心の一日
    const milkFocusedRecords = [
      ...Array.from({ length: 10 }, (_, i) => {
        const today = new Date();
        const hour = 6 + i * 1.8;
        return {
          id: `milk-focus-${i}`,
          user_id: 'user1',
          type: 'milk' as const,
          recorded_at: new Date(today.getFullYear(), today.getMonth(), today.getDate(), Math.floor(hour), (hour % 1) * 60).toISOString(),
          recorded_by: i % 2 === 0 ? 'mama' as const : 'papa' as const,
          metadata: {
            amount_ml: 80 + Math.floor(Math.random() * 120),
            milk_type: Math.random() > 0.4 ? 'breast' : 'formula',
            duration_minutes: 10 + Math.floor(Math.random() * 25),
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }),
      ...generateTodayRecords(3).filter(r => r.type !== 'milk'), // 他の記録も少し
    ];

    return (
      <MockStatsProvider 
        todayRecords={milkFocusedRecords}
        yesterdayRecords={generateYesterdayRecords(8)}
      >
        <TodayStats {...args} />
      </MockStatsProvider>
    );
  },
};

export const ComparisionWithYesterday: Story = {
  render: (args) => {
    // 昨日より増加パターン
    const todayMoreRecords = generateTodayRecords(20);
    const yesterdayLessRecords = generateYesterdayRecords(12);

    return (
      <MockStatsProvider 
        todayRecords={todayMoreRecords}
        yesterdayRecords={yesterdayLessRecords}
      >
        <TodayStats {...args} />
      </MockStatsProvider>
    );
  },
};

export const MobileView: Story = {
  render: (args) => (
    <MockStatsProvider 
      todayRecords={generateTodayRecords(12)}
      yesterdayRecords={generateYesterdayRecords(10)}
    >
      <TodayStats {...args} />
    </MockStatsProvider>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const RealTimeUpdate: Story = {
  render: (args) => {
    function RealTimeStats() {
      const [records, setRecords] = React.useState(generateTodayRecords(5));
      const [isLoading, setIsLoading] = React.useState(false);

      const addRandomRecord = () => {
        setIsLoading(true);
        
        setTimeout(() => {
          const types: Record['type'][] = ['milk', 'diaper', 'sleep'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          const today = new Date();
          
          const newRecord: Record = {
            id: `realtime-${Date.now()}`,
            user_id: 'user1',
            type: randomType,
            recorded_at: today.toISOString(),
            recorded_by: Math.random() > 0.5 ? 'mama' : 'papa',
            metadata: randomType === 'milk' ? { amount_ml: 150 } : randomType === 'diaper' ? { diaper_type: 'pee' } : { duration_minutes: 60 },
            created_at: today.toISOString(),
            updated_at: today.toISOString(),
          };

          setRecords(prev => [...prev, newRecord]);
          setIsLoading(false);
        }, 1000);
      };

      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-3">リアルタイム更新デモ</h3>
            <button
              onClick={addRandomRecord}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? '記録追加中...' : '新しい記録を追加'}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              記録を追加すると統計がリアルタイムで更新されます
            </p>
          </div>
          
          <MockStatsProvider 
            todayRecords={records}
            yesterdayRecords={generateYesterdayRecords(8)}
            isLoading={isLoading}
          >
            <TodayStats {...args} />
          </MockStatsProvider>
        </div>
      );
    }

    return <RealTimeStats />;
  },
};