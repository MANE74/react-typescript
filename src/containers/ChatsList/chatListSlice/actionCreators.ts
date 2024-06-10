import _ from 'lodash';
import { batch } from 'react-redux';
import { NavigateFunction } from 'react-router-dom';
import {
  setChats,
  setIsError,
  setIsChatsLoading,
  setTotalUnread,
  setMessagesRecipients,
  setSearchPhrase,
  setCurrentChat,
  setIncomingMessages,
  setLogNotes,
  selectHoldingStatement,
  setHoldingStatements,
} from '.';
import {
  archiveMessage,
  deleteChat,
  deleteReply,
  editMessage,
  getChats,
  GetChatsProps,
  getMessagesRecipients,
  getSingleChat,
  getTotalUnread,
  messageRead,
  recallAlert,
  replyToMessage,
} from '../../../apis/chatAPI';
import { AppThunk } from '../../../store';
import { MessageReplyType, SentMessageType } from '../../../utils/enums';
import { translate } from '../../../utils/translate';
import { trunctateText } from '../../../utils/truncate';
import { MessageReplyModel } from '../../Chat/Chat';
import {
  setForwardedMessage,
  setGroupMembers,
  setSelectedGroups,
  setSelectedGroupType,
  setSelectedUsers,
} from '../../CreateMessage/createMessageSlice';
import { Chat } from './types';

