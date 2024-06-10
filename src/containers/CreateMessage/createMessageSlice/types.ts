import { ActiveTab } from '../../../utils/enums';
import { GroupMember } from '../../GroupDetail/groupDetailSlice/types';

export interface CreateMessageState {
  users: SelectListUser[] | null;
  isLoading: boolean;
  error: string | null;
  selectedUsers: SelectListUser[];
  selectedGroups: any[];
  groupMembers: GroupMember[];
  forwardMessage: ForwardMessageModel | null;
  selectedGroupType: number[];
  activeTab: ActiveTab;
}

export interface SelectListUser {
  id: number;
  displayName: string;
  title: string | null;
  photoFileName: string | null;
  email: string;
  creatorId: number | null;
  phoneNumber: string | null;
  isSelected?: boolean;
  admin?: boolean;
}

export interface ForwardMessageModel {
  text: string;
  photoFileNames: string[];
  documentFileNames: string[];
  audioFileNames: string[];
  locationID?: number;
  emergancyTypeID?: number;
}
