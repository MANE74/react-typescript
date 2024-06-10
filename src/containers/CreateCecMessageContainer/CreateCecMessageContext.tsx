import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  sessionStorageGet,
  sessionStorageRemove,
  sessionStorageSet,
} from '../../utils/storage';
import { CecMessageSendingMethod } from '../CreateCecMessage/helpers';

interface CreateCecMessageCtxState {
  contactListIds: Set<number>;
  sendMethods: CecMessageSendingMethod[];
  setContactListIds: (set: Set<number>) => void;
  setSendMethods: React.Dispatch<React.SetStateAction<number[]>>;
  addTrackingLink: boolean;
  setAddTrackingLink: React.Dispatch<React.SetStateAction<boolean>>;
  cecMessageText: string;
  setCecmessageText: React.Dispatch<React.SetStateAction<string>>;
  onFinish: () => void;
}

const CreateCecMessageCtxDefualtValue: CreateCecMessageCtxState = {
  contactListIds: new Set(),
  setContactListIds: () => {},
  sendMethods: [],
  setSendMethods: () => {},
  addTrackingLink: false,
  setAddTrackingLink: () => {},
  cecMessageText: '',
  setCecmessageText: () => {},
  onFinish: () => {},
};

export const useCreateCecMessageCtx = () => useContext(CreateCecMessageCtx);

const CreateCecMessageCtx = createContext<CreateCecMessageCtxState>(
  CreateCecMessageCtxDefualtValue
);

export const CreateCecMessageCtxKey = 'CREATE_CEC_MESSAGE';

interface CreateCecMessageCtxProviderProps {
  children: React.ReactNode;
}
export const CreateCecMessageCtxProvider = (
  props: CreateCecMessageCtxProviderProps
) => {
  const { children } = props;

  const [contactListIds, setContactListIds]: [
    Set<number>,
    (set: Set<number>) => void
  ] = useState(new Set());
  const [sendMethods, setSendMethods] = useState<CecMessageSendingMethod[]>([]);
  const [addTrackingLink, setAddTrackingLink] = useState<boolean>(false);
  const [cecMessageText, setCecmessageText] = useState<string>('');

  // read and write from session storage
  // delete the props after complete the the send
  useEffect(() => {
    const retrived = sessionStorageGet(CreateCecMessageCtxKey);
    if (retrived) {
      // if there is an retrived let's parse it so we can have it ready ;)
      try {
        const { sendMethods, contactListIds, cecMessageText, addTrackingLink } =
          JSON.parse(retrived);
        setSendMethods(sendMethods);
        setContactListIds(new Set(contactListIds));
        setCecmessageText(cecMessageText);
        setAddTrackingLink(addTrackingLink);
      } catch {
        console.error('not valid JSON');
      }
    }
  }, []);
  useEffect(() => {
    const toSave = JSON.stringify({
      sendMethods,
      contactListIds: Array.from(contactListIds),
      cecMessageText,
      addTrackingLink,
    });
    sessionStorageSet(CreateCecMessageCtxKey, toSave);
  }, [
    sendMethods.length,
    contactListIds.size,
    cecMessageText,
    addTrackingLink,
  ]);

  const onFinish = () => {
    sessionStorageRemove(CreateCecMessageCtxKey);
  };

  const value = useMemo(
    () => ({
      contactListIds,
      setContactListIds,
      sendMethods,
      setSendMethods,
      addTrackingLink,
      setAddTrackingLink,
      cecMessageText,
      setCecmessageText,
      onFinish,
    }),
    [contactListIds, sendMethods, addTrackingLink, cecMessageText]
  );
  return (
    <CreateCecMessageCtx.Provider value={value}>
      {children}
    </CreateCecMessageCtx.Provider>
  );
};
