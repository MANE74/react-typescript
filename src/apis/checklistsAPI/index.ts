import {
  Checklist,
  ChecklistItem,
} from '../../containers/Checklists/checklistsSlice/types';
import { getAntiForgeryToken } from '../authAPI';
import { ApiCore } from '../utils/core';

const url = 'Checklists';

const ApiChecklists = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  put: false,
  patch: false,
  remove: true,
  singleExtra: true,
  url: url,
});

export const createNewChecklist = async (name: string, userIds?: Array<number>, groupIds?: Array<number>) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiChecklists.performExtra<Checklist>({
    extraResource: '',
    method: 'post',
    model: {
      name,
      userIds,
      groupIds,
    },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const changeItemStatus = async (
  id: number,
  itemId: number,
  completed: boolean
) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiChecklists.performExtra<any>({
    extraResource: `${id}/items/${itemId}`,
    method: 'post',
    model: {
      complete: completed,
    },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const addComment = async (
  id: number,
  itemID: number,
  model: { text: string | null }
) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiChecklists.performExtra<any>({
    extraResource: `${id}/items/${itemID}/comment`,
    method: 'post',
    model: model,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const saveItems = async (
  id: number,
  items: { name: string; sortIndex: number }[]
) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiChecklists.performExtra<any>({
    extraResource: `${id}/edititems`,
    method: 'post',
    model: { items },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const getChecklists = async () => {
  return ApiChecklists.performExtra<Checklist[]>({
    extraResource: '',
    method: 'get',
  });
};

export const getChecklist = async (id: number) => {
  return ApiChecklists.performExtra<any>({
    extraResource: `${id}`,
    method: 'get',
  });
};

export const getChecklistItems = async (id: number) => {
  return ApiChecklists.performExtra<ChecklistItem[]>({
    extraResource: `${id}/items`,
    method: 'get',
  });
};

export const deleteTemplate = async (checklistId: number) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiChecklists.performExtra({
    method: 'DELETE',
    extraResource: `${checklistId}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const endChecklist = async (checklistId: number) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiChecklists.performExtra({
    method: 'POST',
    id: checklistId,
    extraResource: 'end',
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const checklistContinue = async (checklistId: number) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiChecklists.performExtra<any>({
    method: 'POST',
    id: checklistId,
    extraResource: `reactivate`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const startChecklist = async (
  id: number,
  groupIDs: number[],
  newName: string
) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiChecklists.performExtra<any>({
    method: 'POST',
    extraResource: `${id}/start/${groupIDs}`,
    headers: { 'X-XSRF-Token': csrfToken },
    model: {
      newName,
    },
  });
};

export const shareChecklist = async (id: number, groupID: number) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiChecklists.performExtra<any>({
    method: 'POST',
    extraResource: `${id}/sharelive/${groupID}`,
    headers: { 'X-XSRF-Token': csrfToken },
    model: {}
  });
};

export const unshareChecklist = async (id: number, groupID: number) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiChecklists.performExtra<any>({
    method: 'POST',
    extraResource: `${id}/unshare/${groupID}`,
    headers: { 'X-XSRF-Token': csrfToken },
    model: {}
  });
};

export const editChecklist = async (checklistID: number, items: any) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiChecklists.performExtra<any>({
    method: 'POST',
    id: checklistID,
    extraResource: 'edititems',
    model: { items },
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
