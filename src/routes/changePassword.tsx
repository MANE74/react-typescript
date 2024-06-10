import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { ChangePassword } from '../containers/ChangePassword/ChangePassword';

export const ChangePasswordPage = () => {
  return (
    <Layout isMessageLayout message={'profile_edit_password'} to="/profile">
      <Routes>
        <Route path="/" element={<ChangePassword />} />
        <Route path="new" element={<ChangePassword />} />
      </Routes>
    </Layout>
  );
};
