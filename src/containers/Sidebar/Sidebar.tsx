import React from 'react';
import styled from 'styled-components';
import { Layout } from '../../components/Layout/Layout';
import SidebarElement from './SidebarElement';
import { palette } from '../../theme/colors';
import { ProfilePicture } from '../../components/ProfilePicture/ProfilePicture';
import EnglishIcon from '../../assets/imgs/general/united-kingdom-round.svg';
import SwedishIcon from '../../assets/imgs/general/sweden-round.svg';
import SettingsIcon from '../../assets/imgs/general/settings.svg';
import BellIcon from '../../assets/imgs/general/bell.svg';
import QuestionIcon from '../../assets/imgs/general/question.svg';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectUser } from '../Login/LoginSlice';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Page } from '../../components/Page/Page';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { logoutUser } from './actionCreators';
import { logoutRequest } from '../../apis/authAPI';
import i18n, { ELanguages } from '../../i18n';

export interface SidebarSection {
  name: string;
  icon: string;
  to?: string;
  onClick?: () => void | null;
  style?: React.CSSProperties;
}

function Sidebar() {
  const confirm = useConfirmation();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);

  const testAlarmError = () => {
    confirm({
      description: t('alarm_popup_message_warning'),
      onSubmit: () => {},
      confirmText: 'ok',
    });
  };
  const sidebarElements: SidebarSection[] = [
    {
      name: 'mainMenu_settings',
      icon: SettingsIcon,
      to: 'settings',
    },
    {
      name: 'support',
      icon: QuestionIcon,
      to: 'support',
    },
    {
      name: 'language',
      icon: i18n.language === ELanguages.se ? SwedishIcon : EnglishIcon,
      to: 'language',
    },
    {
      name: 'profile_test_alarm',
      icon: BellIcon,
      onClick: testAlarmError,
      style: { filter: 'opacity(0.5)' },
    },
  ];

  const confirmLogout = () => {
    confirm({
      title: 'warning',
      description: 'login_logout_question',
      onSubmit: doLogout,
      onCancel: () => {},
      confirmText: 'logout',
      cancelText: 'cancel',
    });
  };

  const doLogout = async () => {
    await logoutRequest();
    dispatch(logoutUser());
    // navigate('/login');
  };

  return (
    <Layout backBtn to="/dashboard" showCoSafeLogo>
      <Page>
        <SSidebar>
          <SContainer>
            <div>
              <ProfilePicture
                profilePictureFileName={user!.photoFileName}
                diameter={50}
              />
            </div>
            <SRowContainers>
              <SName> {user?.name} </SName>
              <SInfoContainer>
                <SInfo to="/profile">{t(`viewProfile`)}</SInfo>
              </SInfoContainer>
            </SRowContainers>
          </SContainer>
          <SElementContainer>
            {sidebarElements.map((element, key) => (
              <SidebarElement
                key={key}
                name={element.name}
                icon={element.icon}
                to={element.to}
                onClick={element.onClick}
                style={element.style}
              />
            ))}
          </SElementContainer>
          <div style={{ flex: 1 }} />
          <BigFloatButton
            tx="logout"
            onClick={confirmLogout}
            extraPadding={false}
          />
        </SSidebar>
      </Page>
    </Layout>
  );
}

export default Sidebar;

const SSidebar = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 19px 0 0;
  height: 100%;
`;

const SRowContainers = styled.div`
  color: ${palette.white};
  padding: 8px 4px 8px 18px;
`;

const SContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 31px;
`;

const SName = styled.div`
  font-size: 16px;
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;
  color: ${(props) => props.theme.palette.text.primary};
  margin-bottom: 7px;
`;

const SInfoContainer = styled.div`
  display: flex;
`;

const SInfo = styled(Link)`
  font-size: 12px;
  font-family: 'Roboto-Regular';
  color: ${palette.honeyYellow};
  line-height: 14px;
  text-transform: uppercase;
  text-decoration: none;
`;

export const SElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  * + * {
    margin-top: 10px;
  }
`;
