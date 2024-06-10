import { NavigateFunction } from 'react-router';
import { ConfirmationOptions } from '../../utils/ConfirmationServiceContext/confirmationContext';

import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import { ImOkDocumentSimple } from '../ImOkList/imOkSlice/types';
import { AppDispatch, store } from '../../store';
import { MemberSettingsOptionsStateType } from './MemberSettings';
import { SyntheticEvent } from 'react';
import Copy from '../../assets/imgs/groups/member-details-copy.svg';
import Email from '../../assets/imgs/groups/member-details-send-email.svg';
const dispatch = store.dispatch;

export const getIamOkMemberLocationName = (
  iamOk: ImOkDocumentSimple,
  userId: number
): string | 'NO_LOCATION' => {
  return (
    iamOk.users.find(i => i.userid === userId)?.locationName || 'NO_LOCATION'
  );
};
export const getIamOkMemberLocation = (
  iamOk: ImOkDocumentSimple,
  userId: number
) => {
  const user = iamOk.users.find(i => i.userid === userId);
  if (user) {
    return {
      latitude: user.locationLatitude,
      longitude: user.locationLongitude,
      name: user.locationName,
      lastupdated: user.lastupdated,
    };
  }
};

export const copyText =
  (text: string, setOpen: (isOpen: boolean) => void) => () => {
    if (text?.length) {
      navigator.clipboard.writeText(text);
    }
    setOpen(false);
  };

export const sendEmail =
  (mail: string, setOpen: (isOpen: boolean) => void) => () => {
    if (mail?.length) {
      window.open(`mailto:${mail}`, '_blank');
    }
    setOpen(false);
  };

export const handleMemberSettingsPhoneClick =
  (
    phone: string,
    setOptionsState: (
      value: React.SetStateAction<MemberSettingsOptionsStateType>
    ) => void,
    setOpen: (isOpen: boolean) => void
  ) =>
  (e: SyntheticEvent) => {
    setOptionsState(prev => ({
      ...prev,
      options: [
        {
          name: 'copy_number',
          icon: Copy,
          callback: copyText(phone, setOpen),
        },
      ],
    }));

    setOpen(true);
  };

export const handleMemberSettingsEmailClick =
  (
    email: string,
    setOptionsState: (
      value: React.SetStateAction<MemberSettingsOptionsStateType>
    ) => void,
    setOpen: (isOpen: boolean) => void
  ) =>
  (e: SyntheticEvent) => {
    setOptionsState(prev => ({
      ...prev,
      options: [
        {
          name: 'copy_email',
          icon: Copy,
          callback: copyText(email, setOpen),
        },
        {
          name: 'send_email',
          icon: Email,
          callback: sendEmail(email, setOpen),
        },
      ],
    }));

    setOpen(true);
  };
