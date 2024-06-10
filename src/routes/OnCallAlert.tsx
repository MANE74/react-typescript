import React, { useState } from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '../components/Layout/Layout';
import OnCallAlertDocument from '../containers/OnCallAlertDocument/OnCallAlertDocument';
import { CreateMessageOnCallAlertSummary } from '../containers/OnCallAlertList/createMessageOnCallAlertSummary';
import { EditOnCallAlertMessage } from '../containers/OnCallAlertList/EditOnCallAlertMessage';
import { isOnCallAlertBottomModalOpen } from '../containers/OnCallAlertList/onCallAlertSlice';
import { toggleOnCallAlertBottomModal } from '../containers/OnCallAlertList/onCallAlertSlice/actionCreators';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useLayoutContext } from '../utils/customHooks/LayoutContext';

export type OnCallAlertkMessageMembersType =
  | 'ALL'
  | 'AVIALABLE'
  | 'NOT_AVAILANLE'
  | 'NO_STATUS';

const OnCallAlert = () => {
  const dispatch = useAppDispatch();
  const openBottomModal = () => {
    dispatch(toggleOnCallAlertBottomModal(true));
  };

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setTabsState } = useLayoutContext();
  const [showDots, setShowDots] = useState<boolean>(true);

  React.useEffect(() => {
    if (pathname.includes('createMessageSummary')) {
      setTabsState(true);
    } else {
      setTabsState(false);
    }
  }, [pathname]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              isMessageLayout
              // message="onCallAlert_screen"
              to="/onCallAlert"
              showBottomTabs
              showDots={showDots}
              dotsCallBack={() => openBottomModal()}
            >
              <OnCallAlertDocument setShowDots={setShowDots} />
            </Layout>
          }
        />

        <Route
          path="createMessageSummary/:membersType"
          element={
            <Layout
              to={`/oncall/${id}`}
              isMessageLayout
              message={'messages_createMessage'}
            >
              <CreateMessageOnCallAlertSummary />
            </Layout>
          }
        />
        <Route
          path="edit"
          element={
            <Layout
              to={`/muster/${id}`}
              isMessageLayout
              message={'imOk_editMessage'}
            >
              <EditOnCallAlertMessage />
            </Layout>
          }
        />
      </Routes>
    </>
  );
};

export default OnCallAlert;
