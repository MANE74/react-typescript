import React from 'react';
import {
  BottomRow,
  LeftContainer,
  MessagesTextContainer,
  OnCallAlertContainer,
  Row,
  SGroupsTitle,
  SimpleText,
  Subject,
  WhiteSpan,
} from './OnCallAlertItem.styles';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import { useAppSelector } from '../../hooks';
import { selectGroups } from '../../containers/GroupsList/groupsSlice';
import _ from 'lodash';
import {
  checkIfDateIsToday,
  dateFormats,
  getDateFormatCustom,
} from '../../utils/date';
import { OnCallAlertDocument } from '../../containers/OnCallAlertList/onCallAlertSlice/types';
import { translate } from '../../utils/translate';

export interface OnCallAlertProps {
  onCallAlert: OnCallAlertDocument;
}

export const OnCallAlertItem = (props: OnCallAlertProps) => {
  const { onCallAlert } = props;
  const {
    subject,
    ended,
    groupName,
    started,
    groupId,
    text,
    groupImage,
    id,
    senderName,
    canParticipate,
    totalRecipients,
  } = onCallAlert;
  const groupsList = useAppSelector(selectGroups);
  const group = _.find(groupsList, group => group.id === groupId);
  const dateFormat = checkIfDateIsToday(started || '')
    ? dateFormats.simpleTime24
    : dateFormats.mothNameShortDateTimeNoComma24;

  return (
    <OnCallAlertContainer to={`/oncall/${id}`}>
      <Row>
        <Subject ended={ended}>
          {subject || translate('onCallAlert_screen')}
        </Subject>
        <SimpleText fontSize={'0.7rem'}>{`${canParticipate || 0}/${
          totalRecipients || 0
        } ${translate('onCallAlert_available')}`}</SimpleText>
      </Row>
      <BottomRow>
        <LeftContainer>
          <ProfilePicture
            profilePictureFileName={group?.imageFileName || groupImage || ''}
            isGroup
          />
        </LeftContainer>
        <MessagesTextContainer>
          <SGroupsTitle>{groupName}</SGroupsTitle>
          <Row>
            <SimpleText fontSize={'0.7rem'} gray>
              {senderName}: <WhiteSpan>{text}</WhiteSpan>
            </SimpleText>
            <SimpleText fontSize={'0.6rem'}>
              <WhiteSpan>
                {getDateFormatCustom(started || '', dateFormat)}
              </WhiteSpan>
            </SimpleText>
          </Row>
        </MessagesTextContainer>
      </BottomRow>
    </OnCallAlertContainer>
  );
};
