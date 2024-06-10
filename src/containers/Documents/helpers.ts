import { compact, orderBy } from 'lodash';
import { BrowseSortType } from '../../components/BrowseFolderSort/BrowseFolderSort';
import { DocumentFilters } from '../../components/DocumentFilter/DocumentFilter';
import { RootState } from '../../store';
import { Group } from '../GroupsList/groupsSlice/types';
import { FileItem, FolderItem } from './documentsSlice/types';

export const searchGroups = (searchTerm: string, groups: Group[]): Group[] => {
  return searchTerm
    ? groups.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : groups;
};

export const checkHasMultipleAccounts = (groups: Group[]): boolean => {
  const groupOrganizationIDs = groups.map(g => g.organizationID);
  const groupSubOrganizationIDs = groups.map(g => g.subOrganizationID);

  const toFindAccounts = Array.from(new Set(groupOrganizationIDs));
  const toFindSubAccounts = Array.from(
    new Set(compact(groupSubOrganizationIDs))
  );
  return toFindAccounts.length > 1 || toFindSubAccounts.length > 1;
};

export interface GroupAccount {
  id: number;
  name: string;
  type: 'ACCOUNT' | 'SUB_ACCOUNT';
}

export const getAccounts = (groups: Group[]): GroupAccount[] => {
  let groupAccount: GroupAccount | undefined;
  const accounts = groups.map(group => {
    groupAccount = group.subOrganizationID
      ? {
          id: group.subOrganizationID!,
          name: group.subOrganizationname!,
          type: 'SUB_ACCOUNT',
        }
      : group.organizationID
      ? {
          id: group.organizationID!,
          name: group.organizationName!,
          type: 'ACCOUNT',
        }
      : undefined;
    return groupAccount;
  });
  const uniqueIds: number[] = [];

  return compact(accounts).filter(element => {
    const isDuplicate = uniqueIds.includes(element.id);

    if (!isDuplicate) {
      uniqueIds.push(element.id);
      return true;
    }
    return false;
  });
};

export const filterGroupDocuments = (
  state: RootState,
  filters: DocumentFilters
): Group[] => {
  const {
    files: documents,
    folders,
    groupDocuments: allGroups,
  } = state.documents;

  let clonedGroups: Group[] = [...allGroups];
  //let groupsForAccounts: Group[] = [...allGroups];

  if (!filters.showEmptyFolders) {
    const GroupIDsFromFolders = folders.map(folder => folder.GroupID);
    const GroupIDsFromDocuments = documents
      .map(file => file.groups.map(group => group.GroupID))
      .flat();
    const documentGroupIDs = [...GroupIDsFromFolders, ...GroupIDsFromDocuments];
    clonedGroups = compact(
      documentGroupIDs
        .filter((item, index) => documentGroupIDs.indexOf(item) === index)
        .map(id => clonedGroups.find(group => group.id === id)!)
    );
  }

  if (filters.memberFilter !== undefined && filters.memberFilter.length !== 0) {
    if (
      filters.memberFilter.includes('NOT_MEMBER') &&
      filters.memberFilter.includes('MEMBER')
    ) {
    } else if (filters.memberFilter.includes('NOT_MEMBER')) {
      clonedGroups = clonedGroups.filter(g => !g.member);
      //groupsForAccounts = clonedGroups;
    } else if (filters.memberFilter.includes('MEMBER')) {
      clonedGroups = clonedGroups.filter(g => g.member);
      //groupsForAccounts = clonedGroups;
    }
  }

  if (
    filters.selectedData !== undefined &&
    filters.selectedData !== 'SELECTED_ALL' &&
    filters.selectedData !== 'UNSELECTED_ALL'
  ) {
    const filterIds = Array.from(filters.selectedData);
    clonedGroups = clonedGroups.filter(group => {
      const id = group.subOrganizationID || group.organizationID!;
      return filterIds.includes(id);
    });
    //groupsForAccounts = clonedGroups;
  }

  return clonedGroups;
};

export const checkGroupOffline = (
  groupId: number,
  folders: FolderItem[],
  files?: FileItem[]
): boolean => {
  let online: 'Online'[] = [];

  const groupsFiles = files?.filter(file =>
    file.groups.map(g => g.id).includes(groupId)
  );
  const groupsFolders = folders?.filter(folder => folder.GroupID === groupId);

  if (groupsFiles?.length === 0 && groupsFolders.length === 0) return false;

  groupsFiles?.forEach(file => {
    // check if the file is online use only not offline
    const fileGroup = file.groups.find(group => group.id === groupId);
    if (!fileGroup?.offline) {
      online.push('Online');
    }
  });

  groupsFolders?.forEach(folder => {
    if (!folder.Offline) {
      online.push('Online');
    }
  });

  return online.length === 0;
};

export const isGroupEmpty = (
  groupId: number,
  folders: FolderItem[],
  files?: FileItem[]
): boolean => {
  const groupsFiles = files?.filter(file =>
    file.groups.map(g => g.id).includes(groupId)
  );
  const groupsFolders = folders?.filter(folder => folder.GroupID === groupId);

  return groupsFiles?.length === 0 && groupsFolders.length === 0;
};

export const isDocumentOffline = (
  file: FileItem,
  groupId?: number,
  folderId?: number
): boolean => {
  if (folderId) {
    const fileInThatFolderState = file.folders.find(
      folder => folder.ID === folderId
    );
    return !!fileInThatFolderState?.Offline;
  }
  const fileInThatGroupDocumentState = file.groups.find(
    groupDocument => groupDocument.GroupID === groupId
  );
  return !!fileInThatGroupDocumentState?.offline;
};

export const dateStringToDate = (dateString: string): Date => {
  const date = new Date(dateString);
  return date;
};

export const sortData = <T>(
  data: T[],
  sorting: BrowseSortType,
  extractingKeys: Record<BrowseSortType, keyof T>
): T[] => {
  switch (sorting) {
    case BrowseSortType.date:
      return data.sort((a, b) => {
        const _a = a[extractingKeys.date];
        const _b = b[extractingKeys.date];
        if (typeof _a === 'string' && typeof _b === 'string') {
          return (
            dateStringToDate(_b).getTime() - dateStringToDate(_a).getTime()
          );
        }
        return 1;
      });
    default:
      return orderBy(data, 'asc').sort((a, b) => {
        const _a = a[extractingKeys.Alphabetically];
        const _b = b[extractingKeys.Alphabetically];
        if (typeof _a === 'string' && typeof _b === 'string') {
          return _a - _b;
        }
        return 1;
      });
  }
};

export const searchFilesOrFolders = <
  T extends { name?: string; Name?: string }
>(
  searchTerm: string,
  data: T[]
): T[] => {
  return searchTerm
    ? data.filter(item => {
        if (item.name)
          return item.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (item.Name)
          return item.Name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : data;
};
