import { Layout } from '../components/Layout/Layout';
import { InternalSupport } from '../containers/Support/InternalSupport';

export const InternalSupportPage = () => {
  return (
    <Layout
      isMessageLayout
      message={'profile_support_internal_support'}
      showBottomTabs
      to="/sidebar/support"
    >
      <InternalSupport />
    </Layout>
  );
};
