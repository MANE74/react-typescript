import { Layout } from '../../components/Layout/Layout';
import BroadcastNew from '../../containers/Broadcast/BroadcastNew';

export const BroadcastNewPage = () => {
  return (
    <Layout isMessageLayout message="messages_create_broadcast" to="/broadcast">
      <BroadcastNew setShowBottomTabs={(props) => props} />
    </Layout>
  );
};
