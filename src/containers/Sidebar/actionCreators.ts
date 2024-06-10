import { batch } from 'react-redux';
import { AppThunk } from '../../store';
import { unloadSkolonButtonScript } from '../../utils/skolon';
import { deleteItem } from '../../utils/storage';
import { resetAlarmSlice } from '../Alarm/AlarmSlice';
import { resetDocumentSlice } from '../Documents/documentsSlice';
import { resetDocumentGroups } from '../GroupsList/groupsSlice';
import { resetUser } from '../Login/LoginSlice';

export const logoutUser = (): AppThunk => async dispatch => {
  deleteItem('user');
  deleteItem('csrf');
  deleteItem('organizationLogo');
  unloadSkolonButtonScript();

  batch(()=>{
    dispatch(resetStores());
    dispatch(resetUser());
  })
};
export const resetStores = (): AppThunk => async dispatch => {
  batch(()=>{
    dispatch(resetDocumentSlice());
    dispatch(resetDocumentGroups());
    dispatch(resetAlarmSlice());
  })
};
