/**
 * useRecords フック
 * RecordsContextを使いやすくラップしたカスタムフック
 */

import { useRecords as useRecordsContext } from '@/contexts/RecordsContext';
import type { Record, RecordType, RecordedBy } from '@/types';

/**
 * 記録管理フック
 * RecordsContextへの便利なインターフェースを提供
 */
export function useRecords() {
  return useRecordsContext();
}

/**
 * 特定タイプの記録を取得するフック
 */
export function useRecordsByType(type: RecordType) {
  const { records, getRecordsByType, ...rest } = useRecords();
  
  return {
    records: getRecordsByType(type),
    ...rest,
  };
}

/**
 * 特定担当者の記録を取得するフック
 */
export function useRecordsByRecordedBy(recordedBy: RecordedBy) {
  const { records, getRecordsByRecordedBy, ...rest } = useRecords();
  
  return {
    records: getRecordsByRecordedBy(recordedBy),
    ...rest,
  };
}

/**
 * 特定日付の記録を取得するフック
 */
export function useRecordsForDate(date: string) {
  const { records, getRecordsForDate, ...rest } = useRecords();
  
  return {
    records: getRecordsForDate(date),
    ...rest,
  };
}

/**
 * 最新記録を取得するフック
 */
export function useLatestRecords(limit?: number) {
  const { records, getLatestRecords, ...rest } = useRecords();
  
  return {
    records: getLatestRecords(limit),
    ...rest,
  };
}

/**
 * 記録統計を計算するフック
 */
export function useRecordStats() {
  const { records } = useRecords();
  
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(record => 
    record.recorded_at.startsWith(today)
  );

  const stats = {
    total: records.length,
    today: todayRecords.length,
    byType: {
      milk: records.filter(r => r.type === 'milk').length,
      diaper: records.filter(r => r.type === 'diaper').length,
      sleep: records.filter(r => r.type === 'sleep').length,
      growth: records.filter(r => r.type === 'growth').length,
    },
    byRecordedBy: {
      mama: records.filter(r => r.recorded_by === 'mama').length,
      papa: records.filter(r => r.recorded_by === 'papa').length,
      unknown: records.filter(r => r.recorded_by === 'unknown').length,
    },
    todayByType: {
      milk: todayRecords.filter(r => r.type === 'milk').length,
      diaper: todayRecords.filter(r => r.type === 'diaper').length,
      sleep: todayRecords.filter(r => r.type === 'sleep').length,
      growth: todayRecords.filter(r => r.type === 'growth').length,
    },
    todayByRecordedBy: {
      mama: todayRecords.filter(r => r.recorded_by === 'mama').length,
      papa: todayRecords.filter(r => r.recorded_by === 'papa').length,
      unknown: todayRecords.filter(r => r.recorded_by === 'unknown').length,
    },
  };

  return stats;
}

/**
 * ミルク記録専用フック
 */
export function useMilkRecords() {
  const context = useRecordsByType('milk');
  
  // ミルク記録特有の統計を計算
  const milkStats = {
    totalAmount: context.records.reduce((sum, record) => {
      if (record.type === 'milk') {
        return sum + (record.metadata.amount_ml || 0);
      }
      return sum;
    }, 0),
    averageAmount: context.records.length > 0 
      ? context.records.reduce((sum, record) => {
          if (record.type === 'milk') {
            return sum + (record.metadata.amount_ml || 0);
          }
          return sum;
        }, 0) / context.records.length 
      : 0,
    byType: {
      breast: context.records.filter(r => r.type === 'milk' && r.metadata.milk_type === 'breast').length,
      formula: context.records.filter(r => r.type === 'milk' && r.metadata.milk_type === 'formula').length,
      mixed: context.records.filter(r => r.type === 'milk' && r.metadata.milk_type === 'mixed').length,
    },
  };

  return {
    ...context,
    stats: milkStats,
  };
}

/**
 * おむつ記録専用フック
 */
export function useDiaperRecords() {
  const context = useRecordsByType('diaper');
  
  // おむつ記録特有の統計を計算
  const diaperStats = {
    byType: {
      pee: context.records.filter(r => r.type === 'diaper' && r.metadata.diaper_type === 'pee').length,
      poop: context.records.filter(r => r.type === 'diaper' && r.metadata.diaper_type === 'poop').length,
      both: context.records.filter(r => r.type === 'diaper' && r.metadata.diaper_type === 'both').length,
    },
  };

  return {
    ...context,
    stats: diaperStats,
  };
}

/**
 * 睡眠記録専用フック
 */
