import { Group } from '../../GroupsList/groupsSlice/types';

export interface EmergencyType {
  Color: string | null;
  Deleted: boolean | null;
  Groups: GroupsArr[] | null;
  ID: number | null;
  Icon: string | null;
  IncludeCrisisTeam: boolean | null;
  Names: NamesArr[] | null;
  NoGroup: boolean | null;
  Order: number | null;
  OrganizationID: number | null;
  OrganizationName: string | null;
  SkipMap: boolean | null;
  SuborganizationID: number | null;
  SuborganizationName: string | null;
  eventCodeId: number | null;
  hideFromMainAccountUsers: boolean | null;
  isMandatory: boolean | null;
  linkedSubOrganizationsWithGroups:
    | linkedSubOrganizationsWithGroupsType[]
    | null;
  subOrganisationIDForEmergencyMessage: number | null;
}

export interface GroupsArr {
  GroupID: number;
  created: string;
  id: number;
  name: string;
  type: number;
  groupMembersCount?: number;
  groupType?: number;
}

export interface NamesArr {
  Language: string;
  Name: string;
  ShortName: string | null;
}

export interface linkedSubOrganizationsWithGroupsType {
  groupIDs: number[] | null;
  groups: any[];
  id: number;
  name: string;
  noGroup: boolean;
  skipMap: boolean;
}

export interface AlarmState {
  types: EmergencyType[];
  isLoading: boolean;
  selectedType: EmergencyType | null;
  selectedGroups: number[];
  alarmCreateModel: EmergencyType | null;
  selectedGroupType: number[];
}
