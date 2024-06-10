import GroupFolder from '../../assets/imgs/documents/document-group-folder.svg';
import OfflineGroupFolder from '../../assets/imgs/documents/document-offline-group-folder.svg';
import Folder from '../../assets/imgs/documents/document-folder.svg';
import OfflineFolder from '../../assets/imgs/documents/document-offline-folder.svg';
import File from '../../assets/imgs/documents/document-file.svg';
import OfflineFile from '../../assets/imgs/documents/fileCloudYellow.svg';

export type DocumentIconType =
  | 'GROUP_FOLDER'
  | 'OFFLINE_GROUP_FOLDER'
  | 'FOLDER'
  | 'OFFLINE_FOLDER'
  | 'FILE'
  | 'OFFLINE_FILE';

export const documentIcons: Record<DocumentIconType, string> = {
  GROUP_FOLDER: GroupFolder,
  OFFLINE_GROUP_FOLDER: OfflineGroupFolder,
  FOLDER: Folder,
  OFFLINE_FOLDER: OfflineFolder,
  FILE: File,
  OFFLINE_FILE: OfflineFile
};
