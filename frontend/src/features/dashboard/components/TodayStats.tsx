/**
 * 今日の統計コンポーネント
 * 記録回数、総量表示、担当者別統計
 */

'use client';

import React from 'react';
import { RecordTypeIcon, Icon } from '@/components/ui';
import { useRecords } from '@/contexts/RecordsContext';
import type { Record, RecordType, RecordedBy } from '@/types';

interface TodayStatsProps {
  className?: string;
  showDetailed?: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  subText?: string;
  color?: string;
  onClick?: () => void;
}

function StatCard({ icon, title, value, unit, subText, color = 'blue', onClick }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    gray: 'bg-gray-50 border-gray-200 text-gray-600',
    pink: 'bg-pink-50 border-pink-200 text-pink-600',
  };

  return (
    <div 
      className={`p-4 rounded-lg border-2 transition-all ${colorClasses[color as keyof typeof colorClasses]} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-700">{title}</div>
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {unit && <div className="text-sm text-gray-600">{unit}</div>}
          </div>
          {subText && (
            <div className="text-xs text-gray-500 mt-1">{subText}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TodayStats({ className = '', showDetailed = true }: TodayStatsProps) {
  const { records, isLoading, error, getRecordsForDate } = useRecords();

  // 今日の日付
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = getRecordsForDate(today);

  // 基本統計の計算
  const calculateBasicStats = () => {
    const stats = {
      total: todayRecords.length,
      milk: todayRecords.filter(r => r.type === 'milk').length,
      diaper: todayRecords.filter(r => r.type === 'diaper').length,
      sleep: todayRecords.filter(r => r.type === 'sleep').length,
      growth: todayRecords.filter(r => r.type === 'growth').length,
    };

    return stats;
  };

  // 詳細統計の計算
  const calculateDetailedStats = () => {
    // ミルク統計
    const milkRecords = todayRecords.filter(r => r.type === 'milk');
    const totalMilkAmount = milkRecords.reduce((sum, record) => {
      const metadata = record.metadata as any;
      return sum + (metadata.amount_ml || 0);
    }, 0);
    const avgMilkAmount = milkRecords.length > 0 ? Math.round(totalMilkAmount / milkRecords.length) : 0;

    // 睡眠統計
    const sleepRecords = todayRecords.filter(r => r.type === 'sleep');
    const totalSleepMinutes = sleepRecords.reduce((sum, record) => {
      const metadata = record.metadata as any;
      return sum + (metadata.duration_minutes || 0);
    }, 0);
    const sleepHours = Math.floor(totalSleepMinutes / 60);
    const sleepMinutes = totalSleepMinutes % 60;

    // おむつ統計
    const diaperRecords = todayRecords.filter(r => r.type === 'diaper');
    const diaperStats = {
      pee: diaperRecords.filter(r => (r.metadata as any).diaper_type === 'pee' || (r.metadata as any).diaper_type === 'both').length,
      poop: diaperRecords.filter(r => (r.metadata as any).diaper_type === 'poop' || (r.metadata as any).diaper_type === 'both').length,
    };

    // 担当者別統計
    const byRecordedBy = {
      mama: todayRecords.filter(r => r.recorded_by === 'mama').length,
      papa: todayRecords.filter(r => r.recorded_by === 'papa').length,
      unknown: todayRecords.filter(r => r.recorded_by === 'unknown').length,
    };

    // 時間帯別統計
    const hourlyStats = Array.from({ length: 24 }, (_, hour) => {
      const count = todayRecords.filter(record => {
        const recordHour = new Date(record.recorded_at).getHours();
        return recordHour === hour;
      }).length;
      return { hour, count };
    });

    const peakHour = hourlyStats.reduce((peak, current) => 
      current.count > peak.count ? current : peak
    );

    return {
      milk: {
        total: totalMilkAmount,
        average: avgMilkAmount,
        count: milkRecords.length,
      },
      sleep: {
        totalMinutes: totalSleepMinutes,
        hours: sleepHours,
        minutes: sleepMinutes,
        count: sleepRecords.length,
      },
      diaper: {
        ...diaperStats,
        total: diaperRecords.length,
      },
      byRecordedBy,
      peakHour,
    };
  };

  const basicStats = calculateBasicStats();
  const detailedStats = showDetailed ? calculateDetailedStats() : null;

  // 前日との比較
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const yesterdayRecords = getRecordsForDate(yesterday);
  const comparison = {
    total: basicStats.total - yesterdayRecords.length,
    milk: basicStats.milk - yesterdayRecords.filter(r => r.type === 'milk').length,
    diaper: basicStats.diaper - yesterdayRecords.filter(r => r.type === 'diaper').length,
    sleep: basicStats.sleep - yesterdayRecords.filter(r => r.type === 'sleep').length,
  };

  const getComparisonText = (diff: number) => {
    if (diff > 0) return `昨日より+${diff}`;
    if (diff < 0) return `昨日より${diff}`;
    return '昨日と同じ';
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          今日の統計
        </h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
            weekday: 'short',
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* 基本統計 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={<Icon name="clipboard" size="lg" />}
          title="総記録"
          value={basicStats.total}
          unit="件"
          subText={getComparisonText(comparison.total)}
          color="gray"
        />
        
        <StatCard
          icon={<RecordTypeIcon type="milk" size="lg" variant="emoji" />}
          title="ミルク"
          value={basicStats.milk}
          unit="回"
          subText={getComparisonText(comparison.milk)}
          color="blue"
        />
        
        <StatCard
          icon={<RecordTypeIcon type="diaper" size="lg" variant="emoji" />}
          title="おむつ"
          value={basicStats.diaper}
          unit="回"
          subText={getComparisonText(comparison.diaper)}
          color="yellow"
        />
        
        <StatCard
          icon={<RecordTypeIcon type="sleep" size="lg" variant="emoji" />}
          title="睡眠"
          value={basicStats.sleep}
          unit="回"
          subText={getComparisonText(comparison.sleep)}
          color="purple"
        />
        
        <StatCard
          icon={<RecordTypeIcon type="growth" size="lg" variant="emoji" />}
          title="成長"
          value={basicStats.growth}
          unit="回"
          color="green"
        />
      </div>

      {/* 詳細統計 */}
      {showDetailed && detailedStats && (
        <>
          {/* ミルク・睡眠詳細 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ミルク詳細 */}
            {detailedStats.milk.count > 0 && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <RecordTypeIcon type="milk" size="sm" variant="emoji" />
                  ミルク詳細
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">総量</span>
                    <span className="font-semibold">{detailedStats.milk.total}ml</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">平均</span>
                    <span className="font-semibold">{detailedStats.milk.average}ml</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">回数</span>
                    <span className="font-semibold">{detailedStats.milk.count}回</span>
                  </div>
                </div>
              </div>
            )}

            {/* 睡眠詳細 */}
            {detailedStats.sleep.count > 0 && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <RecordTypeIcon type="sleep" size="sm" variant="emoji" />
                  睡眠詳細
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">総睡眠時間</span>
                    <span className="font-semibold">
                      {detailedStats.sleep.hours}時間{detailedStats.sleep.minutes}分
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">平均</span>
                    <span className="font-semibold">
                      {Math.round(detailedStats.sleep.totalMinutes / detailedStats.sleep.count)}分
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">回数</span>
                    <span className="font-semibold">{detailedStats.sleep.count}回</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 担当者別統計 */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="users" size="sm" />
              担当者別統計
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard
                icon="👩"
                title="ママ"
                value={detailedStats.byRecordedBy.mama}
                unit="件"
                color="pink"
              />
              <StatCard
                icon="👨"
                title="パパ"
                value={detailedStats.byRecordedBy.papa}
                unit="件"
                color="blue"
              />
              <StatCard
                icon="👤"
                title="その他"
                value={detailedStats.byRecordedBy.unknown}
                unit="件"
                color="gray"
              />
            </div>
          </div>

          {/* 時間帯統計 */}
          {detailedStats.peakHour.count > 0 && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Icon name="clock" size="sm" />
                活動パターン
              </h3>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-blue-600">
                  {detailedStats.peakHour.hour}時台
                </div>
                <div className="text-sm text-gray-600">
                  最も活動的な時間帯 ({detailedStats.peakHour.count}件)
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 空の状態 */}
      {basicStats.total === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            今日はまだ記録がありません
          </h3>
          <p className="text-gray-600 mb-6">
            記録を追加して赤ちゃんの一日を振り返りましょう
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <span className="mr-2">+</span>
            最初の記録を追加
          </button>
        </div>
      )}
    </div>
  );
}

export default TodayStats;