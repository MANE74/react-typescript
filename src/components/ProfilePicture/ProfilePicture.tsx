import styled from 'styled-components';
import { useImage } from '../../utils/customHooks/useImage';
import userImg from '../../assets/imgs/general/single-place-holder.svg';
import avatar from '../../assets/imgs/general/groups-place-holder.svg';
import { palette } from '../../theme/colors';
interface ProfilePictureProps {
  profilePictureFileName: string | null;
  readyPhotoSource?: string;
  isGroup?: boolean;
  diameter?: number;
  style?: React.CSSProperties;
}

export const ProfilePicture = (props: ProfilePictureProps) => {
  const {
    readyPhotoSource,
    profilePictureFileName,
    isGroup,
    diameter = 45,
    style,
  } = props;

  const noImage = isGroup ? avatar : userImg;

  const { img, isImageLoading } = useImage({
    imageName: profilePictureFileName,
    size: 'small',
  });

  if (readyPhotoSource)
    return (
      <SImg src={readyPhotoSource} alt="" diameter={diameter} style={style} />
    );
  if (!profilePictureFileName && isImageLoading) return <></>;

  if (profilePictureFileName && img !== '') {
    return <SImg src={img} alt="" diameter={diameter} style={style} />;
  } else {
    return (
      <PlaceHolderWrapper
        src={noImage}
        alt=""
        diameter={diameter}
        style={style}
      />
    );
  }
};

interface ImageProps {
  diameter?: number;
}

const SImg = styled.img<ImageProps>`
  border-radius: 9.5rem;
  height: ${props => `${props.diameter}px`};
  width: ${props => `${props.diameter}px`};
  object-fit: cover;
`;

export const PlaceHolderWrapper = styled.img<ImageProps>`
  width: ${props => `${props.diameter}px`};
  height: ${props => `${props.diameter}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${palette.nightSkyBlue};
  border-radius: 999rem;
  padding: 0.5rem;
`;
