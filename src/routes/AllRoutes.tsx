import React from 'react';
import Language from '../components/SidebarOptions/Language/Language';
import Settings from '../components/SidebarOptions/Settings/Settings';
import Sidebar from '../containers/Sidebar/Sidebar';
import { Support } from '../containers/Support/Support';
import { ChangePasswordPage } from './changePassword';
import { ChangeSecondNumberPage } from './changeSecondNumber';
import { ChatPage } from './chat/chat';
import ChecklistsPage from './checklists/checklistsPage';
import CreateChecklistPage from './checklists/createChecklistPage';
import NewChecklistPage from './checklists/newChecklistPage';
import { CreateMessage } from './CreateMessage';
import { CreateMessageNew } from './CreateMessageNew';
import { DashBoardPage } from './dashBoard';
import { DocumentsPage } from './documents';
import { ForgetPasswordPage } from './forgetPassword';
import { GroupsPage } from './groupDetails';
import { GroupsListPage } from './groupsList';
import { HoldingStatementPage } from './holdingStatement';
import ImOk from './ImOk';
import ImOkPage from './ImOkPage';
import { InternalSupportPage } from './internalSupport';
import { LoginPage } from './login';
import { LoginIntroPage } from './loginIntro';
import { GroupMemberPage } from './memberSettings';
import { NewsPage } from './news';
import { NotFoundPage } from './notFound';
import { ProfilePage } from './profile';
import { ResetPasswordPage } from './resetPassword';
import { TutorialDetailsPage } from './tutorialDetails';
import { VideoSupportPage } from './videoSupport';
import { LogNotesPage } from './LogNotes';
import { LogNotePage } from './logNote';
import { BroadcastPage } from './broadcast/broadcast';
import { BroadcastNewPage } from './broadcast/broadcastNew';
import { BroadcastListPage } from './broadcast/broadcastList';
import { BroadcastRecipientsPage } from './broadcast/broadcastRecipients';
import ChatAddGroupsPage from './chat/chatAddGroups';
import ChatDetailsPage from './chat/chatDetails';
import { ChatMessages } from './chat/ChatMessages';
import AlarmPage from './alarm/alarm';
import AlarmMapPage from './alarm/alarmMap';
import AlarmSelectGroupPage from './alarm/alarmSelectGroup';
import { StartIamOkMessagePage } from './startIamOkMessage';
import { IAmOkMemberSettingsPage } from './iAmOkMemberSettings';
import { ExternalContactsPage } from './externalContacts';
import { ExternalContactMessagePage } from './externalContactMessage';
import { CreatCecMessagePage } from './creatCecMessage';
import CreateLogNotePage from './createLogNote';
import ChecklistEditAccess from './checklists/checklistEditAccess';
import ChecklistPage from './checklists/checklist';
import OverviewPage from './OverviewPage';
import StartChecklistPage from './checklists/startChecklistPage';
import { EditDocumentsPage } from './EditDocuments';
import OnCallAlertPage from './OnCallAlertPage';
import OnCallAlert from './OnCallAlert';
import { StartOnCallAlertMessagePage } from './startOnCallAlertMessage';
import { OnCallAlertMemberSettingsPage } from './OnCallAlertMemberSettings';
import LoginSkolonPage from './LoginSkolonPage';
import { Login2faPage } from './Login2fa';
import { CreateHoldingStatementPage } from './createHoldingStatement';
import { ChatMessagesFrpmHoldingStatement } from './chat/ChatMessagesFrpmHoldingStatement';
import EditChecklistPage from './checklists/editChecklistPage';
import ChatDetailsFromHoldingStatementPage from './chat/chatDetailFromHoldingStatment';
import { ChatMemberSettings } from './chatMemberSettings';
import ForwardPage from './chat/forward';

