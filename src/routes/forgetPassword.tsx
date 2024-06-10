import { Layout } from '../components/Layout/Layout';
import { ForgetPassword } from '../containers/ForgetPassword/ForgetPassword';

export const ForgetPasswordPage = () => {
  return (
    <Layout isAuthLayout={false} backBtn to="/login">
      <ForgetPassword />
    </Layout>
  );
};
