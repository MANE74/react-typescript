import _ from 'lodash';
import { OnCallAlertkMessageMembersType } from '../../routes/OnCallAlert';
import { OnCallAlertDocumentSimple } from './onCallAlertSlice/types';
import { OnCallAlertStatusType } from '../../utils/enums';

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

export const getOnCallAlertInitiallSelected = (
  meesageType: OnCallAlertkMessageMembersType,
  onCallAlert: OnCallAlertDocumentSimple,
  withoutCurrentUserId?: number
): Set<number> => {
  switch (meesageType) {
    case 'ALL':
      return new Set(
        onCallAlert?.users
          .map(member => member.userId!)
          .filter(id => {
            if (withoutCurrentUserId) return id !== withoutCurrentUserId;
            return true;
          })
      );
    case 'NOT_AVAILANLE':
      return new Set(
        _.filter(
          onCallAlert?.users,
          user => user.status === OnCallAlertStatusType.NotAvailable
        )
          .map(user => user.userId!)
          .filter(id => {
            if (withoutCurrentUserId) return id !== withoutCurrentUserId;
            return true;
          })
      );
    case 'NO_STATUS':
      return new Set(
        _.filter(
          onCallAlert?.users,
          user => user.status === OnCallAlertStatusType.NoStatus
        ).map(user => user.userId!)
      );
    case 'AVIALABLE':
      return new Set(
        _.filter(
          onCallAlert?.users,
          user => user.status === OnCallAlertStatusType.Available
        )
          .map(user => user.userId!)
          .filter(id => {
            if (withoutCurrentUserId) return id !== withoutCurrentUserId;
            return true;
          })
      );
    default:
      return new Set(
        onCallAlert?.users
          .map(member => member.userId!)
          .filter(id => {
            if (withoutCurrentUserId) return id !== withoutCurrentUserId;
            return true;
          })
      );
  }
};

export const checkOnCallAlertIfNotZeroMembers = (
  type: OnCallAlertkMessageMembersType,
  onCallAlert: OnCallAlertDocumentSimple
): boolean => {
  switch (type) {
    case 'ALL':
      return (
        new Set(onCallAlert?.users.map(member => member.userId!)).size === 0
      );
    case 'NOT_AVAILANLE':
      return (
        new Set(
          _.filter(
            onCallAlert?.users,
            user => user.status === OnCallAlertStatusType.NotAvailable
          ).map(user => user.userId!)
        ).size === 0
      );
    case 'NO_STATUS':
      return (
        new Set(
          _.filter(
            onCallAlert?.users,
            user => user.status === OnCallAlertStatusType.NoStatus
          ).map(user => user.userId!)
        ).size === 0
      );
    case 'AVIALABLE':
      return (
        new Set(
          _.filter(
            onCallAlert?.users,
            user => user.status === OnCallAlertStatusType.Available
          ).map(user => user.userId!)
        ).size === 0
      );
    default:
      return (
        new Set(onCallAlert?.users.map(member => member.userId!)).size === 0
      );
  }
};
