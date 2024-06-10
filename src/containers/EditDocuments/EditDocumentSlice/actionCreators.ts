import { batch } from 'react-redux';
import { AppThunk } from '../../../store';
import { fetchFolders } from '../../Documents/documentsSlice/actionCreators';
import { setIsError, setIsLoading } from '.';
import {
  setOffline,
  createGroupFolders,
  addDocumentToGroups,
  addDocumentToFolders,
  removeDocumentFromGroup,
  removeDocumentFromFolder,
  shareDocumentWithMoreGroup,
  shareDocumentWithMoreFolders,
} from '../../../apis/documentsAPI';

export const fetchCreateFolders =
  (group: object): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      await createGroupFolders(group);

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

export const fetchSetOffline =
  (files: Array<any>): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      await setOffline(files);
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

export const fetchAddDocumentGroupsAndFolders =
  (groupID: number, foldersInGroup: any, formData: any): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      const id: any = await addDocumentToGroups(groupID, formData);
      batch(() => {
        foldersInGroup.forEach((folder: any) => {
          shareDocumentWithMoreFolders(id.id, folder.ID);
        });
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

export const fetchAddDocumentToGroups =
  (groupIds: any, formData: any): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      await addDocumentToGroups(groupIds, formData);
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

export const fetchAddDocumentFolders =
  (folderIds: any, formData: any): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      await addDocumentToFolders(folderIds, formData);
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(fetchFolders());
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

// share document start =============================================

export const fetchShareDocumentWithMoreGroup =
  (documentID: number, groupID: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      await shareDocumentWithMoreGroup(documentID, groupID);
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
export const fetchShareDocumentWithMoreFolders =
  (documentID: number, folderID: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      await shareDocumentWithMoreFolders(documentID, folderID);
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
export const fetchRemoveDocumentFromGroup =
  (documentID: number, groupID: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      await removeDocumentFromGroup(documentID, groupID);
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
export const fetchRemoveDocumentFromFolder =
  (documentID: number, folderID: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      await removeDocumentFromFolder(documentID, folderID);
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
