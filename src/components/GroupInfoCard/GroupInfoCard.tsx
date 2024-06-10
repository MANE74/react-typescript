import React from 'react';
import styled from 'styled-components';
import {
  SRowContainers,
  SName,
  SInfo,
  SInfoContainer,
} from '../../containers/GroupDetail';
import Hidden from '../../assets/imgs/groups/eye-slash.svg';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import { useTranslation } from 'react-i18next';
import { getImageLink } from '../../utils/formatImageLink';

const SGroupContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-height: 3.75rem;
  margin-bottom: 1.25rem;
`;

interface IGroupInfoCardProps {
  name: string;
  membersLength: number;
  hidden: boolean;
  imageFileName: string;
  isAdmin?: boolean;
}

const GroupInfoCard = (props: IGroupInfoCardProps) => {
  const { membersLength, name, hidden, imageFileName, isAdmin } = props;
  const { t } = useTranslation();

  const showMemberCount = hidden ? isAdmin : true;
  //
  return (
    <SGroupContainer>
      <div>
        <ProfilePicture
          profilePictureFileName={''}
          readyPhotoSource={getImageLink({
            imageName: imageFileName,
            size: 'small',
          })}
          isGroup
          diameter={60}
        />
      </div>
      <SRowContainers>
        <SName> {name}</SName>
        <SInfoContainer>
          {showMemberCount && (
            <SInfo>
              {membersLength}{' '}
              {membersLength === 1 ? t('groups_member') : t(`groups_members`)}
            </SInfo>
          )}

          <SInfo>
            {hidden && (
              <>
                {isAdmin && <>&#xa0; </>}
                <img
                  alt=""
                  src={Hidden}
                  style={{
                    verticalAlign: 'text-top',
                    marginRight: 2,
                  }}
                />
                {t('group_hidden')}
              </>
            )}
          </SInfo>
        </SInfoContainer>
      </SRowContainers>
    </SGroupContainer>
  );
};

export default GroupInfoCard;
