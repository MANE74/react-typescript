import { batch } from 'react-redux';
import { setGroupDetail, setGroupMembers, setIsError, setGDIsLoading } from '.';
import { getGroupById, getGroupMembers } from '../../../apis/groupsAPI';
import { AppThunk } from '../../../store';
import { fetchGroupDetailParams, fetchGroupMembersParams } from './types';

// GROUP SECTION START ===================================
export const fetchGroupDetail =
  (params: fetchGroupDetailParams): AppThunk =>
  async dispatch => {
    const { id } = params;
    try {
      dispatch(setGDIsLoading({ all: true }));
      const group = await getGroupById(id);
      const members = await getGroupMembers({ id });
      batch(() => {
        dispatch(setGroupDetail(group));
        dispatch(setGroupMembers(members));
        dispatch(setGDIsLoading({ all: false }));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setGDIsLoading({ all: false }));
        dispatch(setIsError(`${error}`));
      });
    }
  };

// GROUP SECTION END ===================================
// MEMBER SECTION START ===================================
export const fetchGroupMembers =
  (params: fetchGroupMembersParams): AppThunk =>
  async (dispatch, getState) => {
    const { id, query } = params;
    try {
      dispatch(setGroupMembers([]));
      dispatch(setGDIsLoading({ member: true }));
      const members = await getGroupMembers({ id, query });
      batch(() => {
        dispatch(setGroupMembers(members));
        dispatch(setGDIsLoading({ member: false }));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setGDIsLoading({ member: false }));
        dispatch(setIsError(`${error}`));
      });
    }
  };

// MEMBER SECTION END ===================================
