import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import {
  filterGroupsMemberNotMember,
  filterGroupsNoCoAlertNoCO,
  getIamOkGroups,
  MemberNotMemberGroupsFilters,
  searchGroupsName,
} from '../../StartIamOkMessage/helpers';
import { Group, GroupsState } from './types';

// initail state
const initialState: GroupsState = {
  groups: [],
  documentGroups: [],
  searchedGroups: [],
  nearbyGroups: [],

  isLoading: false,
  error: null,
  joinGroupError: null,
};

// group detail slice
const groupsSlice = createSlice({
  name: 'groupDetail',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    setDocumentGroups: (state, action: PayloadAction<Group[]>) => {
      state.documentGroups = action.payload;
    },
    setGIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    searchGroups: (state, action: PayloadAction<Group[]>) => {
      state.searchedGroups = action.payload;
    },
    resetDocumentGroups: state => {
      state.documentGroups = [];
    },
  },
});

// export store actions
export const {
  setGIsLoading,
  setIsError,
  setGroups,
  searchGroups,
  setDocumentGroups,
  resetDocumentGroups,
} = groupsSlice.actions;

// data selecting could be seperated also
export const selectGroups = (state: RootState) => state.groups.groups;
export const selectNearbyGroups = (state: RootState) =>
  state.groups.nearbyGroups;
export const selectSearchedGroups = (state: RootState) =>
  state.groups.searchedGroups;
export const selectGroupsError = (state: RootState) => state.groups.error;
export const selectGroupsIsLoading = (state: RootState) =>
  state.groups.isLoading;
export const selectUserGroupAdmin = (state: RootState) => state.groups.groups;
export const selectGroupsIDList = (state: RootState) =>
  state.groups.groups.map(group => group.id);
export const getGroupByID = (groupID: number, state: RootState) => {
  return state.groups.groups.find(group => {
    return group.id === groupID;
  });
};
export const selectIamOkGroupsWithFilter =
  (filters: MemberNotMemberGroupsFilters[], searchTerm: string = '') =>
  (state: RootState) =>
    searchGroupsName(
      searchTerm,
      filterGroupsMemberNotMember(filters, getIamOkGroups(state.groups.groups))
    );

export const selectGroupsNoCANoCOWithFilter =
  (filters: MemberNotMemberGroupsFilters[], searchTerm: string = '') =>
  (state: RootState) =>
    searchGroupsName(
      searchTerm,
      filterGroupsMemberNotMember(
        filters,
        filterGroupsNoCoAlertNoCO(state.groups.groups)
      )
    );

export const selectGroupById = (groupID: number) => (state: RootState) =>
  state.groups.groups.find(group => group.id === groupID);

export const selectGroupsByIds = (ids: number[]) => (state: RootState) =>
  state.groups.groups.filter(group => ids.includes(group.id));
// export const selectGroupUsersById = (groupID: number) => (state: RootState) =>
//   state.groups.groups.find(group => group.id === groupID

// export the reducers

export default groupsSlice.reducer;
