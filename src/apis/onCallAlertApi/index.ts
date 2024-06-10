import {
  OnCallAlertDocument,
  OnCallAlertDocumentSimple,
  OnCallAlertStatus,
  OnCallAlertUser,
} from '../../containers/OnCallAlertList/onCallAlertSlice/types';
import { getAntiForgeryToken } from '../authAPI';
import { ApiCore } from '../utils/core';

const url = 'OnCallAlerts';

const ApiOnCallAlert = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  put: false,
  patch: true,
  remove: false,
  singleExtra: true,
  url: url,
});

export const getSentOnCallAlertList = () => {
  return ApiOnCallAlert.performExtra<OnCallAlertDocument[]>({
    method: 'GET',
    extraResource: `sent`,
  });
};

export const getReceivedOnCallAlertList = () => {
  return ApiOnCallAlert.performExtra<OnCallAlertDocument[]>({
    method: 'GET',
    extraResource: `received`,
  });
};

export const getOnCallAlertStatuses = (id: number) => {
  return ApiOnCallAlert.performExtra<OnCallAlertUser[]>({
    method: 'GET',
    extraResource: `${id}/statuses`,
  });
};

export const sendOnCallAlertResponseApi = async (
  id: number,
  status: number
) => {
  const modelNew: OnCallAlertStatus = {
    status: status,
  };
  const csrfToken = await getAntiForgeryToken();

  return ApiOnCallAlert.performExtra<any>({
    method: 'POST',
    extraResource: `${id}/SetStatus`,
    model: modelNew,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const endOnCallAlert = async (id: number) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiOnCallAlert.performExtra<any>({
    method: 'POST',
    extraResource: `${id}/end`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export const deleteOnCallAlert = async (id: number) => {
  const csrfToken = await getAntiForgeryToken();
  return ApiOnCallAlert.performExtra<OnCallAlertDocument>({
    method: 'DELETE',
    extraResource: '',
    id,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export interface SendOnCallAlertMessageParams {
  groupId: number;
  recipientIDs: number[];
  text: string;
  subject?: string;
}

export const sendOnCallAlertMessage = async (
  message: SendOnCallAlertMessageParams
) => {
  const csrfToken = await getAntiForgeryToken();
  return ApiOnCallAlert.performExtra<OnCallAlertDocument>({
    method: 'POST',
    extraResource: '',
    model: message,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

export interface EditIamOkMessageParams {
  id: number;
  message: {
    text: string;
    subject?: string;
  };
}

export const editOnCallAlertMessage = async (
  params: EditIamOkMessageParams
) => {
  const csrfToken = await getAntiForgeryToken();
  return ApiOnCallAlert.performExtra<OnCallAlertDocument>({
    method: 'POST',
    extraResource: 'edit',
    model: params.message,
    id: params.id,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
