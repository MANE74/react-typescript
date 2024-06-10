import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Support } from '../../../apis/authAPI';
import { Tutorial } from '../../../apis/mediaAPI';
import { RootState } from '../../../store';

import { SupportState } from './types';

// initail state
const initialState: SupportState = {
  tutorials: null,
  tutorialsImages: [],
  supports: null,
  isLoading: {
    internalSupport: false,
    videoTutorial: false,
  },
  error: null,
};

// group detail slice
const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    setSupports: (state, action: PayloadAction<Support[]>) => {
      state.supports = action.payload;
    },
    setTutorials: (state, action: PayloadAction<Tutorial[]>) => {
      state.tutorials = action.payload;
    },
    setTutorialsImages: (state, action: PayloadAction<string[]>) => {
      state.tutorialsImages = action.payload;
    },
    setIsInternalLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading.internalSupport = action.payload;
    },
    setIsTutorialLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading.videoTutorial = action.payload;
    },
    setIsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

// export the reducers
export const {
  setTutorials,
  setTutorialsImages,
  setSupports,
  setIsTutorialLoading,
  setIsInternalLoading,
  setIsError,
} = supportSlice.actions;

export const selectSupports = (state: RootState) => state.support.supports;
export const selectTutorials = (state: RootState) => state.support.tutorials;
export const selectTutorialsImages = (state: RootState) =>
  state.support.tutorialsImages;
export const selectIsVideoTutorialLoading = (state: RootState) =>
  state.support.isLoading.videoTutorial;
export const selectIsInternalSupportLoading = (state: RootState) =>
  state.support.isLoading.internalSupport;
export const selectTutorialSubTutorial = (id: number) => (state: RootState) =>
  state.support.tutorials
    ?.slice()
    .filter((item) => item.parentId === id)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
export const selectTutorialsList = (state: RootState) =>
  state.support.tutorials
    ?.slice()
    .filter((item) => item.parentId === null)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

export default supportSlice.reducer;
