import { Layout } from '../components/Layout/Layout';
import { TutorialDetails } from '../containers/Support/TutorialDetails';
export const TutorialDetailsPage = () => {
  return (
    <Layout
      isMessageLayout
      to="/video-tutorials"
      showBottomTabs
      message="support"
    >
      <TutorialDetails />
    </Layout>
  );
};
