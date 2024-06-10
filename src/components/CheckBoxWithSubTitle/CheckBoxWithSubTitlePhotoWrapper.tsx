import * as React from 'react';
import { useImage } from '../../utils/customHooks/useImage';
import {
  CheckBoxWithSubTitle,
  ICheckBoxWithSubTitleProps,
} from './CheckBoxWithSubTitle';
export interface ICheckBoxWithSubTitlePhotoWrapperProps
  extends Omit<ICheckBoxWithSubTitleProps, 'withPhoto' | 'photoUrl'> {
  imageName?: string;
}

export const CheckBoxWithSubTitlePhotoWrapper = (
  props: ICheckBoxWithSubTitlePhotoWrapperProps
) => {
  const { imageName, ...res } = props;
  const { img } = useImage({ imageName: imageName || '' });

  return <CheckBoxWithSubTitle withPhoto photoUrl={img} {...res} />;
};
