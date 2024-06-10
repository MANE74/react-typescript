import { User } from '../../../apis/authAPI';
import { ChecklistStatus } from '../../../utils/enums';
import { SelectListUser } from '../../CreateMessage/createMessageSlice/types';
import { Group } from '../../GroupsList/groupsSlice/types';
import { SelectedGroup } from '../ChecklistSelectGroupsList';

export interface checklistsState {
  selectedUsers: SelectListUser[];
  selectedGroups: SelectedGroup[];
  users: SelectListUser[];
  groups: Group[];
  usersLoading: boolean;
  groupsLoading: boolean;
  checklistName: string;
  checklists: Checklist[];
  isChecklistsLoading: boolean;
  activeChecklist: Checklist | null;
  preSelectedGroups: SelectedGroup[];
  checklistItems: ChecklistItem[];
  selectedGroupType: number[];
  activeTab: ChecklistStatus;
  tempChecklistTasks: ChecklistTask[] | null
}

export interface Checklist {
  completeTasks: number;
  created: string;
  ended: null;
  id: number;
  lastEdited: string | null;
  lastEditor: SelectListUser | null;
  name: string;
  organizationId: number;
  organizationNames: string[];
  organizationsCount: number;
  owner: SelectListUser;
  sharedGroups: number[];
  started: boolean | null;
  status: ChecklistStatus;
  totalTasks: number;
  type: string;
  userNames: string[];
  usersCount: number;
  userIds: number[]
}

export interface ChecklistItem {
  checklistID: number;
  comments: Comment[];
  complete: boolean;
  id: number;
  name: string;
  sortIndex: number;
}

export interface Comment {
  author: string;
  checklistID: number;
  checklistItemID: number;
  id: number;
  imageFileName: string | null;
  sent: string;
  text: string | null;
  type: 'Checked' | 'Unchecked' | 'Regular';
}

export interface ChecklistTask {
  id: string;
  sortIndex: number;
  name: string;
  deleted?: boolean;
  new?: boolean;
}
