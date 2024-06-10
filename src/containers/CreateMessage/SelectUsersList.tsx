import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import _ from 'lodash';
import { setSelectedUsersAction } from './createMessageSlice/actionCreators';
import {
  createMessageGetUsers,
  createMessageIsLoading,
  getSelectedGroups,
  getSelectedUsers,
  selectGroupMembers,
  setGroupMembers,
} from './createMessageSlice';
import { UserSelectItem } from '../../components/Chat/UserSelectItem';
import Loader from '../../components/Loader/Loader';
import { selectMessagesRecipients } from '../ChatsList/chatListSlice';
import { SelectListUser } from './createMessageSlice/types';
import { SList } from './SelectGroupsList';

interface SelectUsersListProps {
  searchText: string;
  usersToHide?: number[];
  excludeRecipients?: boolean;
}

export const SelectUsersList = (props: SelectUsersListProps) => {
  const { searchText, usersToHide, excludeRecipients } = props;

  const dispatch = useAppDispatch();

  const users = useAppSelector(createMessageGetUsers);
  const isLoading = useAppSelector(createMessageIsLoading);
  const selectedUsers = useAppSelector(getSelectedUsers);
  const selectedGroupMembers = useAppSelector(selectGroupMembers);
  const selectedGroups = useAppSelector(getSelectedGroups);
  const excludedRecipients = useAppSelector(selectMessagesRecipients);

  const [excludedRecipientsIds, setExcludedRecipientsIds] = useState<number[]>(
    []
  );

  useEffect(() => {
    usersToHide && setExcludedRecipientsIds(usersToHide);
  }, []);

  useEffect(() => {
    const getExcludedRecipientsIds = () => {
      const idsList = _.map(
        excludedRecipients,
        (recipient) => recipient.userID
      );
      setExcludedRecipientsIds(idsList);
    };

    excludeRecipients && getExcludedRecipientsIds();
  }, [excludedRecipients]);

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
    dispatch(setSelectedUsersAction(tempArr));

    if (selectedGroups.length !== 0) {
      const foundIndexGroupMembers = _.findIndex(
        selectedGroupMembers,
        function (user) {
          return user.userID === selectedUser.id;
        }
      );
      const tempArrGroupMembers = [...selectedGroupMembers];
      if (foundIndexGroupMembers > -1) {
        tempArrGroupMembers.splice(foundIndex, 1);
      } else {
      }
      dispatch(setGroupMembers(tempArrGroupMembers));
    }
  };

  const isSelectedUser = (selectedUsers: SelectListUser[], id: number) => {
    for (let i = 0; i < selectedUsers.length; i++) {
      if (selectedUsers[i].id === id) {
        return i > -1;
      }
    }
    return false;
  };

  const getFilteredUsers = () => {
    const newUsers: SelectListUser[] = [];
    _.forEach(users, (user) => {
      if (!_.includes(excludedRecipientsIds, user.id)) {
        newUsers.push(user);
      }
    });
    return newUsers;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SList>
      {_.map(getFilteredUsers(), (user) => (
        <UserSelectItem
          key={user.id}
          user={user}
          isSelected={isSelectedUser(selectedUsers, user.id)}
          onCardPress={() => onUserClick(user)}
          photoFileName={user.photoFileName || undefined}
        />
      ))}
    </SList>
  );
};
