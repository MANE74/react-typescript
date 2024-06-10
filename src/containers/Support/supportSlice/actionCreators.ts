import { batch } from 'react-redux';
import {
  setIsError,
  setIsInternalLoading,
  setIsTutorialLoading,
  setSupports,
  setTutorials,
  setTutorialsImages,
} from './index';
import { AppThunk } from '../../../store';
import { getSupportInfo } from '../../../apis/authAPI';
import { getImage, Tutorial, _getTutorials } from '../../../apis/mediaAPI';
import { setUser } from '../../Login/LoginSlice';
import { getItem } from '../../../utils/storage';

export const getSupports =
  (errorCallback?: (e: any) => void): AppThunk =>
  async (dispatch, getState) => {
    const organizationID = getState().user.user?.organizationID;
    if (!organizationID) {
      dispatch(setUser(getItem('user')));
      dispatch(getSupports());
      return;
    }
    try {
      dispatch(setIsInternalLoading(true));
      const supports = await getSupportInfo();
      const sortedSupports = supports.sort((a, b) => {
        return a.id === organizationID ? -1 : b.id === organizationID ? 1 : 0;
      });
      batch(() => {
        dispatch(setSupports(sortedSupports));
        dispatch(setIsInternalLoading(false));
      });
    } catch (error) {
      console.log('error log ', error);
      errorCallback && errorCallback(error);
      batch(() => {
        dispatch(setIsInternalLoading(false));
        dispatch(setIsError(`${error}`));
      });
    }
  };

export const getTutorials = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setIsTutorialLoading(true));
    const tutorials = await _getTutorials();
    const imgs = await getTutorialImgs(tutorials);

    batch(() => {
      dispatch(setTutorials(tutorials));
      dispatch(setTutorialsImages(imgs));
      dispatch(setIsTutorialLoading(false));
    });
  } catch (error) {
    batch(() => {
      dispatch(setIsTutorialLoading(false));
      dispatch(setIsError(`${error}`));
    });
  }
};

const getTutorialImgs = async (tutorials: Tutorial[]) => {
  let tempImgArr: string[] = [];
  let tutorial;

  for (tutorial of tutorials) {
    const imgRes = await getImage({
      imageName: tutorial.iconName,
      svg: true,
    });

    if (imgRes) {
      tempImgArr.push(imgRes);
    }
  }

  return tempImgArr;
};
