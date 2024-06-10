import { getAntiForgeryToken } from '../authAPI';
import { ApiCore } from '../utils/core';
import {
  CalculateSmsLengthRes,
  CecMessagePostType,
  ExternalContact,
  ExternalContactTextTemplate,
  ExternalMessage,
  ExternalMessageDetail,
} from './types';

const url = 'ExternalContacts';

const ApiExtCont = new ApiCore({
  getAll: true,
  getSingle: false,
  post: false,
  put: false,
  patch: false,
  remove: false,
  singleExtra: true,
  url: url,
});

export const fetchExternalMessages = () => {
  return ApiExtCont.performExtra<ExternalMessage[]>({
    method: 'GET',
    extraResource: `GetMessages`,
  });
};

export const fetchExternalMessageDetail = (id: number) => {
  return ApiExtCont.performExtra<ExternalMessageDetail>({
    method: 'GET',
    extraResource: `message/${id}`,
  });
};

export const fetchExternalContact = () => {
  return ApiExtCont.getAll<ExternalContact[]>();
};

export const fetchExternalTextTemplates = () => {
  return ApiExtCont.performExtra<ExternalContactTextTemplate[]>({
    method: 'GET',
    extraResource: `GetTextTemplates`,
  });
};
export const calculateSmsLength = () => {
  return ApiExtCont.performExtra<CalculateSmsLengthRes>({
    method: 'GET',
    extraResource: `CalculateSmsLength`,
  });
};

export const sendCecMessage = async (message: CecMessagePostType) => {
  const csrfToken = await getAntiForgeryToken();

  return ApiExtCont.performExtra<{ ok?: boolean }>({
    extraResource: `SendMessage`,
    method: 'POST',
    model: message,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
