import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RootState } from '../../../store';
import { ActiveTab } from '../../../utils/enums';
import { GroupMember } from '../../GroupDetail/groupDetailSlice/types';
import {
  CreateMessageState,
  ForwardMessageModel,
  SelectListUser,
} from './types';

const initialState: CreateMessageState = {
  users: [],
  isLoading: false,
  error: null,
  selectedUsers: [],
  selectedGroups: [],
  groupMembers: [],
  forwardMessage: null,
  selectedGroupType: [],
  activeTab: ActiveTab.Groups,
};

export const createMessageSlice = createSlice({
  name: 'createMessage',
  initialState,
  reducers: {
    setGroupMembers: (state, action: PayloadAction<GroupMember[]>) => {
      state.groupMembers = action.payload;
    },
    setSelectedUsers: (state, action: PayloadAction<any[]>) => {
      state.selectedUsers = action.payload;
    },
    setSelectedGroups: (state, action: PayloadAction<any[]>) => {
      state.selectedGroups = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<ActiveTab>) => {
      state.activeTab = action.payload;
    },
    setUsers: (state, action: PayloadAction<SelectListUser[]>) => {
      state.users = action.payload;
    },
    deleteGroup: (state, action: PayloadAction<number>) => {
      const selectedGroups = state.selectedGroups;
      state.selectedGroups = _.filter(
        selectedGroups,
        x => x.id !== action.payload
      );
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      const selectedUsers = state.selectedUsers;
      state.selectedUsers = _.filter(
        selectedUsers,
        x => x.id !== action.payload
      );
    },
    setForwardedMessage: (
      state,
      action: PayloadAction<ForwardMessageModel | null>
    ) => {
      state.forwardMessage = action.payload;
    },
    setSelectedGroupType: (state, action: PayloadAction<number[]>) => {
      state.selectedGroupType = action.payload;
    },
    resetSelectedUser: state => {
      state.selectedUsers = [];
    },
    resetAll: state => {
      state.activeTab = ActiveTab.Groups;
      state.selectedUsers = [];
      state.groupMembers = [];
      state.selectedGroups = [];
      state.selectedGroupType = [];
    },
  },
});

// export store actions
export const {
  setGroupMembers,
  deleteGroup,
  deleteUser,
  setSelectedUsers,
  setSelectedGroups,
  setIsLoading,
  setIsError,
  setUsers,
  setActiveTab,
  setForwardedMessage,
  setSelectedGroupType,
  resetSelectedUser,
  resetAll,
} = createMessageSlice.actions;

export const createMessageIsLoading = (state: RootState) =>
  state.createMessage.isLoading;

export const createMessageError = (state: RootState) =>
  state.createMessage.error;

export const createMessageGetUsers = (state: RootState) =>
  state.createMessage.users;

export const getSelectedUsers = (state: RootState) =>
  state.createMessage.selectedUsers;

export const getSelectedGroups = (state: RootState) =>
  state.createMessage.selectedGroups;

export const selectGroupMembers = (state: RootState) =>
  state.createMessage.groupMembers;

export const getForwardedMessage = (state: RootState) =>
  state.createMessage.forwardMessage;

export const getSelectedGroupType = (state: RootState) =>
  state.createMessage.selectedGroupType;

export const selectActiveTab = (state: RootState) =>
  state.createMessage.activeTab;

export default createMessageSlice.reducer;
