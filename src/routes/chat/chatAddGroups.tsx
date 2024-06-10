import { useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import AddGroups from '../../containers/ChatDetails/AddGroups';

function ChatAddGroupsPage() {
  const { id } = useParams();

  return (
    <Layout
      isMessageLayout
      to={`/message-details/${id}`}
      message={'messages_add_recipients'}
      showBottomTabs
    >
      <AddGroups />
    </Layout>
  );
}

export default ChatAddGroupsPage;
