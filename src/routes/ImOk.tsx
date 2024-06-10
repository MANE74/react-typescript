import React, { useState } from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import ImOkDocument from '../containers/ImOkDocument/ImOkDocument';
import { CreateMessageIamOkSummary } from '../containers/ImOkList/createMessageIamOkSummary';
import { EditIamOkMessage } from '../containers/ImOkList/EditIamOkMessage';
import { toggleImOkBottomModal } from '../containers/ImOkList/imOkSlice/actionCreators';
import { useAppDispatch } from '../hooks';
import { useLayoutContext } from '../utils/customHooks/LayoutContext';

export type IamOkMessageMembersType = 'ALL' | 'OK' | 'NOT_OK' | 'NO_STATUS';

const ImOk = () => {
  const dispatch = useAppDispatch();
  const openBottomModal = () => {
    dispatch(toggleImOkBottomModal(true));
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
              // message="home_muster"
              // message={undefined}
              to="/imOk"
              showBottomTabs
              showDots={showDots}
              dotsCallBack={() => openBottomModal()}
            >
              <ImOkDocument setShowDots={setShowDots} />
            </Layout>
          }
        />
        <Route
          path="createMessageSummary/:membersType"
          element={
            <Layout
              to={`/muster/${id}`}
              isMessageLayout
              message={'messages_createMessage'}
            >
              <CreateMessageIamOkSummary />
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
              <EditIamOkMessage />
            </Layout>
          }
        />
      </Routes>
    </>
  );
};

export default ImOk;
