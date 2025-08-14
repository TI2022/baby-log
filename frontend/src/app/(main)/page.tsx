import { RecordsContainer } from './RecordsContainer';
import {
  PageContainer,
  WelcomeSection,
  WelcomeTitle,
  WelcomeText
} from '@/components/pages/HomePageComponents';

export default function HomePage() {
  return (
    <PageContainer>
      <WelcomeSection>
        <WelcomeTitle>
          育児記録
        </WelcomeTitle>
        <WelcomeText>
          赤ちゃんの成長を記録して、大切な思い出を残しましょう
        </WelcomeText>
      </WelcomeSection>
      
      <RecordsContainer />
    </PageContainer>
  );
}