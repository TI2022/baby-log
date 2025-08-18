/**
 * Baby Log API Client
 * Axiosベースの統一API通信ライブラリ
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 環境変数から設定を取得
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

/**
 * Axios インスタンスの作成
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // リクエストインターセプター（認証ヘッダー自動付与）
  client.interceptors.request.use(
    (config) => {
      // モック環境では認証ヘッダーをスキップ
      if (!USE_MOCK) {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // デバッグログ
      if (DEBUG_MODE) {
        console.info(`🚀 API Request [${USE_MOCK ? 'MOCK' : 'REAL'}]:`, {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // レスポンスインターセプター（エラーハンドリング）
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // デバッグログ
      if (DEBUG_MODE) {
        console.info(`✅ API Response [${USE_MOCK ? 'MOCK' : 'REAL'}]:`, {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }
      return response;
    },
    (error) => {
      // デバッグログ
      if (DEBUG_MODE) {
        console.error(`❌ API Error [${USE_MOCK ? 'MOCK' : 'REAL'}]:`, {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        });
      }

      // 実API環境でのみ401エラー時の自動ログアウト
      if (!USE_MOCK && error.response?.status === 401) {
        removeToken();
        
        // ブラウザ環境でのみリダイレクト
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// API Client インスタンス
export const apiClient = createApiClient();

/**
 * Token管理関数
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('baby_log_token');
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('baby_log_token', token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('baby_log_token');
  }
};

/**
 * API レスポンス型定義
 */
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

/**
 * 認証API
 */
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

export interface AuthResponse {
  user: User;
  token: string;
}

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

export const authApi = {
  // ユーザー登録
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/api/auth/register', data),

  // ログイン
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/api/auth/login', data),

  // ログアウト
  logout: () =>
    apiClient.delete('/api/auth/logout'),

  // 現在のユーザー情報取得
  me: () =>
    apiClient.get<User>('/api/auth/me'),
};

/**
 * 記録API
 */
export interface Record {
  id: string;
  user_id: string;
  type: 'milk' | 'diaper' | 'sleep' | 'growth';
  recorded_at: string;
  recorded_by: 'mama' | 'papa' | 'unknown';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateRecordRequest {
  type: Record['type'];
  recorded_at: string;
  recorded_by: Record['recorded_by'];
  metadata: Record<string, any>;
}

export interface GetRecordsParams {
  page?: number;
  per_page?: number;
  type?: Record['type'];
  date_from?: string;
  date_to?: string;
  recorded_by?: Record['recorded_by'];
}

export const recordsApi = {
  // 記録一覧取得
  getRecords: (params?: GetRecordsParams) =>
    apiClient.get<Record[]>('/api/records', { params }),

  // 記録作成
  createRecord: (data: CreateRecordRequest) =>
    apiClient.post<Record>('/api/records', data),

  // 記録詳細取得
  getRecord: (id: string) =>
    apiClient.get<Record>(`/api/records/${id}`),

  // 記録更新
  updateRecord: (id: string, data: Partial<CreateRecordRequest>) =>
    apiClient.put<Record>(`/api/records/${id}`, data),

  // 記録削除
  deleteRecord: (id: string) =>
    apiClient.delete(`/api/records/${id}`),
};

/**
 * ユーザープロフィールAPI
 */
export interface UpdateProfileRequest {
  display_name?: string;
  baby_name?: string;
  baby_birthday?: string;
  avatar_url?: string;
  timezone?: string;
}

export const usersApi = {
  // プロフィール取得
  getProfile: () =>
    apiClient.get<User>('/api/users/profile'),

  // プロフィール更新
  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<User>('/api/users/profile', data),
};

/**
 * 便利関数
 */
export const isApiError = (error: any): error is ApiError => {
  return error?.response?.data?.errors !== undefined;
};

export const getApiErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.response.data.errors.join(', ');
  }
  return error?.message || '不明なエラーが発生しました';
};

/**
 * デフォルトエクスポート
 */
export default {
  auth: authApi,
  records: recordsApi,
  users: usersApi,
  client: apiClient,
  token: {
    get: getToken,
    set: setToken,
    remove: removeToken,
  },
};