import { batch } from 'react-redux';
import { AppThunk } from '../../../store';
import { saveItem } from '../../../utils/storage';
import { I2FAProps } from './types';
import { loginWithCode } from '../../../apis/authAPI';
import { setUser, setIsError } from '../../Login/LoginSlice';

export const fetchLogin2FA =
  (props: I2FAProps): AppThunk =>
  async dispatch => {
    const { code, email, password } = props;
    try {
      const user = await loginWithCode({
        code,
        email,
        password,
      });
      saveItem('user', user);
      batch(() => {
        dispatch(setUser(user));
      });
    } catch (error) {
      console.log('error log ', error);
      batch(() => {
        dispatch(setIsError(error));
      });
    }
  };
