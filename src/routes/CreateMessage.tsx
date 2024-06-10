import { Layout } from '../components/Layout/Layout';
import CreateMessageList from '../containers/CreateMessage/CreateMessageList';

export const CreateMessage = () => {
  return (
    <Layout
      isMessageLayout
      message={'messages_createMessage'}
      to="/chat"
      showBottomTabs
    >
      <CreateMessageList />
    </Layout>
  );
};
