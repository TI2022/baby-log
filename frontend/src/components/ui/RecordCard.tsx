import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, CardHeader } from './Card';
import { RecordTypeIcon } from './RecordTypeIcon';

export interface RecordCardData {
  id: string;
  type: 'milk' | 'diaper' | 'sleep' | 'vaccination' | 'growth';
  timestamp: string;
  metadata?: {
    amount_ml?: number;
    milk_type?: 'breast' | 'formula';
    diaper_type?: 'wet' | 'dirty' | 'both';
    sleep_duration?: number;
    notes?: string;
  };
  recorded_by?: {
    display_name: string;
  };
}

export interface RecordCardProps {
  record: RecordCardData;
  onClick?: () => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  className?: string;
}

const InteractiveCard = styled(Card).withConfig({
  shouldForwardProp: (prop) => !['isSelected', 'isClickable'].includes(prop),
})<{ isSelected?: boolean; isClickable?: boolean }>`
  transition: all ${({ theme }) => theme.transitions.default};
  cursor: ${({ isClickable }) => isClickable ? 'pointer' : 'default'};
  
  ${({ isSelected, theme }) => isSelected && `
    box-shadow: 0 0 0 2px ${theme.colors.primary[500]};
  `}
  
  &:hover {
    transform: ${({ isClickable }) => isClickable ? 'translateY(-1px)' : 'none'};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const CardHeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RecordInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecordType = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RecordTime = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const RecordedBy = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const MetadataText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const NotesText = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

export const RecordCard: React.FC<RecordCardProps> = ({
  record,
  onClick,
  isSelectable = false,
  isSelected = false,
  onSelect,
  className = '',
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMetadata = (type: string, metadata: any) => {
    if (!metadata) return '';
    
    switch (type) {
      case 'milk':
        return metadata.amount_ml ? `${metadata.amount_ml}ml` : '';
      case 'diaper':
        return metadata.diaper_type || '';
      case 'sleep':
        return metadata.sleep_duration ? `${metadata.sleep_duration}分` : '';
      default:
        return metadata.notes || '';
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick();
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelect) onSelect(!isSelected);
  };

  return (
    <InteractiveCard 
      className={className}
      isSelected={isSelected}
      isClickable={!!onClick}
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardHeaderContent>
          <LeftSection>
            {isSelectable && (
              <Checkbox
                type="checkbox"
                checked={isSelected}
                onChange={handleSelectChange}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <RecordTypeIcon type={record.type} size="md" />
            <RecordInfo>
              <RecordType>{record.type}</RecordType>
              <RecordTime>
                {formatTime(record.timestamp)}
              </RecordTime>
            </RecordInfo>
          </LeftSection>
          {record.recorded_by && (
            <RecordedBy>
              by {record.recorded_by.display_name}
            </RecordedBy>
          )}
        </CardHeaderContent>
      </CardHeader>
      {record.metadata && (
        <CardContent>
          <MetadataText>
            {formatMetadata(record.type, record.metadata)}
            {record.metadata.notes && (
              <NotesText>
                {record.metadata.notes}
              </NotesText>
            )}
          </MetadataText>
        </CardContent>
      )}
    </InteractiveCard>
  );
};

export default RecordCard;