'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { authApi, setToken, removeToken, getToken } from '@/lib/api';
import type { User, LoginCredentials, RegisterData } from '@/types';

// 認証状態の型定義
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// アクションの型定義
type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'INITIALIZE'; payload: { user: User | null; token: string | null } };

// 初期状態
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // アプリ起動時は認証状態をチェック中
};

// Reducer関数
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'INITIALIZE':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.user && !!action.payload.token,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Context作成
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider コンポーネント
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // アプリ起動時に localStorage から認証情報を復元
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = getToken();
    
    if (token) {
      // トークンがある場合はユーザー情報を取得
      try {
        const response = await authApi.me();
        dispatch({ type: 'INITIALIZE', payload: { user: response.data, token } });
      } catch (error) {
        console.warn('認証トークンが無効です:', error);
        // トークンが無効な場合は削除
        removeToken();
        dispatch({ type: 'INITIALIZE', payload: { user: null, token: null } });
      }
    } else {
      // モック環境では、認証情報がない場合はダミーユーザーでログイン
      if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
        const dummyUser: User = {
          id: 'demo-user-1',
          email: 'demo@example.com',
          display_name: 'デモユーザー',
          baby_name: 'さくらちゃん',
          baby_birthday: '2024-07-01',
          timezone: 'Asia/Tokyo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const dummyToken = 'demo-token-123';
        
        setToken(dummyToken);
        dispatch({ type: 'INITIALIZE', payload: { user: dummyUser, token: dummyToken } });
      } else {
        dispatch({ type: 'INITIALIZE', payload: { user: null, token: null } });
      }
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.login(credentials);
      const { user, token } = response.data;
      setToken(token);
      dispatch({ type: 'LOGIN', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.register(userData);
      const { user, token } = response.data;
      setToken(token);
      dispatch({ type: 'LOGIN', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // ログアウト API の失敗は無視（モック環境など）
      console.warn('ログアウトAPI呼び出しに失敗しましたが、ローカル認証情報を削除します:', error);
    } finally {
      removeToken();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      dispatch({ type: 'LOGOUT' });
      return;
    }

    try {
      const response = await authApi.me();
      dispatch({ type: 'UPDATE_USER', payload: response.data });
    } catch (error) {
      console.warn('認証チェックに失敗しました:', error);
      removeToken();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// カスタムフック
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}