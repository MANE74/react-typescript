import { Layout } from '../components/Layout/Layout';
import CreateMessageSummary from '../containers/CreateMessage/CreateMessageSummary';

export const CreateMessageNew = () => {
  return (
    <Layout
      to={'/createMessage'}
      isMessageLayout
      message={'messages_createMessage'}
    >
      <CreateMessageSummary />
    </Layout>
  );
};
