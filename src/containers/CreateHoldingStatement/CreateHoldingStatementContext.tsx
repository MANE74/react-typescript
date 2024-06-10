import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { GroupType } from '../../utils/enums';
import {
  sessionStorageGet,
  sessionStorageRemove,
  sessionStorageSet,
} from '../../utils/storage';

interface CreateHoldingStatementCtxState {
  groupIds: Set<number>;
  setGroupIds: (set: Set<number>) => void;

  userIds: Set<number>;
  setUserIds: (set: Set<number>) => void;

  subject: string;
  setSubject: React.Dispatch<React.SetStateAction<string>>;

  messageText: string;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;

  selectedGroupType: GroupType[];
  setSelectedGroupType: React.Dispatch<React.SetStateAction<GroupType[]>>;

  onFinish: () => void;
}

const CreateHoldingStatementCtxDefualtValue: CreateHoldingStatementCtxState = {
  groupIds: new Set(),
  userIds: new Set(),

  setGroupIds: () => {},
  setUserIds: () => {},

  subject: '',
  setSubject: () => {},

  messageText: '',
  setMessageText: () => {},

  onFinish: () => {},
  selectedGroupType: [],
  setSelectedGroupType: () => {},
};

export const useCreateHoldingStatementCtx = () =>
  useContext(CreateHoldingStatementCtx);

const CreateHoldingStatementCtx = createContext<CreateHoldingStatementCtxState>(
  CreateHoldingStatementCtxDefualtValue
);

export const CreateHoldingStatmentCtxKey = 'CREATE_HOLDINGSTATEMENT_MESSAGE';

interface CreateHoldingStatementCtxProviderProps {
  children: React.ReactNode;
}
export const CreateHoldingStatementCtxProvider = (
  props: CreateHoldingStatementCtxProviderProps
) => {
  const { children } = props;

  const [groupIds, setGroupIds]: [Set<number>, (set: Set<number>) => void] =
    useState(new Set());

  const [userIds, setUserIds]: [Set<number>, (set: Set<number>) => void] =
    useState(new Set());

  const [subject, setSubject] = useState<string>('');

  const [messageText, setMessageText] = useState<string>('');

  const [selectedGroupType, setSelectedGroupType] = useState<GroupType[]>([]);

  const onFinish = () => {
    sessionStorageRemove(CreateHoldingStatmentCtxKey);
  };

  const value = useMemo(
    () => ({
      groupIds,
      userIds,
      subject,
      messageText,
      selectedGroupType,

      setGroupIds,
      setUserIds,
      setSubject,
      setMessageText,
      onFinish,
      setSelectedGroupType,
    }),
    [groupIds, userIds, subject, messageText, selectedGroupType]
  );
  return (
    <CreateHoldingStatementCtx.Provider value={value}>
      {children}
    </CreateHoldingStatementCtx.Provider>
  );
};
