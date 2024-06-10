import React from 'react';
import { ImOkDocument } from '../../containers/ImOkList/imOkSlice/types';
import {
  BottomRow,
  ImOkContainer,
  LeftContainer,
  MessagesTextContainer,
  Row,
  SGroupsTitle,
  SimpleText,
  Subject,
  WhiteSpan,
} from './ImOkItem.styles';
import { useTranslation } from 'react-i18next';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import _ from 'lodash';
import {
  checkIfDateIsToday,
  dateFormats,
  getDateFormatCustom,
} from '../../utils/date';
import { translate } from '../../utils/translate';

export interface ImOkProps {
  imOk: ImOkDocument;
}

export const ImOkItem = (props: ImOkProps) => {
  const { imOk } = props;
  const {
    subject,
    ended,
    groups,
    created,
    name,
    recipientsOk,
    recipientsNotOk,
    recipients,
    id,
    creatorname,
  } = imOk;
  const group = _.find(groups, group => group.id === groups[0]?.id);

  const groupsName = groups?.length ? groups[0].name : '';

  const { t } = useTranslation();
  const dateFormat = checkIfDateIsToday(created)
    ? dateFormats.simpleTime24
    : dateFormats.mothNameShortDateTimeNoComma24;

  return (
    <ImOkContainer to={`/muster/${id}`}>
      <Row>
        <Subject ended={ended}>{subject || translate(`imOk_title`)}</Subject>
        <SimpleText fontSize={'0.7rem'}>{`${
          (recipientsOk ?? 0) + (recipientsNotOk ?? 0)
        }/${recipients} ${t('imOk_okay')}`}</SimpleText>
      </Row>
      <BottomRow>
        <LeftContainer>
          <ProfilePicture
            profilePictureFileName={group?.image || null}
            isGroup
          />
        </LeftContainer>
        <MessagesTextContainer>
          <SGroupsTitle>{groupsName}</SGroupsTitle>
          <Row>
            <SimpleText fontSize={'0.7rem'} gray>
              {creatorname}: <WhiteSpan>{name}</WhiteSpan>
            </SimpleText>
            <SimpleText fontSize={'0.6rem'}>
              <WhiteSpan>{getDateFormatCustom(created, dateFormat)}</WhiteSpan>
            </SimpleText>
          </Row>
        </MessagesTextContainer>
      </BottomRow>
    </ImOkContainer>
  );
};