export const public_routes = [
  // intor page was hidden  for more info --> loginIntro.tsx
  { path: '/intro/*', element: <LoginIntroPage /> },
  { path: '/', element: <LoginIntroPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/forgetPassword', element: <ForgetPasswordPage /> },
  {
    path: '/recover_password/:userId/:resetToken',
    element: <ResetPasswordPage />,
  },
  {
    path: '/initial_password/:userId/:resetToken',
    element: <ResetPasswordPage />,
  },
  { path: '/sso', element: <LoginPage /> },
  { path: '/skolon_login', element: <LoginSkolonPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export const auth_routes = [
  { path: '/2fa', element: <Login2faPage /> },
  {
    path: 'dashboard',
    element: <DashBoardPage />,
  },
  {
    path: '/change_password/*',
    element: <ChangePasswordPage />,
  },
  { path: '/sidebar', element: <Sidebar /> },
  { path: '/change-second-number', element: <ChangeSecondNumberPage /> },
  { path: '/chat', element: <ChatPage /> },
  { path: 'message/:id/forward', element: <ForwardPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/groups', element: <GroupsListPage /> },
  {
    path: '/groups/:id',
    element: <GroupsPage />,
  },
  {
    path: 'groups/:id/memberSettings/:memberID',
    element: <GroupMemberPage />,
  },
  {
    path: 'documents/*',
    element: <DocumentsPage />,
  },
  {
    path: 'documents/:groupDocumentId/:folderId/:type/:selectedFileId',
    element: <EditDocumentsPage />,
  },
  {
    path: 'documents/:groupDocumentId/:type/:selectedFileId',
    element: <EditDocumentsPage />,
  },
  {
    path: 'documents/edit/:type',
    element: <EditDocumentsPage />,
  },
  {
    path: 'documents/edit/:type/:value',
    element: <EditDocumentsPage />,
  },
  { path: '/internal-support', element: <InternalSupportPage /> },
  { path: '/video-tutorials', element: <VideoSupportPage /> },
  { path: '/video-tutorials/:id', element: <TutorialDetailsPage /> },
  { path: 'imOk', element: <ImOkPage /> },
  { path: 'muster/:id/*', element: <ImOk /> },
  { path: 'startIamOk/*', element: <StartIamOkMessagePage /> },
  {
    // id here is GroupID
    path: 'muster/:imOkId/memberSettings/:id/:memberID',
    element: <IAmOkMemberSettingsPage />,
  },
  { path: 'onCallAlert', element: <OnCallAlertPage /> },
  { path: 'oncall/:id/*', element: <OnCallAlert /> },
  { path: 'startOnCallAlert/*', element: <StartOnCallAlertMessagePage /> },
  {
    // id here is GroupID
    path: 'oncall/:onCallAlertId/memberSettings/:id/:memberID',
    element: <OnCallAlertMemberSettingsPage />,
  },
  { path: '/createMessage', element: <CreateMessage /> },
  { path: '/sidebar', element: <Sidebar /> },
  { path: 'sidebar/settings', element: <Settings /> },
  { path: 'sidebar/support', element: <Support /> },
  { path: 'sidebar/language', element: <Language /> },
  { path: '/createMessage/new', element: <CreateMessageNew /> },
  { path: 'news', element: <NewsPage /> },
  { path: '/message/:id', element: <ChatMessages /> },
  {
    path: '/message/:id/fromHoldingStatement',
    element: <ChatMessagesFrpmHoldingStatement />,
  },
  {
    path: '/message/:id/fromHoldingStatement/forward/',
    element: <ForwardPage fromHoldingStatement />,
  },
  {
    path: 'message-details/:chatID/memberSettings/:memberID',
    element: <ChatMemberSettings />,
  },
  {
    path: 'message-details/:chatID/fromHoldingStatement/memberSettings/:memberID',
    element: <ChatMemberSettings fromHoldingStatement />,
  },
  { path: '/message-details/:id', element: <ChatDetailsPage /> },
  {
    path: '/message-details/:id/fromHoldingStatement',
    element: <ChatDetailsFromHoldingStatementPage />,
  },
  { path: '/message-details/:id/addGroups', element: <ChatAddGroupsPage /> },
  { path: 'checklists', element: <ChecklistsPage /> },
  { path: 'checklists/create', element: <CreateChecklistPage /> },
  { path: 'checklists/new', element: <NewChecklistPage /> },
  { path: 'checklist/:id/edit', element: <EditChecklistPage /> },
  { path: 'checklist/:id', element: <ChecklistPage /> },
  { path: 'checklist/:id/start', element: <StartChecklistPage /> },
  { path: 'checklist/:id/edit-access', element: <ChecklistEditAccess /> },
  { path: '/holding-statement', element: <HoldingStatementPage /> },
  {
    path: '/createHoldingStatement/*',
    element: <CreateHoldingStatementPage />,
  },
  { path: '/log-notes', element: <LogNotesPage /> },
  { path: '/log-note/:id', element: <LogNotePage /> },
  { path: 'log-note/:id/forward', element: <ForwardPage fromLogNote /> },
  { path: '/log-note/new', element: <CreateLogNotePage /> },
  { path: 'broadcast', element: <BroadcastPage /> },
  { path: 'broadcast/new', element: <BroadcastNewPage /> },
  { path: 'broadcast/message/:id', element: <BroadcastListPage /> },
  {
    path: 'broadcast/message/:id/recipients',
    element: <BroadcastRecipientsPage />,
  },
  { path: '/message/:id', element: <ChatMessages /> },
  { path: '/message-details/:id', element: <ChatDetailsPage /> },
  {
    path: '/message-details/:id/addRecipients',
    element: <ChatAddGroupsPage />,
  },
  { path: 'alarm', element: <AlarmPage /> },
  { path: 'alarm/selectGroup/:alarmId', element: <AlarmSelectGroupPage /> },
  { path: 'alarm/map/:alarmId', element: <AlarmMapPage /> },
  { path: 'cec', element: <ExternalContactsPage /> },
  { path: 'cec/:id/*', element: <ExternalContactMessagePage /> },
  { path: 'createCecMessage/*', element: <CreatCecMessagePage /> },
  { path: 'overview', element: <OverviewPage /> },
];
