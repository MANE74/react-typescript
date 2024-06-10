import React, { useEffect, useState } from 'react';
import { t } from 'i18next';
import {
  checkIfDateIsCurrentYear,
  checkIfDateIsToday,
  dateFormats,
  getDateFormatCustom,
} from '../../utils/date';
import {
  BottomRow,
  LeftContainer,
  MessageItemContainer,
  MessagesTextContainer,
  Row,
  Column,
  SimpleText,
  Subject,
  WhiteSpan,
  SDots,
  SBubble,
  GroupsTitle,
} from './ChatListItem.styles';
import Dots from '../../assets/imgs/documents/documents_dots.svg';
import Broadcast from '../../assets/imgs/chats/broadcast.svg';
import { Chat } from '../../containers/ChatsList/chatListSlice/types';
import { MessageReplyType, ReceivedMessageType } from '../../utils/enums';
import { messageReplyTextGenerator } from '../../containers/ChatsList/chatListSlice/actionCreators';
import Highlighter from 'react-highlight-words';
import { palette } from '../../theme/colors';
import _ from 'lodash';
import { ProfilePictureRow } from '../ProfilePicture/ProfilePictureRow';
import { decode } from 'html-entities';
import { translate } from '../../utils/translate';

export interface ChatListItemProps {
  message: Chat;
  userId: number;
  handleDots: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number
  ) => void;
  overview?: boolean;
  searchText: string;
  groupPictures: string[];
  onClick: (id: number) => void;
}

