import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import CreateMessageList from '../../containers/CreateMessage/CreateMessageList';

function ForwardPage(props: {
  fromHoldingStatement?: boolean;
  fromLogNote?: boolean;
}) {
  const { fromHoldingStatement, fromLogNote } = props;
  const { id } = useParams();
  return (
    <Layout
      to={
        fromHoldingStatement
          ? `/message/${id}/fromHoldingStatement`
          : fromLogNote
          ? `/log-note/${id}`
          : `/message/${id}`
      }
      isMessageLayout
      message="forward_message_text"
    >
      <CreateMessageList forward />
    </Layout>
  );
}

export default ForwardPage;
