import { Layout } from '../components/Layout/Layout';
import { ExternalContacts } from '../containers/ExternalContacts/ExternalContacts';

export const ExternalContactsPage = () => {
  return (
    <Layout
      isMessageLayout
      message="home_externalContacts"
      to="/dashboard"
      showBottomTabs
    >
      <ExternalContacts />
    </Layout>
  );
};
