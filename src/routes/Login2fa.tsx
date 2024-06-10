import styled from 'styled-components';
import { Layout } from '../components/Layout/Layout';
import { Login2fa } from '../containers/Login2fa/Login2fa';

const SContainer = styled.div`
  width: 90%;
  margin: auto;
  height: 100%;
`;

export const Login2faPage = () => {
  return (
    <Layout isAuthLayout={false} backBtn showCoSafeLogo to="/login">
      {/* <SContainer> */}
      <Login2fa />
      {/* </SContainer> */}
    </Layout>
  );
};
