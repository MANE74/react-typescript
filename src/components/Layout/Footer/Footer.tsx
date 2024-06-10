import { useLocation, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { palette } from '../../../theme/colors';
import { ReactComponent as Home } from '../../../assets/imgs/navigation/homeTab.svg';
import { ReactComponent as Chat } from '../../../assets/imgs/navigation/envelopeTab.svg';
import { ReactComponent as Alarm } from '../../../assets/imgs/navigation/alarmTab.svg';
import { useAppSelector } from '../../../hooks';
import {
  selectMessagesActiveEmergancy,
  selectMessagesTotalUnread,
} from '../../../containers/ChatsList/chatListSlice';
import { NotificationBubble } from '../../NotificationBubble/NotificationBubble';
import { Link } from 'react-router-dom';
import { selectUserMenuItems } from '../../../containers/Login/LoginSlice';

function Footer(props: { showBottomTabs: boolean }) {
  const { id } = useParams();
  const location = useLocation();
  const totalUnread = useAppSelector(selectMessagesTotalUnread);
  const activeEmergancy = useAppSelector(selectMessagesActiveEmergancy);
  const menuItems = useAppSelector(selectUserMenuItems);

  let notificationNum: number | null | '!' = null;
  if (totalUnread !== 0) {
    notificationNum = totalUnread;
  } else {
    notificationNum = activeEmergancy ? '!' : null;
  }

  if (!props.showBottomTabs) {
    return <></>;
  }

  const haveAlarm =
    menuItems &&
    menuItems?.findIndex((item) => item.technicalName === 'alarm') > -1;

  return (
    <FooterWrapper>
      <SFooter>
        <STabs>
          <STabList>
            <STab selected={location.pathname === '/dashboard'}>
              <Link to="/dashboard">
                <Home />
              </Link>
            </STab>
            <STab
              selected={[
                '/chat',
                '/createMessage',
                `/message-details/${id}`,
              ].includes(location.pathname)}
            >
              <Link to="/chat">
                <Chat />
                {notificationNum && (
                  <NotificationBubble
                    notification={notificationNum}
                    isDanger={true}
                    style={{ left: '58%', color: palette.white }}
                  />
                )}
              </Link>
            </STab>
            {!haveAlarm ? (
              <STab />
            ) : (
              <STab selected={location.pathname === '/alarm'} isAlarm>
                <Link to="/alarm">
                  <Sbackground>
                    <Alarm />
                  </Sbackground>
                </Link>
              </STab>
            )}
          </STabList>
        </STabs>
      </SFooter>
    </FooterWrapper>
  );
}

const Sbackground = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 4px;
  background: ${palette.danger};
`;

const FooterWrapper = styled.footer<any>`
  position: fixed;
  bottom: 0;
  z-index: 997;
  width: 100%;
`;

const SFooter = styled.div<any>`
  background-color: ${({ theme }) => theme.palette.background.nav};
  box-shadow: 0px -1px 9px rgba(211, 211, 211, 0.25);
  clip-path: inset(-9px 0 0);
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;

  max-width: 26rem;
  margin: auto;
  padding: 0 0.4em;

  height: 4.86rem;
`;

const STabs = styled.div`
  font-size: 12px;
  width: 100%;
  padding-top: 0px;
`;

const STabList = styled.div`
  list-style-type: none;
  display: flex;
  margin: 0;
`;

const STab = styled.div<any>`
  position: relative;
  width: 50%;
  text-align: center;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    cursor: pointer;
  }

  ${(props) =>
    props.selected &&
    !props.isAlarm &&
    css`
      path {
        fill: ${palette.honeyYellow};
      }
    `}

  &:focus {
    outline: none;
  }
`;

export default Footer;
