import { isNull } from 'lodash';
import { MemberFilterTypes } from '.';
import { GroupMember } from './groupDetailSlice/types';

export const sortGroupMembers = (
  members: GroupMember[] | null,
  sorting: MemberFilterTypes,
  searchTerm?: string
): GroupMember[] => {
  let _groups: GroupMember[] = [];
  if (members) {
    if (sorting === MemberFilterTypes.Name)
      _groups = members
        .slice()
        .sort((a, b) => a.userName!.localeCompare(b.userName!));
    if (sorting === MemberFilterTypes.Title)
      _groups = [
        ...members
          .slice()
          .filter(a => !isNull(a.info) && a.info.length > 0)
          .sort((a, b) => a.info!.localeCompare(b.info!)),
        ...members.slice().filter(a => !isNull(a.info) && a.info!.length === 0),
      ];
  }
  return searchTerm
    ? _groups.filter(e =>
        e.userName!.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : _groups;
};
