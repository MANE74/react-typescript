import React from 'react';
import styled from 'styled-components';
import { palette } from '../../../theme/colors';

export interface ImagesMessagesItemProps {
  photo: string;
  setIsLightBoxOpen: (img: string | null) => void;
  handleExpand: () => void;
  imagesLength: number;
  showMoreImages: boolean;
  isLastInList: boolean;
  expanded: boolean;
}

function ImagesMessagesItem(props: ImagesMessagesItemProps) {
  const {
    photo,
    setIsLightBoxOpen,
    imagesLength,
    showMoreImages,
    isLastInList,
    expanded,
    handleExpand,
  } = props;

  const onImagesTap = () => {
    if (showMoreImages && !expanded) {
      handleExpand();
    } else {
      setIsLightBoxOpen(photo);
    }
  };

  const singleImage = imagesLength === 1;
  const twoImages = imagesLength === 2;
  const lastInThree = imagesLength === 3 && isLastInList;

  const moreImagesLength = imagesLength - 4;
  const showWideImage =
    (imagesLength % 2 !== 0 && isLastInList) || imagesLength === 1;
  const imageWideDivider = showWideImage ? 1 : 2;
  const showHideImage = imagesLength === 1 || imagesLength === 2;

  return (
    <SGridItem
      singleImage={singleImage}
      twoImages={twoImages}
      lastInThree={lastInThree}
      onClick={onImagesTap}
    >
      {photo && (
        <SImageContainer>
          <SImage src={photo} alt="" backdrop={showMoreImages} />
          {showMoreImages && (
            <SMoreImagesText>{`+${moreImagesLength.toString()}`}</SMoreImagesText>
          )}
        </SImageContainer>
      )}
    </SGridItem>
  );
}

const SGridItem = styled.div<any>`
  cursor: pointer;
  border-radius: 3px;
  overflow: hidden;
  width: 100%;
  grid-area: ${(props) =>
    props.singleImage
      ? '1/1/span1/span2'
      : props.lastInThree
      ? '2/1/span 1 / span 2'
      : ''};
  height: ${(props) =>
    props.singleImage
      ? '100%'
      : props.twoImages
      ? '140px'
      : props.lastInThree
      ? '120px'
      : '80px'};
`;

const SImageContainer = styled.div`
  height: 100%;
  position: relative;
`;

const SImage = styled.img<any>`
  object-fit: cover;
  width: 100%;
  height: 100%;
  max-height: 24rem;
  filter: ${(props) => props.backdrop && 'brightness(0.45)'};
`;

const SMoreImagesText = styled.p`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: ${palette.white};
  font-size: 34px;
  font-family: 'Roboto-Regular';
  font-weight: 400;
`;

export default ImagesMessagesItem;
