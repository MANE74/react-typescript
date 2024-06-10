import _ from 'lodash';
import { GroupType } from '../../utils/enums';
import { translate } from '../../utils/translate';
import { GroupMember } from '../GroupDetail/groupDetailSlice/types';
import { Group } from '../GroupsList/groupsSlice/types';
import { SelectListUser } from './createMessageSlice/types';

export const isSameUser = (a: SelectListUser, b: GroupMember) =>
  a.id === b.userID;

export const onlyInSelectListUser = (
  selectedList: SelectListUser[],
  groupMembers: GroupMember[],
  compareFunction: (a: SelectListUser, b: GroupMember) => boolean
) =>
  selectedList.filter(
    leftValue =>
      !groupMembers.some(rightValue => compareFunction(leftValue, rightValue))
  );

export const intersicetedWithGroupMembers = (
  selectedList: SelectListUser[],
  groupMembers: GroupMember[],
  compareFunction: (a: SelectListUser, b: GroupMember) => boolean
) =>
  selectedList.filter(leftValue =>
    groupMembers.some(rightValue => compareFunction(leftValue, rightValue))
  );

export const isHiddenCrossOrgOrCoAlert = (group: Group): boolean => {
  return [GroupType.CoAlert, GroupType.Hidden, GroupType.CrossOrg].includes(
    group.groupType
  );
};

export const isAddGroupHidden = (selectedGroups: Group[]): boolean => {
  const slectedGrouopsType = selectedGroups.map(g => g.groupType);
  return [GroupType.CoAlert, GroupType.Hidden, GroupType.CrossOrg].some(v =>
    slectedGrouopsType.includes(v)
  );
};

export const checkGroupsType = (groupType: number) => {
  if (groupType === GroupType.Hidden) {
    return translate('messages_hidden');
  }
  if (groupType === GroupType.CrossOrg) {
    return translate('groups_cossOrg');
  }
  if (groupType === GroupType.CoAlert) {
    return translate('CoAlert');
  } else {
    return null;
  }
};

export const isGroupActive = (selectedGroups: any[], groupId: number) => {
  const foundIndex = _.findIndex(selectedGroups, function (group) {
    return group.id === groupId;
  });
  return foundIndex > -1;
};