/**
 * Fetch API ベースのHTTPクライアント
 * axiosでNode.jsモジュールの問題が発生する場合の代替実装
 */

import { API_MODE, FEATURE_FLAGS } from './feature-flags';

const API_BASE_URL = process.env.NEXT_PUBLIC_RAILS_API_URL || 'http://localhost:3001';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

class FetchClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const requestConfig: RequestInit = {
      method: config.method || 'GET',
      headers,
    };

    if (config.body && config.method !== 'GET') {
      requestConfig.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, requestConfig);
      
      // ログ出力（開発時のデバッグ用）
      if (FEATURE_FLAGS.detailedLogging) {
        console.info(`✅ API Success [${API_MODE}]:`, {
          method: config.method || 'GET',
          url: endpoint,
          status: response.status,
        });
      }

      // 401エラー時は自動ログアウト処理
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (FEATURE_FLAGS.detailedLogging) {
          console.error(`❌ API Error [${API_MODE}]:`, {
            method: config.method || 'GET',
            url: endpoint,
            status: response.status,
            statusText: response.statusText,
            data: errorData,
          });
        }
        
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (FEATURE_FLAGS.detailedLogging) {
        console.error(`❌ API Error [${API_MODE}]:`, {
          method: config.method || 'GET',
          url: endpoint,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: data });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: data });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const fetchClient = new FetchClient(API_BASE_URL);

// 型定義（api.tsと互換性を保つため）
export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Record {
  id: string;
  user_id: string;
  type: 'milk' | 'diaper' | 'sleep' | 'vaccination' | 'growth';
  timestamp: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Token管理関数（クライアントサイドのみ）
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

// API 関数（api.tsと同じインターフェース）
export const fetchAuthApi = {
  login: (email: string, password: string) => 
    fetchClient.post<{ user: User; token: string }>('/api/auth/login', { email, password }),
  
  register: (email: string, password: string, display_name: string) => 
    fetchClient.post<{ user: User; token: string }>('/api/auth/register', { email, password, display_name }),
  
  logout: () => 
    fetchClient.delete<void>('/api/auth/logout'),
  
  me: () => 
    fetchClient.get<User>('/api/auth/me'),
};

export const fetchRecordApi = {
  getRecords: () => fetchClient.get<Record[]>('/api/records'),
  
  createRecord: (data: Omit<Record, 'id' | 'created_at' | 'updated_at'>) => 
    fetchClient.post<Record>('/api/records', data),
  
  updateRecord: (id: string, data: Partial<Record>) => 
    fetchClient.put<Record>(`/api/records/${id}`, data),
  
  deleteRecord: (id: string) => 
    fetchClient.delete(`/api/records/${id}`),
};