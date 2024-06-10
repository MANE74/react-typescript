import { useEffect, useState } from 'react';
import { compact, flatten } from 'lodash';
import { getGroupMembers, getGroups } from '../../apis/groupsAPI';
import { getImage } from '../../apis/mediaAPI';
import { getUserById } from '../../apis/userAPI';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { GroupMember } from '../GroupDetail/groupDetailSlice/types';
import {
  selectGroupsNoCANoCOWithFilter,
  setGIsLoading,
} from '../GroupsList/groupsSlice';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import { Group } from '../GroupsList/groupsSlice/types';
import {
  filterGroupsMemberNotMember,
  searchGroupsName,
} from '../StartIamOkMessage/helpers';
import { MemberNotMemberGroupsFilters } from '../StartOnCallAlertMessage/helpers';
import { translate } from '../../utils/translate';
import { isHiddenCrossOrgOrCoAlert } from '../CreateMessage/helpers';
import { GroupType } from '../../utils/enums';

export const useMembersWitPic = (props: {
  ids: number[];
  setUserIds?: (set: Set<number>) => void;
}) => {
  const { ids, setUserIds } = props;

  const [isGettingMembers, setIsLoading] = useState<boolean>(false);

  const [members, setMembers] = useState<
    (GroupMember & {
      name: string;
      id: number;
      imageName?: string | undefined;
    })[]
  >([]);

  const init = async () => {
    if (!ids) return;
    setIsLoading(true);
    const members = await Promise.all(
      ids.map(groupId => getGroupMembers({ id: groupId }))
    );

    // const _members  = flatten(members)
    const uniqueIds: number[] = [];

    const _members = compact(flatten(members)).filter(element => {
      const isDuplicate = uniqueIds.includes(element.userID!);

      if (!isDuplicate) {
        element.userID && uniqueIds.push(element.userID);
        return true;
      }
      return false;
    });

    const Trasformed: (GroupMember & {
      name: string;
      id: number;
      imageName?: string | undefined;
    })[] = _members.map((member, index) => {
      getPhotos(+member.userID!, index);
      return {
        ...member,
        name: member.userName!,
        id: +member.userID!,
      };
    });
    const _selected = new Set(_members.map(member => member.userID!));
    setUserIds && setUserIds(_selected);
    setMembers(Trasformed);
    setIsLoading(false);
  };

  const getPhotos = async (userID: number, index: number) => {
    const { photoFileName } = await getUserById(userID);
    setMembers(prev => {
      const cloned = [...prev];
      cloned[index] = { ...cloned[index], imageName: photoFileName };
      return cloned;
    });
  };

  useEffect(() => {
    init();
  }, [ids.length]);

  return {
    members,
    isGettingMembers,
  };
};

export interface MessageSubjectForm {
  subject: string;
}

export const messageSubjectSchema = (input: string): string | null => {
  if (!input) {
    return translate('login_enterEmail');
  } else {
    return null;
  }
};

export const getGroupsNameById = (
  groupIds: number[],
  groups: Group[]
): string => {
  return groups
    .filter(group => groupIds.includes(group.id))
    .map(g => g.name)
    .join(', ');
};

export const isCurrentUserTheOnlyMemberOfGroup = async (
  groupIds: number[],
  currentUserId: number
): Promise<{ is: boolean; singleCurrentUserGroupIds?: number[] }> => {
  const members = await Promise.all(
    groupIds.map(groupId => getGroupMembers({ id: groupId }))
  );

  let singleCurrentUserGroupIds: number[] = [];

  members.forEach((groupMembers, index) => {
    if (groupMembers.length === 1) {
      if (groupMembers[0].userID === currentUserId) {
        singleCurrentUserGroupIds.push(groupIds[index]);
      }
    }
  });

  if (singleCurrentUserGroupIds.length !== 0) {
    return { is: true, singleCurrentUserGroupIds };
  }

  return { is: false };
};

export const groupTypeTx: Record<GroupType, string> = {
  0: '',
  2: 'messages_hidden',
  3: 'groups_cossOrg',
  4: 'CoAlert',
};

export const getGroupsTypeOrMemberCount = (group: Group): string => {
  const type = isHiddenCrossOrgOrCoAlert(group)
    ? translate(groupTypeTx[group.groupType as GroupType])!
    : undefined;
  const count = group.groupMembersCount
    ? group.groupMembersCount === 1
      ? `${group.groupMembersCount} ${translate('member')}`
      : `${group.groupMembersCount} ${translate('groups_members')}`
    : translate('cec_noMembers')!;

  return type || count;
};

export const decideIfGroupDisabled = (group: Group, selected) => {};
