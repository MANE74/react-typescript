import { Layout } from '../components/Layout/Layout';
import { Profile } from '../containers/Profile/Profile';

export const ProfilePage = () => {
  return (
    <Layout isMessageLayout message={'profile_profile'} to="/sidebar">
      <Profile />
    </Layout>
  );
};
