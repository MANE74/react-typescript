export interface EditMyGroupProfileDataType {
  locationID?: number;
  info?: string;
  showPhone?: boolean;
  showEmail?: boolean;
}
export interface EditMyGroupProfileParam {
  groupID: number;
  editedData: EditMyGroupProfileDataType;
}

// As admin
export interface EditGroupMemberSettingDataType {
    info: string
}
export interface EditGroupMemberSettingParams {
    editedData: EditGroupMemberSettingDataType
    groupID: number
    userID: number
}