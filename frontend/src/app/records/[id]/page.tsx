/**
 * 記録詳細ページ
 * 個別記録の詳細表示・編集・削除
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecordDetail } from '@/features/records';
import { useRecords } from '@/contexts/RecordsContext';
import type { Record } from '@/types';

interface RecordDetailPageProps {
  params: {
    id: string;
  };
}

export default function RecordDetailPage({ params }: RecordDetailPageProps) {
  const router = useRouter();
  const { records, updateRecord, deleteRecord, isLoading } = useRecords();
  const [record, setRecord] = useState<Record | null>(null);
  const [notFound, setNotFound] = useState(false);

  // URLパラメータから記録を取得
  useEffect(() => {
    if (records.length > 0) {
      const foundRecord = records.find(r => r.id === params.id);
      if (foundRecord) {
        setRecord(foundRecord);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }
  }, [records, params.id]);

  // 記録更新処理
  const handleUpdate = async (updatedRecord: Record) => {
    try {
      await updateRecord(updatedRecord.id, updatedRecord);
      setRecord(updatedRecord);
    } catch (error) {
      console.error('Failed to update record:', error);
      throw error; // RecordDetailコンポーネントでエラーハンドリング
    }
  };

  // 記録削除処理
  const handleDelete = async (recordId: string) => {
    try {
      await deleteRecord(recordId);
      router.push('/records'); // 削除後は一覧ページに戻る
    } catch (error) {
      console.error('Failed to delete record:', error);
      throw error; // RecordDetailコンポーネントでエラーハンドリング
    }
  };

  // 閉じる処理（一覧ページに戻る）
  const handleClose = () => {
    router.push('/records');
  };

  // ローディング状態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">記録を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // 記録が見つからない場合
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            記録が見つかりません
          </h2>
          <p className="text-gray-600 mb-6">
            指定された記録は存在しないか、削除された可能性があります。
          </p>
          <button
            onClick={() => router.push('/records')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            記録一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  // 記録がまだ読み込まれていない場合
  if (!record) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* パンくずナビ */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button
                onClick={() => router.push('/dashboard')}
                className="hover:text-blue-600"
              >
                ダッシュボード
              </button>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <button
                onClick={() => router.push('/records')}
                className="hover:text-blue-600"
              >
                記録一覧
              </button>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900">記録詳細</span>
            </li>
          </ol>
        </nav>

        {/* 記録詳細コンポーネント */}
        <div className="max-w-4xl mx-auto">
          <RecordDetail
            record={record}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: '記録詳細 | Baby Log',
  description: '赤ちゃんの記録詳細表示・編集・削除',
};