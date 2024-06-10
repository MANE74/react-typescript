import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { t } from 'i18next';
import {
  LeftContainer,
  MessagesTextContainer,
  RadioButton,
  RadioButtonLabel,
  Row,
  SimpleText,
} from './SelectGroupList.styles';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import { isNil } from 'lodash';

export const SelectMemberItem = (props) => {
  const { member } = props;

  console.log(member);

  return (
    <GroupItemContainer onClick={props.onCardPress}>
      <BottomRow>
        <LeftContainer>
          <ProfilePicture profilePictureFileName={''} />
        </LeftContainer>
        <LeftContainer>
          {<SimpleText fontSize={'0.7rem'}>{'test'}</SimpleText>}
        </LeftContainer>
        <MessagesTextContainer />
        <Item>
          <RadioButton type="radio" name="radio" />
          <RadioButtonLabel checked={true} />
        </Item>
      </BottomRow>
    </GroupItemContainer>
  );
};

const GroupItemContainer = styled.div`
  padding-bottom: 5px;
  padding-top: 8px;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  position: relative;
`;
