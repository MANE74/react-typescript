import { Group } from '../containers/GroupsList/groupsSlice/types';
import { ApiCore } from './utils/core';

const url = 'Groups';

const chatAPI = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  put: false,
  patch: true,
  remove: false,
  singleExtra: true,
  url,
});

export const getGroups = () => {
  return chatAPI.getAll<Group>();
};

export const getSingleGroupsMembers = (id: number) => {
  return chatAPI.performExtra<any>({
    method: 'GET',
    extraResource: `${id}/members`,
  });
};
