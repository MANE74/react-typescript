import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import _ from 'lodash';
import { UserSelectItem } from '../../components/Chat/UserSelectItem';
import Loader from '../../components/Loader/Loader';
import {
  getChecklists,
  getSelectedUsers,
  selectUsers,
  setSelectedUsers,
} from './checklistsSlice';
import { selectGroupsIsLoading } from '../GroupsList/groupsSlice';
import { SelectListUser } from '../CreateMessage/createMessageSlice/types';
import { useParams } from 'react-router-dom';
import { SList } from '../CreateMessage/SelectGroupsList';

interface ChecklistSelectUsersListProps {
  searchText: string;
  start?: boolean;
}

export const ChecklistSelectUsersList = (
  props: ChecklistSelectUsersListProps
) => {
  const { searchText, start } = props;

  const dispatch = useAppDispatch();
  const { id } = useParams();

  const users = useAppSelector(selectUsers);
  const isLoading = useAppSelector(selectGroupsIsLoading);
  const selectedUsers = useAppSelector(getSelectedUsers);
  const checklists = useAppSelector(getChecklists);

  const [userList, setUserList] = useState<SelectListUser[]>([]);

  useEffect(() => {
    const filteredUsers = _.filter(
      users,
      (user) => _.toLower(user.displayName).search(_.toLower(searchText)) !== -1
    );
    // For starting checklists only show the shared users
    const userIdsFromChecklist = checklists.find(
      (checklist) => checklist.id === Number(id)
    )?.userIds;

    if (start && userIdsFromChecklist) {
      setUserList(
        filteredUsers.filter((user) => userIdsFromChecklist.includes(user.id))
      );
    } else {
      setUserList(filteredUsers);
    }
  }, [users, searchText]);

  const onUserClick = (selectedUser: SelectListUser) => {
    const foundIndex = _.findIndex(selectedUsers, function (user) {
      return user.id === selectedUser.id;
    });
    const tempArr = [...selectedUsers];
    if (foundIndex > -1) {
      tempArr.splice(foundIndex, 1);
    } else {
      tempArr.push(selectedUser);
    }
    dispatch(setSelectedUsers(tempArr));
  };

  const isSelectedUser = (selectedUsers: SelectListUser[], id: number) => {
    for (let i = 0; i < selectedUsers.length; i++) {
      if (selectedUsers[i].id === id) {
        return i > -1;
      }
    }
    return false;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SList>
      {_.map(userList, (user) => {
        return (
          <UserSelectItem
            key={user.id}
            user={user}
            isSelected={isSelectedUser(selectedUsers, user.id)}
            onCardPress={() => onUserClick(user)}
          />
        );
      })}
    </SList>
  );
};
