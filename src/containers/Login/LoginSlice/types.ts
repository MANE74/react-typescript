import { User } from '../../../apis/authAPI';
import { UserById } from '../../../apis/userAPI/types';

export interface Reply {
  id: number;
  sent: string;
  text: string;
  senderID: number;
  senderName: string;
  photoFileName: string | null;
  isCrisisTeamMember: boolean;
  checklistID: number | null;
  checklistName: string | null;
  photoFileNames: string[] | null | [];
  documentFileNames: string[] | null | [];
  audioFileNames: string[] | null | [];
  locationID: number | null;
  locationName: string | null;
  edited: boolean;
  emergencyRecall: boolean;
}

export interface Chat {
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
  lastReplyText: string | null;
  lastReplySent: string | null;
  lastReplySender: string | null;
  lastReplyLocationID: number | null;
  lastReplyLocationName: string | null;
  recipientCount: number;
  checklistID: string | null;
  checklistName: string | null;
  totalTaskCount: number | null;
  totalCompletedTasks: number | null;
  lastReplyChecklistID: string | null;
  lastReplyChecklistName: string | null;
  profilePictureFileName: string | null;
  photoFileNames: string[] | null | [];
  documentFileNames: string[] | null | [];
  audioFileNames: string[] | null | [];
  searchReplyText: string | null;
  searchReplyID: number | null;
  searchReplySender: string | null;
  emergencyTypeName: string | null;
  situationReportID: number | null;
  situationReportName: string | null;
  edited: boolean;
  repliesCount: number;
  unreadRepliesCount: number;
  lastReplyPhotoFileNames: string[] | null | [];
  lastReplyDocumentFileNames: string[] | null | [];
  musterID: number | null;
  onCallAlertID: number | null;
  isCrisisTeamMember: boolean;
  emergencyRecallTime: string | null;
  replies: Reply[];
  Organization: string | null;
  recipientReadCount: number;
  emergencyTypeIconFileName?: string | null;
}

interface ExtendedUserByIdType extends UserById {
  photoUrl?: string;
}

export interface AuthState {
  user: User | null;
  language: 'en' | 'se'; //[TODO]: has to be moved to a settings slice
  userById: ExtendedUserByIdType | null;

  isLoading: {
    login?: boolean;
    userById?: boolean;
  };
  alreadyOpen: boolean;
  isUserVerified?: boolean;
  error: string | null;
}
