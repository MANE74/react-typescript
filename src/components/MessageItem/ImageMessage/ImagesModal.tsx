import React from 'react';
import styled from 'styled-components';
import { Modal } from '../../Modal/Modal';

export interface ImagesModalProps {
  imgKey: number;
  isOpen: boolean;
  img: string | null;
  closeModal: () => void;
  handleImageChange?: (imgKey: number, next: boolean) => void;
}

function ImagesModal(props: ImagesModalProps) {
  const { isOpen = false, img, closeModal, handleImageChange, imgKey } = props;

  const handleChangeImage = (index: number) => {
    if (!handleImageChange) return;
    if (index === 1) {
      handleImageChange(imgKey, true);
    } else {
      handleImageChange(imgKey, false);
    }
  };
  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={closeModal}>
        <SImg src={img!} alt="" />
        <SLeft onClick={() => handleChangeImage(-1)} />
        <SRight onClick={() => handleChangeImage(+1)} />
      </Modal>
    </div>
  );
}

const SImg = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
`;

const SNext = styled.div`
  position: absolute;
  height: 100%;
  width: 3rem;
  top: 0;
  cursor: pointer;
`;

const SRight = styled(SNext)`
  right: 0;
`;

const SLeft = styled(SNext)`
  left: 0;
`;

export default ImagesModal;
