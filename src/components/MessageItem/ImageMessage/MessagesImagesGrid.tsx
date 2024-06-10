import _ from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import Loader from '../../Loader/Loader';
import ImagesMessagesItem from './ImagesMessagesItem';

export interface MessagesImagesGridProps {
  photoFileNames: string[];
  setIsLightBoxOpen: (img: string | null) => void;
  setKey: React.Dispatch<React.SetStateAction<number>>;
}

function MessagesImagesGrid(props: MessagesImagesGridProps) {
  const { photoFileNames, setIsLightBoxOpen, setKey } = props;

  const [expanded, setExpanded] = useState(false);
  const showMoreImages = photoFileNames.length > 4 && !expanded;

  if (photoFileNames.length === 0) {
    return (
      <SImageLoadingReplacer>
        <Loader />
      </SImageLoadingReplacer>
    );
  }

  return (
    <SGrid>
      {_.map(
        expanded ? photoFileNames : photoFileNames.slice(0, 4),
        (photo, index) => (
          <ImagesMessagesItem
            key={index}
            setIsLightBoxOpen={(img) => {
              setIsLightBoxOpen(img);
              setKey(index);
            }}
            photo={photo}
            imagesLength={photoFileNames.length}
            showMoreImages={showMoreImages && index === 3}
            isLastInList={photoFileNames.length === index + 1}
            expanded={expanded}
            handleExpand={() => setExpanded(true)}
          />
        )
      )}
    </SGrid>
  );
}

const SGrid = styled.div`
  display: grid;
  gap: 6px;
  grid-template-columns: minmax(auto, 50%) minmax(auto, 50%);
  height: 100%;
`;

const SImageLoadingReplacer = styled.div`
  justify-content: center;
  align-items: center;
  height: 290px;
  position: relative;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

export default MessagesImagesGrid;
