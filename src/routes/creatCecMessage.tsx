import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { CreateCecMessageContainer } from '../containers/CreateCecMessageContainer/CreateCecMessageContainer';

const backRoutes: { [index: string]: string } = {
  '/createCecMessage': '/cec',
  '/createCecMessage/options': '/createCecMessage',
  '/createCecMessage/summary': '/createCecMessage/options',
};
const headerTitles: { [index: string]: string } = {
  '/createCecMessage': 'home_externalContacts',
  '/createCecMessage/options': 'home_externalContacts',
  '/createCecMessage/summary': 'cec_creatMessage',
};

export const CreatCecMessagePage = () => {
  let { pathname } = useLocation();

  const backRoute = useMemo(() => backRoutes[pathname], [pathname]);
  const title = useMemo(() => headerTitles[pathname], [pathname]);

  return (
    <Layout isMessageLayout message={title} to={backRoute} showBottomTabs>
      <CreateCecMessageContainer />
    </Layout>
  );
};
