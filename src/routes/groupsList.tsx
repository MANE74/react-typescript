import { Layout } from '../components/Layout/Layout';
import { GroupsList } from '../containers/GroupsList';

export const GroupsListPage = () => {
  return (
    <Layout
      isMessageLayout
      message="home_groups"
      to="/dashboard"
      showBottomTabs
    >
      <GroupsList />
    </Layout>
  );
};