export const ChatListItem = (props: ChatListItemProps) => {
  const { message, userId, handleDots, searchText, groupPictures, onClick } =
    props;

  const [usersImages, setUsersImages] = useState<string[]>([]);

  const isIamOkMessage = !!message?.musterID;
  const isOnCallAlerMessage = !!message?.onCallAlertID;
  const isAlarm = message.type === ReceivedMessageType.Alarm;
  const alert = isAlarm && !message.recalled;
  const broadcast = message.type === ReceivedMessageType.Broadcast;

  const showReplies =
    !_.isEqual(message.replyType, 1) ||
    (_.isEqual(message.replyType, 1) && _.isEqual(message.senderID, userId)) ||
    (_.isEqual(message.replyType, 1) &&
      _.isEqual(message.lastReplySenderId, userId));

  useEffect(() => {
    const getRecipientsImagesList = () => {
      const usersList = _.filter(message.messageRecipients, (recipient) => {
        if (recipient.photoFileName && recipient.photoFileName.trim() !== '') {
          return recipient.photoFileName;
        }
      });
      const imagesList: string[] = _.map(usersList, 'photoFileName');
      setUsersImages(imagesList);
    };

    getRecipientsImagesList();
  }, [message.messageRecipients]);

  const handleDate = (time: string) => {
    if (checkIfDateIsToday(time)) {
      return getDateFormatCustom(time!, dateFormats.simpleTime);
    } else if (!checkIfDateIsCurrentYear(time)) {
      return getDateFormatCustom(time!, dateFormats.dayMonthNameYearSpace);
    } else {
      return getDateFormatCustom(
        time!,
        dateFormats.mothNameShortDateTimeNoComma24
      );
    }
  };

  const getMessageSender = (message: Chat) => {
    const { lastReplySenderId, senderID, lastReplySender, senderName } =
      message;
    const lastSenderId = lastReplySenderId || senderID;
    if (userId === lastSenderId) {
      const sender = t('messages_you');
      return sender;
    } else {
      return lastReplySender || senderName;
    }
  };

  const messageShowGenerator = () => {
    if (showReplies) {
      return (
        messageReplyTextGenerator(MessageReplyType.Reply, message, userId) ||
        messageReplyTextGenerator(MessageReplyType.Message, message, userId)
      );
    } else {
      return messageReplyTextGenerator(
        MessageReplyType.Message,
        message,
        userId
      );
    }
  };

  const getRecipientsNamesList = () => {
    let recipientsNames = [];
    _.forEach(message.messageRecipients, (recipient) => {
      if (
        recipient.userID !== userId &&
        !_.isNil(recipient.displayName) &&
        !_.isEmpty(recipient.displayName.trim())
      ) {
        recipientsNames.push(recipient.displayName);
      }
    });
    recipientsNames.unshift(translate('messages_you'));
    return _.join(recipientsNames, ', ');
  };

  const findChunksAtBeginningOfWords = ({
    searchWords,
    textToHighlight,
  }: {
    searchWords: string[];
    textToHighlight: string;
  }) => {
    let searchWord = _.head(searchWords) || '';

    const textLow: string = textToHighlight.toLowerCase();
    if (!_.isEmpty(textLow) && !_.isEmpty(searchWord)) {
      let startIndex = textLow.indexOf(searchWord);
      let endIndex = startIndex + searchWord.length;
      if (startIndex === -1 || endIndex === -1) return [];
      return [{ start: startIndex, end: endIndex }];
    } else {
      return [];
    }
  };

  const itemTitle = broadcast
    ? message.subject || translate('broadcast')
    : message.groupName || getRecipientsNamesList();

  return (
    <MessageItemContainer
      selected={false}
      alert={alert}
      overview={props.overview}
      onClick={() => onClick(message.id)}
    >
      <Column className="left">
        <Row padding>
          {!isAlarm && message.subject && (
            <Subject hasSubject={true} ended={true}>
              {message.subject}
            </Subject>
          )}
          {alert && <Subject ended={false}>{t('alert')} </Subject>}
          {message.recalled && isAlarm && (
            <Subject ended={true}>{t('messages_alert_canceled')}</Subject>
          )}
          {!message.subject && !isAlarm && (
            <Subject hasSubject={true} ended={true}>
              {broadcast
                ? t(`broadcast`)
                : isIamOkMessage
                ? t(`home_muster`)
                : isOnCallAlerMessage
                ? t(`onCallAlert_screen`)
                : t(`imOk_message`)}
            </Subject>
          )}

          <SimpleText fontSize={'0.7rem'}>
            {handleDate(message.sent!)}
          </SimpleText>
        </Row>
        <BottomRow>
          <LeftContainer>
            {broadcast && (
              <img style={{ padding: '0.5rem' }} src={Broadcast} alt="" />
            )}
            {!_.isEmpty(message.groupIDs) && !broadcast && (
              <ProfilePictureRow
                profilePictureFileNames={groupPictures}
                isGroup
              />
            )}
            {_.isEmpty(message.groupIDs) && !broadcast && (
              <ProfilePictureRow profilePictureFileNames={usersImages} />
            )}
          </LeftContainer>
          <MessagesTextContainer>
            <Row padding>
              <GroupsTitle>{itemTitle}</GroupsTitle>
              {message.unreadRepliesCount > 0 && (
                <SBubble>
                  <p>{message.unreadRepliesCount}</p>
                </SBubble>
              )}
            </Row>
            <Row>
              <SimpleText fontSize={'0.7rem'} gray>
                {getMessageSender(message)}:{' '}
                <WhiteSpan>
                  <Highlighter
                    highlightStyle={{
                      backgroundColor: 'transparent',
                      color: palette.honeyYellow,
                    }}
                    findChunks={(options) =>
                      findChunksAtBeginningOfWords({
                        searchWords: options.searchWords as string[],
                        textToHighlight: options.textToHighlight,
                      })
                    }
                    searchWords={[searchText]}
                    textToHighlight={decode(messageShowGenerator())}
                    autoEscape
                  />
                </WhiteSpan>
              </SimpleText>
              <SimpleText fontSize={'0.6rem'}>
                <WhiteSpan>
                  {handleDate(message.lastReplySent || message.sent!)}
                </WhiteSpan>
              </SimpleText>
            </Row>
          </MessagesTextContainer>
        </BottomRow>
      </Column>
      {!props.overview && !alert && (
        <Column className="right" onClick={(e) => handleDots(e, message.id)}>
          <SDots src={Dots} alt="" />
        </Column>
      )}
    </MessageItemContainer>
  );
};
