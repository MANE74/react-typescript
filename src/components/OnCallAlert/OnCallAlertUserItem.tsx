import React from 'react';
import { OnCallAlertStatusType } from '../../utils/enums';
import { useNavigate } from 'react-router-dom';
import {
  SwitchButtonText,
  UserButton,
  UserColumn,
  UserContainer,
  UserLocation,
  UserStatus,
} from './OnCallAlert.styles';
import { translate } from '../../utils/translate';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import phoneIcon from '../../assets/imgs/no-phone.svg';
import { OnCallAlertUser } from '../../containers/OnCallAlertList/onCallAlertSlice/types';

export interface OnCallAlertUserItemProps {
  user: OnCallAlertUser;
  selectedGroup: Icon;
  groupId: number;
  onCallAlertId: number;
}

export interface Icon {
  id: OnCallAlertStatusType;
  text: string;
  color: string;
}

const OnCallAlertUserItem = (props: OnCallAlertUserItemProps) => {
  const { user, selectedGroup, groupId, onCallAlertId } = props;
  const { userId, userName, responseTime, hasPhoneNumber } = user;
  const navigation = useNavigate();

  const handleMemberSelected = () => {
    return navigation(
      `/oncall/${onCallAlertId}/memberSettings/${groupId}/${userId}`
    );
  };
  return (
    <UserContainer onClick={() => handleMemberSelected()}>
      <UserColumn>
        {selectedGroup.id !== OnCallAlertStatusType.NoStatus && (
          <SwitchButtonText color={selectedGroup.color}>
            {translate(selectedGroup.text)}
          </SwitchButtonText>
        )}
        <UserButton>{userName}</UserButton>
      </UserColumn>
      <UserColumn>
        <UserStatus paddingRight>
          {selectedGroup.id === OnCallAlertStatusType.NoStatus &&
            translate(selectedGroup.text)}
          {selectedGroup.id !== OnCallAlertStatusType.NoStatus &&
            getDateFormatCustom(
              responseTime,
              dateFormats.yearMonthDayTimeNoComma24
            )}
        </UserStatus>
        {!hasPhoneNumber && <UserLocation src={phoneIcon} />}
      </UserColumn>
    </UserContainer>
  );
};

export default OnCallAlertUserItem;
