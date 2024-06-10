// [TODO] maybe duplication need to be refactored later now for time sake
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import ChatDetails from '../../containers/ChatDetails/ChatDetails';

function ChatDetailsFromHoldingStatementPage() {
  const { id } = useParams();

  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [subMessageText, setSubMessageText] = useState('');
  const [alertType, setAlertType] = useState<string | null>(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [message, setMessage] = useState('messages_details');

  const onClickOptions = () => {
    setOptionsOpen(!optionsOpen);
  };

  return (
    <Layout
      isMessageLayout
      message={message}
      to={`/message/${id}/fromHoldingStatement`}
      subMessageText={subMessageText}
      showDots
      isAlarmActive={isAlarmActive}
      alertType={alertType}
      dotsCallBack={onClickOptions}
      showBottomTabs
    >
      <ChatDetails
        optionsOpen={optionsOpen}
        setOptionsOpen={setOptionsOpen}
        onClickOptions={setOptionsOpen}
        setIsAlarmActive={setIsAlarmActive}
        setAlertType={setAlertType}
        setSubMessageText={setSubMessageText}
        fromHoldingStatment={true}
        setMessage={setMessage}
      />
    </Layout>
  );
}

export default ChatDetailsFromHoldingStatementPage;
