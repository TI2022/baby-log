import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GrowthRecordForm } from './GrowthRecordForm';
import type { GrowthRecordData } from './GrowthRecordForm';

const meta: Meta<typeof GrowthRecordForm> = {
  title: 'Features/Records/GrowthRecordForm',
  component: GrowthRecordForm,
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
  const handleSubmit = async (data: GrowthRecordData) => {
    console.log('Submitted data:', data);
    // 送信をシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('成長記録が保存されました！');
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <GrowthRecordForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultFormComponent />,
};

function NewbornComponent() {
  const initialData: Partial<GrowthRecordData> = {
    recorded_at: new Date('2024-08-15T10:00:00'),
    recorded_by: 'mama',
    metadata: {
      weight_g: 3200,
      height_cm: 52.0,
      head_circumference_cm: 35.5,
      chest_circumference_cm: 33.0,
      note: '生後1週間の測定です。体重は出生時より少し増えました。',
    },
  };

  const handleSubmit = async (data: GrowthRecordData) => {
    console.log('Newborn data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('新生児の成長記録が保存されました！');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <GrowthRecordForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => console.log('Newborn form cancelled')}
      />
    </div>
  );
}

export const Newborn: Story = {
  render: () => <NewbornComponent />,
};

function ThreeMonthsComponent() {
  const initialData: Partial<GrowthRecordData> = {
    recorded_at: new Date('2024-08-15T14:30:00'),
    recorded_by: 'papa',
    metadata: {
      weight_g: 6200,
      height_cm: 61.5,
      head_circumference_cm: 40.2,
      chest_circumference_cm: 38.5,
      note: '3ヶ月健診での測定結果。順調に成長しています。',
    },
  };

  const handleSubmit = async (data: GrowthRecordData) => {
    console.log('3 months data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('3ヶ月の成長記録が保存されました！');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <GrowthRecordForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => console.log('3 months form cancelled')}
      />
    </div>
  );
}

export const ThreeMonths: Story = {
  render: () => <ThreeMonthsComponent />,
};

function WeightOnlyComponent() {
  const initialData: Partial<GrowthRecordData> = {
    recorded_at: new Date(),
    recorded_by: 'mama',
    metadata: {
      weight_g: 4800,
      note: '体重のみ測定しました',
    },
  };

  const handleSubmit = async (data: GrowthRecordData) => {
    console.log('Weight only data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('体重記録が保存されました！');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <GrowthRecordForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => console.log('Weight only cancelled')}
      />
    </div>
  );
}

export const WeightOnly: Story = {
  render: () => <WeightOnlyComponent />,
};

function HeightAndHeadComponent() {
  const initialData: Partial<GrowthRecordData> = {
    recorded_at: new Date(),
    recorded_by: 'papa',
    metadata: {
      height_cm: 58.3,
      head_circumference_cm: 38.7,
      note: '身長と頭囲を測定しました。体重計が故障中のため体重は測定できませんでした。',
    },
  };

  const handleSubmit = async (data: GrowthRecordData) => {
    console.log('Height and head data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('身長・頭囲記録が保存されました！');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <GrowthRecordForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => console.log('Height and head cancelled')}
      />
    </div>
  );
}

export const HeightAndHead: Story = {
  render: () => <HeightAndHeadComponent />,
};

function SubmittingStateComponent() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: GrowthRecordData) => {
    setIsSubmitting(true);
    console.log('Submitting data:', data);
    
    // 長い送信をシミュレート
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSubmitting(false);
    alert('成長記録が保存されました！');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <GrowthRecordForm
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

  const handleSubmit = async (data: GrowthRecordData) => {
    setSubmissionCount(prev => prev + 1);
    console.log(`Submission #${submissionCount + 1}:`, data);
    
    // バリデーションエラーをシミュレート（最初の送信のみ）
    if (submissionCount === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('サーバーエラーが発生しました');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('成長記録が保存されました！');
  };

  return (
    <div className="space-y-4">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <GrowthRecordForm
          onSubmit={handleSubmit}
          onCancel={() => console.log('Cancelled')}
        />
      </div>
      
      <div className="max-w-3xl mx-auto p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">テスト用メモ:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 最初の送信はエラーになります（バリデーションテスト用）</li>
          <li>• 2回目以降の送信は成功します</li>
          <li>• 体重、身長、頭囲、胸囲のうち少なくとも1つは必須です</li>
          <li>• 各値には適切な範囲制限があります</li>
          <li>• 値を入力すると測定値サマリーが表示されます</li>
        </ul>
      </div>
    </div>
  );
}

export const ValidationTest: Story = {
  render: () => <ValidationTestComponent />,
};

function UnitConversionDemoComponent() {
  const [measurements, setMeasurements] = React.useState({
    weight_g: 5200,
    height_cm: 62.3,
    head_circumference_cm: 39.8,
    chest_circumference_cm: 37.2,
  });

  const updateMeasurement = (field: keyof typeof measurements, value: number) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="max-w-3xl mx-auto p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">単位変換デモ:</h3>
        <p className="text-sm text-gray-600 mb-3">
          スライダーで値を変更すると、リアルタイムで単位変換が表示されます。
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">体重 (g)</label>
            <input
              type="range"
              min="2000"
              max="12000"
              step="100"
              value={measurements.weight_g}
              onChange={(e) => updateMeasurement('weight_g', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">
              {measurements.weight_g}g = {(measurements.weight_g / 1000).toFixed(2)}kg
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">身長 (cm)</label>
            <input
              type="range"
              min="45"
              max="80"
              step="0.1"
              value={measurements.height_cm}
              onChange={(e) => updateMeasurement('height_cm', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">{measurements.height_cm}cm</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">頭囲 (cm)</label>
            <input
              type="range"
              min="30"
              max="50"
              step="0.1"
              value={measurements.head_circumference_cm}
              onChange={(e) => updateMeasurement('head_circumference_cm', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">{measurements.head_circumference_cm}cm</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">胸囲 (cm)</label>
            <input
              type="range"
              min="25"
              max="45"
              step="0.1"
              value={measurements.chest_circumference_cm}
              onChange={(e) => updateMeasurement('chest_circumference_cm', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">{measurements.chest_circumference_cm}cm</div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <GrowthRecordForm
          key={JSON.stringify(measurements)} // フォームリセット用
          initialData={{
            metadata: measurements,
          }}
          onSubmit={async (data) => {
            console.log('Unit conversion demo:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('測定値が保存されました！');
          }}
        />
      </div>
    </div>
  );
}

export const UnitConversionDemo: Story = {
  render: () => <UnitConversionDemoComponent />,
};

export const MobileView: Story = {
  render: () => (
    <div className="w-full max-w-sm mx-auto p-4 bg-white rounded-lg shadow-lg">
      <GrowthRecordForm
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

function AgeProgressionComponent() {
  const ageProgression = [
    { age: '新生児', weight: 3200, height: 52, head: 35.5, chest: 33 },
    { age: '1ヶ月', weight: 4100, height: 54.5, head: 37.2, chest: 34.8 },
    { age: '3ヶ月', weight: 6200, height: 61.5, head: 40.2, chest: 38.5 },
    { age: '6ヶ月', weight: 8000, height: 67.0, head: 43.0, chest: 41.5 },
  ];

  const [selectedAge, setSelectedAge] = React.useState(0);
  const currentData = ageProgression[selectedAge];

  return (
    <div className="space-y-4">
      <div className="max-w-3xl mx-auto p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">成長の経過デモ:</h3>
        <div className="flex gap-2 mb-3">
          {ageProgression.map((data, index) => (
            <button
              key={index}
              onClick={() => setSelectedAge(index)}
              className={`px-3 py-1 rounded text-sm ${
                selectedAge === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {data.age}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          現在表示中: {currentData.age} - 
          体重: {(currentData.weight / 1000).toFixed(1)}kg, 
          身長: {currentData.height}cm, 
          頭囲: {currentData.head}cm, 
          胸囲: {currentData.chest}cm
        </div>
      </div>
      
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <GrowthRecordForm
          key={selectedAge} // フォームリセット用
          initialData={{
            metadata: {
              weight_g: currentData.weight,
              height_cm: currentData.height,
              head_circumference_cm: currentData.head,
              chest_circumference_cm: currentData.chest,
              note: `${currentData.age}の測定記録`,
            },
          }}
          onSubmit={async (data) => {
            console.log('Age progression submission:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert(`${currentData.age}の成長記録が保存されました！`);
          }}
        />
      </div>
    </div>
  );
}

export const AgeProgression: Story = {
  render: () => <AgeProgressionComponent />,
};