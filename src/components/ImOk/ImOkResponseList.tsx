import * as React from 'react';
import _ from 'lodash';
import { ImOkStatusType } from '../../utils/enums';
import ImOkUserItem from './ImOkUserItem';
import {
  CountText,
  EmptyList,
  ResponseListContainer,
  ResponseRow,
  SwitchButton,
  SwitchButtonText,
  UserWrapper,
} from './ImOk.styles';
import { translate } from '../../utils/translate';
import {
  ImOkDocumentSimple,
  ImOkUser,
} from '../../containers/ImOkList/imOkSlice/types';
import { palette } from '../../theme/colors';
import { IamOkLocationDataType } from '../../containers/ImOkDocument/ImOkDocument';

export interface ImOkResponseListProps {
  activeButton: ImOkStatusType;
  setActiveButton: (e) => void;
  imOkDocument: ImOkDocumentSimple;
  messageHeight?: number;
  handleMapCLick: (data: IamOkLocationDataType) => void;
}

export const ImOkResponseList = (props: ImOkResponseListProps) => {
  const {
    activeButton,
    setActiveButton,
    imOkDocument,
    messageHeight,
    handleMapCLick,
  } = props;
  const {
    recipientsNotOk,
    recipientsOk,
    users,
    groups,
    id: iAmOkId,
  } = imOkDocument;

  const buttonRowItems = [
    {
      id: ImOkStatusType.NotOk,
      text: 'imOk_notOk',
      count: recipientsNotOk,
      color: palette.tartOrange,
      align: 'flex-start',
    },
    {
      id: ImOkStatusType.NoStatus,
      text: 'imOk_notStatus',
      color: 'transparent',
      align: 'center',
    },
    {
      id: ImOkStatusType.Ok,
      text: 'imOk_Ok',
      count: recipientsOk,
      color: palette.applGreen,
      align: 'flex-end',
    },
  ];

  const selectedUserGroup = () => {
    if (activeButton === ImOkStatusType.NotOk) {
      return _.filter(users, user => user.imok === false);
    }
    if (activeButton === ImOkStatusType.Ok) {
      return _.filter(users, user => user.imok === true);
    }
    return _.filter(users, user => user.imok === null);
  };
  const selectedGroup = _.find(
    buttonRowItems,
    button => button.id === activeButton
  );

  const onMapClick = (userItem: ImOkUser) => () =>
    handleMapCLick({
      locationName: userItem.locationName ?? '',
      latitude: userItem.locationLatitude ?? 0,
      longitude: userItem.locationLongitude ?? 0,
      userName: userItem.username ?? '',
      lastupdated: userItem.lastupdated,
    });

  return (
    <ResponseListContainer $removedHeight={messageHeight}>
      <ResponseRow>
        {_.map(buttonRowItems, (button, index) => {
          return (
            <SwitchButton
              align={button.align}
              active={button.id === activeButton}
              onClick={() => setActiveButton(button.id)}
              key={index}
            >
              <SwitchButtonText color={button.color}>
                {translate(button.text)}
              </SwitchButtonText>
              {button.id !== ImOkStatusType.NoStatus && (
                <CountText active={button.id === activeButton}>{`(${
                  button.count || 0
                })`}</CountText>
              )}
            </SwitchButton>
          );
        })}
      </ResponseRow>
      {selectedUserGroup().length ? (
        <UserWrapper>
          {_.map(selectedUserGroup(), (userItem, index) => {
            return (
              <ImOkUserItem
                key={index}
                user={userItem}
                groupId={groups[0].id!}
                iAmOkId={iAmOkId}
                selectedGroup={selectedGroup}
                handleMapCLick={onMapClick(userItem)}
              />
            );
          })}
        </UserWrapper>
      ) : (
        <EmptyList>
          <p>{translate('imOk_noMessages')}</p>
        </EmptyList>
      )}
    </ResponseListContainer>
  );
};
