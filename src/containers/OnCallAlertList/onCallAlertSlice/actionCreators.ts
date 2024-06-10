import _ from 'lodash';
import { batch } from 'react-redux';
import { NavigateFunction } from 'react-router-dom';
import {
  setIsError,
  setOnCallAlertDocument,
  setOnCallAlertList,
  setonCallAlertLoading,
  setShowOnCallAlertBottomModal,
} from '.';
import {
  deleteOnCallAlert,
  endOnCallAlert,
  getOnCallAlertStatuses,
  getReceivedOnCallAlertList,
  getSentOnCallAlertList,
  sendOnCallAlertResponseApi,
} from '../../../apis/onCallAlertApi';
import { AppThunk } from '../../../store';
import { OnCallAlertDocumentSimple } from './types';

const orderMessages = (messages: any) => {
  return messages?.sort((a, b) => {
    const dateA = new Date(a.started.replace(' ', 'T') + 'Z');
    const dateB = new Date(b.started.replace(' ', 'T') + 'Z');

    if (dateB < dateA) {
      return -1;
    }
    if (dateB > dateA) {
      return 1;
    }
    return 0;
  });
};

export const fetchOnCallAlertList = (): AppThunk => async dispatch => {
  try {
    dispatch(setonCallAlertLoading(true));
    const sentOnCallAlert = await getSentOnCallAlertList();
    const receivedOnCallAlert = await getReceivedOnCallAlertList();
    const allMessages = [...sentOnCallAlert, ...receivedOnCallAlert];
    batch(() => {
      dispatch(setOnCallAlertList(orderMessages(allMessages)));
      dispatch(setonCallAlertLoading(false));
    });
  } catch (error) {
    console.log('error log ', error);
    batch(() => {
      dispatch(setonCallAlertLoading(false));
      dispatch(setIsError(`${error}`));
    });
  }
};

export const fetchOnCallAlertDocument =
  (id: number): AppThunk =>
  async dispatch => {
    try {
      dispatch(setonCallAlertLoading(true));
      // dispatch(fetchOnCallAlertList());
      const sentOnCallAlert = await getSentOnCallAlertList();
      const receivedOnCallAlert = await getReceivedOnCallAlertList();
      const allMessages = [...sentOnCallAlert, ...receivedOnCallAlert];
      const currentCallAlert = _.find(allMessages, item => item.id === id);
      const onCallStatuses = await getOnCallAlertStatuses(id);
      const onCallDocument: OnCallAlertDocumentSimple = {
        ...currentCallAlert!,
        users: onCallStatuses,
      };
      batch(() => {
        dispatch(setOnCallAlertDocument(onCallDocument));
        dispatch(setonCallAlertLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setonCallAlertLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const sendOnCallAlertResponse =
  (id: number, status: number): AppThunk =>
  async dispatch => {
    try {
      dispatch(setonCallAlertLoading(true));
      dispatch(setOnCallAlertDocument(null));
      await sendOnCallAlertResponseApi(id, status);
      batch(() => {
        dispatch(fetchOnCallAlertDocument(id));
        dispatch(setonCallAlertLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setonCallAlertLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const setOnCallAlertEnd =
  (id: number): AppThunk =>
  async dispatch => {
    try {
      dispatch(setonCallAlertLoading(true));
      dispatch(setOnCallAlertDocument(null));
      await endOnCallAlert(id);
      batch(() => {
        dispatch(fetchOnCallAlertDocument(id));
        dispatch(setonCallAlertLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setonCallAlertLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const deleteOnCallAlertMessage =
  (id: number, navigate: NavigateFunction): AppThunk =>
  async dispatch => {
    try {
      dispatch(setonCallAlertLoading(true));
      dispatch(setOnCallAlertDocument(null));
      await endOnCallAlert(id);
      await deleteOnCallAlert(id);
      dispatch(fetchOnCallAlertList());
      navigate('/onCallAlert');
      batch(() => {
        dispatch(setOnCallAlertDocument(null));
        dispatch(setonCallAlertLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setonCallAlertLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const toggleOnCallAlertBottomModal =
  (show: boolean): AppThunk =>
  async dispatch => {
    try {
      dispatch(setShowOnCallAlertBottomModal(show));
    } catch (error) {
      console.log('error log ', error);
    }
  };