export const fetchChats =
  (props: GetChatsProps): AppThunk =>
  async dispatch => {
    const { search = '' } = props;
    try {
      dispatch(setIsChatsLoading(true));
      const chats = await getChats({
        search,
      });

      batch(() => {
        dispatch(setSearchPhrase(search));
        dispatch(setChats(chats));
        dispatch(setIsChatsLoading(false));
        dispatch(setIncomingMessages(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsChatsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const fetchLogNotes =
  (props: GetChatsProps): AppThunk =>
  async dispatch => {
    try {
      dispatch(setIsChatsLoading(true));
      const chats = await getChats({
        ...props,
        types: [SentMessageType.LogNotes],
      });

      batch(() => {
        dispatch(setLogNotes(chats));
        dispatch(setIsChatsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsChatsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const fetchHoldingStatement =
  (props: GetChatsProps): AppThunk =>
  async dispatch => {
    try {
      dispatch(setIsChatsLoading(true));
      const chats = await getChats({
        ...props,
        types: [SentMessageType.HoldingStatement],
      });

      batch(() => {
        dispatch(setHoldingStatements(chats));
        dispatch(setIsChatsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsChatsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const reset = (): AppThunk => (dispatch, state) => {
  const searchTerm = state().chatList.searchPhrase;

  if (searchTerm) {
    dispatch(setSearchPhrase(''));
    dispatch(fetchChats({ search: '' }));
  }
};

export const resetChat = (): AppThunk => dispatch => {
  batch(() => {
    dispatch(setForwardedMessage(null));
    dispatch(setCurrentChat(undefined));
    dispatch(setSelectedGroups([]));
    dispatch(setSelectedUsers([]));
    dispatch(setGroupMembers([]));
    dispatch(setSelectedGroupType([]));
  });
};

export const fetchCurrentChat =
  (id: string, refetch?: boolean): AppThunk =>
  async dispatch => {
    try {
      !refetch && dispatch(setIsChatsLoading(true));
      const currentChat = await getSingleChat(id);
      batch(() => {
        dispatch(setCurrentChat(currentChat));
        dispatch(setIsChatsLoading(false));
        dispatch(readMessage(currentChat.id));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsChatsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

const fetchSingleChat =
  (id: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      let newState = [...getState().chatList.chats];
      const newChat = await getSingleChat(id);
      const index = _.findIndex(newState, chat => chat.id === newChat.id);
      if (index > -1) {
        newState[index] = newChat;
        dispatch(setChats(newState));
      }
    } catch (error) {
      console.log('error log ', error);
    }
  };

export const readMessage =
  (id: number): AppThunk =>
  async dispatch => {
    try {
      await messageRead(id);
      batch(() => {
        dispatch(fetchTotalUnread(true));
        dispatch(fetchSingleChat(`${id}`));
      });
    } catch (error) {
      console.log('error log ', error);
      dispatch(setIsError(`${error}`));
    }
  };

export const fetchTotalUnread =
  (read?: boolean): AppThunk =>
  async (dispatch, store) => {
    try {
      const lastTotalUnread = store().chatList.totalUnread.UnreadCount;
      const totalUnread = await getTotalUnread();
      if (
        lastTotalUnread &&
        lastTotalUnread !== totalUnread.UnreadCount &&
        !read
      ) {
        dispatch(setIncomingMessages(true));
      }
      dispatch(setTotalUnread(totalUnread));
    } catch (error) {
      console.log('error log ', error);
      dispatch(setIsError(`${error}`));
    }
  };

export const hideAMessage =
  (id: number, messages: Chat[]): AppThunk =>
  async dispatch => {
    try {
      setIsChatsLoading(true);
      await archiveMessage(id);
      const filterMessages = messages.filter(message => message.id !== id);
      batch(() => {
        dispatch(setChats(filterMessages));
      });
      setIsChatsLoading(false);
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const endAlertAction =
  (chatID: number): AppThunk =>
  async dispatch => {
    try {
      const res = await recallAlert(chatID);
      if (res) {
        dispatch(fetchCurrentChat(`${chatID}`));
      }
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const deleteAMessage =
  (
    chatID: number,
    navigate: NavigateFunction,
    logNotes?: boolean,
    fromHoldingStatement?: boolean
  ): AppThunk =>
  async dispatch => {
    try {
      setIsChatsLoading(true);
      await deleteChat(chatID);
      setIsChatsLoading(false);
      if (logNotes) {
        dispatch(fetchLogNotes({}));
      } else if (fromHoldingStatement) {
        navigate('/holding-statement');
      } else {
        navigate('/chat');
      }
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsError(`${error}`));
      });
    }
  };
export const deleteHoldingStatement =
  (chatID: number, searchTerm?: string): AppThunk =>
  async dispatch => {
    try {
      setIsChatsLoading(true);
      await deleteChat(chatID);
      dispatch(fetchHoldingStatement({ search: searchTerm }));

      setIsChatsLoading(false);
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const deleteAReply =
  (messageID: number, replyID: number): AppThunk =>
  async dispatch => {
    try {
      setIsChatsLoading(true);
      await deleteReply(messageID, replyID);
      dispatch(fetchCurrentChat(messageID.toString()!));
      setIsChatsLoading(false);
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const messageReplyTextGenerator = (
  messageType: MessageReplyType,
  message: Chat,
  userId: number
) => {
  const {
    lastReplySenderId,
    senderID,
    searchReplyText,
    lastReplyText,
    lastReplyLocationName,
    locationID,
    lastReplyPhotoFileNames,
    photoFileNames,
    lastReplyAudioFileNames,
    audioFileNames,
    lastReplyDocumentFileNames,
    documentFileNames,
    emergencyTypeName,
    text: messageText,
  } = message;
  const lastSenderId = lastReplySenderId || senderID;
  const isSent = lastSenderId === userId;
  const isReply = messageType === MessageReplyType.Reply;
  const textMessage = isReply ? searchReplyText || lastReplyText : messageText;
  const locationMessage = isReply ? lastReplyLocationName : locationID;
  const photoFilesCount = isReply
    ? lastReplyPhotoFileNames?.length
    : photoFileNames?.length;
  const audioFilesCount = isReply
    ? lastReplyAudioFileNames?.length
    : audioFileNames?.length;
  const documentFilesCount = isReply
    ? lastReplyDocumentFileNames?.length
    : documentFileNames?.length;

  if (textMessage && textMessage.trim() !== '') {
    return `${trunctateText(textMessage, 50)}`;
  } else if (locationMessage) {
    return isSent
      ? translate('messages_location_sent')
      : translate('messages_location_received');
  } else if (photoFilesCount) {
    if (isSent) {
      return translate(photoFilesCount === 1 ? 'imageSent' : 'imagesSent', {
        count: photoFilesCount,
      });
    } else {
      return translate(
        photoFilesCount === 1 ? 'imageReceived' : 'imagesReceived',
        {
          count: photoFilesCount,
        }
      );
    }
  } else if (audioFilesCount) {
    return translate(isSent ? 'audioSent' : 'audioReceived');
  } else if (documentFilesCount) {
    return `${documentFilesCount > 1 ? documentFilesCount : ''} ${
      documentFilesCount > 1
        ? translate(
            isSent ? 'messages_documents_sent' : 'messages_documents_received',
            {
              count: documentFilesCount,
            }
          )
        : translate(isSent ? 'documentSent' : 'documentReceived', {
            count: documentFilesCount,
          })
    }`;
  } else if (!lastReplyText && emergencyTypeName) {
    return emergencyTypeName;
  } else return '';
};

export const editMessageAction =
  (text: string, messageID: number, replyID?: number): AppThunk =>
  async dispatch => {
    try {
      if (replyID) {
        await editMessage(replyID, text, true);
      } else {
        await editMessage(messageID, text, false);
      }
      batch(() => {
        dispatch(fetchCurrentChat(messageID.toString()!, true));
      });
    } catch (error) {}
  };

export const replyToMessageAction =
  (messageReply: MessageReplyModel): AppThunk =>
  async dispatch => {
    try {
      // dispatch(setIsChatsLoading(true));
      await replyToMessage(messageReply);
      batch(() => {
        dispatch(fetchCurrentChat(messageReply.messageId?.toString()!, true));
        dispatch(readMessage(messageReply.messageId));
        dispatch(setIsChatsLoading(false));
      });
    } catch (error) {
      dispatch(setIsChatsLoading(false));
      console.log('error log ', error);
    }
  };

export const getMessagesRecipientsAction =
  (messageID: number): AppThunk =>
  async dispatch => {
    try {
      const messagesRecipients = await getMessagesRecipients(messageID);
      batch(() => {
        dispatch(setMessagesRecipients(messagesRecipients));
      });
    } catch (error) {
      console.log('error log ', error);
    }
  };
