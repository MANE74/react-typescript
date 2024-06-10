import { useCallback, useEffect, useState } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '../components/Layout/Layout';
import { Page } from '../components/Page/Page';
import { ExternalContactMessage } from '../containers/ExternalContacts/ExternalContactMessage';
import { ExternalContactMessageDetail } from '../containers/ExternalContacts/ExternalContactMessageDetail';
import { selectExternalMessage } from '../containers/ExternalContacts/externalContactsSlice';
import { getExternalMessages } from '../containers/ExternalContacts/externalContactsSlice/actionCreators';
import { useAppDispatch, useAppSelector } from '../hooks';
import { translate } from '../utils/translate';

const SPage = styled(Page)`
  padding: 1.375rem 0 1.375rem 0;
  /* to make only the list overflow */
  position: relative;

  height: 100%;
`;

export const ExternalContactMessagePage = () => {
  const { id } = useParams();

  const cecMessage = useAppSelector(selectExternalMessage(+id!));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const init = async () => {
    if (!cecMessage) {
      await dispatch(getExternalMessages());
    }
  };

  useEffect(() => {
    init();
  }, []);
  const handleDots = useCallback(() => {
    navigate(`messageDetail`);
  }, [id]);

  const { pathname } = useLocation();
  const [showDots, setShowDots] = useState(true);
  const [backTo, setBackTo] = useState('cec');

  useEffect(() => {
    if (pathname === `/cec/${id}/messageDetail`) {
      setShowDots(false);
      setBackTo(`/cec/${id}`);
    } else {
      setShowDots(true);
      setBackTo(`/cec`);
    }
  }, [pathname]);

  return (
    <Layout
      isMessageLayout
      message="home_externalContacts"
      to={-1}
      subMessageText={`${cecMessage?.contactLists.length || 0} ${translate(
        'messages_lists'
      )}`}
      showDots={showDots}
      dotsCallBack={handleDots}
      showBottomTabs
    >
      <SPage>
        <Routes>
          <Route
            path="/"
            element={
              cecMessage ? (
                <ExternalContactMessage cecMessage={cecMessage} />
              ) : (
                // couild be done better than that espacially with the network issues
                <div>No message with this id </div>
              )
            }
          />

          {cecMessage && (
            <Route
              path="messageDetail"
              element={<ExternalContactMessageDetail cecId={+id!} />}
            />
          )}
        </Routes>
      </SPage>
    </Layout>
  );
};
