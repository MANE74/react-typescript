import { GroupSelectItem } from '../../components/Chat/GroupSelectItem';
import { useEffect, useState } from 'react';
import { Group } from '../../containers/GroupsList/groupsSlice/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectGroups, selectGroupsIsLoading } from '../GroupsList/groupsSlice';
import _ from 'lodash';
import Loader from '../../components/Loader/Loader';
import { setSelectedGroupsAction } from './createMessageSlice/actionCreators';
import {
  createMessageGetUsers,
  getSelectedGroups,
  getSelectedGroupType,
  getSelectedUsers,
  selectGroupMembers,
  setGroupMembers,
  setSelectedGroupType,
  setSelectedUsers,
} from './createMessageSlice';
import { GroupsToShow } from '../../utils/global';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { getGroupMembers } from '../../apis/groupsAPI';
import { GroupType } from '../../utils/enums';
import { checkGroupsType, isGroupActive } from './helpers';

export interface SelectedGroup {
  id: number;
  name: string;
  hidden: boolean;
  groupType: GroupType;
}

interface SelectGroupsListProps {
  types?: string[];
  searchText?: string;
  onlyNormal?: boolean;
  groupsToHide?: number[];
}

export const SelectGroupsList = (props: SelectGroupsListProps) => {
  const { types, searchText, onlyNormal, groupsToHide } = props;
  const dispatch = useAppDispatch();

  const users = useAppSelector(createMessageGetUsers);
  const groups = useAppSelector(selectGroups);
  const selectedGroups = useAppSelector(getSelectedGroups);
  const isLoading = useAppSelector(selectGroupsIsLoading);
  const selectedUsers = useAppSelector(getSelectedUsers);
  const selectedGroupType = useAppSelector(getSelectedGroupType);
  const allSelectedGroupMembers = useAppSelector(selectGroupMembers);

  const [groupList, setGroupList] = useState<Group[]>([]);

  useEffect(() => {
    let searchedGroups = [...groups];

    const memberOfGroup = _.includes(types, GroupsToShow.MemberOfGroup);
    const notMemberOfGroup = _.includes(types, GroupsToShow.NotMemberOfGroup);

    if (memberOfGroup && !notMemberOfGroup) {
      searchedGroups = _.filter(searchedGroups, (group) => group.member);
    }
    if (notMemberOfGroup && !memberOfGroup) {
      searchedGroups = _.filter(searchedGroups, (group) => !group.member);
    }

    if (onlyNormal) {
      searchedGroups = _.filter(
        searchedGroups,
        (grp) => grp.groupType === GroupType.Normal
      );
    }

    if (groupsToHide) {
      searchedGroups = _.filter(
        searchedGroups,
        (grp) => !_.includes(groupsToHide, grp.id)
      );
    }
    setGroupList(searchedGroups);
  }, [types, groups]);

  const onGroupClick = async (selectedGroup: SelectedGroup) => {
    const foundIndex = _.findIndex(selectedGroups, function (group) {
      return group.id === selectedGroup.id;
    });
    const tempUserArr = [...selectedUsers];
    const tempGroupArr = [...selectedGroups];
    let tempGroupMemberArr = [...allSelectedGroupMembers];

    async function removeGroupFromSelected<T extends { userID: number }>(
      selectedId: number,
      removedIndex: number,
      tempGroupMemberArr: T[]
    ): Promise<T[]> {
      const _members = await getGroupMembers({ id: selectedId });
      // Uncheck the group
      tempGroupArr.splice(removedIndex, 1);
      // Uncheck the members too
      let _cloned = [...tempGroupMemberArr];
      for (let groupMember of _members) {
        const groupMemberIndex = _cloned.findIndex(
          (member) => member.userID === groupMember.userID
        );

        _cloned.splice(groupMemberIndex, 1);

        const foundMemberIndex = _.findIndex(
          tempUserArr,
          (user) => user.id === groupMember.userID
        );
        if (foundMemberIndex > -1) {
          tempUserArr.splice(foundMemberIndex, 1);
        }
      }
      return _cloned;
    }
    async function addGroupToSelectd(selectedId: number) {
      const _members = await getGroupMembers({ id: selectedId });

      tempGroupArr.push(selectedGroup);

      for (let groupMember of _members) {
        const alreadyInStore = _.findIndex(
          tempGroupMemberArr,
          (user) => user.userID === groupMember.userID
        );
        if (alreadyInStore === -1) {
          groupMember.isSelected = true;
          tempGroupMemberArr.push(groupMember);
        }

        const found = _.find(users, (user) => user.id === groupMember.userID);
        if (found) {
          tempUserArr.push(found);
        }
      }
    }

    if (foundIndex > -1) {
      tempGroupMemberArr = await removeGroupFromSelected(
        selectedGroup.id,
        foundIndex,
        tempGroupMemberArr
      );
      // after latest update of the logic maybe we don't need this but, if it wroks now, we will need to refactor it later
    } else if (
      selectedGroup.groupType !== GroupType.Normal &&
      tempGroupArr.length === 1
    ) {
      tempGroupMemberArr = await removeGroupFromSelected(
        tempGroupArr[0].id,
        0,
        tempGroupMemberArr
      );
      await addGroupToSelectd(selectedGroup.id);
    } else {
      await addGroupToSelectd(selectedGroup.id);
    }

    dispatch(setGroupMembers(tempGroupMemberArr));
    dispatch(setSelectedUsers(tempUserArr));
    await dispatch(setSelectedGroupsAction(tempGroupArr));

    dispatch(setSelectedGroupType([selectedGroup.groupType]));

    if (tempGroupArr.length === 0) {
      dispatch(setSelectedGroupType([]));
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SList>
      {_.map(groupList, (group) => {
        const type = checkGroupsType(group.groupType!);
        const isNotNormal =
          group.groupType === GroupType.Hidden ||
          group.groupType === GroupType.CrossOrg ||
          group.groupType === GroupType.CoAlert;

        const isTheSameType =
          selectedGroupType.length > 0 &&
          !selectedGroupType.includes(group.groupType!);
        const isTheSelected =
          !selectedGroups.map((g) => g.id).includes(group.id) &&
          selectedGroups.length !== 0;
        const disable = isNotNormal ? isTheSelected : isTheSameType;

        return (
          <GroupSelectItem
            key={group.id}
            name={group.name}
            membersCount={group.groupMembersCount}
            photoFileName={group.imageFileName || undefined}
            type={type}
            isSelected={isGroupActive(selectedGroups, group.id)}
            disable={disable}
            onCardPress={() =>
              onGroupClick({
                id: group.id,
                name: group.name,
                hidden: group.hidden,
                groupType: group.groupType,
              })
            }
          />
        );
      })}
    </SList>
  );
};

export const SList = styled.div`
  height: 100%;
  padding: 1.25rem 0 5rem 0;
  .item-container + * {
    padding-top: 10px;
    border-top: 1px solid ${palette.prussianBlue4};
  }

  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
