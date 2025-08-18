/**
 * Baby Log アプリケーション型定義
 */

// =============================================================================
// 基本型定義
// =============================================================================

export type RecordType = 'milk' | 'diaper' | 'sleep' | 'growth';
export type RecordedBy = 'mama' | 'papa' | 'unknown';
export type MilkType = 'breast' | 'formula' | 'mixed';
export type DiaperType = 'pee' | 'poop' | 'both';
export type SleepQuality = 'good' | 'normal' | 'poor';
export type SleepLocation = 'crib' | 'arms' | 'stroller' | 'other';

// =============================================================================
// ユーザー・認証関連
// =============================================================================

export interface User {
  id: string;
  email: string;
  display_name: string;
  baby_name?: string;
  baby_birthday?: string;
  avatar_url?: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  display_name: string;
  baby_name?: string;
  baby_birthday?: string;
}

// =============================================================================
// 記録関連
// =============================================================================

export interface BaseRecord {
  id: string;
  user_id: string;
  type: RecordType;
  recorded_at: string;
  recorded_by: RecordedBy;
  created_at: string;
  updated_at: string;
}

// ミルク記録のメタデータ
export interface MilkMetadata {
  amount_ml: number;
  milk_type: MilkType;
  duration_minutes?: number;
  note?: string;
}

// おむつ記録のメタデータ
export interface DiaperMetadata {
  diaper_type: DiaperType;
  condition?: 'normal' | 'loose' | 'hard';
  color?: string;
  note?: string;
}

// 睡眠記録のメタデータ
export interface SleepMetadata {
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  quality: SleepQuality;
  location: SleepLocation;
  note?: string;
}

// 成長記録のメタデータ
export interface GrowthMetadata {
  weight_g?: number;
  height_cm?: number;
  head_circumference_cm?: number;
  chest_circumference_cm?: number;
  note?: string;
}

// 型安全な記録インターフェース
export interface MilkRecord extends BaseRecord {
  type: 'milk';
  metadata: MilkMetadata;
}

export interface DiaperRecord extends BaseRecord {
  type: 'diaper';
  metadata: DiaperMetadata;
}

export interface SleepRecord extends BaseRecord {
  type: 'sleep';
  metadata: SleepMetadata;
}

export interface GrowthRecord extends BaseRecord {
  type: 'growth';
  metadata: GrowthMetadata;
}

// 統合型
export type Record = MilkRecord | DiaperRecord | SleepRecord | GrowthRecord;

// 記録作成用
export interface CreateRecordData {
  type: RecordType;
  recorded_at: string;
  recorded_by: RecordedBy;
  metadata: MilkMetadata | DiaperMetadata | SleepMetadata | GrowthMetadata;
}

// 記録状態管理
export interface RecordsState {
  records: Record[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  filters: RecordFilters;
}

export interface RecordFilters {
  type?: RecordType;
  recorded_by?: RecordedBy;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

// =============================================================================
// UI・フォーム関連
// =============================================================================

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: string;
}

// クイックアクションボタン
export interface QuickAction {
  type: RecordType;
  icon: string;
  label: string;
  color: string;
}

// ダッシュボード統計
export interface DashboardStats {
  today: {
    totalRecords: number;
    recordsByType: Record<RecordType, number>;
    recordsByPerson: Record<RecordedBy, number>;
    totalMilkAmount: number;
    totalSleepMinutes: number;
  };
  thisWeek: {
    totalRecords: number;
    averagePerDay: number;
    growthChange?: {
      weight_g?: number;
      height_cm?: number;
    };
  };
}

// =============================================================================
// API関連
// =============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  errors: string[];
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

// =============================================================================
// 環境・設定関連
// =============================================================================

export interface AppConfig {
  apiUrl: string;
  useMock: boolean;
  appEnv: 'development' | 'production' | 'test';
  debugMode: boolean;
  version: string;
}

export interface FeatureFlags {
  enableAnalytics: boolean;
  enablePWA: boolean;
  enableOfflineMode: boolean;
}

// =============================================================================
// イベント関連（将来のリアルタイム機能用）
// =============================================================================

export interface RecordEvent {
  type: 'record_created' | 'record_updated' | 'record_deleted';
  record: Record;
  timestamp: string;
}

// =============================================================================
// ユーティリティ型
// =============================================================================

export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// API呼び出し状態
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// 検索・フィルタリング
export interface SearchParams {
  query?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// コンポーネントプロップス
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

// =============================================================================
// React Hook関連
// =============================================================================

export interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: string) => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e?: React.FormEvent) => void;
  reset: (values?: Partial<T>) => void;
}