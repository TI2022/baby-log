import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MilkRecordForm } from './MilkRecordForm';
import type { MilkRecordData } from './MilkRecordForm';

const meta: Meta<typeof MilkRecordForm> = {
  title: 'Features/Records/MilkRecordForm',
  component: MilkRecordForm,
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
  const handleSubmit = async (data: MilkRecordData) => {
    console.log('Submitted data:', data);
    // 送信をシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('ミルク記録が保存されました！');
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <MilkRecordForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultFormComponent />,
};

function WithInitialDataComponent() {
  const initialData: Partial<MilkRecordData> = {
    recorded_at: new Date('2024-08-15T14:30:00'),
    recorded_by: 'papa',
    metadata: {
      amount_ml: 150,
      milk_type: 'mixed',
      duration_minutes: 20,
      note: '機嫌よく飲みました',
    },
  };

  const handleSubmit = async (data: MilkRecordData) => {
    console.log('Submitted data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('ミルク記録が更新されました！');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <MilkRecordForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => console.log('Edit cancelled')}
      />
    </div>
  );
}

export const WithInitialData: Story = {
  render: () => <WithInitialDataComponent />,
};

function SubmittingStateComponent() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: MilkRecordData) => {
    setIsSubmitting(true);
    console.log('Submitting data:', data);
    
    // 長い送信をシミュレート
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSubmitting(false);
    alert('ミルク記録が保存されました！');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <MilkRecordForm
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

  const handleSubmit = async (data: MilkRecordData) => {
    setSubmissionCount(prev => prev + 1);
    console.log(`Submission #${submissionCount + 1}:`, data);
    
    // バリデーションエラーをシミュレート（最初の送信のみ）
    if (submissionCount === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('サーバーエラーが発生しました');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('ミルク記録が保存されました！');
  };

  return (
    <div className="space-y-4">
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <MilkRecordForm
          onSubmit={handleSubmit}
          onCancel={() => console.log('Cancelled')}
        />
      </div>
      
      <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">テスト用メモ:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 最初の送信はエラーになります（バリデーションテスト用）</li>
          <li>• 2回目以降の送信は成功します</li>
          <li>• 必須フィールドを空にして送信してみてください</li>
          <li>• 無効な値（負の数、大きすぎる値など）を入力してみてください</li>
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
      <MilkRecordForm
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

export const MinimalData: Story = {
  render: () => {
    const minimalInitialData: Partial<MilkRecordData> = {
      metadata: {
        amount_ml: 100,
        milk_type: 'formula',
      },
    };

    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <MilkRecordForm
          initialData={minimalInitialData}
          onSubmit={async (data) => {
            console.log('Minimal data submission:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('最小限のデータで記録完了！');
          }}
        />
      </div>
    );
  },
};

export const AllFieldsFilled: Story = {
  render: () => {
    const fullData: Partial<MilkRecordData> = {
      recorded_at: new Date(),
      recorded_by: 'mama',
      metadata: {
        amount_ml: 180,
        milk_type: 'breast',
        duration_minutes: 25,
        note: 'とても機嫌よく飲んでくれました。途中で少し眠そうになりましたが、最後まで飲み切りました。次回は少し量を減らしても良いかもしれません。',
      },
    };

    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <MilkRecordForm
          initialData={fullData}
          onSubmit={async (data) => {
            console.log('Full data submission:', data);
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('すべてのフィールドで記録完了！');
          }}
          onCancel={() => console.log('Full form cancelled')}
        />
      </div>
    );
  },
};