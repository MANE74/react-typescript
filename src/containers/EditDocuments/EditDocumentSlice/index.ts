import { RootState } from '../../../store';
import { CreateFolderState } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CreateFolderState = {
  isLoading: false,
  isListLodaing: false,
  error: null,
};

export const CreateFoldersSlice = createSlice({
  name: 'editDocuments',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsListLoading: (state, action: PayloadAction<boolean>) => {
      state.isListLodaing = action.payload;
    },
    setIsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    reset: state => {
      state.error = null;
    },
  },
});

export const {
  setIsLoading,
  setIsListLoading,
  setIsError,
  reset,
} = CreateFoldersSlice.actions;

export default CreateFoldersSlice.reducer;

export const selectCreateFolderIsLoading = (state: RootState) => state.createFolder.isLoading;