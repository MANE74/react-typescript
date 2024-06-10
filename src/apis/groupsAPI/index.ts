import {
  GroupDetail,
  GroupMember,
} from '../../containers/GroupDetail/groupDetailSlice/types';
import { Group } from '../../containers/GroupsList/groupsSlice/types';
import { objectToQueryParams } from '../../utils/format';
import { getAntiForgeryToken } from '../authAPI';
import { ApiCore } from '../utils/core';
import {
  editGroupMemberIsAdminParams,
  EditGroupSettingsParam,
  getGroupMembersParams,
  GetGroupsQuery,
} from './types';

const url = 'Groups';

const ApiGroups = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  put: false,
  patch: true,
  remove: false,
  singleExtra: true,
  url: url,
});

/// Groups Section :start ------------------------------------------------------------------

export const checkGroupName = (name: string) => {
  return ApiGroups.performExtra<{ groupExists: boolean }>({
    method: 'GET',
    extraResource: `CheckName/?name=${name}`,
  });
};

export const getGroups = (query?: GetGroupsQuery) => {
  return ApiGroups.performExtra<Group[]>({
    method: 'get',
    extraResource: `?${objectToQueryParams(query)}`,
  });
};
/// Group CRUD operation --------------------------------------------------------------------
// export const createGroup = (group: object) => {
//   // group Type Should be added or request param type
//   return ApiGroups.post(group);
// };

export const getGroupById = (id: number) => {
  return ApiGroups.getSingle<GroupDetail>(id);
};
// As Admin
export const editGroupSettings = async (params: EditGroupSettingsParam) => {
  const csrfToken = await getAntiForgeryToken();

  const { editidData, groupID } = params;
  return ApiGroups.performExtra<Group>({
    method: 'POST',
    model: editidData,
    extraResource: 'editgroup',
    id: groupID,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

///------------------------------------------------------------------------------------------
/// Groups Section :End ---------------------------------------------------------------------

/// members Section :start ------------------------------------------------------------------

export const getGroupMembers = (params: getGroupMembersParams) => {
  const { id, query } = params;
  return ApiGroups.performExtra<GroupMember[]>({
    extraResource: `members?${objectToQueryParams(query)}`,
    method: 'GET',
    id: id,
  });
};

// As Admin
export const editGroupMemberIsAdmin = async (
  params: editGroupMemberIsAdminParams
) => {
  const { groupId, isAdmin, userID } = params;
  const csrfToken = await getAntiForgeryToken();

  return ApiGroups.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `members/${userID}`,
    id: groupId,
    model: isAdmin,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

// As Admin
export const deleteMember = async (groupId: number, userID: number) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiGroups.performExtra<{ ok?: boolean }>({
    method: 'DELETE',
    extraResource: `members/${userID}`,
    id: groupId,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
///members Section :End  ----------------------------------------------------------------------
