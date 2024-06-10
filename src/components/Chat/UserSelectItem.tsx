import styled from 'styled-components';
import { BottomRow, LeftContainer, SimpleText } from './SelectGroupList.styles';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import _ from 'lodash';
import { SelectListUser } from '../../containers/CreateMessage/createMessageSlice/types';
import SCheckbox from '../FilterItem/SBoxButton';
import { trunctateText } from '../../utils/truncate';

export interface IUserProps {
  user: SelectListUser;
  onCardPress?: () => void;
  isSelected: boolean;
  photoFileName?: string;
}

export const UserSelectItem = (props: IUserProps) => {
  const { user, onCardPress, isSelected, photoFileName } = props;

  return (
    <SelectItemContainer onClick={onCardPress} className="item-container">
      <BottomRow>
        <LeftContainer>
          <ProfilePicture profilePictureFileName={photoFileName || null} />
        </LeftContainer>
        <MessagesTextContainer>
          <Row>
            <SimpleText fontSize={'0.8rem'}>{user.displayName}</SimpleText>
            {/* {!_.isNil(user.title) && (
              <SimpleText fontSize={'0.7rem'} gray>
                {trunctateText(user.title, 50)}
              </SimpleText>
            )} */}
          </Row>
        </MessagesTextContainer>
        <SCheckbox isChecked={isSelected} />
      </BottomRow>
    </SelectItemContainer>
  );
};

export const SelectItemContainer = styled.div`
  padding-bottom: 10px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const MessagesTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;
