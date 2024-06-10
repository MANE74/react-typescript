import { useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Login } from '../containers/Login/Login';

export const LoginPage = () => {
  let location = useLocation();
  return (
    // hidden elements backBtn to={`/intro`}   add it to layout to appear intro page 
    <Layout isAuthLayout={false} >
      <Login mode={location.pathname === '/sso' ? 'sso' : undefined} />
    </Layout>
  );
};
