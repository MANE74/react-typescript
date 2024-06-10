import { batch } from 'react-redux';
import { setGroups, setIsError, setGIsLoading, setDocumentGroups } from '.';
import { getGroups } from '../../../apis/groupsAPI';
import { GetGroupsQuery } from '../../../apis/groupsAPI/types';
import { AppThunk } from '../../../store';

export const fetchGroups =
  (query?: GetGroupsQuery, showLoading = true, onSuccess? :()=>void): AppThunk =>
  async (dispatch, getState) => {
    try {
      showLoading && dispatch(setGIsLoading(true));
      const groups = await getGroups(query);
      batch(() => {
        dispatch(setGroups(groups));
        showLoading && dispatch(setGIsLoading(false));
      });
      onSuccess && onSuccess()
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        showLoading && dispatch(setGIsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const fetcDocumentGroups =
  (): AppThunk => async (dispatch, getState) => {
    try {
      dispatch(setGIsLoading(true));
      const groups = await getGroups({ menuitem: 'documents' });
      batch(() => {
        dispatch(setDocumentGroups(groups));
        dispatch(setGIsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setGIsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };
