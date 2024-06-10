import * as React from 'react';
import styled from 'styled-components';
import { Group } from '../../containers/GroupsList/groupsSlice/types';
import { palette } from '../../theme/colors';
import { useImage } from '../../utils/customHooks/useImage';
import { GroupType, groupTypeNames } from '../../utils/enums';
import { translate } from '../../utils/translate';
import {
  CheckBoxWithSubTitle,
  ICheckBoxWithSubTitleProps,
} from '../CheckBoxWithSubTitle/CheckBoxWithSubTitle';

const SCheckBoxWithSubTitle = styled(CheckBoxWithSubTitle)`
  .STitle {
    font-family: 'Roboto-Regular';
  }
`;
export interface IIamOkGroupSelectItemProps
  extends Omit<ICheckBoxWithSubTitleProps, 'title' | 'valueId'> {
  group: Group;
  withSubtitle?: boolean;
}

export const IamOkGroupSelectItem = (props: IIamOkGroupSelectItemProps) => {
  const { group, selected, onToggleCheck, withSubtitle, ...res } = props;

  const { img } = useImage({ imageName: group.imageFileName });
  const isNotNormal =
    group.groupType === GroupType.Hidden ||
    group.groupType === GroupType.CrossOrg ||
    group.groupType === GroupType.CoAlert;
  return (
    <SCheckBoxWithSubTitle
      withPhoto
      selected={selected}
      photoUrl={img}
      subTitle={
        withSubtitle
          ? isNotNormal
            ? translate(groupTypeNames[group.groupType as GroupType])!
            : group.groupMembersCount.toString() +
              ' ' +
              translate('groups_members')!
          : undefined
      }
      title={group.name}
      valueId={group.id}
      onToggleCheck={onToggleCheck}
      separatorColor={palette.prussianBlue4}
      clickAll
      {...res}
    />
  );
};
