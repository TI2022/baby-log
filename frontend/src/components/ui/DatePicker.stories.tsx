import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker, TimePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    includeTime: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function DatePickerComponent() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="w-80">
      <DatePicker
        value={date}
        onChange={setDate}
        label="記録日時"
        placeholder="日付を選択してください"
      />
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">
          選択された日付: {date ? date.toLocaleString('ja-JP') : 'なし'}
        </p>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <DatePickerComponent />,
};

function DateTimePickerComponent() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="w-80">
      <DatePicker
        value={date}
        onChange={setDate}
        includeTime
        label="記録日時"
        placeholder="日付と時刻を選択してください"
      />
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">
          選択された日時: {date ? date.toLocaleString('ja-JP') : 'なし'}
        </p>
      </div>
    </div>
  );
}

export const WithTime: Story = {
  render: () => <DateTimePickerComponent />,
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="w-80">
          <h3 className="text-sm font-medium mb-3 text-gray-600 capitalize">{size}</h3>
          <DatePickerComponent />
        </div>
      ))}
    </div>
  ),
};

function RestrictedDatePickerComponent() {
  const [date, setDate] = React.useState<Date | undefined>();
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7); // 7日後まで

  return (
    <div className="w-80">
      <DatePicker
        value={date}
        onChange={setDate}
        minDate={today}
        maxDate={maxDate}
        label="記録日（今日から1週間以内）"
        placeholder="日付を選択してください"
      />
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">
          選択された日付: {date ? date.toLocaleDateString('ja-JP') : 'なし'}
        </p>
      </div>
    </div>
  );
}

export const WithRestrictions: Story = {
  render: () => <RestrictedDatePickerComponent />,
};

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <DatePicker
        value={new Date()}
        disabled
        label="無効な日付選択"
        placeholder="日付を選択してください"
      />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <DatePicker
        label="記録日時"
        placeholder="日付を選択してください"
        error="日付の選択は必須です"
      />
    </div>
  ),
};

export const MultiplePickers: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <DatePickerComponent />
      <DateTimePickerComponent />
      <RestrictedDatePickerComponent />
    </div>
  ),
};

// TimePicker Stories
const TimePickerMeta: Meta<typeof TimePicker> = {
  title: 'UI/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

function TimePickerComponent() {
  const [time, setTime] = React.useState({ hours: 12, minutes: 30 });

  return (
    <div className="w-80">
      <TimePicker
        value={time}
        onChange={setTime}
        label="時刻"
      />
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">
          選択された時刻: {time.hours.toString().padStart(2, '0')}:{time.minutes.toString().padStart(2, '0')}
        </p>
      </div>
    </div>
  );
}

export const TimePickerDefault: StoryObj<typeof TimePicker> = {
  render: () => <TimePickerComponent />,
};

export const TimePickerSizes: StoryObj<typeof TimePicker> = {
  render: () => (
    <div className="space-y-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="w-80">
          <h3 className="text-sm font-medium mb-3 text-gray-600 capitalize">{size}</h3>
          <TimePicker
            value={{ hours: 14, minutes: 30 }}
            size={size}
            label={`時刻選択 (${size})`}
          />
        </div>
      ))}
    </div>
  ),
};

export const TimePickerDisabled: StoryObj<typeof TimePicker> = {
  render: () => (
    <div className="w-80">
      <TimePicker
        value={{ hours: 9, minutes: 0 }}
        disabled
        label="無効な時刻選択"
      />
    </div>
  ),
};

export const TimePickerWithError: StoryObj<typeof TimePicker> = {
  render: () => (
    <div className="w-80">
      <TimePicker
        label="開始時刻"
        error="時刻の選択は必須です"
      />
    </div>
  ),
};