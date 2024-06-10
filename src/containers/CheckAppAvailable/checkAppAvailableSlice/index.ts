import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

import { CheckAppAvailableState } from './types';

// initail state
const initialState: CheckAppAvailableState = {
  isOnline: true,
  isLoading: false,
};
// group detail slice
export const checkAppAvailableStateSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setIsOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// export store actions
export const { setIsLoading, setIsOnline } =
  checkAppAvailableStateSlice.actions;

export const selectIsOnLine = (state: RootState) =>
  state.checkAppAvailableState.isOnline;
export const selectIsLoading = (state: RootState) =>
  state.checkAppAvailableState.isLoading;

// export the reducer
export default checkAppAvailableStateSlice.reducer;
