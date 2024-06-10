import { compact } from 'lodash';
import { batch } from 'react-redux';
import {
  setFiles,
  setFolders,
  setGroupDocuments,
  setIsError,
  setIsLoading,
} from '.';
import {
  getDocuments,
  getFolders,
  toggleOffline,
  _deleteFileFromFolder,
  _deleteFileFromGroup,
  _deleteFolder,
  _renameFolder,
} from '../../../apis/documentsAPI';
import {
  RenameFolderProps,
  ToggleOfflineModel,
} from '../../../apis/documentsAPI/types';

import { AppThunk } from '../../../store';
import { ConfirmationOptions } from '../../../utils/ConfirmationServiceContext/confirmationContext';
import { getItem } from '../../../utils/storage';
import { translate } from '../../../utils/translate';
import {
  fetcDocumentGroups,
  fetchGroups,
} from '../../GroupsList/groupsSlice/actionCreators';
import { setUser } from '../../Login/LoginSlice';
import { filterGroupsNoCoAlertNoCO } from '../../StartIamOkMessage/helpers';
// for now until i make a generic recursive dispatcher
let recursionFetchFoldersLimit = 1;
let recurToggleOfflineFetchFolderLimit = 1;
export const fetchFolders = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setIsLoading(true));
    const groups = getState().groups.documentGroups;
    const user = getState().user.user;

    if (!user) {
      await dispatch(setUser(getItem('user')));
      dispatch(fetchFolders());
      return;
    }
    if (groups.length === 0 && recursionFetchFoldersLimit) {
      await dispatch(fetcDocumentGroups());
      recursionFetchFoldersLimit--;
      dispatch(fetchFolders());
      return;
    }
    const [folders, documents] = await Promise.all([
      getFolders(),
      getDocuments(),
    ]);

    const isSeeOrgGroups = user.roles?.includes('SeeOrgGroups');

    const documentGroups = isSeeOrgGroups
      ? filterGroupsNoCoAlertNoCO(groups)
      : filterGroupsNoCoAlertNoCO(groups)
          .slice()
          .filter(group => group.member);

    batch(() => {
      dispatch(setFolders(folders));
      dispatch(setGroupDocuments(documentGroups));
      dispatch(setFiles(documents));

      dispatch(setIsLoading(false));
    });
  } catch (error) {
    console.log('error log ', error);
    batch(() => {
      dispatch(setIsLoading(false));
      dispatch(setIsError(`${error}`));
    });
  }
};

export const deleteFolder =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      const res = await _deleteFolder(id);
      dispatch(fetchFolders());
      batch(() => {
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const deleteFile =
  (props: {
    id: number;
    groupIds?: number[];
    folderIds?: number[];
  }): AppThunk =>
  async (dispatch, getState) => {
    const { id, groupIds, folderIds } = props;
    try {
      dispatch(setIsLoading(true));
      if (groupIds) {
        const requests = groupIds.map(groupId =>
          _deleteFileFromGroup({ id, groupId })
        );
        await Promise.all(requests);
      }
      if (folderIds) {
        const requests = folderIds.map(folderId =>
          _deleteFileFromFolder({ id, folderId })
        );
        await Promise.all(requests);
      }
      batch(() => {
        dispatch(fetchFolders());
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };
export const toggleGroupOffline =
  (props: {
    id: number;
    offline: boolean;
    confirm: (options: ConfirmationOptions) => Promise<void>;
  }): AppThunk =>
  async (dispatch, getState) => {
    const { id, offline, confirm } = props;
    try {
      dispatch(setIsLoading(true));
      const groups = getState().groups.documentGroups;
      const files = getState().documents.files;
      const folders = getState().documents.folders;

      if (groups.length === 0 && recurToggleOfflineFetchFolderLimit) {
        await dispatch(fetcDocumentGroups());
        recurToggleOfflineFetchFolderLimit--;
        dispatch(toggleGroupOffline({ id, offline, confirm }));
        return;
      }
      const groupsFilesToOffline: ToggleOfflineModel[] = files
        ?.filter(file => file.groups.map(g => g.id).includes(id))
        .map(file => ({ offline, documentID: file.id, groupID: id }));

      const groupsFoldersToOffline: ToggleOfflineModel[] = folders
        ?.filter(folder => folder.GroupID === id)
        .map(folder => ({ offline, folderID: folder.ID }));

      const res = await toggleOffline([
        ...groupsFilesToOffline,
        ...groupsFoldersToOffline,
      ]);
      dispatch(fetchFolders());
      batch(() => {
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      confirm({
        title: 'warning',
        description: translate('general_network_error'),
        onSubmit: () => {},
        confirmText: 'done',
      });
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };
export const toggleFileOrFolderOffline =
  (props: {
    toggleOfflineModel: ToggleOfflineModel;
    confirm: (options: ConfirmationOptions) => Promise<void>;
  }): AppThunk =>
  async (dispatch, getState) => {
    const { confirm, toggleOfflineModel } = props;
    try {
      dispatch(setIsLoading(true));

      const res = await toggleOffline([toggleOfflineModel]);
      dispatch(fetchFolders());
      batch(() => {
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      confirm({
        title: 'warning',
        description: translate('general_network_error'),
        onSubmit: () => {},
        confirmText: 'done',
      });
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };
export const renameFolder =
  (props: {
    params: RenameFolderProps;
    confirm: (options: ConfirmationOptions) => Promise<void>;
  }): AppThunk =>
  async (dispatch, getState) => {
    const { confirm, params } = props;
    try {
      dispatch(setIsLoading(true));

      const res = await _renameFolder(params);
      dispatch(fetchFolders());
      batch(() => {
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      confirm({
        title: 'warning',
        description: translate('general_network_error'),
        onSubmit: () => {},
        confirmText: 'done',
      });
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

// ===== ===== ===== ===== ===== ===== ===== ===== =====
