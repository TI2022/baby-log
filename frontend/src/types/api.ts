/**
 * API レスポンス型定義
 * OpenAPI仕様と対応する型定義
 */

// =============================================================================
// 認証API
// =============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  display_name: string;
  baby_name?: string;
  baby_birthday?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    display_name: string;
    baby_name?: string;
    baby_birthday?: string;
    avatar_url?: string;
    timezone: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

// =============================================================================
// 記録API
// =============================================================================

export interface GetRecordsRequest {
  page?: number;
  per_page?: number;
  type?: 'milk' | 'diaper' | 'sleep' | 'growth';
  date_from?: string;
  date_to?: string;
  recorded_by?: 'mama' | 'papa' | 'unknown';
}

export interface CreateRecordRequest {
  type: 'milk' | 'diaper' | 'sleep' | 'growth';
  recorded_at: string;
  recorded_by: 'mama' | 'papa' | 'unknown';
  metadata: Record<string, any>;
}

export interface UpdateRecordRequest {
  type?: 'milk' | 'diaper' | 'sleep' | 'growth';
  recorded_at?: string;
  recorded_by?: 'mama' | 'papa' | 'unknown';
  metadata?: Record<string, any>;
}

export interface RecordResponse {
  id: string;
  user_id: string;
  type: 'milk' | 'diaper' | 'sleep' | 'growth';
  recorded_at: string;
  recorded_by: 'mama' | 'papa' | 'unknown';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// ユーザープロフィールAPI
// =============================================================================

export interface UpdateProfileRequest {
  display_name?: string;
  baby_name?: string;
  baby_birthday?: string;
  avatar_url?: string;
  timezone?: string;
}

export interface ProfileResponse {
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

// =============================================================================
// 共通レスポンス型
// =============================================================================

export interface SuccessResponse<T = any> {
  data?: T;
  message?: string;
}

export interface ErrorResponse {
  errors: string[];
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

// =============================================================================
// OpenAPI準拠のスキーマ型
// =============================================================================

export interface HealthResponse {
  status: string;
  message: string;
}

// メタデータのスキーマ型定義（OpenAPIと同期）
export interface MilkMetadataSchema {
  amount_ml: number;
  milk_type: 'breast' | 'formula' | 'mixed';
  duration_minutes?: number;
  note?: string;
}

export interface DiaperMetadataSchema {
  diaper_type: 'pee' | 'poop' | 'both';
  condition?: 'normal' | 'loose' | 'hard';
  color?: string;
  note?: string;
}

export interface SleepMetadataSchema {
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  quality: 'good' | 'normal' | 'poor';
  location: 'crib' | 'arms' | 'stroller' | 'other';
  note?: string;
}

export interface GrowthMetadataSchema {
  weight_g?: number;
  height_cm?: number;
  head_circumference_cm?: number;
  chest_circumference_cm?: number;
  note?: string;
}