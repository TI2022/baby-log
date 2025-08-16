import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DiaperRecordForm } from './DiaperRecordForm';
import type { DiaperRecordData } from './DiaperRecordForm';

const meta: Meta<typeof DiaperRecordForm> = {
  title: 'Features/Records/DiaperRecordForm',
  component: DiaperRecordForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isSubmitting: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultFormComponent() {
  const handleSubmit = async (data: DiaperRecordData) => {
    console.log('Submitted data:', data);
    // 送信をシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('おむつ記録が保存されました！');
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <DiaperRecordForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultFormComponent />,
};

function PeeOnlyComponent() {
  const initialData: Partial<DiaperRecordData> = {
    recorded_at: new Date('2024-08-15T10:30:00'),
    recorded_by: 'papa',
    metadata: {
      diaper_type: 'pee',
      note: 'おしっこだけでした',
    },
  };

  const handleSubmit = async (data: DiaperRecordData) => {
    console.log('Pee only data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('おしっこ記録が保存されました！');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <DiaperRecordForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => console.log('Pee form cancelled')}
      />
    </div>
  );
}

export const PeeOnly: Story = {
  render: () => <PeeOnlyComponent />,
};

function PoopDetailedComponent() {
  const initialData: Partial<DiaperRecordData> = {
    recorded_at: new Date('2024-08-15T16:45:00'),
    recorded_by: 'mama',
    metadata: {
      diaper_type: 'poop',
      condition: 'loose',
      color: '黄色',
      note: '少し緩めでしたが、量は普通でした。おむつかぶれは見られません。',
    },
  };

  const handleSubmit = async (data: DiaperRecordData) => {
    console.log('Detailed poop data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('詳細なうんち記録が保存されました！');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <DiaperRecordForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => console.log('Detailed poop form cancelled')}
      />
    </div>
  );
}

export const PoopDetailed: Story = {
  render: () => <PoopDetailedComponent />,
};

function BothTypesComponent() {
  const initialData: Partial<DiaperRecordData> = {
    recorded_at: new Date(),
    recorded_by: 'mama',
    metadata: {
      diaper_type: 'both',
      condition: 'normal',
      color: '茶色',
      note: 'おしっことうんち両方でした',
    },
  };

  const handleSubmit = async (data: DiaperRecordData) => {
    console.log('Both types data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('おしっこ・うんち記録が保存されました！');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <DiaperRecordForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => console.log('Both types form cancelled')}
      />
    </div>
  );
}

export const BothTypes: Story = {
  render: () => <BothTypesComponent />,
};

function SubmittingStateComponent() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: DiaperRecordData) => {
    setIsSubmitting(true);
    console.log('Submitting data:', data);
    
    // 長い送信をシミュレート
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSubmitting(false);
    alert('おむつ記録が保存されました！');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <DiaperRecordForm
        onSubmit={handleSubmit}
        onCancel={() => console.log('Cancelled')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export const SubmittingState: Story = {
  render: () => <SubmittingStateComponent />,
};

function ValidationTestComponent() {
  const [submissionCount, setSubmissionCount] = React.useState(0);

  const handleSubmit = async (data: DiaperRecordData) => {
    setSubmissionCount(prev => prev + 1);
    console.log(`Submission #${submissionCount + 1}:`, data);
    
    // バリデーションエラーをシミュレート（最初の送信のみ）
    if (submissionCount === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('サーバーエラーが発生しました');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('おむつ記録が保存されました！');
  };

  return (
    <div className="space-y-4">
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <DiaperRecordForm
          onSubmit={handleSubmit}
          onCancel={() => console.log('Cancelled')}
        />
      </div>
      
      <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">テスト用メモ:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 最初の送信はエラーになります（バリデーションテスト用）</li>
          <li>• 2回目以降の送信は成功します</li>
          <li>• うんちを選択すると状態・色の選択が表示されます</li>
          <li>• おしっこを選択すると状態・色は表示されません</li>
        </ul>
      </div>
    </div>
  );
}

export const ValidationTest: Story = {
  render: () => <ValidationTestComponent />,
};

export const MobileView: Story = {
  render: () => (
    <div className="w-full max-w-sm mx-auto p-4 bg-white rounded-lg shadow-lg">
      <DiaperRecordForm
        onSubmit={async (data) => {
          console.log('Mobile submission:', data);
          await new Promise(resolve => setTimeout(resolve, 1500));
          alert('記録完了！');
        }}
        onCancel={() => console.log('Mobile cancelled')}
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

function ColorVariationsComponent() {
  const [selectedType, setSelectedType] = React.useState<'poop' | 'both'>('poop');
  
  const initialData: Partial<DiaperRecordData> = {
    metadata: {
      diaper_type: selectedType,
      condition: 'normal',
    },
  };

  return (
    <div className="space-y-4">
      <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">色選択テスト:</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType('poop')}
            className={`px-3 py-1 rounded ${selectedType === 'poop' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            うんちのみ
          </button>
          <button
            onClick={() => setSelectedType('both')}
            className={`px-3 py-1 rounded ${selectedType === 'both' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            おしっこ・うんち
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <DiaperRecordForm
          key={selectedType} // フォームをリセット
          initialData={initialData}
          onSubmit={async (data) => {
            console.log('Color test submission:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert(`${selectedType}記録が保存されました！色: ${data.metadata.color || 'なし'}`);
          }}
        />
      </div>
    </div>
  );
}

export const ColorVariations: Story = {
  render: () => <ColorVariationsComponent />,
};

export const AllStatesDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">おむつ記録フォーム - 全パターンデモ</h2>
        <p className="text-gray-600">各種類のおむつ記録を確認できます</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* おしっこのみ */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3 text-center">おしっこのみ</h3>
          <PeeOnlyComponent />
        </div>
        
        {/* うんち詳細 */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3 text-center">うんち（詳細）</h3>
          <PoopDetailedComponent />
        </div>
        
        {/* 両方 */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3 text-center">おしっこ・うんち</h3>
          <BothTypesComponent />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};