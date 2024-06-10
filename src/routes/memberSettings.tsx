import { Layout } from '../components/Layout/Layout';
import { useParams } from 'react-router-dom';
import MemberSettings from '../containers/MemberSettings/MemberSettings';

export const GroupMemberPage = () => {
  const { id } = useParams();
  return (
    <Layout
      isMessageLayout
      message={`groups_groupMember`}
      to={`/groups/${id}`}
      showBottomTabs
    >
      <MemberSettings />
    </Layout>
  );
};
