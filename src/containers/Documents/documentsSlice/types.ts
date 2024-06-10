import { Group } from '../../GroupsList/groupsSlice/types';

// folder comming from the api
export interface FolderItem {
  ID: number;
  Name: string;
  GroupID: number;
  Offline: boolean;
  userId: number | null;
  userName: string | null;
  creationTime: string | null;
}

export interface DocumentGroup {
  id: number;
  name: string;
  created: string;
  GroupID: number;
  type: number;
  offline: boolean;
}

// document comming from the api

export interface FileItem {
  id: number;
  name: string;
  original_filen_name: string;
  document_url: string;
  group_id: number | null;
  groups: DocumentGroup[];
  file_size: number;
  upload_time: string;
  folderids: number[];
  offline: boolean;
  userId: number;
  userName: string | null;
  folders: FolderItem[];
  organizations: any[];
  users: any[];
  default: boolean;
}
// document stored in the store

export interface DocumentsState {
  files: FileItem[];
  folders: FolderItem[];
  groupDocuments: Group[];

  isLoading: boolean;
  error: string | null;
}
