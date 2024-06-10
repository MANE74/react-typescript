import React from 'react';
import { Layout } from '../components/Layout/Layout';
import { OnCallAlert } from '../containers/OnCallAlertList';

const OnCallAlertPage = () => {
  return (
    <Layout
      isMessageLayout
      message="onCallAlert_screen"
      to="/dashboard"
      showBottomTabs
    >
      <OnCallAlert />
    </Layout>
  );
};

export default OnCallAlertPage;
