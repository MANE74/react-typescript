import { SyntheticEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import ChatDetails from '../../containers/ChatDetails/ChatDetails';

function ChatDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const onClickOptions = () => {
    setOptionsOpen(!optionsOpen);
  };

  const handleNavigate = (e: SyntheticEvent) => {
    e.preventDefault();
    navigate(`/message/${id}`, { state: { fromDetails: true } });
  };

  return (
    <Layout
      isMessageLayout
      to="#"
      message="messages_details"
      backBtn
      backBtnCallBack={handleNavigate}
      isAlarmActive={isAlarmActive}
      dotsCallBack={onClickOptions}
      showBottomTabs
    >
      <ChatDetails
        optionsOpen={optionsOpen}
        setOptionsOpen={setOptionsOpen}
        onClickOptions={setOptionsOpen}
        setIsAlarmActive={setIsAlarmActive}
      />
    </Layout>
  );
}

export default ChatDetailsPage;
