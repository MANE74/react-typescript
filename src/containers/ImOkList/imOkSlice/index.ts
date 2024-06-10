import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { ImOkDocument, ImOkDocumentSimple, ImOkDocumentState } from './types';

const initialState: ImOkDocumentState = {
  imOkList: [],
  isLoading: false,
  imOkErrors: null,
  imOkDocument: null,
  showImOkBottomModal: false
};

const imOkSlice = createSlice({
  name: 'imOkState',
  initialState,
  reducers: {
    setImOkList: (state, action: PayloadAction<ImOkDocument[]>) => {
      state.imOkList = action.payload;
    },
    setImOkLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setImOkDocument: (state, action: PayloadAction<ImOkDocumentSimple | null>) => {
      state.imOkDocument = action.payload;
    },
    setIsError: (state, action: PayloadAction<string>) => {
      state.imOkErrors = action.payload;
    },
    setShowImOkBottomModal: (state, action: PayloadAction<boolean>) => {
      state.showImOkBottomModal = action.payload;
    },
  },
});

export const { setImOkLoading, setIsError, setImOkList, setImOkDocument, setShowImOkBottomModal } = imOkSlice.actions;

export const selectImOkList = (state: RootState) => state.imOkState.imOkList;
export const selectImOkError = (state: RootState) => state.imOkState.imOkErrors;
export const selectImOkDocument = (state: RootState) => state.imOkState.imOkDocument;
export const selectImOkIsLoading = (state: RootState) =>
  state.imOkState.isLoading;
export const isImOkBottomModalOpen = (state: RootState) => state.imOkState.showImOkBottomModal;

export default imOkSlice.reducer;
