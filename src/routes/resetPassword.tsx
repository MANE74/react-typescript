import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { ResetPassword } from '../containers/ResetPassword/ResetPassword';

export const ResetPasswordPage = () => {
  const { userId, resetToken } = useParams();

  return <Layout><ResetPassword userId={userId} resetToken={resetToken} /></Layout>;
};
