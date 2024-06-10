import styled from 'styled-components';
import _ from 'lodash';
import { palette } from '../../theme/colors';
import {
  BottomRow,
  Item,
  RadioButton,
  RadioButtonLabel,
  SimpleText,
} from './SelectOrgList.styles';
import { translate } from '../../utils/translate';
import SCheckbox from '../../components/FilterItem/SBoxButton';

export interface IOtherProps {
  id: number,
  name?: string,
  title?: string,
}

export interface IOrgProps {
  org: any | IOtherProps;
  onCardPress?: () => void;
  isSelected: boolean;
  style?: any;
}

export const SelectOrgItem = (props: IOrgProps) => {
  const handleOrgType = (org: any) => {
    return !org?.parentId ? `${translate('messages_broadcast_account')}` : `${translate('messages_broadcast_subaccount')}`;
  };

  return (
    <GroupItemContainer onClick={props.onCardPress}>
      <BottomRow>
        {/* <LeftContainer>
          <ProfilePicture profilePictureFileName={''} />
        </LeftContainer> */}
        <MessagesTextContainer>
          <Row>
            <SimpleText fontSize={'0.8rem'} style={props.style}>
              {props.org?.name}
            </SimpleText>
            {_.isNil(props.org.title) && (
              <SimpleText fontSize={'0.7rem'} gray>
                {handleOrgType(props.org)}
              </SimpleText>
            )}
          </Row>
        </MessagesTextContainer>
        <Item>
          {/* <RadioButton type="radio" name="radio" />
          <RadioButtonLabel checked={props.isSelected} /> */}
          <SCheckbox isChecked={props.isSelected} />
        </Item>
      </BottomRow>
    </GroupItemContainer>
  );
};

export const GroupItemContainer = styled.div`
  // border-bottom: 1px solid ${palette.queenBlue};
  padding-bottom: 5px;
  padding-top: 5px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const MessagesTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;
