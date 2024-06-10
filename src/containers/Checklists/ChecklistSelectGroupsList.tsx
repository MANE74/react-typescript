import { GroupSelectItem } from '../../components/Chat/GroupSelectItem';
import { useEffect, useState } from 'react';
import { Group } from '../GroupsList/groupsSlice/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import _ from 'lodash';
import Loader from '../../components/Loader/Loader';
import { getGroupMembers } from '../../apis/groupsAPI';
import { GroupType } from '../../utils/enums';
import {
  getSelectedGroups,
  getSelectedUsers,
  isGroupsLoading,
  selectUsers,
  setSelectedGroups,
  setSelectedUsers,
} from './checklistsSlice';
import { checkGroupsType, isGroupActive } from '../CreateMessage/helpers';
import { SList } from '../CreateMessage/SelectGroupsList';

export interface SelectedGroup {
  id: number;
  name: string | null;
  hidden: boolean;
  groupType: GroupType;
}

interface ChecklistSelectGroupsListProps {
  groups: Group[];
}

export const ChecklistSelectGroupsList = (
  props: ChecklistSelectGroupsListProps
) => {
  const { groups } = props;
  const dispatch = useAppDispatch();

  const users = useAppSelector(selectUsers);
  const selectedGroups = useAppSelector(getSelectedGroups);
  const isLoading = useAppSelector(isGroupsLoading);
  const selectedUsers = useAppSelector(getSelectedUsers);

  const [groupList, setGroupList] = useState<Group[]>([]);

  useEffect(() => {
    setGroupList(groups);
  }, [groups]);

  // useEffect(() => {
  //   let searchedGroups = _.filter(
  //     groups,
  //     (group) => _.toLower(group.name).search(_.toLower(searchText)) !== -1
  //   );

  //   const memberOfGroup = _.includes(types, GroupsToShow.MemberOfGroup);
  //   const notMemberOfGroup = _.includes(types, GroupsToShow.NotMemberOfGroup);

  //   if (memberOfGroup && !notMemberOfGroup) {
  //     searchedGroups = _.filter(searchedGroups, (group) => group.member);
  //   }
  //   if (notMemberOfGroup && !memberOfGroup) {
  //     searchedGroups = _.filter(searchedGroups, (group) => !group.member);
  //   }
  //   setGroupList(searchedGroups);
  // }, [searchText, groups]);

  const onGroupClick = async (selectedGroup: SelectedGroup) => {
    const foundIndex = _.findIndex(selectedGroups, function (group) {
      return group.id === selectedGroup.id;
    });

    const tempUserArr = [...selectedUsers];
    const tempGroupArr = [...selectedGroups];

    const groupMembers = await getGroupMembers({ id: selectedGroup.id });
    if (foundIndex > -1) {
      tempGroupArr.splice(foundIndex, 1);

      //Uncheck the members too
      for (let groupMember of groupMembers) {
        const foundMemberIndex = _.findIndex(
          tempUserArr,
          (user) => user.id === groupMember.userID
        );
        if (foundMemberIndex > -1) {
          tempUserArr.splice(foundMemberIndex, 1);
        }
      }
    } else {
      tempGroupArr.push(selectedGroup);

      for (let groupMember of groupMembers) {
        const found = _.find(users, (user) => user.id === groupMember.userID);
        if (found) {
          tempUserArr.push(found);
        }
      }
    }

    dispatch(setSelectedUsers(tempUserArr));
    dispatch(setSelectedGroups(tempGroupArr));
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <SList>
      {_.map(groupList, (group) => (
        <GroupSelectItem
          key={group.id}
          name={group.name}
          membersCount={group.groupMembersCount}
          type={checkGroupsType(group.groupType!)}
          isSelected={isGroupActive(selectedGroups, group.id)}
          onCardPress={() =>
            onGroupClick({
              id: group.id,
              name: group.name,
              hidden: group.hidden,
              groupType: group.groupType,
            })
          }
        />
      ))}
    </SList>
  );
};
