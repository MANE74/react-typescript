import * as React from 'react';
import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';
import Drawer from 'react-bottom-drawer';
import { useDropzone } from 'react-dropzone';
import GallaryIcon from '../../assets/imgs/profile/pic-gallery.svg';
import DeleteIcon from '../../assets/imgs/profile/pic-delete.svg';
import { translate } from '../../utils/translate';

const SButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: transparent;

  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.25rem;
  .image-wrapper {
    width: 2.5rem;
    height: 2.5rem;
    aspect-ratio: 1;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${palette.nightSkyBlue};
  }

  img {
  }
`;
const STitle = styled.p`
  font-size: 0.9375rem;
  font-family: 'Roboto-Medium';
  color: ${palette.white};
  text-align: center;
`;

const SButtonsContainer = styled.div<{ $extraButton?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);

  ${props =>
    props.$extraButton &&
    css`
      width: 50%;
    `}
`;

const SDrawerWrapper = styled.div`
  h1 {
    color: ${palette.black};
  }

  .profileDrawer {
    left: 0;
    right: 0;

    margin: auto;
    z-index: 1001;
    @media (min-width: 450px) {
      max-width: 26rem;
      margin: auto;
    }
    background-color: ${palette.prussianBlue2};
    min-height: 25%;
    max-height: 35%;
  }

  .profileDrawer__backdrop {
    z-index: 1000;
  }

  .profileDrawer__handle-wrapper {
  }

  .profileDrawer__handle {
    width: 36%;
  }

  .profileDrawer__content {
  }
`;
export interface IChoosePhotoBottomSheetProps {
  // refactor if we want to choose multiple select
  didChoosePic: (picUrl: string, picFile?: File) => void;
  onDeletePic: () => void;
  choosedPic: boolean;
  isOpen: boolean;
  toggleIsOpen: () => void;
}

export const ChoosePhotoBottomSheet = (props: IChoosePhotoBottomSheetProps) => {
  const { didChoosePic, onDeletePic, choosedPic, isOpen, toggleIsOpen } = props;

  const { open, getInputProps } = useDropzone({
    accept: 'image/*',
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length === 1) {
        // refactor if we want to choose multiple select
        const profileURL = URL.createObjectURL(acceptedFiles[0]);
        // refactor if we want to choose multiple select
        didChoosePic(profileURL, acceptedFiles[0]);
        toggleIsOpen();
      }
    },
  });

  const handleDelete = () => {
    onDeletePic();
    toggleIsOpen();
  };

  return (
    <SDrawerWrapper>
      <Drawer
        className="profileDrawer"
        isVisible={isOpen}
        onClose={toggleIsOpen}
        hideScrollbars
      >
        <SButtonsContainer $extraButton={choosedPic}>
          <SButton onClick={open}>
            <input {...getInputProps()} />
            <div className="image-wrapper">
              <img src={GallaryIcon} alt="GallaryIcon" />
            </div>
            <STitle>{translate('messages_photo_or_video')}</STitle>
          </SButton>

          {choosedPic && (
            <SButton onClick={handleDelete}>
              <div className="image-wrapper">
                <img src={DeleteIcon} alt="DeleteIcon" />
              </div>
              <STitle>{translate('delete')}</STitle>
            </SButton>
          )}
        </SButtonsContainer>
      </Drawer>
    </SDrawerWrapper>
  );
};
