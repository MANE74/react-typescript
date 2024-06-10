import React, { SyntheticEvent } from 'react';
import { ImOkStatusType } from '../../utils/enums';
import { ImOkUser } from '../../containers/ImOkList/imOkSlice/types';
import { useNavigate } from 'react-router-dom';
import {
  SwitchButtonText,
  UserButton,
  UserColumn,
  UserContainer,
  UserLocation,
  UserStatus,
} from './ImOk.styles';
import { translate } from '../../utils/translate';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import locationActive from '../../assets/imgs/general/locationActive.svg';
import locationInActive from '../../assets/imgs/general/locationInActive.svg';

export interface ImOkUserProps {
  user: ImOkUser;
  selectedGroup: Icon;
  groupId: number;
  iAmOkId: number;
  handleMapCLick?: () => void;
}

export interface Icon {
  id: ImOkStatusType;
  text: string;
  color: string;
}

const ImOkUserItem = (props: ImOkUserProps) => {
  const { user, selectedGroup, groupId, iAmOkId, handleMapCLick } = props;
  const {
    userid,
    username,
    lastupdated,
    locationLatitude: latitude,
    locationLongitude: longitude,
  } = user;
  const navigation = useNavigate();
  const activeIcon = latitude && longitude;
  const handleMemberSelected = () => {
    return navigation(`/muster/${iAmOkId}/memberSettings/${groupId}/${userid}`);
  };

  const onMapClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    handleMapCLick && handleMapCLick();
  };

  return (
    <UserContainer onClick={() => handleMemberSelected()}>
      <UserColumn>
        {selectedGroup.id !== ImOkStatusType.NoStatus && (
          <SwitchButtonText $morePadding color={selectedGroup.color}>
            {translate(selectedGroup.text)}
          </SwitchButtonText>
        )}
        <UserButton>{username}</UserButton>
      </UserColumn>
      <UserColumn>
        <UserStatus paddingRight={selectedGroup.id !== ImOkStatusType.NoStatus}>
          {selectedGroup.id === ImOkStatusType.NoStatus &&
            translate(selectedGroup.text)}
          {selectedGroup.id !== ImOkStatusType.NoStatus &&
            getDateFormatCustom(
              lastupdated,
              dateFormats.yearMonthDayTimeNoComma24
            )}
        </UserStatus>
        {selectedGroup.id !== ImOkStatusType.NoStatus && (
          <UserLocation
            onClick={onMapClick}
            src={activeIcon ? locationActive : locationInActive}
          />
        )}
      </UserColumn>
    </UserContainer>
  );
};

export default ImOkUserItem;
