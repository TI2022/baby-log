'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
// axiosの依存関係問題を避けるためfetch-clientを使用
import { fetchAuthApi as authApi, setToken, removeToken, getToken, User } from '@/lib/fetch-client';

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
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; password_confirmation: string; display_name: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
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
    const token = getToken();
    
    if (token) {
      // トークンがある場合はユーザー情報を取得
      authApi.me()
        .then(response => {
          dispatch({ type: 'INITIALIZE', payload: { user: response, token } });
        })
        .catch(() => {
          // トークンが無効な場合は削除
          removeToken();
          dispatch({ type: 'INITIALIZE', payload: { user: null, token: null } });
        });
    } else {
      // 開発環境では、認証情報がない場合はダミーユーザーでログイン
      if (process.env.NODE_ENV === 'development') {
        const dummyUser: User = {
          id: 'demo-user-1',
          email: 'demo@example.com',
          display_name: 'デモユーザー',
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
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.login(credentials.email, credentials.password);
      setToken(response.token);
      dispatch({ type: 'LOGIN', payload: { user: response.user, token: response.token } });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (userData: { email: string; password: string; password_confirmation: string; display_name: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.register(userData.email, userData.password, userData.display_name);
      setToken(response.token);
      dispatch({ type: 'LOGIN', payload: { user: response.user, token: response.token } });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // ログアウト API の失敗は無視
    } finally {
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