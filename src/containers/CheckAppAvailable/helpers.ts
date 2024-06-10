import { store } from '../../store';
import { getItem } from '../../utils/storage';
import { setIsOnline } from './checkAppAvailableSlice';
import axios from 'axios';
import { BASE_URL } from '../../apis/utils/provider';

interface CheckNetworkAvailabiltyProps {
  errorType?: 'MISSING_NETWORK' | number;
  checkIfNetworkBack?: boolean;
}

export const checkNetworkAvailabilty = async (
  props: CheckNetworkAvailabiltyProps
) => {
  const { checkIfNetworkBack, errorType } = props;

  try {
    await axios.request({
      baseURL: BASE_URL,
      method: 'GET',
      url: `/account/info`,
      withCredentials: true,
      responseType: 'json',
      headers: {
        'X-XSRF-Token': getItem('csrf'),
      },
    });
    store.dispatch(setIsOnline(true));
  } catch (err) {
    // if (!checkIfNetworkBack) {
    if (err.response) {
      // The client was given an error response (5xx, 4xx)
      if (err.response.status !== 401 && !checkIfNetworkBack) {
        store.dispatch(setIsOnline(false));
      }
      if (err.response.status === 401) {
        store.dispatch(setIsOnline(true));
      }
    } else if (err.request) {
      // The client never received a response, and the request was never left
      if (!checkIfNetworkBack) {
        store.dispatch(setIsOnline(false));
      }
    }
  }
};

export const chackIfNetworkBack = async () => {};
