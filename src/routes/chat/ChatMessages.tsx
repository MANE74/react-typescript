import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Layout } from '../../components/Layout/Layout';
import { Chat } from '../../containers/Chat/Chat';

export const ChatMessages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAlarmActive, setIsAlarmActive] = useState(false);

  const data: any = location.state;

  const handleDots = () => {
    navigate(`/message-details/${id}`);
  };

  return (
    <Layout
      isMessageLayout
      to={data?.fromOverview ? '/overview' : '/chat'}
      showDots
      isAlarmActive={isAlarmActive}
      dotsCallBack={handleDots}
    >
      <Chat id={id} setIsAlarmActive={setIsAlarmActive} setSubMessage />
    </Layout>
  );
};
