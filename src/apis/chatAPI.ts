import { MessageReplyModel, CreateMessageModel } from '../containers/Chat/Chat';
import { Chat, TotalUnread } from '../containers/ChatsList/chatListSlice/types';
import { objectToQueryParams } from '../utils/format';
import { getAntiForgeryToken } from './authAPI';
import { indexInterface } from './groupsAPI/types';
import { ApiCore } from './utils/core';

const url = 'messages';

const chatAPI = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  put: false,
  patch: true,
  remove: false,
  singleExtra: true,
  url,
});

export interface GetChatsProps extends indexInterface {
  search?: string;
  skip?: number;
  take?: number;
  types?: number[];
}

export const getChats = (props: GetChatsProps) => {
  // in case for log notes & holding statement we don't paginate since that make the list incomplete becoause of filtring
  // so do we need to limit the take [performance wise] ? or maybe take = 0 to make sure that we will recive the full list
  // const { skip = 0, search = '', take = 200 } = props;
  // const isPaginated = (skip !== undefined || skip !== null) && take;
  // its the same in chat, where we need complete list for filter so theres no point for it
  //const { search = '' } = props;

  return chatAPI.performExtra<Chat[]>({
    method: 'GET',
    extraResource: `list?${objectToQueryParams(props)}`,
  });
};


export const getSingleChat = (id: string) => {
  return chatAPI.performExtra<Chat>({
    method: 'GET',
    extraResource: id,
  });
};

export const messageRead = async (id: number) => {
  const csrfToken = await getAntiForgeryToken();

  return chatAPI.performExtra<any>({
    method: 'POST',
    extraResource: `${id}/read`,
    model: {
      read: true,
    },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const getTotalUnread = () => {
  return chatAPI.performExtra<TotalUnread>({
    method: 'GET',
    extraResource: 'TotalUnread',
  });
};

export const archiveMessage = async (id: number) => {
  const csrfToken = await getAntiForgeryToken();

  return chatAPI.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `${id}/archive`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const addGroupToMessage = async (
  messageId: number,
  groupId: number,
  recipientIDs: number[]
) => {
  const csrfToken = await getAntiForgeryToken();

  return chatAPI.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `${messageId}/addgroup/${groupId}`,
    model: { recipientIDs: recipientIDs },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const addRecipientsToMessage = async (
  messageId: number,
  recipientIDs: number[],
) => {
  const csrfToken = await getAntiForgeryToken();

  return chatAPI.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `${messageId}/addRecipients`,
    model: { recipientIDs: recipientIDs },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const recallAlert = async (chatID: number) => {
  const csrfToken = await getAntiForgeryToken();

  return chatAPI.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `${chatID}/recall`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const deleteChat = async (chatID: number) => {
  const csrfToken = await getAntiForgeryToken();

  return chatAPI.performExtra<{ ok?: boolean }>({
    method: 'DELETE',
    extraResource: `${chatID}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const createMessage = async (createMessageModel: CreateMessageModel) => {
  const {
    senderId,
    text,
    photoFileNames,
    documentFileNames,
    audioFileNames,
    groupIds,
    recipientIds,
    emergencyTypeId,
    locationId,
    type,
    subOrganisationIDForEmergencyMessage,
    subject,
    replyType,
  } = createMessageModel;
  const csrfToken = await getAntiForgeryToken();

  return chatAPI.performExtra<Chat>({
    method: 'POST',
    extraResource: ``,
    headers: { 'X-XSRF-Token': csrfToken },
    model: {
      senderId,
      text,
      photoFileNames,
      documentFileNames,
      audioFileNames,
      groupIds,
      recipientIds,
      emergencyTypeId,
      locationId,
      type,
      subOrganisationIDForEmergencyMessage,
      subject,
      replyType,
    },
  });
};

export const deleteReply = async (messageID: number, replyID: number) => {
  const csrfToken = await getAntiForgeryToken();

  return chatAPI.performExtra<{ ok?: boolean }>({
    method: 'DELETE',
    extraResource: `${messageID}/replies/${replyID}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const editMessage = async (
  id: number,
  text: string,
  isReply: boolean
) => {
  const csrfToken = await getAntiForgeryToken();
  if (!isReply) {
    return chatAPI.performExtra<{ ok?: boolean }>({
      method: 'POST',
      extraResource: `${id}`,
      model: {
        text,
      },
      headers: { 'X-XSRF-Token': csrfToken },
    });
  } else {
    return chatAPI.performExtra<{ ok?: boolean }>({
      method: 'POST',
      extraResource: `replies/${id}/edit`,
      model: {
        text,
      },
      headers: { 'X-XSRF-Token': csrfToken },
    });
  }
};

export const replyToMessage = async (messageReply: MessageReplyModel) => {
  const {
    messageId,
    text,
    photoFileNames,
    documentFileNames,
    audioFileNames,
    locationId,
  } = messageReply;
  const csrfToken = await getAntiForgeryToken();

  return chatAPI.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `${messageId}/reply`,
    model: {
      text,
      photoFileNames,
      documentFileNames,
      audioFileNames,
      locationId,
    },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const getMessagesRecipients = (messageID: number) => {
  return chatAPI.performExtra<any>({
    method: 'GET',
    extraResource: `${messageID}/recipients`,
  });
};
