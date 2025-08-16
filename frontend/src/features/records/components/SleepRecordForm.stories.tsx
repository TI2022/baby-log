import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SleepRecordForm } from './SleepRecordForm';
import type { SleepRecordData } from './SleepRecordForm';

const meta: Meta<typeof SleepRecordForm> = {
  title: 'Features/Records/SleepRecordForm',
  component: SleepRecordForm,
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
  const handleSubmit = async (data: SleepRecordData) => {
    console.log('Submitted data:', data);
    // 送信をシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('睡眠記録が保存されました！');
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <SleepRecordForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultFormComponent />,
};

function OngoingSleepComponent() {
  const now = new Date();
  const startTime = new Date();
  startTime.setHours(startTime.getHours() - 2); // 2時間前

  const initialData: Partial<SleepRecordData> = {
    recorded_at: now,
    recorded_by: 'mama',
    metadata: {
      start_time: startTime.toISOString(),
      end_time: undefined, // 進行中
      quality: 'good',
      location: 'crib',
      note: 'ぐっすり眠っています',
    },
  };

  const handleSubmit = async (data: SleepRecordData) => {
    console.log('Ongoing sleep data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('進行中の睡眠記録が保存されました！');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <SleepRecordForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => console.log('Ongoing sleep cancelled')}
      />
    </div>
  );
}

export const OngoingSleep: Story = {
  render: () => <OngoingSleepComponent />,
};

function CompletedSleepComponent() {
  const now = new Date();
  const startTime = new Date();
  startTime.setHours(startTime.getHours() - 3);
  const endTime = new Date();
  endTime.setHours(endTime.getHours() - 1);

  const initialData: Partial<SleepRecordData> = {
    recorded_at: now,
    recorded_by: 'papa',
    metadata: {
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration_minutes: 120, // 2時間
      quality: 'normal',
      location: 'arms',
      note: '抱っこで眠りました。途中で少し起きましたが、また寝てくれました。',
    },
  };

  const handleSubmit = async (data: SleepRecordData) => {
    console.log('Completed sleep data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('完了した睡眠記録が保存されました！');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <SleepRecordForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => console.log('Completed sleep cancelled')}
      />
    </div>
  );
}

export const CompletedSleep: Story = {
  render: () => <CompletedSleepComponent />,
};

function PoorQualitySleepComponent() {
  const now = new Date();
  const startTime = new Date();
  startTime.setHours(startTime.getHours() - 4);
  const endTime = new Date();
  endTime.setMinutes(endTime.getMinutes() - 30);

  const initialData: Partial<SleepRecordData> = {
    recorded_at: now,
    recorded_by: 'mama',
    metadata: {
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration_minutes: 210, // 3時間30分
      quality: 'poor',
      location: 'stroller',
      note: 'ベビーカーでお散歩中に眠りました。途中で何度か起きて、あまり深く眠れませんでした。次回はもう少し静かな場所で寝かせてあげたいです。',
    },
  };

  const handleSubmit = async (data: SleepRecordData) => {
    console.log('Poor quality sleep data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('睡眠の質が悪い記録が保存されました');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <SleepRecordForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => console.log('Poor sleep cancelled')}
      />
    </div>
  );
}

export const PoorQualitySleep: Story = {
  render: () => <PoorQualitySleepComponent />,
};

function SubmittingStateComponent() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: SleepRecordData) => {
    setIsSubmitting(true);
    console.log('Submitting data:', data);
    
    // 長い送信をシミュレート
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSubmitting(false);
    alert('睡眠記録が保存されました！');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <SleepRecordForm
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

  const handleSubmit = async (data: SleepRecordData) => {
    setSubmissionCount(prev => prev + 1);
    console.log(`Submission #${submissionCount + 1}:`, data);
    
    // バリデーションエラーをシミュレート（最初の送信のみ）
    if (submissionCount === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('サーバーエラーが発生しました');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('睡眠記録が保存されました！');
  };

  return (
    <div className="space-y-4">
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <SleepRecordForm
          onSubmit={handleSubmit}
          onCancel={() => console.log('Cancelled')}
        />
      </div>
      
      <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">テスト用メモ:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 最初の送信はエラーになります（バリデーションテスト用）</li>
          <li>• 2回目以降の送信は成功します</li>
          <li>• 進行中/完了の切り替えで終了時刻が変化します</li>
          <li>• 開始・終了時刻を設定すると睡眠時間が自動計算されます</li>
          <li>• 終了時刻は開始時刻より後である必要があります</li>
        </ul>
      </div>
    </div>
  );
}

export const ValidationTest: Story = {
  render: () => <ValidationTestComponent />,
};

function InteractiveToggleComponent() {
  const [toggleCount, setToggleCount] = React.useState(0);
  
  const handleSubmit = async (data: SleepRecordData) => {
    setToggleCount(prev => prev + 1);
    console.log('Interactive submission:', data);
    
    const isOngoing = !data.metadata.end_time;
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`${isOngoing ? '進行中' : '完了'}の睡眠記録が保存されました！`);
  };

  return (
    <div className="space-y-4">
      <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">進行中/完了切り替えテスト:</h3>
        <p className="text-sm text-gray-600">
          「進行中」と「完了」を切り替えて、フォームの動作を確認してください。
          進行中の場合は終了時刻が無効になり、完了の場合は終了時刻の入力が必要になります。
        </p>
      </div>
      
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <SleepRecordForm
          key={toggleCount} // フォームリセット用
          onSubmit={handleSubmit}
          onCancel={() => console.log('Interactive cancelled')}
        />
      </div>
    </div>
  );
}

export const InteractiveToggle: Story = {
  render: () => <InteractiveToggleComponent />,
};

export const MobileView: Story = {
  render: () => (
    <div className="w-full max-w-sm mx-auto p-4 bg-white rounded-lg shadow-lg">
      <SleepRecordForm
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

function AllLocationsComponent() {
  const locations = ['crib', 'arms', 'stroller', 'other'] as const;
  const [selectedLocation, setSelectedLocation] = React.useState<typeof locations[number]>('crib');
  
  const initialData: Partial<SleepRecordData> = {
    metadata: {
      start_time: new Date().toISOString(),
      quality: 'good',
      location: selectedLocation,
    },
  };

  return (
    <div className="space-y-4">
      <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">睡眠場所テスト:</h3>
        <div className="flex gap-2">
          {locations.map(location => (
            <button
              key={location}
              onClick={() => setSelectedLocation(location)}
              className={`px-3 py-1 rounded text-sm ${
                selectedLocation === location ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <SleepRecordForm
          key={selectedLocation} // フォームリセット用
          initialData={initialData}
          onSubmit={async (data) => {
            console.log('Location test submission:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert(`${data.metadata.location}での睡眠記録が保存されました！`);
          }}
        />
      </div>
    </div>
  );
}

export const AllLocations: Story = {
  render: () => <AllLocationsComponent />,
};

export const DurationCalculation: Story = {
  render: () => {
    const startTime = new Date();
    startTime.setHours(14, 0, 0, 0); // 14:00
    const endTime = new Date();
    endTime.setHours(16, 30, 0, 0); // 16:30 (2時間30分後)

    const initialData: Partial<SleepRecordData> = {
      metadata: {
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: 150, // 2時間30分
        quality: 'good',
        location: 'crib',
        note: '睡眠時間の自動計算テスト',
      },
    };

    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            開始時刻と終了時刻を変更すると、睡眠時間が自動で計算されます。
          </p>
        </div>
        <SleepRecordForm
          initialData={initialData}
          onSubmit={async (data) => {
            console.log('Duration calculation test:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert(`睡眠時間: ${data.metadata.duration_minutes || 0}分で記録されました！`);
          }}
        />
      </div>
    );
  },
};