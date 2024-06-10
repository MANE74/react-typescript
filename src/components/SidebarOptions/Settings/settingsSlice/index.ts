import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserById } from '../../../../apis/userAPI/types';
import { RootState } from '../../../../store';
import { SettingsState, SettingsType } from './types';

// initail state
const initialState: SettingsState = {
  account: null,

  isLoading: false,
};

// group detail slice
const settingsSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUserAccount: (state, action: PayloadAction<UserById>) => {
      state.account = action.payload;
    },
    setIsSettingsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// export the reducers
export const { setUserAccount, setIsSettingsLoading } = settingsSlice.actions;

export const selectSettings = (state: RootState) => {
  return {
    notifyChecklists: state.settings.account?.notifyChecklists,
    notifyDocuments: state.settings.account?.notifyDocuments,
    notifyWithEmail: state.settings.account?.notifyWithEmail
  } as SettingsType
};

export const selectIsSettingsLoading = (state: RootState) =>
  state.settings.isLoading;

export default settingsSlice.reducer;
