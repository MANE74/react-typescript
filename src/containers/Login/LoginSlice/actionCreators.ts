import { batch } from 'react-redux';
import {
  setUser,
  setIsError,
  setIsLoginLoading,
  setUserById,
  setIsUserByIdLoading,
  setIsUserVerified,
  setUserByIdPhotoUrl,
} from './index';
import { AppThunk } from '../../../store';
import {
  editSecondaryNumber,
  fetchSsoUrl,
  getAccountInfo,
  login as loginAPI,
  ssoLogin as ssoLoginAPI,
  _changeProfileImage,
} from '../../../apis/authAPI';
import { getItem, saveItem } from '../../../utils/storage';
import { getUserById } from '../../../apis/userAPI';
import { getImage } from '../../../apis/mediaAPI';
import { UserById } from '../../../apis/userAPI/types';
import { getSsoRedirectUrl } from '../helpers';
import { loadSkolonButtonScript } from '../../../utils/skolon';
import { logoutUser } from '../../Sidebar/actionCreators';

interface loginProps {
  email: string;
  password: string;
}

export interface ssoLoginProps {
  email: string | null;
  code: string;
  provider?: string;
}

export const login =
  (props: loginProps): AppThunk =>
  async (dispatch) => {
    const { email, password } = props;
    try {
      dispatch(setIsLoginLoading(true));
      const user = await loginAPI({
        email,
        password,
      });
      saveItem('user', user);
      batch(() => {
        dispatch(setUser(user));
        dispatch(setIsLoginLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsLoginLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const updateUser = (): AppThunk => async (dispatch) => {
  try {
    const user = await getAccountInfo();
    saveItem('user', user);
    dispatch(setUser(user));
  } catch (error) {
    console.log('error log ', error);
    batch(() => {
      dispatch(setIsLoginLoading(false));
      // dispatch(setIsError(`${error}`));
      dispatch(logoutUser());
    });
  }
};

export const SsoLogin =
  (props: ssoLoginProps): AppThunk =>
  async (dispatch) => {
    const { email, code, provider } = props;
    try {
      dispatch(setIsLoginLoading(true));
      const user = await ssoLoginAPI({
        email,
        code,
        url: getSsoRedirectUrl(email, provider),
        provider,
      });
      saveItem('user', user);
      loadSkolonButtonScript();
      batch(() => {
        dispatch(setUser(user));
        dispatch(setIsLoginLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsLoginLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const getSsoUrl =
  (email: string | null, provider?: string): AppThunk =>
  async (dispatch) => {
    try {
      var redirect = getSsoRedirectUrl(email, provider);
      if (email) {
        email = encodeURIComponent(email);
      }
      redirect = encodeURIComponent(redirect);

      var url = 'AuthorizationUrl';

      if (email) {
        url += '?email=' + email;
      } else {
        url += '?provider=' + provider;
      }

      url += '&redirectUrl=' + redirect;

      const res = await fetchSsoUrl(url);
      window.location.href = res.url;
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsLoginLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const getCurrentUserById =
  (): AppThunk => async (dispatch, getState) => {
    const currentUserId = getState().user.user?.id;

    if (!currentUserId) {
      dispatch(setUser(getItem('user')));
      dispatch(getCurrentUserById());
      return;
    }
    try {
      dispatch(setIsUserByIdLoading(true));
      const user = await getUserById(currentUserId);
      const imageName =
        user.photoFileName &&
        (await getImage({ imageName: user.photoFileName }));

      batch(() => {
        dispatch(setUserById(user));
        dispatch(setUserByIdPhotoUrl(imageName));
        dispatch(setIsUserByIdLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsError(`${error}`));
        dispatch(setIsUserByIdLoading(false));
      });
    }
  };

export const updateUserFromUserById =
  (userById: UserById): AppThunk =>
  async (dispatch, getState) => {
    const user = getItem('user');
    const updatedUser = {
      ...user,
      photoFileName: userById.photoFileName,
    };
    saveItem('user', updatedUser);
    dispatch(setUser(updatedUser));
  };

export const editSecondaryPhoneNumber =
  (phoneNumber: string): AppThunk =>
  async (dispatch, getState) => {
    const userById: any = getState().user.userById;
    if (!userById) {
      await dispatch(getCurrentUserById());
      dispatch(editSecondaryPhoneNumber(phoneNumber));
      return;
    }
    const phoneNumbers = userById?.phoneNumber.split(',');
    const primPhoneNumber = phoneNumbers && phoneNumbers[0];
    try {
      const user = await editSecondaryNumber({
        phoneNumbers: `${primPhoneNumber}, ${phoneNumber}`,
        userById: userById!,
      });
      batch(() => {
        dispatch(setUserById(user));
      });
    } catch (error) {
      batch(() => {
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const setIsVerifyAction =
  (res: any): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoginLoading(true));
      batch(() => {
        dispatch(setIsUserVerified(res));
        dispatch(setIsLoginLoading(false));
      });
    } catch (error) {
      batch(() => {
        dispatch(setIsLoginLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const changeProfileImage =
  (photoUrl: string | null): AppThunk =>
  async (dispatch, getState) => {
    const userById = getState().user.userById;
    if (!userById) {
      await dispatch(getCurrentUserById());
      dispatch(changeProfileImage(photoUrl));
      return;
    }
    try {
      const user = await _changeProfileImage({
        photoUrl: photoUrl,
        userById: userById!,
      });
      batch(() => {
        dispatch(setUserById(user));
        dispatch(updateUserFromUserById(user));
      });
    } catch (error) {
      batch(() => {
        dispatch(setIsError(`${error}`));
      });
    }
  };
