import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

// initail state
const initialState: any = {
  isAppLoading: true,
};

// group detail slice
const appSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setIsAppLoading: (state, action: PayloadAction<boolean>) => {
      state.isAppLoading = action.payload;
    },
  },
});

// export the reducers
export const { setIsAppLoading } = appSlice.actions;

export const selectIsAppLoading = (state: RootState) => state.app.isAppLoading;

export default appSlice.reducer;
