import { Layout } from '../components/Layout/Layout';
import { GroupDetail } from '../containers/GroupDetail';

export const GroupsPage = () => {
  return (
    <Layout isMessageLayout message="home_groups" to="/groups" showBottomTabs>
      <GroupDetail />
    </Layout>
  );
};
