import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RecordsFilter } from './RecordsFilter';
import type { RecordFilters } from '@/types';

const meta: Meta<typeof RecordsFilter> = {
  title: 'Features/Records/RecordsFilter',
  component: RecordsFilter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    compact: {
      control: 'boolean',
      description: 'コンパクト表示モード（展開/折りたたみ可能）',
    },
    filters: {
      control: 'object',
      description: '現在のフィルター設定',
    },
    onFiltersChange: {
      action: 'filtersChanged',
      description: 'フィルター変更時のコールバック',
    },
    onReset: {
      action: 'filtersReset',
      description: 'フィルターリセット時のコールバック',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトのフィルター状態
const defaultFilters: RecordFilters = {
  page: 1,
  per_page: 20,
  date_from: '',
  date_to: '',
  type: undefined,
  recorded_by: undefined,
  search: '',
  sort_by: 'recorded_at',
  sort_order: 'desc',
};

// アクティブなフィルターがある状態
const activeFilters: RecordFilters = {
  page: 1,
  per_page: 20,
  date_from: '2024-01-01',
  date_to: '2024-01-31',
  type: 'milk',
  recorded_by: 'mama',
  search: '',
  sort_by: 'recorded_at',
  sort_order: 'desc',
};

export const Default: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
  },
};

export const WithActiveFilters: Story = {
  args: {
    filters: activeFilters,
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
  },
};

export const CompactMode: Story = {
  args: {
    filters: defaultFilters,
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
    compact: true,
  },
};

export const CompactWithActiveFilters: Story = {
  args: {
    filters: activeFilters,
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
    compact: true,
  },
};

export const TodayFilter: Story = {
  args: {
    filters: {
      ...defaultFilters,
      date_from: new Date().toISOString().split('T')[0],
      date_to: new Date().toISOString().split('T')[0],
    },
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
  },
};

export const MilkRecordsOnly: Story = {
  args: {
    filters: {
      ...defaultFilters,
      type: 'milk',
    },
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
  },
};

export const PapaRecordsOnly: Story = {
  args: {
    filters: {
      ...defaultFilters,
      recorded_by: 'papa',
    },
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
  },
};

export const WeekRange: Story = {
  args: {
    filters: {
      ...defaultFilters,
      date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      date_to: new Date().toISOString().split('T')[0],
    },
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
  },
};

export const MonthRange: Story = {
  args: {
    filters: {
      ...defaultFilters,
      date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      date_to: new Date().toISOString().split('T')[0],
    },
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
  },
};

export const AllFiltersActive: Story = {
  args: {
    filters: {
      page: 1,
      per_page: 20,
      date_from: '2024-01-01',
      date_to: '2024-01-31',
      type: 'sleep',
      recorded_by: 'mama',
      search: 'よく眠れた',
      sort_by: 'recorded_at',
      sort_order: 'asc',
    },
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
  },
};

// インタラクティブなデモ
export const Interactive: Story = {
  render: (args) => {
    function InteractiveDemo() {
      const [filters, setFilters] = React.useState<RecordFilters>(defaultFilters);
      const [resetKey, setResetKey] = React.useState(0);

      const handleFiltersChange = (newFilters: Partial<RecordFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
      };

      const handleReset = () => {
        setFilters(defaultFilters);
        setResetKey(prev => prev + 1);
      };

      return (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">インタラクティブデモ</h3>
            <p className="text-sm text-gray-600 mb-4">
              フィルターを操作して動作を確認できます。下部に現在のフィルター状態が表示されます。
            </p>
          </div>

          <RecordsFilter
            key={resetKey}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleReset}
            {...args}
          />

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-2">現在のフィルター状態:</h4>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(filters, null, 2)}
            </pre>
          </div>
        </div>
      );
    }

    return <InteractiveDemo />;
  },
};

// レスポンシブデザインテスト
export const MobileView: Story = {
  args: {
    filters: activeFilters,
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  args: {
    filters: activeFilters,
    onFiltersChange: (filters) => console.log('Filters changed:', filters),
    onReset: () => console.log('Filters reset'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};