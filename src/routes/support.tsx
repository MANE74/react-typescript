import { Layout } from '../components/Layout/Layout';
import { Support } from '../containers/Support/Support';

export const SupportPage = () => {
  return (
    <Layout isMessageLayout message="support" to="/sidebar" showBottomTabs>
      <Support />
    </Layout>
  );
};
