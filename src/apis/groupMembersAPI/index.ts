import { GroupMember } from '../../containers/GroupDetail/groupDetailSlice/types';
import { getAntiForgeryToken } from '../authAPI';
import { ApiCore } from '../utils/core';
import { EditGroupMemberSettingParams, EditMyGroupProfileParam } from './types';

const url = 'GroupMembers';

const ApiGroups = new ApiCore({
  getAll: false,
  getSingle: false,
  post: true,
  put: false,
  patch: false,
  remove: false,
  singleExtra: true,
  url: url,
});

export const editMyGroupProfile = async (
  editMyGroupProfileParam: EditMyGroupProfileParam
) => {
  const { groupID, editedData } = editMyGroupProfileParam;
  const csrfToken = await getAntiForgeryToken();

  return ApiGroups.performExtra<GroupMember>({
    method: 'POST',
    extraResource: `${groupID}`,
    model: editedData,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
// As admin
export const editMemberInfo = async (
  editGroupMemberSettingParams: EditGroupMemberSettingParams
) => {
  const { userID, editedData, groupID } = editGroupMemberSettingParams;
  const csrfToken = await getAntiForgeryToken();

  return ApiGroups.performExtra<GroupMember>({
    method: 'POST',
    extraResource: `${userID}`,
    id: groupID,
    model: editedData,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
