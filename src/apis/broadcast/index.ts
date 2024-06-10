import { getAntiForgeryToken } from '../authAPI';
import { ApiCore } from '../utils/core';

const url = '';

const broadcastAPI = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  put: false,
  patch: true,
  remove: false,
  singleExtra: true,
  url,
});

// Get organizations
export const getOrganizations = async () => {
  return broadcastAPI.performExtra<any[]>({
    method: 'GET',
    extraResource: `messages/broadcast/organizations`,
  });
};

// Post broadcast messages
export interface broadcastParams {
  Type?: number | undefined;
  organizationID?: number;
  subOrganizationID?: number;
  text: string | undefined;
  subject?: string | null;
  photoFileNames?: string[] | string;
  documentFileNames?: string[] | string;
  locationID?: string | number;
}

// Post broadcast message
export const postBroadcastMessage = async (data: broadcastParams) => {
  const csrfToken = await getAntiForgeryToken();
  return broadcastAPI.performExtra({
    method: 'POST',
    extraResource: 'messages/broadcast/organization',
    model: data,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};

// Get broadcast message
export const getBroadcastMessage = async (id: number) => {
  return broadcastAPI.performExtra<any>({
    method: 'GET',
    extraResource: `messages/${id}`,
  });
};

// Delete broadcast message
export const deleteBroadastMessage = async (id: number) => {
  const csrfToken = await getAntiForgeryToken();

  return broadcastAPI.performExtra<any>({
    method: 'DELETE',
    extraResource: `messages/${id}`,
    headers: { 'X-XSRF-Token': csrfToken },
  });
};
