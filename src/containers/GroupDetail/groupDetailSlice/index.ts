import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MemberFilterTypes } from '..';
import { RootState } from '../../../store';
import { sortGroupMembers } from '../helpers';
import {
  GMLoadingState,
  GroupDetail,
  GroupDetailState,
  GroupMember,
} from './types';

// initial state
const initialState: GroupDetailState = {
  groupDetail: null,
  members: null,
  isLoading: {
    all: false,
    member: false,
    groupCard: false,
    groupSettings: false,
    memberSettings: false,
  },
  edit: { location: null },
  error: null,
  groupSettingsError: null,
};

export const groupDetailSlice = createSlice({
  name: 'groupDetail',
  initialState,
  reducers: {
    setGroupDetail: (state, action: PayloadAction<GroupDetail>) => {
      state.groupDetail = action.payload;
    },
    setGroupMembers: (state, action: PayloadAction<GroupMember[]>) => {
      state.members = action.payload;
    },

    setGDIsLoading: (state, action: PayloadAction<GMLoadingState>) => {
      state.isLoading = action.payload;
    },
    setIsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setGroupSettingsError: (state, action: PayloadAction<string | null>) => {
      state.groupSettingsError = action.payload;
    },
    reset: state => {
      state.error = null;
      state.groupDetail = null;
    },
    resetGroupSettings: state => {
      state.groupSettingsError = null;
    },
  },
});

// export store actions
export const {
  setGroupDetail,
  setGDIsLoading,
  setIsError,
  setGroupSettingsError,
  setGroupMembers,

  reset,
  resetGroupSettings,
} = groupDetailSlice.actions;

// data selecting could be separated also
export const selectGroupDetail = (state: RootState) =>
  state.groupDetail.groupDetail;
export const selectMemberById = (state: RootState, memberID: number) => {
  return state.groupDetail.members?.find(member => member.userID === memberID);
};
export const selectGroupDetailIsLoading = (state: RootState) =>
  state.groupDetail.isLoading;
export const selectGroupMembers = (state: RootState) =>
  state.groupDetail.members;

export const selectGroupMembersSortedSearched =
  (sort: MemberFilterTypes, searchTerm?: string) => (state: RootState) =>
    sortGroupMembers(state.groupDetail.members, sort, searchTerm);

export const selectGroupSettingEditedLocation = (state: RootState) =>
  state.groupDetail.edit.location;
export const selectGroupDetailError = (state: RootState) =>
  state.groupDetail.error;
export const selectGroupSettingsError = (state: RootState) =>
  state.groupDetail.groupSettingsError;

export default groupDetailSlice.reducer;
