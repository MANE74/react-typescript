import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { User } from '../../../apis/authAPI';
import { RootState } from '../../../store';
import { BroadcastState } from './types';

// initail state
const initialState: BroadcastState = {
    users: [],
    selectedUsers: [],
    orgs: [],
    selectedOrgs: [],
    broadcastMsgs: null,
    broadcastMsg: null,
    isLoading: false,
    error: null,
  };

// broadcast detail slice
export const broadcastSlice = createSlice({
    name: 'broadcast',
    initialState,
    reducers: {
      setUsers: (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
      },
      setSelectedUsers: (state, action: PayloadAction<any[]>) => {
        state.selectedUsers = action.payload;
      },
      setOrgs: (state, action: PayloadAction<any[]>) => {
        state.orgs = action.payload;
      },
      setSelectedOrgs: (state, action: PayloadAction<any[]>) => {
        state.selectedOrgs = action.payload;
      },
      setBroadcastMsgs: (state, action: PayloadAction<any>) => {
        state.broadcastMsgs = action.payload;
      },
      setBroadcastMsg: (state, action: PayloadAction<any>) => {
        state.broadcastMsg = action.payload;
      },
      setIsLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
      },
      setError: (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      },
      removeUser: (state, action: PayloadAction<number>) => {
        const selectedUsers = state.selectedUsers;
        state.selectedUsers = _.filter(selectedUsers, x => x.id !== action.payload);
      },
      removeOrg: (state, action: PayloadAction<number>) => {
        const selectedOrgs = state.selectedOrgs;
        state.selectedOrgs = _.filter(selectedOrgs, x => x.id !== action.payload);
      }
    },
});

// export store actions
export const {
  setIsLoading,
  setUsers,
  setSelectedUsers,
  setOrgs,
  setSelectedOrgs,
  setBroadcastMsgs,
  setBroadcastMsg,
  removeUser,
  removeOrg,
  setError,
} = broadcastSlice.actions;

// data selection
export const getUsers = (state: RootState) => state.broadcast.users;
export const getSelectedUsers = (state: RootState) => state.broadcast.selectedUsers;
export const getOrgs = (state: RootState) => state.broadcast.orgs;
export const getSelectedOrgs = (state: RootState) => state.broadcast.selectedOrgs;
export const getBroadcastMsgs = (state: RootState) => state.broadcast.broadcastMsgs;
export const getBroadcastMsg = (state: RootState) => state.broadcast.broadcastMsg;
export const getIsLoading = (state: RootState) => state.broadcast.isLoading;
export const getError = (state: RootState) => state.broadcast.error;

// export the reducer
export default broadcastSlice.reducer;
