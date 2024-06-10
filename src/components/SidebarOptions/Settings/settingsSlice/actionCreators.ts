import { batch } from 'react-redux';
import { setIsSettingsLoading, setUserAccount } from '.';
import { savePreferredLanguage, setUserSettings } from '../../../../apis/authAPI';
import { fetchUserSettings } from '../../../../apis/userAPI';
import { updateUser } from '../../../../containers/Login/LoginSlice/actionCreators';
import { ELanguages } from '../../../../i18n';
import { AppThunk } from '../../../../store';
import { saveItem } from '../../../../utils/storage';
import { SettingsType } from './types';

export const getUserAccountInfo =
  (userID: number): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsSettingsLoading(true));
      const res = await fetchUserSettings(userID);
      if (res) {
        batch(() => {
          dispatch(setUserAccount(res));
          dispatch(setIsSettingsLoading(false));
        });
      }
    } catch (error) {
      dispatch(setIsSettingsLoading(false));
      console.log('error log ', error);
    }
  };

  export const saveSettings =
  (settings: SettingsType, onSuccess: ()=>void): AppThunk =>
  async (dispatch, getState) => {
    try {
      const data = {
        notifyWithEmail: settings.notifyWithEmail,
        notifyChecklists: settings.notifyChecklists,
        notifyDocuments: settings.notifyDocuments,
        phoneNumber: getState().settings.account?.phoneNumber,
        photoFileName: getState().settings.account?.photoFileName,
        displayName: getState().settings.account?.displayName,
      }
      const res = await setUserSettings(data);
      if (res) {
        onSuccess();
      }
    } catch (error) {
      console.log('error log ', error);
    }
  };

  export const setLanguage =
  (lang: ELanguages, onSuccess?: ()=>void): AppThunk =>
  async (dispatch) => {
    try {
      const res = await savePreferredLanguage(lang);
      if (res) {
        dispatch(updateUser())
        saveItem('language', lang);
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.log('error log ', error);
    }
  };
