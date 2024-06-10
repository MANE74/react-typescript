import React from 'react';
import { Layout } from '../components/Layout/Layout';
import Overview from '../containers/Overview/Overview';

function OverviewPage() {
  return (
    <Layout
      isMessageLayout
      message="home_overview"
      to="/dashboard"
      showBottomTabs
    >
      <Overview />
    </Layout>
  );
}

export default OverviewPage;
