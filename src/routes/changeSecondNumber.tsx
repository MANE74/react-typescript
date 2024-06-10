import { Layout } from '../components/Layout/Layout';
import { ChangeSecondaryNumber } from '../containers/ChangeSecondaryNumber/ChangeSecondaryNumber';

export const ChangeSecondNumberPage = () => {
  return (
    <Layout
      isMessageLayout
      message={'profile_changeSecNumber_title'}
      to="/profile"
    >
      <ChangeSecondaryNumber />
    </Layout>
  );
};
