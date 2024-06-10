import { User } from "../../../apis/authAPI";

// Broadcast stored in the store
export interface BroadcastState {
    users: User[];
    selectedUsers: any[];
    orgs: any[];
    selectedOrgs: any[];
    broadcastMsgs: any;
    broadcastMsg: any;
    isLoading: boolean;
    error: string | null;
}

export interface BroadcastMsg {
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
    locationName: string | null;
    text: string;
    subject: string | null;
    photoFileName: string | null;
    documentFileName: string | null;
    sent: string;
    lastRead: string | null;
    recalled: boolean;
    ended: boolean | null;
    lastReplyText: string | null;
    lastReplySent: string | null;
    lastReplySender: string | null;
    lastReplySenderId: string | null;
    lastReplyLocationID: number | null;
    lastReplyLocationName: string | null;
    lastReplyAudioFileNames: string[];
    recipientCount: number;
    checklistID: string | null;
    checklistName: string | null;
    totalTaskCount: number | null;
    totalCompletedTasks: number | null;
    lastReplyChecklistID: string | null;
    lastReplyChecklistName: string | null;
    profilePictureFileName: string | null;
    photoFileNames: string[] | null;
    documentFileNames?: string[];
    audioFileNames: string[];
    searchReplyText: string | null;
    searchReplyID: number | null;
    searchReplySender: string | null;
    emergencyTypeName: string | null;
    situationReportID: number | null;
    situationReportName: string | null;
    edited: boolean;
    repliesCount: number;
    unreadRepliesCount: number;
    lastReplyPhotoFileNames: string[] | null;
    lastReplyDocumentFileNames: string[] | null;
    musterID: number | null;
    onCallAlertID: number | null;
    isCrisisTeamMember: boolean;
    emergencyRecallTime: string | null;
    Organization: any | null;
    organizations: any[] | null;
    recipientReadCount: number;
    emergencyTypeIconFileName?: string | null;
    messageRecipients: { photoFileName: string }[] | null;
}

