import styled from 'styled-components';
import { Layout } from '../components/Layout/Layout';
import { News } from '../containers/News';
const SNewsPage = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const NewsPage = () => {
  return (
    <Layout isMessageLayout message="news_news" to="/dashboard" showBottomTabs>
      <SNewsPage>
        <News />
      </SNewsPage>
    </Layout>
  );
};
