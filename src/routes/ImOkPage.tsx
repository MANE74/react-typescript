import React from 'react';
import { Layout } from '../components/Layout/Layout';
import { ImOkList } from '../containers/ImOkList';

const ImOkPage = () => {
  return (
    <Layout
      isMessageLayout
      message="home_muster"
      to="/dashboard"
      showBottomTabs
    >
      <ImOkList />
    </Layout>
  );
};

export default ImOkPage;
