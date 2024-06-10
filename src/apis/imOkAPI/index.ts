import {
  ImOkDocument,
  ImOkDocumentSimple,
  ImOkStatus,
} from '../../containers/ImOkList/imOkSlice/types';
import { getAntiForgeryToken } from '../authAPI';
import { ApiCore } from '../utils/core';

const url = 'muster';

const ApiImOk = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  put: false,
  patch: true,
  remove: false,
  singleExtra: true,
  url: url,
});

export const getImOkList = () => {
  return ApiImOk.getAll<ImOkDocument[]>();
};

export const getImOk = (id: string) => {
  return ApiImOk.performExtra<ImOkDocumentSimple>({
    method: 'GET',
    extraResource: id,
  });
};

export const sendImOkResponseApi = async (
  id: string,
  imOk: boolean,
  locationID: number | null
) => {
  const modelNew: ImOkStatus = {
    imok: imOk,
    locationID: locationID,
  };
  const csrfToken = await getAntiForgeryToken();

  return ApiImOk.performExtra<any>({
    method: 'POST',
    extraResource: `${id}/SetStatus`,
    model: modelNew,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const endImOk = async (id: string) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiImOk.performExtra<any>({
    method: 'POST',
    extraResource: `${id}/end`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const deleteIamOk = async (id: number) => {
  const csrfToken = await getAntiForgeryToken();
  return ApiImOk.performExtra<ImOkDocument>({
    method: 'DELETE',
    extraResource: '',
    id,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export interface SendIamOkMessageParams {
  groupIds: number[];
  userIds: number[];
  name: string;
  subject?: string;
}

export const sendIamOkMessage = async (message: SendIamOkMessageParams) => {
  const csrfToken = await getAntiForgeryToken();
  return ApiImOk.performExtra<ImOkDocument>({
    method: 'POST',
    extraResource: '',
    model: message,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export interface EditIamOkMessageParams {
  id: number;
  message: {
    name: string;
    subject?: string;
  };
}

export const editIamOkMessage = async (params: EditIamOkMessageParams) => {
  const csrfToken = await getAntiForgeryToken();
  return ApiImOk.performExtra<ImOkDocument>({
    method: 'POST',
    extraResource: 'edit',
    model: params.message,
    id: params.id,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
