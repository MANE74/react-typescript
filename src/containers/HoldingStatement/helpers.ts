import { compact } from 'lodash';
import {
  checkIfDateIsToday,
  dateFormats,
  getDateFormatCustom,
} from '../../utils/date';
import {
  MessageReplyType,
  ReceivedMessageType,
  SentMessageType,
} from '../../utils/enums';
import { translate } from '../../utils/translate';
import { messageReplyTextGenerator } from '../ChatsList/chatListSlice/actionCreators';
import { Chat } from '../ChatsList/chatListSlice/types';

export const getHoldingStatement = (messages: Chat[]) => {
  return messages.filter(
    message => message?.type === SentMessageType.HoldingStatement
  );
};

export const getMessageSender = (message: Chat, userId: number): string => {
  const { lastReplySenderId, senderID, lastReplySender, senderName } = message;
  const lastSenderId = lastReplySenderId || senderID;
  if (userId === lastSenderId) {
    const sender = translate('messages_you')!;
    return sender;
  } else {
    return lastReplySender || senderName;
  }
};

export const getMessageSubject = (message: Chat): string => {
  const alert = message.type === ReceivedMessageType.Alarm && !message.recalled;
  if (alert) return translate('alert')!;
  if (message.recalled) return translate('messages_alert_canceled')!;
  return message.subject || translate('home_logNotes');
};

export const handleDate = (
  message: Chat,
  timeKey: keyof Pick<Chat, 'lastReplySent' | 'sent' | 'lastRead'>
): string | undefined => {
  if (!message[timeKey]) return undefined;
  if (checkIfDateIsToday(message[timeKey]!)) {
    return getDateFormatCustom(message[timeKey]!, dateFormats.simpleTime24);
  } else {
    return getDateFormatCustom(
      message[timeKey]!,
      dateFormats.mothNameShortDateTimeNoComma24
    );
  }
};

export const messageShowGenerator = (message: Chat, userId: number): string => {
  return (
    messageReplyTextGenerator(MessageReplyType.Reply, message, userId) ||
    messageReplyTextGenerator(MessageReplyType.Message, message, userId) ||
    ''
  );
};

export const getStatementTitle = (message: Chat): string => {
  return message.groupName || translate('messages_you')!;
};

export const getRecipientsMedia = (message: Chat): string[] => {
  if (!message.messageRecipients) return [];
  const usersPhotoNameList = compact(
    message.messageRecipients.map(recipient => {
      if (recipient.photoFileName && recipient.photoFileName.trim() !== '') {
        return recipient.photoFileName;
      }
      return null;
    })
  );
  return usersPhotoNameList;
};
