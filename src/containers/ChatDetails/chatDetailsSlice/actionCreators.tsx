import _ from 'lodash';
import { batch } from 'react-redux';
import { setIsError, setIsLoading, setMessageGroups } from '.';
import {
  addGroupToMessage,
  addRecipientsToMessage,
} from '../../../apis/chatAPI';
import { getGroupById, getGroupMembers } from '../../../apis/groupsAPI';
import { AppThunk } from '../../../store';
import { fetchCurrentChat } from '../../ChatsList/chatListSlice/actionCreators';
import { GroupDetail } from '../../GroupDetail/groupDetailSlice/types';

export const fetchMessageGroups =
  (groupsIds: number[]): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      let groupsList: GroupDetail[] = [];
      for await (let groupId of groupsIds) {
        const foundGroup = await getGroupById(Number(groupId));
        groupsList.push(foundGroup);
      }
      batch(() => {
        dispatch(setMessageGroups(groupsList));
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

export const addRecipients =
  (
    messageId: number,
    groups: any[],
    usersIds: number[],
    onFinish: () => void
  ): AppThunk =>
  async (dispatch, getState) => {
    try {
      let groupMembersIDsList: number[] = [];
      const user = getState().user.user;
      dispatch(setIsLoading(true));

      for await (let group of groups) {
        const groupMembers = await getGroupMembers({ id: group.id });
        var localMembersIds: number[] = [];
        _.forEach(groupMembers, (member) => {
          if (!_.isEqual(user?.id, member.userID)) {
            localMembersIds.push(member.userID);
            groupMembersIDsList.push(member.userID);
          }
        });

        await addGroupToMessage(messageId, group.id, localMembersIds);
      }
      if (!_.isEmpty(usersIds)) {
        usersIds = usersIds
          .filter((id) => !_.includes(groupMembersIDsList, id))
          .filter((v, i, a) => a.indexOf(v) === i);
        const userIndex = usersIds.findIndex((usrId) => usrId === user?.id);

        if (userIndex > -1) {
          usersIds.splice(userIndex, 1);
        }

        if (!_.isEmpty(usersIds))
          await addRecipientsToMessage(messageId, usersIds);
      }
      batch(() => {
        dispatch(fetchCurrentChat(`${messageId}`));
        dispatch(setIsLoading(false));
      });
      onFinish();
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };
