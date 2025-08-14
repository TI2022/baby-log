import { Record } from '@/lib/fetch-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

// Styled components
const RecordsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const EmptyCard = styled(Card)``;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.gray[500]};
  padding: ${theme.spacing.xl} 0;
`;

const RecordHeader = styled(CardTitle)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const RecordIcon = styled.span`
  font-size: ${theme.fontSize.lg};
`;

const RecordDate = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.sm};
`;

const MetadataContainer = styled.div`
  font-size: ${theme.fontSize.sm};
`;

const MetadataItem = styled.p`
  margin-bottom: ${theme.spacing.xs};
`;

const MetadataNote = styled.p`
  margin-top: ${theme.spacing.sm};
  font-style: italic;
  color: ${theme.colors.gray[700]};
`;

const SkeletonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

interface RecordsListProps {
  records: Record[];
  loading?: boolean;
}

export function RecordsList({ records, loading = false }: RecordsListProps) {
  if (loading) {
    return (
      <RecordsContainer>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <RecordHeader as="div">
                <SkeletonContainer>
                  <Skeleton $variant="text" width="24px" height="24px" />
                  <Skeleton $variant="text" width="80px" height="20px" />
                </SkeletonContainer>
              </RecordHeader>
            </CardHeader>
            <CardContent>
              <Skeleton $variant="text" width="40%" height="14px" style={{ marginBottom: '8px' }} />
              <Skeleton $variant="text" width="60%" height="16px" style={{ marginBottom: '8px' }} />
              <Skeleton $variant="text" width="80%" height="14px" />
            </CardContent>
          </Card>
        ))}
      </RecordsContainer>
    );
  }

  if (records.length === 0) {
    return (
      <EmptyCard>
        <CardContent>
          <EmptyMessage>
            まだ記録がありません
          </EmptyMessage>
        </CardContent>
      </EmptyCard>
    );
  }

  const getRecordTypeLabel = (type: Record['type']): string => {
    const labels = {
      milk: 'ミルク',
      diaper: 'おむつ',
      sleep: '睡眠',
      vaccination: '予防接種',
      growth: '成長記録',
    };
    return labels[type];
  };

  const getRecordIcon = (type: Record['type']): string => {
    const icons = {
      milk: '🍼',
      diaper: '👶',
      sleep: '😴',
      vaccination: '💉',
      growth: '📏',
    };
    return icons[type];
  };

  return (
    <RecordsContainer>
      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader>
            <RecordHeader>
              <RecordIcon>{getRecordIcon(record.type)}</RecordIcon>
              {getRecordTypeLabel(record.type)}
            </RecordHeader>
          </CardHeader>
          <CardContent>
            <RecordDate>
              {formatDate(record.timestamp)}
            </RecordDate>
            <MetadataContainer>
              {record.type === 'milk' && record.metadata.amount && (
                <MetadataItem>量: {record.metadata.amount} {record.metadata.unit || 'ml'}</MetadataItem>
              )}
              {record.type === 'diaper' && record.metadata.type && (
                <MetadataItem>種類: {record.metadata.type === 'wet' ? 'おしっこ' : 
                         record.metadata.type === 'dirty' ? 'うんち' : 
                         record.metadata.type === 'both' ? '両方' : record.metadata.type}</MetadataItem>
              )}
              {record.type === 'sleep' && record.metadata.duration && (
                <MetadataItem>時間: {Math.floor(record.metadata.duration / 60)}時間{record.metadata.duration % 60}分</MetadataItem>
              )}
              {record.type === 'vaccination' && record.metadata.vaccine_name && (
                <MetadataItem>ワクチン: {record.metadata.vaccine_name}</MetadataItem>
              )}
              {record.type === 'growth' && (
                <div>
                  {record.metadata.weight && <MetadataItem>体重: {record.metadata.weight} kg</MetadataItem>}
                  {record.metadata.height && <MetadataItem>身長: {record.metadata.height} cm</MetadataItem>}
                </div>
              )}
              {record.metadata.notes && (
                <MetadataNote>
                  メモ: {record.metadata.notes}
                </MetadataNote>
              )}
            </MetadataContainer>
          </CardContent>
        </Card>
      ))}
    </RecordsContainer>
  );
}