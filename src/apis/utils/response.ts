import { AxiosError, AxiosResponse } from 'axios';
import { checkNetworkAvailabilty } from '../../containers/CheckAppAvailable/helpers';
import { deleteItem } from '../../utils/storage';

export const handleResponse = (response: AxiosResponse) => {
  if (response.data) {
    return response.data;
  }
  return response;
};

export const handleError = (error: AxiosError) => {
  if (error.response) {
    // Request made and server responded
    //can't be read because of missing security headers
    if (
      error.response.status === 401 &&
      error.response.data === 'Invalid CSRF'
    ) {
      checkNetworkAvailabilty({ errorType: 401 });
    }
    // response code 500 or 404
    if (error.response.status === 500 || error.response.status === 404) {
      checkNetworkAvailabilty({ errorType: error.response.status });
    }
  } else if (error.request) {
    // no response at all
    checkNetworkAvailabilty({ errorType: 'MISSING_NETWORK' });
  }
  // check if status is 401 and remove user so we are able to go to login page
  if (error.response?.status === 401) {
    deleteItem('user');
  }
  // all the difrrent type of request fail message that could come from the backend
  if (error.response?.data.Message || error.message) {
    throw error.response?.data.Message || error.message;
  }
  throw error;
};
