import * as React from 'react';
import styled from 'styled-components';
import { MenuItem } from '../../components/MenuItem/MenuItem';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useTranslation } from 'react-i18next';

import {
  selectAlreadyopen,
  selectLoginIsLoading,
  selectUserMenuItems,
  selectUserOrganizationWebsite,
  selectUserRoles,
  setAlertMessage,
} from '../Login/LoginSlice';
import { menu } from './helper';
import { fetchTotalUnread } from '../ChatsList/chatListSlice/actionCreators';
import {
  selectMessagesActiveEmergancy,
  selectMessagesTotalUnread,
} from '../ChatsList/chatListSlice';
import { Page } from '../../components/Page/Page';
import { compact, findIndex } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { PWVerifyModal } from '../../components/PWAlertModal/PWAlertModal';
import { getItem, saveItem } from '../../utils/storage';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import Loader from '../../components/Loader/Loader';
import { selectImOkList } from '../ImOkList/imOkSlice';
import { fetchImOkList } from '../ImOkList/imOkSlice/actionCreators';
import { setSelectedOrgsAction } from '../Broadcast/broadcastSlice/actionCreators';

const SSection = styled.section`
  padding: 1rem 7%;
  height: 100%;
`;

const SListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  justify-content: center;
  column-gap: 0.5rem;
  row-gap: 1rem;
  padding-bottom: 1.3125rem;
`;
const SPage = styled(Page)`
  padding: 0;
  overflow-y: auto;
  height: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  background-color: ${props => props.theme.palette.background.primary};
`;

export const DashBoard = () => {
  const navigate = useNavigate();
  const confirm = useConfirmation();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(selectLoginIsLoading);
  const menuItems = useAppSelector(selectUserMenuItems);
  const roles = useAppSelector(selectUserRoles);
  const organizationWebsite = useAppSelector(selectUserOrganizationWebsite);
  const totalUnread = useAppSelector(selectMessagesTotalUnread);
  const activeEmergancy = useAppSelector(selectMessagesActiveEmergancy);
  const totalImOk = useAppSelector(selectImOkList);
  const alreadyOpen = useAppSelector(selectAlreadyopen);
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch(fetchTotalUnread());
    dispatch(fetchImOkList());
    dispatch(setSelectedOrgsAction([]));
  }, [dispatch]);

  React.useEffect(() => {
    if (alreadyOpen) {
      confirm({
        title: 'warning',
        confirmStyle: 'standard',
        confirmText: 'ok',
        onSubmit: () => {
          dispatch(setAlertMessage(false))
        },
        description: 'home_usingWebApp',
      });
    }
    return (): any => dispatch(setAlertMessage(false))
  }, []);

  const indexOfAlarm = findIndex(
    menuItems,
    item => item.technicalName === 'alarm'
  );

  const menuList = menuItems?.map(item => {
    if (item.technicalName === 'organization_website') {
      if (organizationWebsite) return menu[item.technicalName];
      return null;
    }
    return menu[item.technicalName] || null;
  });

  const alarmMenu = menuList?.splice(indexOfAlarm, 1);

  const rolesList = roles?.map(role => {
    return menu[role] || null;
  });

  const extendSelect = (navLink: string) => {
    if (navLink === 'broadcast') {
      verifyPassword();
    } else if (navLink === 'panic' || navLink === 'aloneWorker') {
      confirm({
        title: 'alarm_warning',
        description: 'only_on_mobile',
        onSubmit: () => {},
      });
    } else {
      naviagteTo(navLink);
    }
  };

  const naviagteTo = (navLink: string) => {
    setIsModalOpen(false);
    navigate(`/${navLink}`);
  };

  const verifyPassword = () => {
    setIsModalOpen(true);
  };

  const ToExtendSelectMenus = ['panic', 'aloneWorker', 'broadcast'];

  if (isLoading) return <Loader />;

  return (
    <SPage>
      <SSection>
        <SListContainer>
          {compact([
            ...menuList!.filter(Boolean),
            ...rolesList!.filter(Boolean),
            ...alarmMenu!.filter(Boolean),
          ]).map(item => {
            let notificationNum: number | null | '!' = null;
            if (item.tx === 'home_messages') {
              if (totalUnread !== 0) {
                notificationNum = totalUnread;
              } else {
                notificationNum = activeEmergancy ? '!' : null;
              }
            }
            if (item.tx === 'home_muster') {
              const totalCount = totalImOk.filter(e => !e.ended).length;
              if (totalCount !== 0) {
                notificationNum = totalCount;
              }
            }
            return (
              <MenuItem
                key={item.tx}
                disabled={
                  item.tx === 'home_panic_button' ||
                  item.tx === 'lone_worker_timer'
                }
                hidden={item.tx === 'home_groupAlarm'}
                titleText={t(item.tx)}
                navLink={item.navLink}
                Icon={item.Icon}
                $needDangerStyle={item.tx === 'home_alarm'}
                notificationNum={notificationNum}
                isNotificationDanger={true}
                outsource={item.tx === 'home_organizationWebsite'}
                onSelect={
                  ToExtendSelectMenus.includes(item.navLink)
                    ? (navLink: string) => extendSelect(navLink)
                    : undefined
                }
              />
            );
          })}
        </SListContainer>
      </SSection>
      <PWVerifyModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onProceed={() => naviagteTo('broadcast')}
      ></PWVerifyModal>
    </SPage>
  );
};
