// data models ==================================================

import { EditMyGroupProfileDataType } from '../../../apis/groupMembersAPI/types';
import {
  GetGroupMembersQuery,
  IsAdminType,
} from '../../../apis/groupsAPI/types';
import { ConfirmationOptions } from '../../../utils/ConfirmationServiceContext/confirmationContext';
import { GroupType } from '../../../utils/enums';

export interface Location {
  name: string | null;
  latitude: number;
  longitude: number;
}

export interface GroupDetail {
  GroupID: number;
  admin: boolean;
  adminSetsInfo: boolean;
  admins: number | null;
  contactPersonEmailAddress: string | null;
  contactPersonName: string | null;
  contactPersonPhoneNumber: string | null;
  contactPersonTitle: string | null;
  county: string | null;
  created: string | null;
  description: string | null;
  groupMembersCount: number | null; // there is membersCount as well which on is right ?
  groupType: number;
  groupsInOrganization: string[] | null; // TODO make sure the type tis right
  hidden: boolean;
  id: number;
  imageFileName: string | null;
  lastSentMessage: string | null;
  latitude: number;
  longitude: number;
  locationID: number;
  member: boolean;
  memberEmergency: boolean;
  membersCount: number | null;
  membersInGroup: string[] | null; // TODO make sure the type tis right
  menuItems: string[] | null;
  municipality: string | null; // TODO make sure the type tis right
  name: string | null;
  openCalendarWriteAccess: boolean;
  organizationID: number | null;
  organizationName: string | null;
  personsInOrganization: string[] | null; // TODO make sure the type tis right
  searchable: boolean;
  subOrganizationID: number | null;
  subOrganizationname: string | null;
  totalMessageCount: number;
  type: GroupType;
}

export interface GroupMember {
  admin: boolean | null;
  created?: string;
  groupID: number | null;
  info: string | null;
  joined: string | null;
  lastAccess: string | null;
  locationID?: number | null;
  phoneNumber: string | null;
  photoFileName: string | null;
  registrationEmailNotSent?: boolean | null;
  registrationEmailSent?: string | null;
  registrationTokenExpired?: string | null;
  showPhone: boolean | null;
  userEmail: string | null;
  userID: number;
  userName: string;

  showEmail?: boolean;
  isSelected?: boolean;
}

///==========================================================
// state Type

export interface GMLoadingState {
  all?: boolean;
  member?: boolean;
  groupCard?: boolean;
  groupSettings?: boolean;
  memberSettings?: boolean;
}

export interface GroupDetailState {
  groupDetail: GroupDetail | null;
  members: GroupMember[] | null;

  edit: {
    location: Location | null;
  };

  isLoading: GMLoadingState;
  error: string | null;
  groupSettingsError: string | null;
}

///==========================================================

/// params & results Type

export interface fetchGroupDetailParams {
  id: number;
}
export interface fetchGroupMembersParams {
  id: number;
  query?: GetGroupMembersQuery;
}

export interface EditMyProfileParams {
  editedData: EditMyGroupProfileDataType;
  memberID: number;
  confirm?: (params: ConfirmationOptions) => void;
}
export interface toggleIsAdminParams {
  isAdmin: IsAdminType;
  memberID: number;
  confirm?: (params: ConfirmationOptions) => void;
}
export interface RemoveMemberPamas {
  memberID: number;
  confirm?: (params: ConfirmationOptions) => void;
  successCallBack?: () => void;
}
export interface EditUserInfoParams {
  memberID: number;
  info: string;
}
///==========================================================
