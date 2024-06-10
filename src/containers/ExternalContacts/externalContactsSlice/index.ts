import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CalculateSmsLengthRes,
  ExternalContact,
  ExternalContactTextTemplate,
  ExternalMessage,
} from '../../../apis/externalContacts/types';
import { RootState } from '../../../store';
import { ExternalContactsState } from './types';

// initail state

const initialState: ExternalContactsState = {
  externalMessages: [],
  externalContacts: [],
  externalContactsTextTemplates: [],

  isLoading: { externalContacts: false, externalMessages: false },
  error: null,
  smsLength: { text: '', tokenLength: 0 },
};

// group detail slice
const externalContactsSlice = createSlice({
  name: 'externalContacts',
  initialState,
  reducers: {
    setExternalMessage: (state, action: PayloadAction<ExternalMessage[]>) => {
      state.externalMessages = action.payload;
    },
    setExternalContacts: (state, action: PayloadAction<ExternalContact[]>) => {
      state.externalContacts = action.payload;
    },
    setExternalContactsTextTemplates: (
      state,
      action: PayloadAction<ExternalContactTextTemplate[]>
    ) => {
      state.externalContactsTextTemplates = action.payload;
    },
    setIsExternalMessagesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading.externalMessages = action.payload;
    },
    setIsExternalContactsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading.externalContacts = action.payload;
    },
    setSmsLength: (state, action: PayloadAction<CalculateSmsLengthRes>) => {
      state.smsLength = action.payload;
    },
    setIsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

// export store actions
export const {
  setIsExternalMessagesLoading,
  setIsExternalContactsLoading,
  setIsError,
  setExternalMessage,
  setExternalContacts,
  setExternalContactsTextTemplates,
  setSmsLength,
} = externalContactsSlice.actions;

export const selectExternalMessags =
  (filterIds?: Set<number>) => (state: RootState) => {
    return filterIds
      ? state.externalContacts.externalMessages.filter((message) => {
          return (
            Array.from(filterIds).filter((id) =>
              message.contactLists.map((con) => con.id).includes(id)
            ).length !== 0
          );
        })
      : state.externalContacts.externalMessages;
  };
export const selectExternalContacts = (state: RootState) =>
  state.externalContacts.externalContacts;

export const selectExternalMessage = (id: number) => (state: RootState) => {
  return state.externalContacts.externalMessages.find(
    (contact) => contact.id === id
  );
};

export const selectSmsLength = (state: RootState) =>
  state.externalContacts.smsLength;

export const selectExternalContactsWithFilter =
  (filterIds: Set<number>) => (state: RootState) =>
    state.externalContacts.externalContacts.filter((contact) =>
      Array.from(filterIds).includes(contact.id)
    );

export const selectExternalContactsTextTemplates = (state: RootState) =>
  state.externalContacts.externalContactsTextTemplates;

export const selectIsExternalMessagsLoading = (state: RootState) =>
  state.externalContacts.isLoading.externalMessages;
export const selectIsExternalContactsLoading = (state: RootState) =>
  state.externalContacts.isLoading.externalContacts;

export default externalContactsSlice.reducer;
