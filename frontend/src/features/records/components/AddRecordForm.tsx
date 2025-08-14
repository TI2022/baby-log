'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Record } from '@/lib/fetch-client';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

// Styled components
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectLabel = styled.label`
  display: block;
  font-size: ${theme.fontSize.sm};
  font-weight: 500;
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing.sm};
`;

const StyledSelect = styled.select`
  display: block;
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  background-color: white;
  font-size: ${theme.fontSize.base};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${theme.colors.primary[500]}33;
  }
  
  &:hover {
    border-color: ${theme.colors.gray[400]};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

interface AddRecordFormProps {
  onSubmit: (recordData: Omit<Record, 'id' | 'created_at' | 'updated_at'>) => void;
  loading?: boolean;
}

export function AddRecordForm({ onSubmit, loading = false }: AddRecordFormProps) {
  const [type, setType] = useState<Record['type']>('milk');
  const [timestamp, setTimestamp] = useState(() => {
    // 現在時刻をISO形式で設定
    const now = new Date();
    now.setSeconds(0, 0); // 秒とミリ秒を0にする
    return now.toISOString().slice(0, 16); // datetime-localで使用する形式
  });
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData: Omit<Record, 'id' | 'created_at' | 'updated_at'> = {
      user_id: '', // これはAPIで自動設定される
      type,
      timestamp: new Date(timestamp).toISOString(),
      metadata,
    };
    
    onSubmit(recordData);
    
    // フォームをリセット
    setMetadata({});
    setTimestamp(() => {
      const now = new Date();
      now.setSeconds(0, 0);
      return now.toISOString().slice(0, 16);
    });
  };

  const renderMetadataFields = () => {
    switch (type) {
      case 'milk':
        return (
          <FormGroup>
            <Input
              type="number"
              label="量 (ml)"
              value={metadata.amount || ''}
              onChange={(e) => setMetadata(prev => ({ ...prev, amount: Number(e.target.value) }))}
              min="0"
              step="10"
            />
            <Input
              type="number"
              label="温度 (℃)"
              value={metadata.temperature || ''}
              onChange={(e) => setMetadata(prev => ({ ...prev, temperature: Number(e.target.value) }))}
              min="0"
              max="100"
            />
          </FormGroup>
        );
        
      case 'diaper':
        return (
          <FormGroup>
            <SelectGroup>
              <SelectLabel>
                種類
              </SelectLabel>
              <StyledSelect
                value={metadata.type || 'wet'}
                onChange={(e) => setMetadata(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="wet">おしっこ</option>
                <option value="dirty">うんち</option>
                <option value="both">両方</option>
              </StyledSelect>
            </SelectGroup>
          </FormGroup>
        );
        
      case 'sleep':
        return (
          <FormGroup>
            <Input
              type="number"
              label="睡眠時間 (分)"
              value={metadata.duration || ''}
              onChange={(e) => setMetadata(prev => ({ ...prev, duration: Number(e.target.value) }))}
              min="0"
              step="15"
            />
            <SelectGroup>
              <SelectLabel>
                睡眠の質
              </SelectLabel>
              <StyledSelect
                value={metadata.quality || 'good'}
                onChange={(e) => setMetadata(prev => ({ ...prev, quality: e.target.value }))}
              >
                <option value="good">良い</option>
                <option value="fair">普通</option>
                <option value="poor">悪い</option>
              </StyledSelect>
            </SelectGroup>
          </FormGroup>
        );
        
      case 'vaccination':
        return (
          <FormGroup>
            <Input
              type="text"
              label="ワクチン名"
              value={metadata.vaccine_name || ''}
              onChange={(e) => setMetadata(prev => ({ ...prev, vaccine_name: e.target.value }))}
              required
            />
            <Input
              type="text"
              label="病院名"
              value={metadata.hospital || ''}
              onChange={(e) => setMetadata(prev => ({ ...prev, hospital: e.target.value }))}
            />
          </FormGroup>
        );
        
      case 'growth':
        return (
          <FormGroup>
            <Input
              type="number"
              label="体重 (kg)"
              value={metadata.weight || ''}
              onChange={(e) => setMetadata(prev => ({ ...prev, weight: Number(e.target.value) }))}
              min="0"
              step="0.1"
            />
            <Input
              type="number"
              label="身長 (cm)"
              value={metadata.height || ''}
              onChange={(e) => setMetadata(prev => ({ ...prev, height: Number(e.target.value) }))}
              min="0"
              step="0.1"
            />
            <Input
              type="number"
              label="頭囲 (cm)"
              value={metadata.head_circumference || ''}
              onChange={(e) => setMetadata(prev => ({ ...prev, head_circumference: Number(e.target.value) }))}
              min="0"
              step="0.1"
            />
          </FormGroup>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>記録を追加</CardTitle>
      </CardHeader>
      <CardContent>
        <StyledForm onSubmit={handleSubmit}>
          <SelectGroup>
            <SelectLabel>
              記録の種類
            </SelectLabel>
            <StyledSelect
              value={type}
              onChange={(e) => setType(e.target.value as Record['type'])}
            >
              <option value="milk">ミルク 🍼</option>
              <option value="diaper">おむつ 👶</option>
              <option value="sleep">睡眠 😴</option>
              <option value="vaccination">予防接種 💉</option>
              <option value="growth">成長記録 📏</option>
            </StyledSelect>
          </SelectGroup>
          
          <Input
            type="datetime-local"
            label="日時"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            required
          />
          
          {renderMetadataFields()}
          
          <Input
            type="text"
            label="メモ"
            value={metadata.notes || ''}
            onChange={(e) => setMetadata(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="何か記録したいことがあれば..."
          />
          
          <Button 
            type="submit" 
            $fullWidth
            disabled={loading}
          >
            {loading ? '記録中...' : '記録を追加'}
          </Button>
        </StyledForm>
      </CardContent>
    </Card>
  );
}