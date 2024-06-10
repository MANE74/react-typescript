import React from 'react';
import styled from 'styled-components';
import { Layout } from '../../components/Layout/Layout';
import BroadcastList from '../../containers/Broadcast/BroadcastList';

export const BroadcastListPage = () => {
  const [showBroadcastInfo, setShowBroadcastInfo] = React.useState(false);
  const [showThreeDots, setShowThreeDots] = React.useState(true);
  const [subMessage, setSubMessage] = React.useState('');

  return (
    <Layout
      isMessageLayout
      showDots={showThreeDots}
      message="messages_broadcast"
      to="/chat"
      subMessageText={subMessage}
      dotsCallBack={() => setShowBroadcastInfo(!showBroadcastInfo)}
    >
      <SBroadcastPage>
        <BroadcastList
          showBroadcastInfo={showBroadcastInfo}
          setShowBroadcastInfo={setShowBroadcastInfo}
          setSubMessage={setSubMessage}
          setShowThreeDots={setShowThreeDots}
        />
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
