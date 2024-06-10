import * as React from 'react';
import _ from 'lodash';
import { OnCallAlertStatusType } from '../../utils/enums';
import {
  CountText,
  EmptyList,
  ResponseListContainer,
  ResponseRow,
  SwitchButton,
  SwitchButtonText,
  UserWrapper,
} from './OnCallAlert.styles';
import { translate } from '../../utils/translate';
import { palette } from '../../theme/colors';
import { OnCallAlertDocumentSimple } from '../../containers/OnCallAlertList/onCallAlertSlice/types';
import OnCallAlertUserItem from './OnCallAlertUserItem';

export interface OnCallAlertResponseListProps {
  activeButton: OnCallAlertStatusType;
  setActiveButton: (e) => void;
  onCallAlertDocument: OnCallAlertDocumentSimple;
  messageHeight?: number;
}

export const OnCallAlertResponseList = (
  props: OnCallAlertResponseListProps
) => {
  const { activeButton, setActiveButton, onCallAlertDocument, messageHeight } =
    props;
  const { users, id: onCallAlertId, groupId } = onCallAlertDocument;

  const notAvailableUsers = _.filter(
    users,
    user => user.status === OnCallAlertStatusType.NotAvailable
  );
  const availableUsers = _.filter(
    users,
    user => user.status === OnCallAlertStatusType.Available
  );
  const noStatus = _.filter(
    users,
    user => user.status === OnCallAlertStatusType.NoStatus
  );

  const buttonRowItems = [
    {
      id: OnCallAlertStatusType.NotAvailable,
      text: 'onCallAlert_unavailable',
      count: notAvailableUsers?.length || 0,
      color: palette.tartOrange,
      align: 'flex-start',
    },
    {
      id: OnCallAlertStatusType.NoStatus,
      text: 'imOk_notStatus',
      color: 'transparent',
      align: 'center',
    },
    {
      id: OnCallAlertStatusType.Available,
      text: 'onCallAlert_available',
      count: availableUsers?.length || 0,
      color: palette.applGreen,
      align: 'flex-end',
    },
  ];

  const selectedUserGroup = () => {
    if (activeButton === OnCallAlertStatusType.NotAvailable) {
      return notAvailableUsers;
    }
    if (activeButton === OnCallAlertStatusType.Available) {
      return availableUsers;
    }
    return noStatus;
  };
  const selectedGroup = _.find(
    buttonRowItems,
    button => button.id === activeButton
  );

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
              {button.id !== OnCallAlertStatusType.NoStatus && (
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
              <OnCallAlertUserItem
                key={index}
                user={userItem}
                onCallAlertId={onCallAlertId}
                groupId={groupId!}
                selectedGroup={selectedGroup}
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
