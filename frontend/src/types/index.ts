/**
 * 統合型定義ファイル
 * 自動生成された型とカスタム型の統合
 */

// 自動生成されたAPI型をre-export
export type {
  // 認証関連
  AuthResponse,
  User,
  UserLoginRequest,
  UserRegistrationRequest,
  UserUpdateRequest,
  
  // 記録関連
  Record,
  RecordType,
  RecordCreateRequest,
  RecordUpdateRequest,
  RecordListResponse,
  
  // パートナーシップ関連
  Partnership,
  PartnershipStatus,
  PartnershipCreateRequest,
  PartnershipUpdateRequest,
  
  // 共通
  ErrorResponse,
  PaginationInfo,
} from '@/api/generated';

// OpenAPIから生成された型の拡張
import type { 
  Record as ApiRecord, 
  RecordType as ApiRecordType,
  User as ApiUser
} from '@/api/generated';

// カスタム型定義（既存のアプリケーション用）
export type RecordedBy = 'mama' | 'papa' | 'unknown';

// Record型の拡張（既存のインターフェースとの互換性のため）
export interface ExtendedRecord extends Omit<ApiRecord, 'metadata' | 'recorded_by'> {
  recorded_by: RecordedBy;
  recorded_at: string; // timestampからrecorded_atにマッピング
  metadata: {
    // ミルク記録
    amount_ml?: number;
    milk_type?: 'breast' | 'formula';
    duration_minutes?: number;
    
    // おむつ記録
    diaper_type?: 'pee' | 'poop' | 'both';
    condition?: 'normal' | 'loose' | 'hard';
    
    // 睡眠記録
    start_time?: string;
    end_time?: string;
    quality?: 'good' | 'normal' | 'poor';
    location?: 'crib' | 'arms' | 'stroller' | 'other';
    
    // 成長記録
    weight_g?: number;
    height_cm?: number;
    head_circumference_cm?: number;
    
    // 共通
    note?: string;
    notes?: string; // API互換性
    [key: string]: any;
  };
}

// アプリケーション用のRecord型（既存コードとの互換性）
export type { ExtendedRecord as Record };

// フィルター用の型定義
export interface RecordFilters {
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
  type?: ApiRecordType;
  recorded_by?: RecordedBy;
  search?: string;
  sort_by?: 'recorded_at' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

// UI関連の型定義
export interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// テーマ関連
export interface Theme {
  colors: {
    primary: {
      50: string;
      100: string;
      500: string;
      600: string;
      700: string;
    };
    gray: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// API エラー型
export interface ApiError {
  message: string;
  errors?: string[];
  status?: number;
}

// React関連の型定義
export interface PropsWithClassName {
  className?: string;
}

export interface PropsWithChildren {
  children: React.ReactNode;
}

// ページネーション情報の型
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 統計情報の型
export interface RecordStats {
  totalCount: number;
  typeBreakdown: {
    [key in ApiRecordType]: number;
  };
  recordedByBreakdown: {
    [key in RecordedBy]: number;
  };
  dateRange: {
    earliest: string;
    latest: string;
  };
}

// ダッシュボード用の型
export interface DashboardStats {
  today: {
    totalRecords: number;
    milkAmount: number;
    milkCount: number;
    sleepDuration: number;
    diaperCount: number;
    lastRecord?: ExtendedRecord;
  };
  thisWeek: {
    totalRecords: number;
    averagePerDay: number;
    comparison: {
      vs_last_week: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
}

// 通知・アラートの型
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// フォーム関連の型
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
}

export interface FormState<T> {
  fields: T;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

// 設定・プリファレンス
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'ja' | 'en';
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  timeFormat: '24h' | '12h';
  notifications: {
    email: boolean;
    push: boolean;
    recordReminders: boolean;
  };
}