import { compact } from 'lodash';
import { SelectListUser } from '../CreateMessage/createMessageSlice/types';

export const getCheckListTemplateUsersCount = (
  users: SelectListUser[]
): number => {
  const uniqueIds: number[] = [];

  const uniqueUsers = compact(users).filter(element => {
    const isDuplicate = uniqueIds.includes(element.id);

    if (!isDuplicate) {
      uniqueIds.push(element.id);
      return true;
    }
    return false;
  });
  return uniqueUsers.length;
};
