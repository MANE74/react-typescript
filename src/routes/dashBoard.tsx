import { Layout } from '../components/Layout/Layout';
import { DashBoard } from '../containers/DashBoard/DashBoard';

export const DashBoardPage = () => {
  return (
    <Layout showBottomTabs>
      <DashBoard />
    </Layout>
  );
};
