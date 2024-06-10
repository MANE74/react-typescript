import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { I2FAInitiol } from './types';

// initail state
const initialState: I2FAInitiol = {
    email: '',
    password: '',
};

// group detail slice
const login2FASlice = createSlice({
  name: 'login2fa',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
        state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
        state.password = action.payload;
    },
  },
});

// export the reducers
export const {
    setEmail,
    setPassword
} = login2FASlice.actions;

export const selectEmail = (state: RootState) =>
  state.auth2f.email;
export const selectPassword = (state: RootState) =>
  state.auth2f.password

export default login2FASlice.reducer;
