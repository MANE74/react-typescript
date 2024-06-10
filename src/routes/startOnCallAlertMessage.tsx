import React from 'react';
import { Layout } from '../components/Layout/Layout';
import { RequireRole } from '../components/RequireRole/RequireRole';
import { selectCanStartOnCallAlert } from '../containers/Login/LoginSlice';
import { StartOnCallAlertMessageContainer } from '../containers/StartOnCallAlertMessage/StartOnCallALertMessageContainer';
import { useAppSelector } from '../hooks';

export const StartOnCallAlertMessagePage = () => {
  const canStartOnCallALert = useAppSelector(selectCanStartOnCallAlert);

  return (
    <Layout
      isMessageLayout
      message="onCallAlert_screen"
      to={'/onCallAlert'}
      showBottomTabs
    >
      <RequireRole roleCondition={!!canStartOnCallALert} backTo="/onCallAlert">
        <StartOnCallAlertMessageContainer />
      </RequireRole>
    </Layout>
  );
};
