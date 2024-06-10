import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import chatListSlice from './containers/ChatsList/chatListSlice';
import groupDetailSlice from './containers/GroupDetail/groupDetailSlice';
import groupsSlice from './containers/GroupsList/groupsSlice';
import appSlice from './containers/App/AppSlice';
import loginSlice from './containers/Login/LoginSlice';
import documentsSlice from './containers/Documents/documentsSlice';
import supportSlice from './containers/Support/supportSlice';
import imOkSlice from './containers/ImOkList/imOkSlice';
import createMessageSlice from './containers/CreateMessage/createMessageSlice';
import newsSlice from './containers/News/newsSlice';
import onCallAlertSlice from './containers/OnCallAlertList/onCallAlertSlice';
import broadcastSlice from './containers/Broadcast/broadcastSlice';
import externalContactsSlice from './containers/ExternalContacts/externalContactsSlice';
import messageDetailsSlice from './containers/ChatDetails/chatDetailsSlice';
import checklistsSlice from './containers/Checklists/checklistsSlice';
import alarmSlice from './containers/Alarm/AlarmSlice';
import EditDocumentsSlice from './containers/EditDocuments/EditDocumentSlice';
import checkAppAvailableStateSlice from './containers/CheckAppAvailable/checkAppAvailableSlice';
import settingsSlice from './components/SidebarOptions/Settings/settingsSlice';
import Login2faSlice from './containers/Login2fa/Login2faSlice';

export const store = configureStore({
  reducer: {
    groups: groupsSlice,
    groupDetail: groupDetailSlice,
    chatList: chatListSlice,
    user: loginSlice,
    documents: documentsSlice,
    news: newsSlice,
    app: appSlice,
    support: supportSlice,
    imOkState: imOkSlice,
    createMessage: createMessageSlice,
    onCallAlertState: onCallAlertSlice,
    broadcast: broadcastSlice,
    createFolder: EditDocumentsSlice,
    externalContacts: externalContactsSlice,
    messageDetails: messageDetailsSlice,
    checklists: checklistsSlice,
    alarm: alarmSlice,
    checkAppAvailableState: checkAppAvailableStateSlice,
    settings: settingsSlice,
    auth2f: Login2faSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
