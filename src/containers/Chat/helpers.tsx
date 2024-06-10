import { compact, isEmpty, isNil } from 'lodash';
import { TFunction } from 'react-i18next';
import { Chat } from '../ChatsList/chatListSlice/types';

export const getMessageHeaderSubTitle = (
  message: Chat,
  t: TFunction<'translation', undefined>,
  seperator = ', '
): string => {
  if (message.type === 3) {
    //Broadcast
    const organizations = message?.organizations;
    const text =
      !isNil(organizations) && organizations.length > 1
        ? `${organizations.length}  ${t('messages_title_info_label')}`
        : !isNil(organizations) && !isNil(organizations[0])
        ? organizations[0].name
        : '';
    if (!isEmpty(text) && !isNil(text)) {
      return text;
    }
  }
  const groupsCount = message.groupIDs?.length || message.groupNames?.length;
  const recipentsCount = message.recipientCount;
  let groupsCountText = '';
  let recipentsCountText = '';
  if (groupsCount) {
    groupsCountText =
      groupsCount > 1
        ? `${groupsCount} ${t('groups_title')}`
        : `${groupsCount} ${t('group')}`;
  }
  if (recipentsCount) {
    recipentsCountText =
      recipentsCount > 1
        ? `${recipentsCount} ${t(`groups_members`)}`
        : `${recipentsCount} ${t('member')}`;
  }

  return compact([groupsCountText, recipentsCountText]).join(seperator);
};
