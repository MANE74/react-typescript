import { useState } from 'react';
import {
  moveSessionStorageToLocalStorage,
  MUST_MOVED_KEYS,
} from '../../utils/storage';
import { CookiesPopup } from '../CookiesPopup/CookiesPopup';

export enum CookiesState {
  accepted = 'ACCEPTED',
  declined = 'DECLINED',
}

export const RequireCookies = ({ children }: { children: JSX.Element }) => {
  const [allowCookies, setAllowCookies] = useState(
    localStorage.getItem('allow-cookies')
  );

  const onAllowCookies = () => {
    localStorage.setItem('allow-cookies', CookiesState.accepted);
    moveSessionStorageToLocalStorage(MUST_MOVED_KEYS);
    setAllowCookies(CookiesState.accepted);
  };
  const onDeclineCookies = () => {
    localStorage.setItem('allow-cookies', CookiesState.declined);
    setAllowCookies(CookiesState.declined);
  };

  return (
    <>
      {!allowCookies && (
        <CookiesPopup
          onAllowCookies={onAllowCookies}
          onDeclineCookies={onDeclineCookies}
        />
      )}
      {children}
    </>
  );
};
