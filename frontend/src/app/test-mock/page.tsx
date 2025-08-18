/**
 * モックサーバー連携テストページ
 */

'use client';

import { useState } from 'react';
import { runIntegrationTest, testSpecificEndpoint, checkMockConfiguration } from '@/lib/mock-test';

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
}

export default function TestMockPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [specificEndpoint, setSpecificEndpoint] = useState('/api/auth/me');
  const [endpointResult, setEndpointResult] = useState<TestResult | null>(null);

  const handleRunIntegrationTest = async () => {
    setIsRunning(true);
    try {
      const results = await runIntegrationTest();
      setTestResults(results);
    } catch (error) {
      console.error('統合テスト実行エラー:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsRunning(false);
    }
  };

  const handleTestEndpoint = async () => {
    setIsRunning(true);
    try {
      const result = await testSpecificEndpoint(specificEndpoint);
      setEndpointResult(result);
    } catch (error) {
      console.error('エンドポイントテストエラー:', error);
      setEndpointResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const config = checkMockConfiguration();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🧪 モックサーバー連携テスト</h1>
      
      {/* 設定情報 */}
      <section className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">⚙️ 現在の設定</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>API URL:</strong> {config.apiUrl}
          </div>
          <div>
            <strong>モック使用:</strong> {config.useMock}
          </div>
          <div>
            <strong>デバッグモード:</strong> {config.debugMode}
          </div>
          <div>
            <strong>環境:</strong> {config.appEnv}
          </div>
        </div>
      </section>

      {/* 統合テスト */}
      <section className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🚀 統合テスト</h2>
        <button
          onClick={handleRunIntegrationTest}
          disabled={isRunning}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? '実行中...' : '統合テスト実行'}
        </button>
        
        {testResults && (
          <div className="mt-4 p-4 bg-gray-50 rounded overflow-auto">
            <pre className="text-sm">{JSON.stringify(testResults, null, 2)}</pre>
          </div>
        )}
      </section>

      {/* 個別エンドポイントテスト */}
      <section className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🔍 個別エンドポイントテスト</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={specificEndpoint}
            onChange={(e) => setSpecificEndpoint(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="/api/records"
          />
          <button
            onClick={handleTestEndpoint}
            disabled={isRunning}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isRunning ? 'テスト中...' : 'テスト実行'}
          </button>
        </div>
        
        {/* よく使うエンドポイントのクイックボタン */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            '/',
            '/api/auth/me',
            '/api/records',
            '/api/users/profile'
          ].map((endpoint) => (
            <button
              key={endpoint}
              onClick={() => setSpecificEndpoint(endpoint)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              {endpoint}
            </button>
          ))}
        </div>
        
        {endpointResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded overflow-auto">
            <div className={`mb-2 font-semibold ${endpointResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {endpointResult.success ? '✅ 成功' : '❌ エラー'}
              {endpointResult.status && ` (${endpointResult.status})`}
            </div>
            <pre className="text-sm">{JSON.stringify(endpointResult, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
}