import { batch } from 'react-redux';
import { NavigateFunction } from 'react-router-dom';
import { setIsLoading, setTypes } from '.';
import { getEmergencyTypes } from '../../../apis/authAPI';
import { createMessage } from '../../../apis/chatAPI';
import { saveLocation } from '../../../apis/locationAPI';
import { AppThunk } from '../../../store';
import Geocoder from '../../../utils/geocoder';
import { CreateMessageModel } from '../../Chat/Chat';
import { fetchChats } from '../../ChatsList/chatListSlice/actionCreators';
import { Location } from '../../GroupDetail/groupDetailSlice/types';
import { fetchGroups } from '../../GroupsList/groupsSlice/actionCreators';
import { setIsError, setIsInternalLoading } from '../../Support/supportSlice';
import { EmergencyType } from './types';

export const getEmergencyTypesAction = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));
    const promise = new Promise<EmergencyType[]>(async (resolve,reject)=>{
      const res = await getEmergencyTypes();
      dispatch(fetchGroups(undefined, false, ()=>resolve(res)));
    })

    promise.then((res)=>{
      batch(()=>{
        dispatch(setTypes(res));
        dispatch(setIsLoading(false));
      })
    })
  } catch (error) {
    console.log('error log ', error);
    batch(() => {
      dispatch(setIsInternalLoading(false));
      dispatch(setIsError(`${error}`));
    });
  }
};

export const sendAlarm =
  (
    messageModel: CreateMessageModel,
    location: Location | null,
    navigate: NavigateFunction
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));
      if (location) {
        const result = await Geocoder({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        const locName = result?.addressName
          ? result?.addressName
          : `${location.latitude} | ${location.longitude}`;

        const loc = {
          name: locName,
          latitude: location.latitude,
          longitude: location.longitude,
        };

        const locationResult = await saveLocation(loc);
        messageModel.locationId = locationResult?.id;
      }

      const res = await createMessage(messageModel);
      if (res) {
        batch(() => {
          dispatch(setIsLoading(false));
          dispatch(fetchChats({}));
        });
        navigate(`/message/${res.id}`);
      }
    } catch (error) {
      batch(() => {
        dispatch(setIsInternalLoading(false));
        dispatch(setIsError(`${error}`));
        dispatch(setIsLoading(false));
      });
    }
  };
