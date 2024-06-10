import React from 'react';
import { isNil } from 'lodash';
import styled from 'styled-components';
import { trunctateText } from '../../utils/truncate';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import SCheckbox from '../FilterItem/SBoxButton';
import {
  BottomRow,
  LeftContainer,
  MessagesTextContainer,
  Row,
  SimpleText,
} from '../Chat/SelectGroupList.styles';
import { translate } from '../../utils/translate';
import { palette } from '../../theme/colors';

interface AlarmGroupSelectItemProps {
  id: number;
  name: string;
  checked: boolean;
  onCardPress: () => void;
  membersCount: number;
  type: string | null;
  disable: boolean;
}

function AlarmGroupSelectItem(props: AlarmGroupSelectItemProps) {
  const { name, checked, onCardPress, membersCount, disable, type } = props;

  const subtitle = type
    ? type
    : `${membersCount} ${
        membersCount === 1 ? translate('member') : translate('groups_members')
      }`;

  return (
    <GroupItemContainer
      className="alarm-group"
      onClick={() => {
        !disable && onCardPress();
      }}
    >
      <BottomRow>
        <LeftContainer>
          <ProfilePicture profilePictureFileName={''} isGroup />
        </LeftContainer>
        <MessagesTextContainer>
          <SimpleText margin="0.3rem 0 0" fontSize={'0.8rem'}>
            {trunctateText(name, 50)}
          </SimpleText>
          <Row>
            {!isNil(props) && (
              <SimpleText fontSize={'0.7rem'} gray>
                {subtitle}
              </SimpleText>
            )}
          </Row>
        </MessagesTextContainer>
        <SCheckbox isChecked={checked} disabled={disable} />
      </BottomRow>
    </GroupItemContainer>
  );
}

export const GroupItemContainer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  &.alarm-group + * {
    border-top: 1px solid ${palette.prussianBlue4};
  }
`;

export default AlarmGroupSelectItem;
