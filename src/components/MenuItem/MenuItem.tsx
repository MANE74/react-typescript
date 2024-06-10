import * as React from 'react';
import styled from 'styled-components';
import { MenuItem as MenuItemType } from '../../containers/DashBoard/helper';
import { SGriditemA, SGriditemLink } from '../GridItemLink/SGridItemLink';
import { NotificationBubble } from '../NotificationBubble/NotificationBubble';

const SMenuName = styled.p`
  font-size: 0.875rem;
  font-family: 'Roboto-Regular';
  color: ${({ theme }) => theme.palette.text.menuPrimary};
  text-align: center;
  text-align-last: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SIconWrapper = styled.div`
  width: 36%;
  height: 36%;
  margin-bottom: 12%;
  min-width: 0;
  position: relative;
  svg {
    height: 100%;
    width: 100%;
  }
`;

const SOverridecSGridItemLink = styled(SGriditemLink)`
  width: 100%;
`;

const SOverridenSGridItem = styled(SGriditemA)`
  width: 100%;
`;

export interface IMenuItemProps extends Omit<MenuItemType, 'tx'> {
  titleText: string;
  hidden: boolean;
  disabled: boolean;
  $needDangerStyle: boolean;
  notificationNum: number | '!' | null;
  isNotificationDanger?: boolean;
  outsource?: boolean;
  onSelect?: (navLink: string) => void;
}

export const MenuItem = (props: IMenuItemProps) => {
  const {
    hidden,
    navLink,
    titleText,
    Icon,
    $needDangerStyle,
    notificationNum,
    isNotificationDanger,
    disabled = false,
    outsource = false,
    onSelect,
  } = props;

  const handleClick = () => {
    onSelect && onSelect(navLink);
  };

  const renderContent = () => (
    <>
      <SIconWrapper>
        {notificationNum && (
          <NotificationBubble
            notification={notificationNum}
            isDanger={isNotificationDanger}
          />
        )}
        <Icon />
      </SIconWrapper>
      <SMenuName>{titleText}</SMenuName>
    </>
  );

  if(hidden) return <></>

  return (
    <>
      {outsource ? (
        <SOverridenSGridItem
          disabled={disabled}
          $needDangerStyle={$needDangerStyle}
          href={navLink}
          target={'_blank'}
          rel={'noopener noreferrer'}
        >
          {renderContent()}
        </SOverridenSGridItem>
      ) : onSelect ? (
        <SOverridecSGridItemLink
          disabled={disabled}
          onClick={handleClick}
          as="div"
          $needDangerStyle={$needDangerStyle}
        >
          {renderContent()}
        </SOverridecSGridItemLink>
      ) : (
        <SOverridecSGridItemLink
          disabled={disabled}
          $needDangerStyle={$needDangerStyle}
          to={`/${navLink}`}
        >
          {renderContent()}
        </SOverridecSGridItemLink>
      )}
    </>
  );
};
