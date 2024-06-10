import axios, { Method } from 'axios';
import { getItem } from '../../utils/storage';
import { handleResponse, handleError } from './response';

// Define your api url from any source.
// Pulling from your .env file when on the server or from localhost when locally
export const BASE_URL = `${process.env.REACT_APP_API_URL}/api`
const csrf = getItem('csrf');

const getAll = <T>(resource: string): Promise<T> => {
  return axios
    .get(`${BASE_URL}/${resource}`, {
      withCredentials: true,
      headers: {
        'X-XSRF-Token': csrf,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const getSingle = <T>(resource: string, id: number): Promise<T> => {
  return axios
    .get(`${BASE_URL}/${resource}/${id}`, {
      withCredentials: true,
      headers: {
        'X-XSRF-Token': csrf,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const post = <T>(resource: string, model: object): Promise<T> => {
  return axios
    .post(`${BASE_URL}/${resource}`, model, {
      withCredentials: true,
      headers: {
        'X-XSRF-Token': csrf,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const put = <T>(resource: string, model: object): Promise<T> => {
  return axios
    .put(`${BASE_URL}/${resource}`, model, {
      withCredentials: true,
      headers: {
        'X-XSRF-Token': csrf,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const patch = <T>(resource: string, model: object): Promise<T> => {
  return axios
    .patch(`${BASE_URL}/${resource}`, model, {
      withCredentials: true,
      headers: {
        'X-XSRF-Token': csrf,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const remove = <T>(resource: string, id: number): Promise<T> => {
  return axios
    .delete(`${BASE_URL}/${resource}`, {
      data: {
        id,
      },
      withCredentials: true,
      headers: {
        'X-XSRF-Token': csrf,
      },
    })
    .then(handleResponse)
    .catch(handleError);
};

const performExtra = <T>(
  method: Method,
  resource: string,
  extraResource: string,
  id?: number,
  modal?: object,
  params?: object,
  buffer?: boolean,
  headers?: any
): Promise<T> => {
  return axios
    .request({
      baseURL: BASE_URL,
      method,
      data: modal,
      params: params,
      url: `${resource}/${id ? id + '/' : ''}${extraResource}`,
      withCredentials: true,
      responseType: buffer ? 'arraybuffer' : 'json',
      headers: {
        'X-XSRF-Token': csrf,
        ...headers,
      },
    })
    .then(res => {
      return handleResponse(res);
    })
    .catch(handleError);
};

export const apiProvider = {
  getAll,
  getSingle,
  post,
  put,
  patch,
  remove,
  performExtra,
};
