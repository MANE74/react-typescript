import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '../../components/Layout/Layout';
import RecipientList from '../../containers/Broadcast/RecipientList';

export const BroadcastRecipientsPage = () => {
  const { id } = useParams();
  const [showBroadcastInfo, setShowBroadcastInfo] =
    React.useState<boolean>(false);
  const [showThreeDots, setShowThreeDots] = React.useState(true);
  const [subMessage, setSubMessage] = React.useState<string>('');

  return (
    <Layout
      isMessageLayout
      showDots={showThreeDots}
      message="messages_broadcast_details"
      subMessageText={subMessage}
      to={`/broadcast/message/${Number(id)}`}
      dotsCallBack={() => setShowBroadcastInfo(!showBroadcastInfo)}
    >
      <SBroadcastPage>
        <RecipientList
          setShowThreeDots={setShowThreeDots}
          showBroadcastInfo={showBroadcastInfo}
          setSubMessage={setSubMessage}
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
