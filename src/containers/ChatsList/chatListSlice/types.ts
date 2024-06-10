export interface Reply {
  id: number;
  sent: string;
  text: string;
  senderID: number;
  senderName: string;
  photoFileName: string | null;
  isCrisisTeamMember?: boolean;
  checklistID?: number | null;
  checklistName?: string | null;
  photoFileNames: string[] | null;
  documentFileNames?: string[];
  audioFileNames: string[];
  locationID: number | null;
  locationName: string | null;
  edited?: boolean;
  emergencyRecall?: boolean;
  attachments: Attachment[];
}

export interface Chat {
  situationReportID: number | null;
  situationReportName: string | null;
  totalTaskCount: number | null;
  totalCompletedTasks: number | null;
  emergencyRecallTime: string | null;
  Organization: string | null;
  organizations: any[];
  replies: Reply[];
  id: number;
  type: number;
  subType: number;
  replyType: number;
  senderID: number;
  senderName: string;
  groupID: number | null;
  groupIDs: number[];
  groupName: string | null;
  groupNames: string[];
  locationID: number | null;
  subject: string | null;
  text: string;
  photoFileName: string | null;
  documentFileName: string | null;
  attachments: Attachment[];
  sent: string;
  lastRead: string | null;
  recalled: boolean;
  lastReplyText: string | null;
  lastReplySent: string | null;
  lastReplySender: string | null;
  lastReplySenderId: string | null;
  lastReplyLocationID: number | null;
  lastReplyLocationName: string | null;
  recipientCount: number;
  recipientReadCount: number;
  messageRecipients:
    | {
        userID: number | null;
        displayName: string | null;
        photoFileName: string | null;
      }[]
    | null;
  checklistID: string | null;
  checklistName: string | null;
  lastReplyChecklistID: string | null;
  lastReplyChecklistName: string | null;
  profilePictureFileName: string | null;
  photoFileNames: string[] | null;
  documentFileNames?: string[];
  audioFileNames: string[];
  searchReplyID: number | null;
  searchReplySender: string | null;
  searchReplySenderId: number | null;
  emergencyTypeName: string | null;
  emergencyTypeId: number | null;
  edited: boolean;
  repliesCount: number;
  unreadRepliesCount: number;
  lastReplyPhotoFileNames: string[] | null;
  lastReplyDocumentFileNames: string[] | null;
  lastReplyAudioFileNames: string[] | null;
  musterID: number | null;
  onCallAlertID: number | null;
  isCrisisTeamMember: boolean;
  emergencyTypeIconFileName?: string | null;
  ended: boolean | null;

  locationName: string | null;
  searchReplyText: string | null;
}

export interface Attachment {
  fileName: string;
  type: number;
  size: number | null;
  fileSize: number | null;
}

export interface ChatListState {
  chats: Chat[];
  logNotes: Chat[];
  holdingStatements: Chat[];
  seachedChats: Chat[];
  currentChat?: Chat;
  // used in dashboard and sideNavBar notification bubble
  totalUnread: TotalUnread;
  messagesRecipients: MessagesRecipients[];

  isLoading: boolean;
  error: string | null;
  joinGroupError: string | null;
  searchPhrase: string;
  incomingMessage: boolean;
  chatFilters: number[]
}

export interface TotalUnread {
  UnreadCount: number | null;
  ActiveEmergency: boolean;
}

export interface MessagesRecipients {
  displayName: string;
  lastRead: string;
  photoFileName: string;
  read: boolean;
  userID: number;
  title: string;
}
