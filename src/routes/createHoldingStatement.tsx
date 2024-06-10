import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { CreateHoldingStatementContainer } from '../containers/CreateHoldingStatement/CreateHoldingStatementContainer';

const backRoutes: { [index: string]: string } = {
  '/createHoldingStatement': '/holding-statement',
  '/createHoldingStatement/summary': '/createHoldingStatement',
};

export const CreateHoldingStatementPage = () => {
  let { pathname } = useLocation();
  const backRoute = useMemo(() => backRoutes[pathname], [pathname]);

  return (
    <Layout
      isMessageLayout
      message={'statement_create_screen'}
      to={backRoute}
      showBottomTabs
    >
      <CreateHoldingStatementContainer />
    </Layout>
  );
};