export function useSleepRecords() {
  const context = useRecordsByType('sleep');
  
  // 睡眠記録特有の統計を計算
  const sleepStats = {
    totalDuration: context.records.reduce((sum, record) => {
      if (record.type === 'sleep') {
        return sum + (record.metadata.duration_minutes || 0);
      }
      return sum;
    }, 0),
    averageDuration: context.records.length > 0 
      ? context.records.reduce((sum, record) => {
          if (record.type === 'sleep') {
            return sum + (record.metadata.duration_minutes || 0);
          }
          return sum;
        }, 0) / context.records.length 
      : 0,
    byQuality: {
      good: context.records.filter(r => r.type === 'sleep' && r.metadata.quality === 'good').length,
      normal: context.records.filter(r => r.type === 'sleep' && r.metadata.quality === 'normal').length,
      poor: context.records.filter(r => r.type === 'sleep' && r.metadata.quality === 'poor').length,
    },
    byLocation: {
      crib: context.records.filter(r => r.type === 'sleep' && r.metadata.location === 'crib').length,
      arms: context.records.filter(r => r.type === 'sleep' && r.metadata.location === 'arms').length,
      stroller: context.records.filter(r => r.type === 'sleep' && r.metadata.location === 'stroller').length,
      other: context.records.filter(r => r.type === 'sleep' && r.metadata.location === 'other').length,
    },
  };

  return {
    ...context,
    stats: sleepStats,
  };
}

/**
 * 成長記録専用フック
 */
export function useGrowthRecords() {
  const context = useRecordsByType('growth');
  
  // 成長記録を日付順でソート
  const sortedRecords = [...context.records].sort((a, b) => 
    new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );

  // 最新の測定値を取得
  const latestRecord = sortedRecords[sortedRecords.length - 1];
  const latestMeasurements = latestRecord?.type === 'growth' ? latestRecord.metadata : null;

  // 成長記録特有の統計を計算
  const growthStats = {
    latestWeight: latestMeasurements?.weight_g,
    latestHeight: latestMeasurements?.height_cm,
    latestHeadCircumference: latestMeasurements?.head_circumference_cm,
    latestChestCircumference: latestMeasurements?.chest_circumference_cm,
    measurementCount: {
      weight: context.records.filter(r => r.type === 'growth' && r.metadata.weight_g).length,
      height: context.records.filter(r => r.type === 'growth' && r.metadata.height_cm).length,
      head: context.records.filter(r => r.type === 'growth' && r.metadata.head_circumference_cm).length,
      chest: context.records.filter(r => r.type === 'growth' && r.metadata.chest_circumference_cm).length,
    },
    // 成長傾向（前回との比較）
    growth: sortedRecords.length >= 2 ? (() => {
      const previous = sortedRecords[sortedRecords.length - 2];
      if (previous?.type === 'growth' && latestRecord?.type === 'growth') {
        return {
          weight: latestRecord.metadata.weight_g && previous.metadata.weight_g 
            ? latestRecord.metadata.weight_g - previous.metadata.weight_g 
            : null,
          height: latestRecord.metadata.height_cm && previous.metadata.height_cm
            ? latestRecord.metadata.height_cm - previous.metadata.height_cm
            : null,
          head: latestRecord.metadata.head_circumference_cm && previous.metadata.head_circumference_cm
            ? latestRecord.metadata.head_circumference_cm - previous.metadata.head_circumference_cm
            : null,
          chest: latestRecord.metadata.chest_circumference_cm && previous.metadata.chest_circumference_cm
            ? latestRecord.metadata.chest_circumference_cm - previous.metadata.chest_circumference_cm
            : null,
        };
      }
      return null;
    })() : null,
  };

  return {
    ...context,
    records: sortedRecords,
    stats: growthStats,
  };
}

/**
 * 楽観的更新用フック
 * UI の応答性を向上させるための楽観的更新を簡単に使えるようにする
 */
export function useOptimisticRecords() {
  const { 
    addLocalRecord, 
    updateLocalRecord, 
    removeLocalRecord,
    createRecord,
    updateRecord,
    deleteRecord,
    ...rest 
  } = useRecords();

  const optimisticCreate = async (recordData: Parameters<typeof createRecord>[0]) => {
    // 楽観的更新：まずローカル状態を更新
    const tempRecord: Record = {
      id: `temp-${Date.now()}`,
      user_id: 'current-user',
      type: recordData.type,
      recorded_at: recordData.recorded_at,
      recorded_by: recordData.recorded_by,
      metadata: recordData.metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Record;

    addLocalRecord(tempRecord);

    try {
      // 実際のAPI呼び出し
      const realRecord = await createRecord(recordData);
      
      // 一時的なレコードを削除して実際のレコードに置き換え
      removeLocalRecord(tempRecord.id);
      addLocalRecord(realRecord);
      
      return realRecord;
    } catch (error) {
      // エラー時は楽観的更新を取り消し
      removeLocalRecord(tempRecord.id);
      throw error;
    }
  };

  const optimisticUpdate = async (id: string, updates: Parameters<typeof updateRecord>[1]) => {
    // 楽観的更新：まずローカル状態を更新
    updateLocalRecord(id, updates);

    try {
      // 実際のAPI呼び出し
      const updatedRecord = await updateRecord(id, updates);
      return updatedRecord;
    } catch (error) {
      // エラー時は楽観的更新を取り消し（元の状態に戻す）
      // 実装は複雑になるため、ここではリフレッシュで対応
      rest.refresh();
      throw error;
    }
  };

  const optimisticDelete = async (id: string) => {
    // 楽観的更新：まずローカル状態を更新
    removeLocalRecord(id);

    try {
      // 実際のAPI呼び出し
      await deleteRecord(id);
    } catch (error) {
      // エラー時は楽観的更新を取り消し（リフレッシュで対応）
      rest.refresh();
      throw error;
    }
  };

  return {
    ...rest,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
  };
}

export default useRecords;