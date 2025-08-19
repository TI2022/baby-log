'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { RecordsList } from '@/features/records';
import { useRecords } from '@/contexts/RecordsContext';
import { useAuth } from '@/contexts/AuthContext';
// axiosの依存関係問題を避けるためfetch-clientを使用
import { fetchRecordApi as recordApi, Record } from '@/lib/fetch-client';
import { Button } from '@/components/ui/Button';
import { FEATURE_FLAGS, API_MODE } from '@/lib/feature-flags';
import { theme } from '@/styles/theme';

// Styled components
const LoadingContainer = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  text-align: center;
`;

const LoadingText = styled.p`
  color: ${theme.colors.gray[600]};
`;

const CenteredContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl} 0;
`;

const CenteredText = styled.p`
  color: ${theme.colors.gray[600]};
`;

const ErrorText = styled.p`
  color: ${theme.colors.error};
  margin-bottom: ${theme.spacing.lg};
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const FormContainer = styled.div`
  max-width: 28rem;
  margin: 0 auto;
`;

const RecordsListContainer = styled.div`
  max-width: 42rem;
  margin: 0 auto;
`;

// フォームは遅延ロード（ユーザーがボタンを押した時のみロード）
const AddRecordForm = dynamic(
  () => import('@/features/records').then(mod => ({ default: mod.AddRecordForm })),
  {
    loading: () => (
      <LoadingContainer>
        <LoadingText>フォームを読み込み中...</LoadingText>
      </LoadingContainer>
    ),
  }
);

export function RecordsContainer() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { 
    records, 
    isLoading, 
    error,
    fetchRecords: contextFetchRecords,
    createRecord,
    deleteRecord,
    addLocalRecord,
    removeLocalRecord,
  } = useRecords();
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // 記録を取得する関数の定義
  const fetchRecords = useCallback(async () => {
    // 認証されていない場合は何もしない
    if (!isAuthenticated) return;
    
    try {
      // setLoadingとsetErrorメソッドが存在しない
      console.log('記録を取得中...');
      
      // 現在はダミーデータでレンダリング遅延をシミュレート
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dummyRecords: Record[] = [
        {
          id: '1',
          user_id: 'user1',
          type: 'milk',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2時間前
          metadata: {
            amount: 120,
            unit: 'ml',
            notes: '順調に飲みました',
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'user1',
          type: 'diaper',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4時間前
          metadata: {
            type: 'wet',
            notes: '',
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          user_id: 'user1',
          type: 'sleep',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6時間前
          metadata: {
            duration: 90, // 90分
            quality: 'good',
            notes: 'よく眠れました',
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      
      // Contextの状態を直接更新（addLocalRecordを使用）
      dummyRecords.forEach(record => {
        addLocalRecord(record);
      });
    } catch (err) {
      console.error('記録の取得に失敗しました:', err);
      // setErrorメソッドが存在しないため、コンソールエラーのみ
      console.error('記録の取得に失敗しました');
    }
  }, [isAuthenticated, addLocalRecord]);

  // 記録を取得する（現在はダミーデータを使用）
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]); // fetchRecordsが変更されたときも実行

  // 認証状態のロード中は何も表示しない
  if (authLoading) {
    return (
      <CenteredContainer>
        <CenteredText>読み込み中...</CenteredText>
      </CenteredContainer>
    );
  }

  const handleAddRecord = async (recordData: Omit<Record, 'id' | 'created_at' | 'updated_at'>) => {
    // 実務: フィーチャーフラグによる動作切り替え
    if (FEATURE_FLAGS.optimisticUpdates && API_MODE === 'real') {
      // 実API環境での楽観的更新
      return handleOptimisticAddRecord(recordData);
    } else {
      // モック環境またはシンプルモードでのAPI依存更新
      return handleSimpleAddRecord(recordData);
    }
  };

  // 楽観的更新版（実API用）
  const handleOptimisticAddRecord = async (recordData: Omit<Record, 'id' | 'created_at' | 'updated_at'>) => {
    const optimisticRecord: Record = {
      id: `temp-${Date.now()}`,
      ...recordData,
      user_id: 'user1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    addLocalRecord(optimisticRecord);
    setShowAddForm(false);
    
    try {
      await createRecord({
        type_name: recordData.type,
        timestamp: recordData.timestamp,
        metadata: recordData.metadata
      });
      
      removeLocalRecord(optimisticRecord.id);
      
    } catch (err) {
      removeLocalRecord(optimisticRecord.id);
      console.error('記録の追加に失敗しました');
      console.error('記録の追加に失敗しました:', err);
    }
  };

  // シンプル版（モック用）
  const handleSimpleAddRecord = async (recordData: Omit<Record, 'id' | 'created_at' | 'updated_at'>) => {
    setShowAddForm(false);
    
    try {
      await createRecord({
        type_name: recordData.type,
        timestamp: recordData.timestamp,
        metadata: recordData.metadata
      });
      
      if (FEATURE_FLAGS.detailedLogging) {
        console.info('📝 Record added successfully in simple mode');
      }
      
    } catch (err) {
      console.error('記録の追加に失敗しました');
      console.error('記録の追加に失敗しました:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <CenteredContainer>
        <CenteredText style={{ marginBottom: theme.spacing.lg }}>
          記録を見るにはログインが必要です
        </CenteredText>
        <Button variant="primary">
          ログイン
        </Button>
      </CenteredContainer>
    );
  }

  if (error) {
    return (
      <CenteredContainer>
        <ErrorText>{error}</ErrorText>
        <Button 
          onClick={fetchRecords}
          variant="primary"
        >
          再試行
        </Button>
      </CenteredContainer>
    );
  }

  return (
    <MainContainer>
      {/* 記録追加ボタン */}
      <ButtonContainer>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
          size="lg"
        >
          {showAddForm ? '記録追加を閉じる' : '記録を追加 ➕'}
        </Button>
      </ButtonContainer>

      {/* 記録追加フォーム */}
      {showAddForm && (
        <FormContainer>
          <AddRecordForm
            onSubmit={handleAddRecord}
            loading={isLoading}
          />
        </FormContainer>
      )}

      {/* 記録一覧 */}
      <RecordsListContainer>
        <RecordsList
          records={records}
          loading={isLoading}
        />
      </RecordsListContainer>
    </MainContainer>
  );
}