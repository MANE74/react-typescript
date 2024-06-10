import { createContext, useContext, useMemo, useState } from 'react';
import { sessionStorageRemove } from '../../utils/storage';

interface StartOnCallAlertMessageCtxState {
  groupIds: number | undefined;
  userIds: Set<number>;

  setGroupIds: React.Dispatch<React.SetStateAction<number | undefined>>;
  setUserIds: (set: Set<number>) => void;

  onCallAlertMessageText: string;
  setOnCallAlertMessageText: React.Dispatch<React.SetStateAction<string>>;

  subject: string;
  setSubject: React.Dispatch<React.SetStateAction<string>>;

  onFinish: () => void;
}

const StartOnCallALertMessageCtxDefualtValue: StartOnCallAlertMessageCtxState =
  {
    groupIds: undefined,
    userIds: new Set(),

    setGroupIds: () => {},
    setUserIds: () => {},

    onCallAlertMessageText: '',
    setOnCallAlertMessageText: () => {},

    subject: '',
    setSubject: () => {},

    onFinish: () => {},
  };

export const useStartOnCallAlertMessageCtx = () =>
  useContext(StartOnCallALertMessageCtx);

const StartOnCallALertMessageCtx =
  createContext<StartOnCallAlertMessageCtxState>(
    StartOnCallALertMessageCtxDefualtValue
  );

const StartOnCallAlertMessageCtxKey = 'START_OnCallAlert_MESSAGE';

interface StartOnCallAlertMessageCtxProviderProps {
  children: React.ReactNode;
}
export const StartOnCallAlertMessageCtxProvider = (
  props: StartOnCallAlertMessageCtxProviderProps
) => {
  const { children } = props;

  const [groupIds, setGroupIds] = useState<number>();

  const [userIds, setUserIds]: [Set<number>, (set: Set<number>) => void] =
    useState(new Set());

  const [onCallAlertMessageText, setOnCallAlertMessageText] =
    useState<string>('');

  const [subject, setSubject] = useState<string>('');

  const onFinish = () => {
    sessionStorageRemove(StartOnCallAlertMessageCtxKey);
  };

  const value = useMemo(
    () => ({
      groupIds,
      userIds,
      subject,

      setGroupIds,
      setUserIds,
      setSubject,

      onCallAlertMessageText,
      setOnCallAlertMessageText,

      onFinish,
    }),
    [groupIds, subject, onCallAlertMessageText, userIds]
  );
  return (
    <StartOnCallALertMessageCtx.Provider value={value}>
      {children}
    </StartOnCallALertMessageCtx.Provider>
  );
};
