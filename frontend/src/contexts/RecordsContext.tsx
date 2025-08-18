'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
// axiosの依存関係問題を避けるためfetch-clientを使用
import { Record as BabyLogRecord, fetchRecordApi as recordApi } from '@/lib/fetch-client';

// 記録状態の型定義
interface RecordsState {
  records: BabyLogRecord[];
  isLoading: boolean;
  error: string | null;
}

// アクションの型定義
type RecordsAction =
  | { type: 'SET_RECORDS'; payload: BabyLogRecord[] }
  | { type: 'ADD_RECORD'; payload: BabyLogRecord }
  | { type: 'UPDATE_RECORD'; payload: { id: string; updates: Partial<BabyLogRecord> } }
  | { type: 'DELETE_RECORD'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// 初期状態
const initialState: RecordsState = {
  records: [],
  isLoading: false,
  error: null,
};

// Reducer関数
function recordsReducer(state: RecordsState, action: RecordsAction): RecordsState {
  switch (action.type) {
    case 'SET_RECORDS':
      return {
        ...state,
        records: action.payload,
        error: null,
      };
    case 'ADD_RECORD':
      return {
        ...state,
        records: [action.payload, ...state.records].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
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
      };
    default:
      return state;
  }
}

// Context作成
interface RecordsContextType extends RecordsState {
  fetchRecords: (params?: { page?: number; per_page?: number; type?: BabyLogRecord['type']; date_from?: string; date_to?: string }) => Promise<void>;
  createRecord: (recordData: { type_name: BabyLogRecord['type']; timestamp: string; metadata?: Record<string, any> }) => Promise<any>;
  updateRecord: (id: string, updates: { timestamp?: string; metadata?: Record<string, any> }) => Promise<any>;
  deleteRecord: (id: string) => Promise<void>;
  setRecords: (records: BabyLogRecord[]) => void;
  addRecord: (record: BabyLogRecord) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  removeLocalRecord: (id: string) => void;
  
  // Getter関数
  getRecordsByType: (type: BabyLogRecord['type']) => BabyLogRecord[];
  getRecordsForDate: (date: string) => BabyLogRecord[];
  getLatestRecords: (limit?: number) => BabyLogRecord[];
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

// Provider コンポーネント
interface RecordsProviderProps {
  children: ReactNode;
}

export function RecordsProvider({ children }: RecordsProviderProps) {
  const [state, dispatch] = useReducer(recordsReducer, initialState);

  const fetchRecords = async (params?: { page?: number; per_page?: number; type?: BabyLogRecord['type']; date_from?: string; date_to?: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await recordApi.getRecords();
      dispatch({ type: 'SET_RECORDS', payload: response });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch records' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createRecord = async (recordData: { type_name: BabyLogRecord['type']; timestamp: string; metadata?: Record<string, any> }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const newRecordData = {
        user_id: 'current-user',
        type: recordData.type_name,
        timestamp: recordData.timestamp,
        metadata: recordData.metadata || {}
      };
      const response = await recordApi.createRecord(newRecordData);
      dispatch({ type: 'ADD_RECORD', payload: response });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create record';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Create record error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateRecord = async (id: string, updates: { timestamp?: string; metadata?: Record<string, any> }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await recordApi.updateRecord(id, updates);
      dispatch({ type: 'UPDATE_RECORD', payload: { id, updates: response } });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update record';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Update record error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      await recordApi.deleteRecord(id);
      dispatch({ type: 'DELETE_RECORD', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete record';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Delete record error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setRecords = (records: BabyLogRecord[]) => {
    dispatch({ type: 'SET_RECORDS', payload: records });
  };

  const addRecord = (record: BabyLogRecord) => {
    dispatch({ type: 'ADD_RECORD', payload: record });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  // 一時レコード（temp-で始まるID）をローカル状態からのみ削除
  const removeLocalRecord = (id: string) => {
    dispatch({ type: 'DELETE_RECORD', payload: id });
  };

  // Getter関数
  const getRecordsByType = (type: BabyLogRecord['type']) => {
    return state.records.filter((record) => record.type === type);
  };

  const getRecordsForDate = (date: string) => {
    const targetDate = new Date(date).toDateString();
    return state.records.filter((record) =>
      new Date(record.timestamp).toDateString() === targetDate
    );
  };

  const getLatestRecords = (limit = 10) => {
    return state.records.slice(0, limit);
  };

  const value: RecordsContextType = {
    ...state,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    setRecords,
    addRecord,
    setLoading,
    setError,
    removeLocalRecord,
    getRecordsByType,
    getRecordsForDate,
    getLatestRecords,
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