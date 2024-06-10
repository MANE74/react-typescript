import _ from 'lodash';
import userImg from '../../assets/imgs/general/single-place-holder.svg';
import avatar from '../../assets/imgs/general/groups-place-holder.svg';
import { PlaceHolderWrapper, ProfilePicture } from './ProfilePicture';
import styled from 'styled-components';
interface ProfilePictureRowProps {
  profilePictureFileNames: string[];
  isGroup?: boolean;
  diameter?: number;
}

export const ProfilePictureRow = (props: ProfilePictureRowProps) => {
  const { profilePictureFileNames, isGroup, diameter = 45 } = props;

  const noImage = isGroup ? avatar : userImg;
  if (!_.isEmpty(profilePictureFileNames)) {
    return (
      <SRowContainer
        diameter={diameter}
        length={profilePictureFileNames.length}
      >
        {profilePictureFileNames.map((img, key) => (
          <ProfilePicture
            key={key}
            profilePictureFileName={img}
            diameter={diameter}
            isGroup={isGroup}
            style={{
              zIndex: profilePictureFileNames.length - key,
            }}
          />
        ))}
      </SRowContainer>
    );
  } else {
    return <PlaceHolderWrapper src={noImage} alt="" diameter={diameter} />;
  }
};

const SRowContainer = styled.div<any>`
  display: flex;
  position: relative;
  height: ${(props) => `${props.diameter}px`};
  min-width: ${(props) => `${props.diameter}px`};
  * + * {
    margin-left: -2.35rem;
  }
`;
