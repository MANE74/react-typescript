export interface indexInterface {
  [index: string]: any;
}
export interface GetGroupMembersQuery extends indexInterface {
  sort?: 'nameAsnc' | 'nameDesc';
  search?: string;
  locationId?: string;
}
export interface GetGroupsQuery extends indexInterface {
  // sort?: "nameAsnc" | "nameDesc";
  sort?: string;
  search?: string;

  locationId?: string;
  skip?: number;

  menuitem?: string;

  limit?: number;
  latitude?: number;
  longitude?: number;
}

export interface EditGroupSettingsDataType {
  name: string;
  locationID: number;
  description: string;

  hidden: boolean;

  openCalendarWriteAccess: boolean;
  receiveEmergency: boolean;
  searchable: boolean;
  adminSetsInfo: boolean;
}

export interface EditGroupSettingsParam {
  groupID: number;
  editidData: EditGroupSettingsDataType;
}

export interface IsAdminType {
  admin: boolean;
}

export interface editGroupMemberIsAdminParams {
  groupId: number;
  userID: number;
  isAdmin: IsAdminType;
}

export interface getGroupMembersParams {
  id: number;
  query?: GetGroupMembersQuery;
}
