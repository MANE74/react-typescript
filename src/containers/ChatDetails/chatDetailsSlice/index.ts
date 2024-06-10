import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RootState } from '../../../store';
import { GroupDetail } from '../../GroupDetail/groupDetailSlice/types';

interface ChatDetailsState {
  messageGroups: GroupDetail[];
  messageRecipients: any[];
  isLoading: boolean;
  isError: string | null;
}

const initialState: ChatDetailsState = {
  messageGroups: [],
  messageRecipients: [],
  isLoading: false,
  isError: null,
};

export const messageDetailsSlice = createSlice({
  name: 'messageDetailsSlice',
  initialState: initialState,
  reducers: {
    setMessageGroups: (state, action: PayloadAction<GroupDetail[]>) => {
      state.messageGroups = action.payload;
    },
    setMessageRecipients: (state, action: PayloadAction<any[]>) => {
      state.messageRecipients = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsError: (state, action: PayloadAction<string>) => {
      state.isError = action.payload;
    },
  },
});

export const {
  setMessageGroups,
  setIsLoading,
  setIsError,
  setMessageRecipients,
} = messageDetailsSlice.actions;

export const getMessageGroups = (state: RootState) =>
  state.messageDetails.messageGroups;
export const getMessageRecipients = (state: RootState) =>
  state.messageDetails.messageRecipients;
export const messageDetailsIsLoading = (state: RootState) =>
  state.messageDetails.isLoading;
export const messageDetailsIsError = (state: RootState) =>
  state.messageDetails.isError;
export const selectIsLoading = (state: RootState) =>
  state.messageDetails.isLoading;

export default messageDetailsSlice.reducer;
