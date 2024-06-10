import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../apis/authAPI';
import { UserById } from '../../../apis/userAPI/types';
import { RootState } from '../../../store';
import { AuthState } from './types';

// initail state
const initialState: AuthState = {
  user: null,
  language: 'en', //[TODO]: has to be moved to a settings slice
  userById: null,

  isLoading: { login: false, userById: false },
  isUserVerified: true,
  alreadyOpen: false,
  error: null,
};

// group detail slice
const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = { ...state.user, ...action.payload };
    },
    resetUser: state => {
      state.user = null;
    },
    setUserByIdPhotoUrl: (state, action: PayloadAction<string>) => {
      if (state.userById) {
        state.userById.photoUrl = action.payload;
      }
    },
    setUserById: (state, action: PayloadAction<UserById>) => {
      state.userById = action.payload;
    },

    setIsLoginLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = {
        ...state.isLoading,
        login: action.payload,
      };
    },
    setIsUserByIdLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = {
        ...state.isLoading,
        userById: action.payload,
      };
    },
    setIsUserVerified: (state, action: PayloadAction<boolean>) => {
      state.isUserVerified = action.payload;
    },
    setIsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAlertMessage: (state, action: PayloadAction<boolean>) => {
      state.alreadyOpen = action.payload;
    }
  },
});

// export the reducers
export const {
  setUser,
  resetUser,
  setIsLoginLoading,
  setIsUserByIdLoading,
  setIsError,
  setUserById,
  setIsUserVerified,
  setUserByIdPhotoUrl,
  setAlertMessage,
} = loginSlice.actions;

export const selectUserMenuItems = (state: RootState) =>
  state.user.user?.menuItems;
export const selectUserRoles = (state: RootState) => state.user.user?.roles;
export const selectUserOrganizationWebsite = (state: RootState) =>
  state.user.user?.organizationWebsite;
export const selectUser = (state: RootState) => state.user.user;
export const selectUserById = (state: RootState) => state.user.userById;
export const selectLoginError = (state: RootState) => state.user.error;
export const selectOrganizationExternalLink = (state: RootState) =>
  state.user.user?.organizationExternalLink;
export const selectOrganizationID = (state: RootState) =>
  state.user.user?.organizationID;
export const selectUserByIdLoading = (state: RootState) =>
  state.user.isLoading.userById;
export const selectLoginIsLoading = (state: RootState) =>
  state.user.isLoading.login;
export const selectIsUserVerified = (state: RootState) =>
  state.user.isUserVerified;
export const selectCanStartIamok = (state: RootState) =>
  state.user.user?.organizationMusterCreateSetting === 0 ||
  state.user.user?.roles?.includes('ManageMuster');
export const selectCanStartOnCallAlert = (state: RootState) =>
  state.user.user?.roles?.includes('OnCallAlerts');
export const selectAlreadyopen = (state: RootState) => 
  state.user.alreadyOpen
export default loginSlice.reducer;
