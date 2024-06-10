import { batch } from 'react-redux';
import {
  setUsers,
  setIsLoading,
  setError,
  setSelectedUsers,
  removeUser,
  setOrgs,
  removeOrg,
  setSelectedOrgs,
  setBroadcastMsg,
} from '.';
import { AppThunk } from '../../../store';
import { getAllUsers, GetUserQuery } from '../../../apis/userAPI';
import {
  deleteBroadastMessage,
  getBroadcastMessage,
  getOrganizations,
  postBroadcastMessage,
} from '../../../apis/broadcast';
import { Chat } from '../../ChatsList/chatListSlice/types';
import { CreateMessageModel } from '../../Chat/Chat';
import { NavigateFunction } from 'react-router-dom';
import { BroadcastMsg } from './types';

export const fetchUsers =
  (query?: GetUserQuery): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      const users = await getAllUsers(query);
      batch(() => {
        dispatch(setUsers(users));
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setError(`${error}`));
      });
    }
  };

export const fetchOrganizations =
  (): AppThunk => async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      const orgs = await getOrganizations();
      batch(() => {
        dispatch(setOrgs(orgs));
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setError(`${error}`));
      });
    }
  };

export const setSelectedOrgsAction =
  (orgs: any[]): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      batch(() => {
        dispatch(setSelectedOrgs(orgs));
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setError(`${error}`));
      });
    }
  };

export const removeSelectedOrgAction =
  (id: number): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      batch(() => {
        dispatch(removeOrg(id));
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setError(`${error}`));
      });
    }
  };

export const fetchBroadcastMesaage =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));
      const msg = await getBroadcastMessage(id);
      batch(() => {
        dispatch(setBroadcastMsg(msg));
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setError(`${error}`));
      });
    }
  };

export const setBroadcastMsgAction =
  (msg: any): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      batch(() => {
        dispatch(setBroadcastMsg(msg));
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setError(`${error}`));
      });
    }
  };

export const deleteBroadcastMessageAction =
  (id: number, messages: BroadcastMsg): AppThunk =>
  async (dispatch) => {
    try {
      setIsLoading(true);
      await deleteBroadastMessage(id);
      // const filterMessages = messages.filter((message) => message.id !== id);
      batch(() => {
        dispatch(setBroadcastMsg(null));
      });
      setIsLoading(false);
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        setIsLoading(false);
        dispatch(setError(`${error}`));
      });
    }
  };

export const setSelectedUsersAction =
  (users: any[]): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      batch(() => {
        dispatch(setSelectedUsers(users));
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setError(`${error}`));
      });
    }
  };

export const removeSelectedUserAction =
  (id: number): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      batch(() => {
        dispatch(removeUser(id));
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setError(`${error}`));
      });
    }
  };

  export const sendBroadcastMsg = (
    messageModel: CreateMessageModel,
    navigate: NavigateFunction,
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      const msg = await postBroadcastMessage(messageModel);
      if (msg) {
        batch(() => {
          dispatch(setBroadcastMsgAction(msg));
        });
        dispatch(setIsLoading(false));
        navigate(`/broadcast/message/${msg.id}`);
      }
    } catch (error) {
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setError(`${error}`));
      });
    }
  };
