import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import Member from '../containers/ChatDetails/Member';

export const ChatMemberSettings = (props: {
  fromHoldingStatement?: boolean;
}) => {
  const { fromHoldingStatement } = props;
  const { chatID } = useParams();
  return (
    <Layout
      isMessageLayout
      message={`groups_groupMember`}
      to={
        fromHoldingStatement
          ? `/message-details/${chatID}/fromHoldingStatement`
          : `/message-details/${chatID}`
      }
      showBottomTabs
    >
      <Member />
    </Layout>
  );
};
