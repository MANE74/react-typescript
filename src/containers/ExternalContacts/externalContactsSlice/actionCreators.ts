import { batch } from 'react-redux';
import {
  setExternalContacts,
  setExternalContactsTextTemplates,
  setExternalMessage,
  setIsError,
  setIsExternalMessagesLoading,
  setSmsLength,
} from '.';
import {
  calculateSmsLength,
  fetchExternalContact,
  fetchExternalMessages,
  fetchExternalTextTemplates,
} from '../../../apis/externalContacts';
import { AppThunk } from '../../../store';

export const getExternalMessages = (): AppThunk => async dispatch => {
  try {
    dispatch(setIsExternalMessagesLoading(true));
    const messages = await fetchExternalMessages();

    batch(() => {
      dispatch(setExternalMessage(messages));
      dispatch(setIsExternalMessagesLoading(false));
    });
  } catch (error) {
    console.log('error log ', error);
    batch(() => {
      dispatch(setIsExternalMessagesLoading(false));
      dispatch(setIsError(`${error}`));
    });
  }
};

export const getExternalContacts = (): AppThunk => async dispatch => {
  try {
    const contacts = await fetchExternalContact();

    batch(() => {
      dispatch(setExternalContacts(contacts));
    });
  } catch (error) {
    console.log('error log ', error);
    batch(() => {
      dispatch(setIsError(`${error}`));
    });
  }
};

export const getExternalContactsTextTemplates =
  (): AppThunk => async dispatch => {
    try {
      const textTemplates = await fetchExternalTextTemplates();

      batch(() => {
        dispatch(setExternalContactsTextTemplates(textTemplates));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const getSmsLenght = (): AppThunk => async dispatch => {
  try {
    const smsLenght = await calculateSmsLength();

    batch(() => {
      dispatch(setSmsLength(smsLenght));
    });
  } catch (error) {
    console.log('error log ', error);
    batch(() => {
      dispatch(setIsError(`${error}`));
    });
  }
};
