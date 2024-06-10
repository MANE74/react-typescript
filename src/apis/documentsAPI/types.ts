export interface DeleteFileFromGroupProps {
  id: number;
  groupId: number;
}
export interface DeleteFileFromFolderProps {
  id: number;
  folderId: number;
}
export interface RenameFolderProps {
  id: number;
  name: string;
}

export interface ToggleOfflineModel {
  folderID?: number;
  documentID?: number;
  groupID?: number;

  action?: number;

  offline: boolean;
}
