import React from 'react';
import { Layout } from '../components/Layout/Layout';
import { RequireRole } from '../components/RequireRole/RequireRole';
import { selectCanStartIamok } from '../containers/Login/LoginSlice';
import { StartIamOkMessageContainer } from '../containers/StartIamOkMessage/StartIamOkMessageContainer';
import { useAppSelector } from '../hooks';

export const StartIamOkMessagePage = () => {
  const canStartIamok = useAppSelector(selectCanStartIamok);

  return (
    <Layout isMessageLayout message="home_muster" to={-1} showBottomTabs>
      <RequireRole roleCondition={!!canStartIamok} backTo="/imOk">
        <StartIamOkMessageContainer />
      </RequireRole>
    </Layout>
  );
};
