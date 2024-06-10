import { batch } from 'react-redux';
import { NavigateFunction } from 'react-router-dom';
import {
  setIsError,
  setImOkList,
  setImOkLoading,
  setImOkDocument,
  setShowImOkBottomModal,
} from '.';
import {
  deleteIamOk,
  endImOk,
  getImOk,
  getImOkList,
  sendImOkResponseApi,
} from '../../../apis/imOkAPI';
import { AppThunk } from '../../../store';

const orderMessages = (messages: any) => {
  return messages?.sort((a, b) => {
    const dateA = new Date(a.created.replace(' ', 'T') + 'Z');
    const dateB = new Date(b.created.replace(' ', 'T') + 'Z');

    if (dateB < dateA) {
      return -1;
    }
    if (dateB > dateA) {
      return 1;
    }
    return 0;
  });
};

export const fetchImOkList = (): AppThunk => async dispatch => {
  try {
    dispatch(setImOkLoading(true));
    const imOkList = await getImOkList();
    batch(() => {
      dispatch(setImOkList(orderMessages(imOkList)));
      dispatch(setImOkLoading(false));
    });
  } catch (error) {
    console.log('error log ', error);
    batch(() => {
      dispatch(setImOkLoading(false));
      dispatch(setIsError(`${error}`));
    });
  }
};

export const fetchImOkDocument =
  (id: string): AppThunk =>
  async dispatch => {
    try {
      dispatch(setImOkLoading(true));
      const imOk = await getImOk(id);
      batch(() => {
        dispatch(setImOkDocument(imOk));
        dispatch(setImOkLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setImOkLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const sendImOkResponse =
  (id: string, status: boolean, locationID: number | null): AppThunk =>
  async dispatch => {
    try {
      dispatch(setImOkLoading(true));
      dispatch(setImOkDocument(null));
      await sendImOkResponseApi(id, status, locationID);
      const imOk = await getImOk(id);
      batch(() => {
        dispatch(setImOkDocument(imOk));
        dispatch(setImOkLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setImOkLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const setEndImOkResponse =
  (id: string): AppThunk =>
  async dispatch => {
    try {
      dispatch(setImOkLoading(true));
      dispatch(setImOkDocument(null));
      await endImOk(id);
      const imOk = await getImOk(id);
      batch(() => {
        dispatch(setImOkDocument(imOk));
        dispatch(setImOkLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setImOkLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };
export const deleteIamOkMessage =
  (id: number, navigate: NavigateFunction): AppThunk =>
  async dispatch => {
    try {
      dispatch(setImOkLoading(true));
      dispatch(setImOkDocument(null));
      await endImOk(id.toString());
      await deleteIamOk(id);
      dispatch(fetchImOkList());
      navigate('/imOk');
      batch(() => {
        dispatch(setImOkDocument(null));
        dispatch(setImOkLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setImOkLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const toggleImOkBottomModal =
  (show: boolean): AppThunk =>
  async dispatch => {
    try {
      dispatch(setShowImOkBottomModal(show));
    } catch (error) {
      console.log('error log ', error);
    }
  };
