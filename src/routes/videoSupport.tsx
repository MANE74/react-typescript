import { Layout } from '../components/Layout/Layout';
import { VideoSupport } from '../containers/Support/VideoSupport';

export const VideoSupportPage = () => {
  return (
    <Layout
      isMessageLayout
      message={'profile_support_video_tutorials'}
      to="/sidebar/support"
      showBottomTabs
    >
      <VideoSupport />
    </Layout>
  );
};
