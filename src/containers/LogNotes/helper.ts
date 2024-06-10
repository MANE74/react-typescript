import { SentMessageType } from '../../utils/enums';
import { Chat } from '../ChatsList/chatListSlice/types';

export const getLogNotes = (messages: Chat[]) => {
  return messages.filter(message => message?.type === SentMessageType.LogNotes);
};
