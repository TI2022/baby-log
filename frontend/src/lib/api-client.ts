/**
 * APIクライアントラッパー
 * 自動生成されたAPIクライアントのカスタマイズ
 */

import { 
  AuthApi, 
  RecordsApi, 
  UsersApi, 
  PartnershipsApi,
  Configuration,
  type AuthResponse,
  type User,
  type Record,
  type RecordCreateRequest,
  type RecordUpdateRequest,
  type RecordListResponse,
  type UserLoginRequest,
  type UserRegistrationRequest,
  type UserUpdateRequest,
  type PartnershipCreateRequest,
  type PartnershipUpdateRequest
} from '@/api/generated';
import { AxiosError } from 'axios';

// API設定
const createConfiguration = (): Configuration => {
  return new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    accessToken: () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token') || '';
      }
      return '';
    },
  });
};

// API インスタンス
export const authApi = new AuthApi(createConfiguration());
export const recordsApi = new RecordsApi(createConfiguration());
export const usersApi = new UsersApi(createConfiguration());
export const partnershipsApi = new PartnershipsApi(createConfiguration());

// エラーハンドリング用のヘルパー
export interface ApiError {
  message: string;
  errors?: string[];
  status?: number;
}

const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const response = error.response;
    if (response?.data) {
      return {
        message: response.data.errors?.[0] || error.message,
        errors: response.data.errors,
        status: response.status,
      };
    }
  }
  
  return {
    message: error instanceof Error ? error.message : 'Unknown error occurred',
  };
};

// 認証API
export const authService = {
  async login(credentials: UserLoginRequest): Promise<AuthResponse> {
    try {
      const response = await authApi.apiAuthLoginPost({ userLoginRequest: credentials });
      
      // トークンをローカルストレージに保存
      if (response.data.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async register(userData: UserRegistrationRequest): Promise<AuthResponse> {
    try {
      const response = await authApi.apiAuthRegisterPost({ userRegistrationRequest: userData });
      
      // トークンをローカルストレージに保存
      if (response.data.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await authApi.apiAuthLogoutDelete();
      
      // ローカルストレージからトークンを削除
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      // ログアウトエラーでもトークンは削除
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      throw handleApiError(error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await authApi.apiAuthMeGet();
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }
};

// 記録API
export const recordsService = {
  async getRecords(params?: {
    page?: number;
    perPage?: number;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<RecordListResponse> {
    try {
      const response = await recordsApi.apiRecordsGet({
        page: params?.page,
        perPage: params?.perPage,
        type: params?.type,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getRecord(id: string): Promise<Record> {
    try {
      const response = await recordsApi.apiRecordsIdGet({ id });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async createRecord(recordData: RecordCreateRequest): Promise<Record> {
    try {
      const response = await recordsApi.apiRecordsPost({ recordCreateRequest: recordData });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateRecord(id: string, recordData: RecordUpdateRequest): Promise<Record> {
    try {
      const response = await recordsApi.apiRecordsIdPut({ 
        id, 
        recordUpdateRequest: recordData 
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deleteRecord(id: string): Promise<void> {
    try {
      await recordsApi.apiRecordsIdDelete({ id });
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// ユーザーAPI
export const usersService = {
  async getProfile(): Promise<User> {
    try {
      const response = await usersApi.apiUsersProfileGet();
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateProfile(userData: UserUpdateRequest): Promise<User> {
    try {
      const response = await usersApi.apiUsersProfilePut({ userUpdateRequest: userData });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// パートナーシップAPI
export const partnershipsService = {
  async getPartnerships() {
    try {
      const response = await partnershipsApi.apiPartnershipsGet();
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async createPartnership(data: PartnershipCreateRequest) {
    try {
      const response = await partnershipsApi.apiPartnershipsPost({ 
        partnershipCreateRequest: data 
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updatePartnership(id: string, data: PartnershipUpdateRequest) {
    try {
      const response = await partnershipsApi.apiPartnershipsIdPut({ 
        id, 
        partnershipUpdateRequest: data 
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// 統合クライアント（従来のインターフェース互換性のため）
export const apiClient = {
  auth: authService,
  records: recordsService,
  users: usersService,
  partnerships: partnershipsService,
};

// カスタムフック用のクライアント
export const useApiClient = () => {
  return apiClient;
};

// デフォルトエクスポート
export default apiClient;