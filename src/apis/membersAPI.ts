import { ApiCore } from './utils/core';

const url = 'GroupMembers​';

const ApiMembers = new ApiCore({
  getAll: false,
  getSingle: false,
  post: false,
  put: false,
  patch: false,
  remove: false,
  singleExtra: true,
  url: url,
});

// export const editMyMemberSettingsProfile = (groupId: number, model: object) => {
//   ApiMembers.performExtra("POST", `${groupId}`, undefined, model);
// };
// export const editMembersettings = (
//   groupId: number,
//   userID: number,
//   model: object
// ) => {
//   ApiMembers.performExtra("POST", `${userID}`, groupId, model);
// };
