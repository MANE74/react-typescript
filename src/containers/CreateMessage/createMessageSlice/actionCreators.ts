import { batch } from 'react-redux';
import { AppThunk } from '../../../store';

import { getAllUsers, GetUserQuery } from '../../../apis/userAPI/index';
import {
  deleteGroup,
  deleteUser,
  setGroupMembers,
  setIsError,
  setIsLoading,
  setSelectedGroups,
  setSelectedGroupType,
  setSelectedUsers,
  setUsers,
} from '.';
import { getSingleGroupsMembers } from '../../../apis/createMessageAPI';
import _ from 'lodash';
import { CreateMessageModel } from '../../Chat/Chat';
import { setIsInternalLoading } from '../../Support/supportSlice';
import { createMessage } from '../../../apis/chatAPI';
import { NavigateFunction } from 'react-router-dom';
import { SelectListUser } from './types';
import { GroupMember } from '../../GroupDetail/groupDetailSlice/types';
import { fetchChats } from '../../ChatsList/chatListSlice/actionCreators';
import { GroupType } from '../../../utils/enums';

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
        dispatch(setIsError(`${error}`));
      });
    }
  };

const getUserIndex = (userId: number, list: any[]) => {
  const foundIndex = _.findIndex(list, user => user.id === userId);
  return foundIndex;
};

const isUserAdded = (userId: number, list: any[]) => {
  const foundIndex = getUserIndex(userId, list);
  return foundIndex > -1;
};

export const fetchGroupMembers =
  (selectedGroups: any[]): AppThunk =>
  async dispatch => {
    try {
      dispatch(setIsLoading(true));
      const usersList: GroupMember[] = [];
      for await (const group of selectedGroups) {
        const usersInGroup = await getSingleGroupsMembers(group.id);
        _.forEach(usersInGroup, user => {
          if (!isUserAdded(user.userID, usersList)) {
            usersList.push({
              ...user,
              isSelected: true,
            });
          } else {
            const userIndex = getUserIndex(user.userID, usersList);
            const isAdmin = usersList[userIndex].admin;
            if (!isAdmin && user.admin) {
              usersList[userIndex] = {
                ...user,
                isSelected: true,
                admin: true,
              };
            }
          }
        });
      }

      batch(() => {
        dispatch(setGroupMembers(usersList));
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

export const setSelectedGroupsAction =
  (groups: any[]): AppThunk =>
  async dispatch => {
    try {
      dispatch(setIsLoading(true));
      batch(() => {
        dispatch(setSelectedGroups(groups));
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const setSelectedUsersAction =
  (users: SelectListUser[]): AppThunk =>
  async dispatch => {
    try {
      dispatch(setIsLoading(true));
      batch(() => {
        dispatch(
          setSelectedUsers(
            users.map(user => {
              return {
                ...user,
                isSelected: true,
              };
            })
          )
        );
        dispatch(setIsLoading(false));
      });
    } catch (error) {
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const deleteGroupAction =
  (id: number, groupType: GroupType): AppThunk =>
  async dispatch => {
    try {
      // if (groupType === GroupType.Hidden) {
      // [TODO] need to only remove the group and the user belong to it
      dispatch(setSelectedGroups([]));
      dispatch(setSelectedUsers([]));
      dispatch(setSelectedGroupType([]));
      // return;
      // }
      // dispatch(deleteGroup(id));
    } catch (error) {
      dispatch(setIsError(`${error}`));
    }
  };

export const deleteUserAction =
  (id: number): AppThunk =>
  async dispatch => {
    try {
      dispatch(deleteUser(id));
    } catch (error) {
      dispatch(setIsError(`${error}`));
    }
  };

export const changeAllMembers = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setIsLoading(true));

    let selectedUsers = getState().createMessage.selectedUsers;
    selectedUsers = selectedUsers.map(user => {
      return { ...user, isSelected: !user.isSelected };
    });
    batch(() => {
      dispatch(setSelectedUsers(selectedUsers));
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

export const changeIsCheckedMember =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true));

      let selectedUsers = getState().createMessage.selectedUsers;
      selectedUsers = selectedUsers.map(user => {
        return user.id === id
          ? { ...user, isSelected: !user.isSelected }
          : user;
      });
      batch(() => {
        dispatch(setSelectedUsers(selectedUsers));
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

export const sendAMessage =
  (
    messageModel: CreateMessageModel,
    navigate: NavigateFunction,
    logNotes?: boolean,
    fromHoldingStatement?: boolean
  ): AppThunk =>
  async dispatch => {
    try {
       dispatch(setIsLoading(true));
      let res = await createMessage(messageModel);
      if (res) {
        batch(() => {
          dispatch(fetchChats({ search: '' }));
          dispatch(setIsLoading(true));
        });
        if (logNotes) {
          navigate(`/log-note/${res.id}`);
        } else if (fromHoldingStatement) {
          navigate(`/message/${res.id}/fromHoldingStatement`);
        } else {
          navigate(`/message/${res.id}`);
        }
      }
    } catch (error) {
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setIsInternalLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };
