import { useEffect, useState } from 'react';
import { getGroupMembers } from '../../apis/groupsAPI';
import { getUserById } from '../../apis/userAPI';
import { MessageGroupTypes } from '../../utils/enums';
import { translate } from '../../utils/translate';
import { GroupMember } from '../GroupDetail/groupDetailSlice/types';
import { Group } from '../GroupsList/groupsSlice/types';

export enum MemberNotMemberGroupsFilters {
  MemberOfGroup,
  NotMemberOfGroup,
}

export const MemberNotMemberFiltersTX: Record<
  MemberNotMemberGroupsFilters,
  string
> = {
  0: 'messages_groups_where_member',
  1: 'messages_groups_where_not_member',
};
export const getIamOkGroups = (groups: Group[]): Group[] => {
  return groups.filter(
    (group) =>
      group.groupType !== MessageGroupTypes.CoAlert &&
      group.groupType !== MessageGroupTypes.CrossOrganization &&
      group.menuItems.includes('muster')
  );
};

export const filterGroupsMemberNotMember = (
  filters: MemberNotMemberGroupsFilters[],
  groups: Group[]
): Group[] => {
  if (filters.length === 0) return groups;
  // number of enum filters
  if (filters.length === Object.keys(MemberNotMemberGroupsFilters).length / 2)
    return groups;

  let _groups = [...groups];

  if (filters.includes(MemberNotMemberGroupsFilters.MemberOfGroup)) {
    _groups = _groups.filter((group) => group.member);
  }

  if (filters.includes(MemberNotMemberGroupsFilters.NotMemberOfGroup)) {
    _groups = _groups.filter((group) => {
      return !group.member;
    });
  }

  return _groups;
};
export const searchGroupsName = (
  searchTerm: string,
  groups: Group[]
): Group[] => {
  return searchTerm
    ? groups.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : groups;
};

export const useGetMembers = (props: {
  id: number;
  setUserIds?: (set: Set<number>) => void;
}) => {
  const { id, setUserIds } = props;

  const [isGettingMembers, setIsLoading] = useState<boolean>(false);

  const [members, setMembers] = useState<
    (GroupMember & {
      name: string;
      id: number;
      imageName?: string | undefined;
    })[]
  >([]);

  const init = async () => {
    if (!id) return;
    setIsLoading(true);
    const members = await getGroupMembers({ id: id });
    const Trasformed: (GroupMember & {
      name: string;
      id: number;
      imageName?: string | undefined;
    })[] = members.map((member, index) => {
      getPhotos(+member.userID!, index);
      return {
        ...member,
        name: member.userName!,
        id: +member.userID!,
      };
    });
    const _selected = new Set(members.map((member) => member.userID!));
    setUserIds && setUserIds(_selected);
    setMembers(Trasformed);
    setIsLoading(false);
  };

  const getPhotos = async (userID: number, index: number) => {
    const { photoFileName } = await getUserById(userID);
    setMembers((prev) => {
      const cloned = [...prev];
      cloned[index] = { ...cloned[index], imageName: photoFileName };
      return cloned;
    });
  };

  useEffect(() => {
    init();
  }, [id]);

  return {
    members,
    isGettingMembers,
  };
};

export const getRecipantsText = (
  members: GroupMember[],
  selected: Set<number>
): string => {
  if (members.length === selected.size) return translate('labelAll')!;
  const selectedUsers = members
    .filter((member) => selected.has(+member.userID!))
    .map(
      (member) =>
        member.userName!.charAt(0).toUpperCase() + member.userName?.slice(1)
    );
  return selectedUsers.join(', ');
};
