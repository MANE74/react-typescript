import React, { useEffect, useState } from 'react';
import {
  SColumnsContainers,
  SInfo,
  SInfoContainer,
  SName,
  SRowContainers,
} from '../../containers/GroupDetail';
import { getDateFormatCustom, dateFormats } from '../../utils/date';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import Eye from '../../assets/imgs/groups/eye.svg';
import { getImageLink } from '../../utils/formatImageLink';

const BASE_URL = `${process.env.REACT_APP_API_URL}`;

interface IGroupMemberItemProps {
  title: string;
  subTitle?: string;
  date?: string;

  memberID: number;

  onClick: (memberID: number) => void;
  photoFileName: string | null;

  isAdmin?: boolean;
  isGroupHidden?: boolean;
}

export const GroupMemberItem = (props: IGroupMemberItemProps) => {
  const {
    title,
    date,
    subTitle,

    onClick,
    memberID,

    photoFileName,

    isAdmin,
    isGroupHidden,
  } = props;

  const handleClick = () => onClick(memberID);
  return (
    <>
      <SColumnsContainers onClick={handleClick}>
        <ProfilePicture
          // TODO make profilePictureFileName not required
          profilePictureFileName=""
          readyPhotoSource={getImageLink({
            imageName: photoFileName,
            size: 'small',
          })}
        />
        <SRowContainers>
          <SInfoContainer>
            <SName> {title}</SName>&nbsp;
            <SInfo>{subTitle}</SInfo>
            {isAdmin && isGroupHidden && (
              <img className="margin-left" src={Eye} alt="hidden" />
            )}
          </SInfoContainer>
          {date && (
            <SInfo>
              {getDateFormatCustom(date, dateFormats.yearMonthDayTimeNoComma24)}
            </SInfo>
          )}
        </SRowContainers>
      </SColumnsContainers>
    </>
  );
};
