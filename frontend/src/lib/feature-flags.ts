/**
 * フィーチャーフラグ管理
 * 実務現場での段階的な機能切り替えを可能にする
 */

export interface FeatureFlags {
  // API関連
  optimisticUpdates: boolean;
  detailedLogging: boolean;
  
  // 開発支援
  mockDataVisible: boolean;
  debugInfo: boolean;
  
  // 実験的機能
  newRecordForm: boolean;
  advancedFiltering: boolean;
}

// 環境変数から設定を読み込み（デフォルト値付き）
export const FEATURE_FLAGS: FeatureFlags = {
  optimisticUpdates: process.env.NEXT_PUBLIC_FEATURE_OPTIMISTIC_UPDATES === 'true',
  detailedLogging: process.env.NEXT_PUBLIC_FEATURE_DETAILED_LOGGING === 'true',
  
  mockDataVisible: process.env.NODE_ENV === 'development',
  debugInfo: process.env.NODE_ENV === 'development',
  
  newRecordForm: process.env.NEXT_PUBLIC_FEATURE_NEW_RECORD_FORM === 'true',
  advancedFiltering: process.env.NEXT_PUBLIC_FEATURE_ADVANCED_FILTERING === 'true',
};

// API モード判定
export const API_MODE = process.env.NEXT_PUBLIC_API_MODE as 'mock' | 'real' || 'mock';

// 開発者向けのデバッグ情報
export const DEV_INFO = {
  apiMode: API_MODE,
  features: FEATURE_FLAGS,
  timestamp: new Date().toISOString(),
};

// 実務でよく使う: フィーチャーフラグの動的変更（開発時のみ）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__FEATURE_FLAGS = FEATURE_FLAGS;
  (window as any).__API_MODE = API_MODE;
  console.info('🚩 Feature Flags:', DEV_INFO);
}