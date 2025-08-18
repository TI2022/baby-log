import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DashboardLayout } from './DashboardLayout';
import { RecordsProvider } from '@/contexts/RecordsContext';
import type { Record } from '@/types';

const meta: Meta<typeof DashboardLayout> = {
  title: 'Features/Dashboard/DashboardLayout',
  component: DashboardLayout,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <RecordsProvider>
        <div className="min-h-screen bg-gray-50 p-4">
          <Story />
        </div>
      </RecordsProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// モックデータ
const mockRecords: Record[] = [
  {
    id: '1',
    user_id: 'user1',
    type: 'milk',
    recorded_at: new Date().toISOString(),
    recorded_by: 'mama',
    metadata: {
      amount_ml: 150,
      milk_type: 'breast',
      duration_minutes: 20,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user1',
    type: 'diaper',
    recorded_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    recorded_by: 'papa',
    metadata: {
      diaper_type: 'pee',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'user1',
    type: 'sleep',
    recorded_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    recorded_by: 'mama',
    metadata: {
      start_time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 120,
      quality: 'good',
      location: 'crib',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    user_id: 'user1',
    type: 'growth',
    recorded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    recorded_by: 'mama',
    metadata: {
      weight_g: 5200,
      height_cm: 62.5,
      head_circumference_cm: 40.2,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// モックプロバイダー
function MockDashboardProvider({ children, records = [] }: { children: React.ReactNode; records?: Record[] }) {
  const [mockRecords, setMockRecords] = React.useState(records);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const getRecordsForDate = (date: string) => {
    const targetDate = new Date(date).toDateString();
    return mockRecords.filter(record => 
      new Date(record.recorded_at).toDateString() === targetDate
    );
  };

  const getLatestRecords = (limit = 10) => {
    return mockRecords
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
      .slice(0, limit);
  };

  const mockContext = {
    records: mockRecords,
    isLoading,
    error,
    getRecordsForDate,
    getLatestRecords,
    // その他の必要なプロパティをモック
    fetchRecords: async () => {},
    createRecord: async () => ({}),
    updateRecord: async () => ({}),
    deleteRecord: async () => {},
    setRecords: () => {},
    addRecord: () => {},
    setLoading: setIsLoading,
    setError: setError,
    removeLocalRecord: () => {},
    getRecordsByType: () => [],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {React.cloneElement(children as React.ReactElement, { 
        // モックコンテキストを注入（実際の実装では適切なプロバイダーを使用）
      })}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <MockDashboardProvider records={mockRecords}>
      <DashboardLayout />
    </MockDashboardProvider>
  ),
};

export const Loading: Story = {
  render: () => {
    function LoadingDashboard() {
      const [isLoading, setIsLoading] = React.useState(true);
      
      React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 3000);
        return () => clearTimeout(timer);
      }, []);

      return (
        <MockDashboardProvider records={isLoading ? [] : mockRecords}>
          <DashboardLayout />
        </MockDashboardProvider>
      );
    }
    
    return <LoadingDashboard />;
  },
};

export const Empty: Story = {
  render: () => (
    <MockDashboardProvider records={[]}>
      <DashboardLayout />
    </MockDashboardProvider>
  ),
};

export const WithError: Story = {
  render: () => {
    function ErrorDashboard() {
      const [error, setError] = React.useState<string | null>(null);
      
      React.useEffect(() => {
        setError('記録の取得に失敗しました。ネットワーク接続を確認してください。');
      }, []);

      return (
        <MockDashboardProvider records={[]}>
          <DashboardLayout />
        </MockDashboardProvider>
      );
    }
    
    return <ErrorDashboard />;
  },
};

export const BusyDay: Story = {
  render: () => {
    // 忙しい一日のモックデータ
    const busyDayRecords: Record[] = [
      // 今日のミルク記録
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `milk-${i}`,
        user_id: 'user1',
        type: 'milk' as const,
        recorded_at: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
        recorded_by: i % 2 === 0 ? 'mama' as const : 'papa' as const,
        metadata: {
          amount_ml: 120 + Math.floor(Math.random() * 60),
          milk_type: Math.random() > 0.7 ? 'formula' : 'breast',
          duration_minutes: 15 + Math.floor(Math.random() * 15),
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      // 今日のおむつ記録
      ...Array.from({ length: 12 }, (_, i) => ({
        id: `diaper-${i}`,
        user_id: 'user1',
        type: 'diaper' as const,
        recorded_at: new Date(Date.now() - i * 1.5 * 60 * 60 * 1000).toISOString(),
        recorded_by: i % 3 === 0 ? 'mama' as const : 'papa' as const,
        metadata: {
          diaper_type: Math.random() > 0.7 ? 'poop' : Math.random() > 0.5 ? 'both' : 'pee',
          condition: Math.random() > 0.8 ? 'loose' : 'normal',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      // 今日の睡眠記録
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `sleep-${i}`,
        user_id: 'user1',
        type: 'sleep' as const,
        recorded_at: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
        recorded_by: 'mama' as const,
        metadata: {
          start_time: new Date(Date.now() - (i * 3 + 2) * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
          duration_minutes: 60 + Math.floor(Math.random() * 120),
          quality: Math.random() > 0.6 ? 'good' : Math.random() > 0.3 ? 'normal' : 'poor',
          location: Math.random() > 0.5 ? 'crib' : 'arms',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    ];

    return (
      <MockDashboardProvider records={busyDayRecords}>
        <DashboardLayout />
      </MockDashboardProvider>
    );
  },
};

export const MobileView: Story = {
  render: () => (
    <MockDashboardProvider records={mockRecords}>
      <DashboardLayout />
    </MockDashboardProvider>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  render: () => (
    <MockDashboardProvider records={mockRecords}>
      <DashboardLayout />
    </MockDashboardProvider>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    function InteractiveDashboard() {
      const [records, setRecords] = React.useState(mockRecords);
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
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          setRecords(prev => [newRecord, ...prev]);
          setIsLoading(false);
        }, 1000);
      };

      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">インタラクティブデモ</h3>
            <button
              onClick={addRandomRecord}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? '記録中...' : 'ランダム記録を追加'}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              ボタンをクリックするとランダムな記録が追加され、ダッシュボードが更新されます
            </p>
          </div>
          
          <MockDashboardProvider records={records}>
            <DashboardLayout />
          </MockDashboardProvider>
        </div>
      );
    }

    return <InteractiveDashboard />;
  },
};