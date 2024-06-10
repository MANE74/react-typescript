import { ApiCore } from '../utils/core';
import { Location } from '../../containers/GroupDetail/groupDetailSlice/types';
import { LocationResult } from './types';
import { getAntiForgeryToken } from '../authAPI';

const url = 'locations';

const LocationAPI = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  put: false,
  patch: false,
  remove: true,
  singleExtra: true,
  url: url,
});

export const getLocationById = (id: number) => {
  return LocationAPI.getSingle<LocationResult>(id);
};
export const saveLocation = async (location: Location) => {
  const csrfToken = await getAntiForgeryToken();

  return LocationAPI.performExtra<LocationResult>({
    method: 'POST',
    model: location,
    headers: { 'X-XSRF-Token': csrfToken },
    extraResource: '',
  });
};
