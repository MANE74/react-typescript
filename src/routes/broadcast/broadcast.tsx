import styled from 'styled-components';
import { Layout } from '../../components/Layout/Layout';
import { Broadcast } from '../../containers/Broadcast';

export const BroadcastPage = () => {
  return (
    <Layout
      isMessageLayout
      showBottomTabs
      message="messages_create_broadcast"
      to="/dashboard"
    >
      <SBroadcastPage>
        <Broadcast />
      </SBroadcastPage>
    </Layout>
  );
};

const SBroadcastPage = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
