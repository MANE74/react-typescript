import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Layout } from '../../components/Layout/Layout';
import { Chat } from '../../containers/Chat/Chat';

export const ChatMessagesFrpmHoldingStatement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isAlarmActive, setIsAlarmActive] = useState(false);

  const handleDots = () => {
    navigate(`/message-details/${id}/fromHoldingStatement`);
  };

  return (
    <Layout
      isMessageLayout
      message="coalert_messages_title"
      to={'/holding-statement'}
      showDots
      isAlarmActive={isAlarmActive}
      dotsCallBack={handleDots}
    >
      <Chat
        id={id}
        setIsAlarmActive={setIsAlarmActive}
        setSubMessage
        fromHoldingStatment={true}
      />
    </Layout>
  );
};
