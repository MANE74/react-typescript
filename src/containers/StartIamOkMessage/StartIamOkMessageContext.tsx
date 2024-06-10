import { createContext, useContext, useMemo, useState } from 'react';
import { sessionStorageRemove } from '../../utils/storage';

interface StartIamOkMessageCtxState {
  groupIds: number | undefined;
  userIds: Set<number>;

  setGroupIds: React.Dispatch<React.SetStateAction<number | undefined>>;
  setUserIds: (set: Set<number>) => void;

  iamOkMessageText: string;
  setIamOkMessageText: React.Dispatch<React.SetStateAction<string>>;

  subject: string;
  setSubject: React.Dispatch<React.SetStateAction<string>>;

  onFinish: () => void;
}

const StartIamOkMessageCtxDefualtValue: StartIamOkMessageCtxState = {
  groupIds: undefined,
  userIds: new Set(),

  setGroupIds: () => {},
  setUserIds: () => {},

  iamOkMessageText: '',
  setIamOkMessageText: () => {},

  subject: '',
  setSubject: () => {},

  onFinish: () => {},
};

export const useStartIamOkMessageCtx = () => useContext(StartIamOkMessageCtx);

const StartIamOkMessageCtx = createContext<StartIamOkMessageCtxState>(
  StartIamOkMessageCtxDefualtValue
);

const StartIamOkMessageCtxKey = 'START_iamOk_MESSAGE';

interface StartIamOkMessageCtxProviderProps {
  children: React.ReactNode;
}
export const StartIamOkMessageCtxProvider = (
  props: StartIamOkMessageCtxProviderProps
) => {
  const { children } = props;

  const [groupIds, setGroupIds] = useState<number>();

  const [userIds, setUserIds]: [Set<number>, (set: Set<number>) => void] =
    useState(new Set());

  const [iamOkMessageText, setIamOkMessageText] = useState<string>('');

  const [subject, setSubject] = useState<string>('');

  const onFinish = () => {
    sessionStorageRemove(StartIamOkMessageCtxKey);
  };

  const value = useMemo(
    () => ({
      groupIds,
      userIds,
      subject,

      setGroupIds,
      setUserIds,
      setSubject,

      iamOkMessageText,
      setIamOkMessageText,

      onFinish,
    }),
    [groupIds, subject, iamOkMessageText, userIds]
  );
  return (
    <StartIamOkMessageCtx.Provider value={value}>
      {children}
    </StartIamOkMessageCtx.Provider>
  );
};
