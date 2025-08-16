/**
 * Records Context - 記録データの状態管理
 * 全記録タイプ（ミルク・おむつ・睡眠・成長）のCRUD操作を管理
 */

'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { recordsApi } from '@/lib/api';
import type { 
  Record, 
  RecordType, 
  RecordedBy, 
  CreateRecordData, 
  RecordFilters,
  PaginatedResponse
} from '@/types';

// 記録状態の型定義
interface RecordsState {
  records: Record[];
  isLoading: boolean;
  error: string | null;
  filters: RecordFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    perPage: number;
  };
}

// アクションの型定義
type RecordsAction =
  | { type: 'SET_RECORDS'; payload: { records: Record[]; pagination?: PaginatedResponse<Record>['pagination'] } }
  | { type: 'ADD_RECORD'; payload: Record }
  | { type: 'UPDATE_RECORD'; payload: { id: string; updates: Partial<Record> } }
  | { type: 'DELETE_RECORD'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<RecordFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'CLEAR_ERROR' };

// 初期状態
const initialState: RecordsState = {
  records: [],
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 20,
  },
};

// Reducer関数
function recordsReducer(state: RecordsState, action: RecordsAction): RecordsState {
  switch (action.type) {
    case 'SET_RECORDS':
      return {
        ...state,
        records: action.payload.records,
        pagination: action.payload.pagination || state.pagination,
        error: null,
      };
    
    case 'ADD_RECORD':
      return {
        ...state,
        records: [action.payload, ...state.records].sort(
          (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
        ),
        pagination: {
          ...state.pagination,
          totalCount: state.pagination.totalCount + 1,
        },
      };
    
    case 'UPDATE_RECORD':
      return {
        ...state,
        records: state.records.map((record) =>
          record.id === action.payload.id
            ? { ...record, ...action.payload.updates }
            : record
        ),
      };
    
    case 'DELETE_RECORD':
      return {
        ...state,
        records: state.records.filter((record) => record.id !== action.payload),
        pagination: {
          ...state.pagination,
          totalCount: Math.max(0, state.pagination.totalCount - 1),
        },
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {},
      };
    
    default:
      return state;
  }
}

// Context型定義
interface RecordsContextType extends RecordsState {
  // CRUD操作
  fetchRecords: (filters?: RecordFilters) => Promise<void>;
  createRecord: (recordData: CreateRecordData) => Promise<Record>;
  updateRecord: (id: string, updates: Partial<Record>) => Promise<Record>;
  deleteRecord: (id: string) => Promise<void>;
  
  // フィルタリング・検索
  setFilters: (filters: Partial<RecordFilters>) => void;
  resetFilters: () => void;
  
  // エラーハンドリング
  clearError: () => void;
  
  // ローカル状態操作（楽観的更新用）
  addLocalRecord: (record: Record) => void;
  updateLocalRecord: (id: string, updates: Partial<Record>) => void;
  removeLocalRecord: (id: string) => void;
  
  // ユーティリティ関数
  getRecordsByType: (type: RecordType) => Record[];
  getRecordsForDate: (date: string) => Record[];
  getLatestRecords: (limit?: number) => Record[];
  getRecordsByRecordedBy: (recordedBy: RecordedBy) => Record[];
  
  // ページネーション
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

// Provider コンポーネント
interface RecordsProviderProps {
  children: ReactNode;
}

export function RecordsProvider({ children }: RecordsProviderProps) {
  const [state, dispatch] = useReducer(recordsReducer, initialState);

  // 記録一覧取得
  const fetchRecords = async (filters?: RecordFilters) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const mergedFilters = { ...state.filters, ...filters };
      const response = await recordsApi.getRecords(mergedFilters);
      
      // レスポンスの型に応じて処理
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        // シンプルな配列レスポンス
        dispatch({ 
          type: 'SET_RECORDS', 
          payload: { 
            records: responseData
          } 
        });
      } else {
        // ページネーション対応のレスポンス
        dispatch({ 
          type: 'SET_RECORDS', 
          payload: { 
            records: responseData || [],
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalCount: responseData?.length || 0,
              perPage: state.pagination.perPage,
            }
          } 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '記録の取得に失敗しました';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Fetch records error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 記録作成
  const createRecord = async (recordData: CreateRecordData): Promise<Record> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await recordsApi.createRecord(recordData);
      const newRecord = response.data;
      
      dispatch({ type: 'ADD_RECORD', payload: newRecord });
      return newRecord;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '記録の作成に失敗しました';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Create record error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 記録更新
  const updateRecord = async (id: string, updates: Partial<Record>): Promise<Record> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await recordsApi.updateRecord(id, updates);
      const updatedRecord = response.data;
      
      dispatch({ type: 'UPDATE_RECORD', payload: { id, updates: updatedRecord } });
      return updatedRecord;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '記録の更新に失敗しました';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Update record error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 記録削除
  const deleteRecord = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      await recordsApi.deleteRecord(id);
      dispatch({ type: 'DELETE_RECORD', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '記録の削除に失敗しました';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Delete record error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // フィルター設定
  const setFilters = (filters: Partial<RecordFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // フィルターリセット
  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  // エラークリア
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // ローカル状態操作（楽観的更新用）
  const addLocalRecord = (record: Record) => {
    dispatch({ type: 'ADD_RECORD', payload: record });
  };

  const updateLocalRecord = (id: string, updates: Partial<Record>) => {
    dispatch({ type: 'UPDATE_RECORD', payload: { id, updates } });
  };

  const removeLocalRecord = (id: string) => {
    dispatch({ type: 'DELETE_RECORD', payload: id });
  };

  // ユーティリティ関数
  const getRecordsByType = (type: RecordType): Record[] => {
    return state.records.filter(record => record.type === type);
  };

  const getRecordsForDate = (date: string): Record[] => {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);
    
    return state.records.filter(record => {
      const recordDate = new Date(record.recorded_at);
      return recordDate >= startOfDay && recordDate <= endOfDay;
    });
  };

  const getLatestRecords = (limit: number = 10): Record[] => {
    return state.records
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())
      .slice(0, limit);
  };

  const getRecordsByRecordedBy = (recordedBy: RecordedBy): Record[] => {
    return state.records.filter(record => record.recorded_by === recordedBy);
  };

  // ページネーション
  const loadMore = async (): Promise<void> => {
    if (state.pagination.currentPage >= state.pagination.totalPages) {
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const nextPage = state.pagination.currentPage + 1;
      const response = await recordsApi.getRecords({
        ...state.filters,
        page: nextPage,
        per_page: state.pagination.perPage,
      });
      
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        dispatch({ 
          type: 'SET_RECORDS', 
          payload: { 
            records: [...state.records, ...responseData],
            pagination: {
              currentPage: nextPage,
              totalPages: state.pagination.totalPages,
              totalCount: state.pagination.totalCount,
              perPage: state.pagination.perPage,
            }
          } 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '追加の記録取得に失敗しました';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // リフレッシュ
  const refresh = async (): Promise<void> => {
    await fetchRecords();
  };

  const value: RecordsContextType = {
    ...state,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    setFilters,
    resetFilters,
    clearError,
    addLocalRecord,
    updateLocalRecord,
    removeLocalRecord,
    getRecordsByType,
    getRecordsForDate,
    getLatestRecords,
    getRecordsByRecordedBy,
    loadMore,
    refresh,
  };

  return (
    <RecordsContext.Provider value={value}>
      {children}
    </RecordsContext.Provider>
  );
}

// カスタムフック
export function useRecords(): RecordsContextType {
  const context = useContext(RecordsContext);
  if (context === undefined) {
    throw new Error('useRecords must be used within a RecordsProvider');
  }
  return context;
}

export default RecordsProvider;