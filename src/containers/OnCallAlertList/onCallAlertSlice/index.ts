import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { OnCallAlertDocument, OnCallAlertDocumentSimple, OnCallAlertState } from './types';

const initialState: OnCallAlertState = {
  onCallAlertList: [],
  isLoading: false,
  onCallAlertErrors: null,
  onCallAlertDocument: null,
  showOnCallAlertBottomModal: false
};

const onCallAlertSlice = createSlice({
  name: 'onCallAlertState',
  initialState,
  reducers: {
    setOnCallAlertList: (state, action: PayloadAction<OnCallAlertDocument[]>) => {
      state.onCallAlertList = action.payload;
    },
    setonCallAlertLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOnCallAlertDocument: (state, action: PayloadAction<OnCallAlertDocumentSimple | null>) => {
      state.onCallAlertDocument = action.payload;
    },
    setIsError: (state, action: PayloadAction<string>) => {
      state.onCallAlertErrors = action.payload;
    },
    setShowOnCallAlertBottomModal: (state, action: PayloadAction<boolean>) => {
      state.showOnCallAlertBottomModal = action.payload;
    },
  },
});

export const { setonCallAlertLoading, setIsError, setOnCallAlertList, setOnCallAlertDocument, setShowOnCallAlertBottomModal } = onCallAlertSlice.actions;

export const selectOnCallAlertList = (state: RootState) => state.onCallAlertState.onCallAlertList;
export const selectOnCallAlertError = (state: RootState) => state.onCallAlertState.onCallAlertErrors;
export const selectOnCallAlertDocument = (state: RootState) => state.onCallAlertState.onCallAlertDocument;
export const selectOnCallAlertIsLoading = (state: RootState) =>
  state.onCallAlertState.isLoading;
export const isOnCallAlertBottomModalOpen = (state: RootState) => state.onCallAlertState.showOnCallAlertBottomModal;

export default onCallAlertSlice.reducer;
