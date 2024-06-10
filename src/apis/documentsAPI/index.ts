import { ApiCore } from '../utils/core';
import {
  FileItem,
  FolderItem,
} from '../../containers/Documents/documentsSlice/types';
import { getAntiForgeryToken } from '../authAPI';
import {
  DeleteFileFromFolderProps,
  DeleteFileFromGroupProps,
  RenameFolderProps,
  ToggleOfflineModel,
} from './types';

const url = 'Media';

const ApiMedia = new ApiCore({
  getAll: false,
  getSingle: false,
  post: true,
  put: false,
  patch: false,
  remove: false,
  singleExtra: true,
  url: url,
});
// why any ????
export const setOffline = async (file: any) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ ok?: boolean }>({
    method: 'POST',
    model: file,
    extraResource: `GroupDocument/setoffline`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

// Documents start
export const getFolders = () => {
  return ApiMedia.performExtra<FolderItem[]>({
    method: 'GET',
    extraResource: `Folders`,
  });
};
export const getDocuments = () => {
  return ApiMedia.performExtra<FileItem[]>({
    method: 'GET',
    extraResource: `GroupDocument`,
  });
};
export const createGroupFolders = async (group: object) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ ok?: boolean }>({
    method: 'POST',
    model: group,
    extraResource: `Folders`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const _deleteFolder = async (id: number) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `Folders/${id}/delete`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const _deleteFileFromGroup = async (props: DeleteFileFromGroupProps) => {
  const { groupId, id } = props;
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `GroupDocument/DeleteDocument/${id}/FromGroup/${groupId}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const _deleteFileFromFolder = async (
  props: DeleteFileFromFolderProps
) => {
  const { folderId, id } = props;
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `GroupDocument/${id}/RemoveFromFolder/${folderId}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
// change offline state
export const toggleOffline = async (model: ToggleOfflineModel[]) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `GroupDocument/setoffline`,
    model,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const _renameFolder = async (props: RenameFolderProps) => {
  const { id, name } = props;
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `Folders/${id}/edit`,
    model: { name },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

// ADD DOCUMENT start ============================================

export const addDocumentToGroups = async (
  groupIds: string | number,
  formData: any
) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ id?: number }>({
    method: 'POST',
    model: formData,
    extraResource: `GroupDocument/AddDocumentToGroups/${groupIds}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
export const addDocumentToFolders = async (
  folderIds: string | number,
  formData: any
) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ id?: number }>({
    method: 'POST',
    model: formData,
    extraResource: `Folders/AddDocument/${folderIds}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
export const addDocumentToGroupsAndFolders = async (
  documentID: number,
  folderId: number
) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ id?: number }>({
    method: 'POST',
    extraResource: `GroupDocument/${documentID}/AddToFolder/${folderId}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

// EDIT ACCESS start ===============================================

export const shareDocumentWithMoreGroup = async (
  documentID: number,
  groupID: number
) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `GroupDocument/${documentID}/AddToGroup/${groupID}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
export const shareDocumentWithMoreFolders = async (
  documentID: number,
  folderID: number
) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `GroupDocument/${documentID}/AddToFolder/${folderID}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
export const removeDocumentFromGroup = async (
  documentID: number,
  groupID: number
) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `GroupDocument/DeleteDocument/${documentID}/FromGroup/${groupID}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
export const removeDocumentFromFolder = async (
  documentID: number,
  folderID: number
) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiMedia.performExtra<{ ok?: boolean }>({
    method: 'POST',
    extraResource: `GroupDocument/${documentID}/RemoveFromFolder/${folderID}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
