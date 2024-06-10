import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  SColumnsContainers,
  SInfo,
  SInfoContainer,
  SName,
  SRowContainers,
} from '../../containers/GroupDetail';
import { getImageLink } from '../../utils/formatImageLink';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';

interface IGroupListItemProps {
  name: string;
  memberCount: number;
  hidden: boolean;
  groupID: number;
  imageFileName: string;
  onClick: (groupID: number) => void;
  type: string;
}

const GroupListItem = (props: IGroupListItemProps) => {
  const { name, memberCount, onClick, groupID, imageFileName, type } = props;
  const { t } = useTranslation();
  return (
    <SColumnsContainers onClick={() => onClick(groupID)}>
      <ProfilePicture
        readyPhotoSource={getImageLink({
          imageName: imageFileName,
          size: 'small',
        })}
        profilePictureFileName={''}
        isGroup
      />
      <SRowContainers>
        <SName>{name}</SName>
        <SInfoContainer>
          <SInfo>
            {t(`groups_typeText`)} {type},{' '}
          </SInfo>{' '}
          &#xa0;{' '}
          <SInfo>
            {t(`groups_members`)}: {memberCount}
          </SInfo>
        </SInfoContainer>
      </SRowContainers>
    </SColumnsContainers>
  );
};

export default GroupListItem;
