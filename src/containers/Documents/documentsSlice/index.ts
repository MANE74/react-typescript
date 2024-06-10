import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BrowseSortType } from '../../../components/BrowseFolderSort/BrowseFolderSort';
import { DocumentFilters } from '../../../components/DocumentFilter/DocumentFilter';
import { RootState } from '../../../store';
import { Group } from '../../GroupsList/groupsSlice/types';
import {
  checkHasMultipleAccounts,
  filterGroupDocuments,
  getAccounts,
  searchFilesOrFolders,
  searchGroups,
  sortData,
} from '../helpers';
import { FileItem, DocumentsState, FolderItem } from './types';

// initail state
const initialState: DocumentsState = {
  files: [],
  folders: [],
  groupDocuments: [],
  isLoading: false,
  error: null,
};
// group detail slice
export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<FileItem[]>) => {
      state.files = action.payload;
    },
    setFolders: (state, action: PayloadAction<FolderItem[]>) => {
      state.folders = action.payload;
    },
    setGroupDocuments: (state, action: PayloadAction<Group[]>) => {
      state.groupDocuments = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetDocumentSlice: state => {
      state.error = null;
      state.files = [];
      state.folders = [];
      state.groupDocuments = [];
    },
  },
});

// export store actions
export const {
  setFiles,
  setFolders,
  setGroupDocuments,
  setIsLoading,
  setIsError,
  resetDocumentSlice,
} = documentsSlice.actions;

// files selectors  ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ====
export const selectFiles = (state: RootState) => state.documents.files;

export const selectFilesByGroupId = (id: number) => (state: RootState) =>
  state.documents.files.filter(file => file.groups.map(g => g.id).includes(id));

export const selectFilesByGroupIdWithSort =
  (id: number, sorting: BrowseSortType, searchTerm: string = '') =>
  (state: RootState) => {
    const data = state.documents.files.filter(file =>
      file.groups.map(g => g.id).includes(id)
    );
    return searchFilesOrFolders(
      searchTerm,
      sortData(data, sorting, {
        date: 'upload_time',
        Alphabetically: 'name',
      })
    );
  };

export const selectFilesByFolderId = (id: number) => (state: RootState) =>
  state.documents.files.filter(file => file.folderids.includes(id));
export const selectFilesByFolderIdWithSort =
  (id: number, sorting: BrowseSortType, searchTerm: string = '') =>
  (state: RootState) => {
    const data = state.documents.files.filter(file =>
      file.folderids.includes(id)
    );
    return searchFilesOrFolders(
      searchTerm,
      sortData(data, sorting, {
        date: 'upload_time',
        Alphabetically: 'name',
      })
    );
  };
// ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ====

// folders selectors  ==== ==== ==== ==== ==== ==== ==== ==== ==== ====
export const selectFolders = (state: RootState) => state.documents.folders;

export const selectFoldersByGroupId = (id: number) => (state: RootState) =>
  state.documents.folders.filter(folder => folder.GroupID === id);

export const selectFoldersByGroupIdWithSortAndSearch =
  (id: number, sorting: BrowseSortType, searchTerm: string = '') =>
  (state: RootState) => {
    const data = state.documents.folders.filter(
      folder => folder.GroupID === id
    );

    return searchFilesOrFolders(
      searchTerm,
      sortData(data, sorting, {
        date: 'creationTime',
        Alphabetically: 'Name',
      })
    );
  };

export const selectFolderById = (id?: number) => (state: RootState) =>
  state.documents.folders.find(folder => folder.ID === id);

// ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ====

// group documents ==== ==== ==== ==== ==== ==== ==== ==== ==== ====

export const selectDocumentGroups = (state: RootState) =>
  state.documents.groupDocuments;

export const selectDocumentGroupById = (id: number) => (state: RootState) =>
  state.documents.groupDocuments.find(g => g.id === id);

export const selectDocumentGroupsWithSearchFilter =
  (searchTerm: string = '', filters: DocumentFilters) =>
  (state: RootState) =>
    searchGroups(searchTerm, filterGroupDocuments(state, filters));

// ==== ==== ==== ====
// group documents extras ==== ==== ==== ====

export const selectGroupsAccountsWithFilter =
  (filters: DocumentFilters) => (state: RootState) =>
    getAccounts(
      filterGroupDocuments(state, {
        showEmptyFolders: filters.showEmptyFolders,
        memberFilter: filters.memberFilter,
      })
    );
export const selectHasMultipleAccounts = (state: RootState) =>
  checkHasMultipleAccounts(state.documents.groupDocuments);
//==== ==== ==== ======== ==== ==== ======== ==== ==== ======== ==== ==== ====

// could be sefely deleted and replaced selectFiles and selectFolders with after updating create folder ==== ==== ====
export const selectDocuments = (state: RootState) => state.documents.folders;
export const selectListDocuments = (state: RootState) =>
  state.documents.folders;
// ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ====
export const selectDocumentsIsListLoading = (state: RootState) =>
  state.documents.isLoading;
export const selectDocumentsError = (state: RootState) => state.documents.error;

// export the reducer
export default documentsSlice.reducer;
