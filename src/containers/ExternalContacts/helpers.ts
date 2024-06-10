import {
  ExternalMessageContact,
  ExternalMessage,
  ExternalContact,
  ExternalMessageDetail,
  ExternalMessageRecipient,
} from '../../apis/externalContacts/types';
import {
  RecipientContact,
  RecipientListItem,
} from '../../components/cec/CecDetailCollapsibleCard/CecDetailCollapsibleCard';
import {
  dateFormats,
  getDateFormatCustom,
} from '../../utils/date';
import { translate } from '../../utils/translate';
import {
  CecMessageSendingMethod,
  getSendingMethodsNames,
} from '../CreateCecMessage/helpers';

export const getContactListNames = (
  contactList: ExternalMessageContact[]
): string => {
  return contactList.map(list => list.name).join(', ');
};

export const handleDate = (date: string, dateFormat?: string): string => {
  return getDateFormatCustom(
    date,
    dateFormat ?? dateFormats.mothNameShortDateTimeNoComma24
  );
};

export const handleExternalContactsDate = (
  message: ExternalMessage,
  dateFormat?: string
): string => {
  return handleDate(message['sendTime']!, dateFormat);
};

export const searchedContactMessages = (
  message: ExternalMessage[],
  searchTerm: string | undefined
): ExternalMessage[] => {
  return searchTerm
    ? message.filter(item =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : message;
};

export const searchedExternalContacts = (
  message: ExternalContact[],
  searchTerm: string | undefined
): ExternalContact[] => {
  return searchTerm
    ? message.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : message;
};

export const searchData = <T>(
  data: T[],
  searchTerm: string | undefined,
  searchKey: keyof T
): T[] => {
  return searchTerm
    ? data.filter(item => {
        const _item = item[searchKey];
        if (typeof _item === 'string') {
          return _item.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return data;
      })
    : data;
};

export const getCecMessageToListsNames = (
  cecMessage: ExternalMessage
): string => {
  return (
    translate('messages_to') +
    ' ' +
    cecMessage.contactLists.map(contact => contact.name).join(', ')
  );
};

export const getCecMessageAsSendingMethod = (
  cecMessage: ExternalMessage
): string => {
  return (
    translate('messages_sent_as') +
    ': ' +
    getSendingMethodsNames(cecMessage.sendMethods.map(s => s + 1)).join(', ')
  );
};

export const getCecMessageTime = (cecMessage: ExternalMessage): string => {
  return (
    translate('messages_sent_as') +
    ': ' +
    getSendingMethodsNames(cecMessage.sendMethods.map(s => s + 1)).join(', ')
  );
};

export const getCecContactListRecipients = (
  contactListId: number,
  cecDetailMessage: ExternalMessageDetail
): ExternalMessageRecipient[] => {
  return cecDetailMessage.recipients.filter(
    rec => rec.contactListId === contactListId
  );
};

export const transformListRecipients = (
  contactListId: number,
  cecDetailMessage: ExternalMessageDetail
): RecipientListItem[] => {
  const recipients = getCecContactListRecipients(
    contactListId,
    cecDetailMessage
  );
  const isSmsSent = cecDetailMessage.sendMethods.includes(
    CecMessageSendingMethod.SMS - 1
  );
  const isEmailSent = cecDetailMessage.sendMethods.includes(
    CecMessageSendingMethod.email - 1
  );
  const formated: RecipientListItem[] = recipients.map(rec => {
    let contacts: RecipientContact[] = [];

    if (rec.email) {
      const contact: RecipientContact = {
        title: rec.email,
        sendTime: rec.emailReadTime
          ? `${translate('messages_seen')} ${handleDate(
              rec.emailReadTime,
              dateFormats.yearMonthDayTimeNoComma24
            )}`
          : isEmailSent
          ? 'NOT_READ'
          : 'NOT_SENT',
        id: rec.id,
      };
      contacts.push(contact);
    }
    if (rec.phoneNumber1) {
      const contact: RecipientContact = {
        title: rec.phoneNumber1,
        sendTime: rec.smsReadTime
          ? `${translate('messages_seen')} ${handleDate(
              rec.smsReadTime,
              dateFormats.yearMonthDayTimeNoComma24
            )}`
          : isSmsSent
          ? 'NOT_READ'
          : 'NOT_SENT',
        id: rec.id,
      };
      contacts.push(contact);
    }
    if (rec.phoneNumber2) {
      const contact: RecipientContact = {
        title: rec.phoneNumber2,
        sendTime: rec.smsReadTime
          ? `${translate('messages_seen')} ${handleDate(
              rec.smsReadTime,
              dateFormats.yearMonthDayTimeNoComma24
            )}`
          : isSmsSent
          ? 'NOT_READ'
          : 'NOT_SENT',
        id: rec.id,
      };
      contacts.push(contact);
    }
    return {
      nameTitle: rec.name,
      professionSubtitle: rec.title,
      contact: contacts,
      id: rec.id,
    };
  });

  return formated;
};
