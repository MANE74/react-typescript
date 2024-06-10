import {
  BottomRow,
  LeftContainer,
  MessagesTextContainer,
  Row,
  SimpleText,
} from './SelectGroupList.styles';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import { isNil } from 'lodash';
import SCheckbox from '../FilterItem/SBoxButton';
import { trunctateText } from '../../utils/truncate';
import { translate } from '../../utils/translate';
import { SelectItemContainer } from './UserSelectItem';

export interface IGroupProps {
  name: string;
  membersCount: number;
  onCardPress: () => void;
  isSelected: boolean;
  type: string | null;
  disable?: boolean;
  photoFileName?: string;
}

export const GroupSelectItem = (props: IGroupProps) => {
  const {
    name,
    membersCount,
    onCardPress,
    isSelected,
    type,
    disable,
    photoFileName,
  } = props;

  const subtitle = type
    ? type
    : `${membersCount} ${
        membersCount === 1 ? translate('member') : translate('groups_members')
      }`;

  return (
    <SelectItemContainer
      onClick={() => !disable && onCardPress()}
      className="item-container"
    >
      <BottomRow>
        <LeftContainer>
          <ProfilePicture
            profilePictureFileName={photoFileName || null}
            isGroup
          />
        </LeftContainer>
        <MessagesTextContainer>
          <SimpleText margin="0.3rem 0 0" fontSize={'0.8rem'}>
            {trunctateText(name, 50)}
          </SimpleText>
          <Row>
            {!isNil(membersCount) && (
              <SimpleText fontSize={'0.7rem'} gray>
                {subtitle}
              </SimpleText>
            )}
          </Row>
        </MessagesTextContainer>
        <SCheckbox isChecked={isSelected} disabled={disable} />
      </BottomRow>
    </SelectItemContainer>
  );
};
