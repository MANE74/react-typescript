import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { ChecklistStatus } from '../../../utils/enums';
import { SelectListUser } from '../../CreateMessage/createMessageSlice/types';
import { checkHasMultipleAccounts, getAccounts, searchGroups } from '../../Documents/helpers';
import { Group } from '../../GroupsList/groupsSlice/types';
import { ChecklistFilters } from '../ChecklistFilter';
import { SelectedGroup } from '../ChecklistSelectGroupsList';
import { Checklist, ChecklistItem, checklistsState, ChecklistTask } from './types';
import { filterGroupChecklists } from './helpers';

const initialState: checklistsState = {
  selectedUsers: [],
  selectedGroups: [],
  users: [],
  groups: [],
  usersLoading: false,
  groupsLoading: false,
  checklistName: '',
  checklists: [],
  isChecklistsLoading: false,
  activeChecklist: null,
  preSelectedGroups: [],
  checklistItems: [],
  selectedGroupType: [],
  activeTab: ChecklistStatus.Started,
  tempChecklistTasks: null
};

export const checklistsSlice = createSlice({
  name: 'checklists',
  initialState,
  reducers: {
    setSelectedUsers: (state, action: PayloadAction<any[]>) => {
      state.selectedUsers = action.payload;
    },
    setSelectedGroups: (state, action: PayloadAction<any[]>) => {
      state.selectedGroups = action.payload;
    },
    setPreSelectedGroups: (state, action: PayloadAction<SelectedGroup[]>) => {
      state.preSelectedGroups = action.payload;
    },
    setUsers: (state, action: PayloadAction<SelectListUser[]>) => {
      state.users = action.payload;
    },
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    setIsGroupsLoading: (state, action: PayloadAction<boolean>) => {
      state.groupsLoading = action.payload;
    },
    setIsUsersLoading: (state, action: PayloadAction<boolean>) => {
      state.usersLoading = action.payload;
    },
    setChecklistName: (state, action: PayloadAction<string>) => {
      state.checklistName = action.payload;
    },
    setChecklists: (state, action: PayloadAction<Checklist[]>) => {
      state.checklists = action.payload;
    },
    setActiveChecklist: (state, action: PayloadAction<Checklist>) => {
      state.activeChecklist = action.payload;
    },
    setChecklistItems: (state, action: PayloadAction<ChecklistItem[]>) => {
      state.checklistItems = action.payload;
    },
    setTempChecklistTasks: (state, action: PayloadAction<ChecklistTask[] | null>) => {
      state.tempChecklistTasks = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isChecklistsLoading = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<ChecklistStatus>) => {
      state.activeTab = action.payload;
    },
    reset: (state) => {
      state.selectedUsers = [];
      state.selectedGroups = [];
      state.checklistName = '';
      state.activeChecklist = null;
      state.tempChecklistTasks = null
    },
  },
});

// export store actions
export const {
  setSelectedUsers,
  setSelectedGroups,
  setPreSelectedGroups,
  setUsers,
  setGroups,
  setIsGroupsLoading,
  setIsUsersLoading,
  setChecklistName,
  setChecklists,
  setActiveChecklist,
  setIsLoading,
  setChecklistItems,
  setTempChecklistTasks,
  setActiveTab,
  reset,
} = checklistsSlice.actions;

export const getSelectedUsers = (state: RootState) =>
  state.checklists.selectedUsers;

export const getSelectedGroups = (state: RootState) =>
  state.checklists.selectedGroups;
export const isGroupsLoading = (state: RootState) =>
  state.checklists.groupsLoading;

export const selectUsers = (state: RootState) => state.checklists.users;
export const selectGroups = (state: RootState) => state.checklists.groups;
export const getChecklistName = (state: RootState) =>
  state.checklists.checklistName;
export const isUsersLoading = (state: RootState) =>
  state.checklists.usersLoading;
export const getPreSelectedGroups = (state: RootState) =>
  state.checklists.preSelectedGroups;
export const isChecklistsLoading = (state: RootState) =>
  state.checklists.isChecklistsLoading;
export const getChecklists = (state: RootState) => state.checklists.checklists;
export const getActiveChecklist = (state: RootState) =>
  state.checklists.activeChecklist;
export const getChecklistItems = (state: RootState) =>
  state.checklists.checklistItems;
export const getActiveTab = (state: RootState) =>
  state.checklists.activeTab;
export const getTempChecklistTasks = (state: RootState) =>
  state.checklists.tempChecklistTasks;
export const selectGroupsAccountsWithFilter =
  (filters: ChecklistFilters) => (state: RootState) =>
    getAccounts(
      filterGroupChecklists(state, {memberFilter:filters.memberFilter})
    );
export const selectHasMultipleAccounts = (state: RootState) =>
  checkHasMultipleAccounts(state.checklists.groups);
export const selectChecklistGroupsWithSearchFilter =
  (searchTerm: string = '', filters: ChecklistFilters) =>
  (state: RootState) =>
    searchGroups(searchTerm, filterGroupChecklists(state, filters));
export default checklistsSlice.reducer;
