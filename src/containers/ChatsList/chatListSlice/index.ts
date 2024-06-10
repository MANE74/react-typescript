import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RootState } from '../../../store';
import { getGroupByID } from '../../GroupsList/groupsSlice';
import { Group } from '../../GroupsList/groupsSlice/types';
import { Chat, ChatListState, MessagesRecipients, TotalUnread } from './types';
import { getLogNotes } from '../../LogNotes/helper';
import { filterStatement } from '../../../utils/customHooks/useStatementFilterdAndPagination';

// initail state
const initialTotalUnread: TotalUnread = {
  ActiveEmergency: false,
  UnreadCount: null,
};
const initialState: ChatListState = {
  chats: [],
  logNotes: [],
  holdingStatements: [],
  seachedChats: [],
  currentChat: undefined,
  totalUnread: initialTotalUnread,
  isLoading: false,
  error: null,
  joinGroupError: null,
  messagesRecipients: [],
  searchPhrase: '',
  incomingMessage: false,
  chatFilters: []
};

// group detail slice
const chatListSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setLogNotes: (state, action: PayloadAction<Chat[]>) => {
      state.logNotes = action.payload;
    },
    setHoldingStatements: (state, action: PayloadAction<Chat[]>) => {
      state.holdingStatements = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setTotalUnread: (state, action: PayloadAction<TotalUnread>) => {
      state.totalUnread = action.payload;
    },
    loadMore: (state, action: PayloadAction<Chat[]>) => {
      const newChatArray = [...state.chats, ...action.payload];
      state.chats = newChatArray;
    },
    setCurrentChat: (state, action: PayloadAction<Chat | undefined>) => {
      state.currentChat = action.payload;
    },
    setSearchPhrase: (state, action: PayloadAction<string>) => {
      state.searchPhrase = action.payload;
    },
    setIncomingMessages: (state, action: PayloadAction<boolean>) => {
      state.incomingMessage = action.payload;
    },
    setChatFilters: (state, action: PayloadAction<number[]>) => {
      state.chatFilters = action.payload;
    },
    setMessagesRecipients: (
      state,
      action: PayloadAction<MessagesRecipients[]>
    ) => {
      state.messagesRecipients = action.payload;
    },
  },
});

// export store actions
export const {
  setIsLoading: setIsChatsLoading,
  setIsError,
  setChats,
  loadMore,
  setCurrentChat,
  setTotalUnread,
  setIncomingMessages,
  setSearchPhrase,
  setMessagesRecipients,
  setLogNotes,
  setHoldingStatements,
  setChatFilters,
} = chatListSlice.actions;

// data selecting could be seperated also
export const selectChats = (state: RootState) => state.chatList.chats;
export const selectMessagesTotalUnread = (state: RootState) =>
  state.chatList.totalUnread.UnreadCount;
export const selectSearchPhrase = (state: RootState) =>
  state.chatList.searchPhrase;
export const selectMessagesActiveEmergancy = (state: RootState) =>
  state.chatList.totalUnread.ActiveEmergency;
export const selectCurrentChat = (state: RootState) =>
  state.chatList.currentChat;
export const selectMessagesRecipients = (state: RootState) =>
  state.chatList.messagesRecipients;

export const getActiveChatGroups = (state: RootState) => {
  const availableGroups: Group[] = [];
  _.forEach(state.chatList.chats, message => {
    const foundGroup = getGroupByID(Number(message.groupID), state);
    foundGroup &&
      availableGroups.indexOf(foundGroup) === -1 &&
      availableGroups.push(foundGroup);
  });
  return availableGroups;
};

export const selectChatListFilters = (state: RootState) => state.chatList.chatFilters;
export const isChatsLoading = (state: RootState) => state.chatList.isLoading;
export const selectIsIncomingMessages = (state: RootState) =>
  state.chatList.incomingMessage;

export const selectLogNotes = (state: RootState) => state.chatList.logNotes;

export const selectLogNoteById = (id: number) => (state: RootState) =>
  getLogNotes(state.chatList.chats).find(chat => chat.id === id);

export const selectHoldingStatementWithFilter =
  (filterOnlyGroupIds: number[] | undefined, groups: Group[]) =>
  (state: RootState) =>
    filterStatement(
      state.chatList.holdingStatements,
      filterOnlyGroupIds,
      getActiveStatementGroups(state)
    );

export const selectHoldingStatement = (state: RootState) =>
  state.chatList.holdingStatements;
export const getActiveStatementGroups = (state: RootState) => {
  const availableGroups: Group[] = [];
  _.forEach(state.chatList.holdingStatements, message => {
    const foundGroup = getGroupByID(Number(message.groupID), state);
    foundGroup &&
      availableGroups.indexOf(foundGroup) === -1 &&
      availableGroups.push(foundGroup);
  });
  return availableGroups;
};

export default chatListSlice.reducer;
