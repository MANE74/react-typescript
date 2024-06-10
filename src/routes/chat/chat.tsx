import { Layout } from '../../components/Layout/Layout';
import { reset } from '../../containers/ChatsList/chatListSlice/actionCreators';
import { ChatsList } from '../../containers/ChatsList/ChatsList';
import { useAppDispatch } from '../../hooks';

export const ChatPage = () => {
  const dispatch = useAppDispatch();
  const handleGoBack = () => {
    dispatch(reset());
  };
  return (
    <Layout
      isMessageLayout
      message={'coalert_messages_title'}
      to="/dashboard"
      showBottomTabs
      backBtnCallBack={handleGoBack}
    >
      <ChatsList />
    </Layout>
  );
};
