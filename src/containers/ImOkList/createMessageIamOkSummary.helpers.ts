import { IamOkMessageMembersType } from '../../routes/ImOk';
import { ImOkDocumentSimple } from './imOkSlice/types';
import _ from 'lodash';

export const getReplyTypeId = (replyType: string) => {
  switch (replyType) {
    case 'messages_replyToAll':
      return 0;
    case 'messages_replyToSender':
      return 1;
    default:
      return 2;
  }
};

export interface GetIamOkInitiallSelectedParams {
  meesageType: IamOkMessageMembersType;

  iamOk: ImOkDocumentSimple;

  withoutCurrentUserId?: number;
}
export const getIamOkInitiallSelected = (
  params: GetIamOkInitiallSelectedParams
): Set<number> => {
  const { iamOk, meesageType, withoutCurrentUserId } = params;
  switch (meesageType) {
    case 'ALL':
      return new Set(
        iamOk?.users
          .map(member => member.userid!)
          .filter(id => {
            if (withoutCurrentUserId) return id !== withoutCurrentUserId;
            return true;
          })
      );
    case 'NOT_OK':
      return new Set(
        _.filter(iamOk?.users, user => user.imok === false)
          .map(user => user.userid!)
          .filter(id => {
            if (withoutCurrentUserId) return id !== withoutCurrentUserId;
            return true;
          })
      );
    case 'NO_STATUS':
      return new Set(
        _.filter(iamOk?.users, user => user.imok === null)
          .map(user => user.userid!)
          .filter(id => {
            if (withoutCurrentUserId) return id !== withoutCurrentUserId;
            return true;
          })
      );
    case 'OK':
      return new Set(
        _.filter(iamOk?.users, user => user.imok)
          .map(user => user.userid!)
          .filter(id => {
            if (withoutCurrentUserId) return id !== withoutCurrentUserId;
            return true;
          })
      );
    default:
      return new Set(
        iamOk?.users
          .map(member => member.userid!)
          .filter(id => {
            if (withoutCurrentUserId) return id !== withoutCurrentUserId;
            return true;
          })
      );
  }
};

export const checkIfNotZeroMembers = (
  type: IamOkMessageMembersType,
  iamOk: ImOkDocumentSimple
): boolean => {
  switch (type) {
    case 'ALL':
      return new Set(iamOk?.users.map(member => member.userid!)).size === 0;
    case 'NOT_OK':
      return (
        new Set(
          _.filter(iamOk?.users, user => user.imok === false).map(
            user => user.userid!
          )
        ).size === 0
      );
    case 'NO_STATUS':
      return (
        new Set(
          _.filter(iamOk?.users, user => user.imok === null).map(
            user => user.userid!
          )
        ).size === 0
      );
    case 'OK':
      return (
        new Set(
          _.filter(iamOk?.users, user => user.imok).map(user => user.userid!)
        ).size === 0
      );
    default:
      return new Set(iamOk?.users.map(member => member.userid!)).size === 0;
  }
};
