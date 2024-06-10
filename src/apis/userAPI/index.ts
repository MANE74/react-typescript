import { SelectListUser } from '../../containers/CreateMessage/createMessageSlice/types';
import { objectToQueryParams } from '../../utils/format';
import { indexInterface } from '../groupsAPI/types';
import { ApiCore } from '../utils/core';
import { UserById } from './types';

const url = 'users';

export interface GetUserQuery extends indexInterface {
  // sort?: "nameAsnc" | "nameDesc";
  sort?: string;
  search?: string;

  locationId?: string;
  skip?: number;

  menuitem?: string;

  limit?: number;
  latitude?: number;
  longitude?: number;
}

const LocationAPI = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  put: false,
  patch: true,
  remove: false,
  singleExtra: true,
  url: url,
});

const userApi = new ApiCore({
  getAll: true,
  getSingle: true,
  post: true,
  put: false,
  patch: true,
  remove: false,
  singleExtra: true,
  url: url,
});

export const getUserById = (id: number) => {
  return userApi.getSingle<UserById>(id);
};

export const getAllUsers = (query?: GetUserQuery) => {
  return LocationAPI.performExtra<SelectListUser[]>({
    method: 'get',
    extraResource: `?${objectToQueryParams(query)}`,
  });
};

export const fetchUserSettings = (userID: number) => {
  return LocationAPI.performExtra<UserById>({
    method: 'GET',
    extraResource: `${userID}`,
  });
};