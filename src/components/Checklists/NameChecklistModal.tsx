import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { Backdrop } from '../Backdrop/Backdrop';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { useTranslation } from 'react-i18next';
import { SCacncelButton, SConfirmButton } from '../ConfirmDialog/style';

interface NameChecklistModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onAdd: () => void;
}

function NameChecklistModal(props: NameChecklistModalProps) {
  const { isOpen, setIsOpen, onAdd, text, setText } = props;

  const { t } = useTranslation();
  const layout = useLayoutContext();

  useEffect(() => {
    layout.setTabsState(!isOpen);
  }, [isOpen]);

  if (!isOpen) return <></>;

  return (
    <>
      <SNameChecklistModalContainer>
        <SHeader>
          <rect width="400" height="100" fill={palette.silver} />
        </SHeader>
        <STitle>{t(`checklist_template_new_task`)}</STitle>
        <STextArea value={text} onChange={(e) => setText(e.target.value)} />
        <SButtonContainer>
          <SCacncelButton
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {t(`cancel`)}
          </SCacncelButton>
          <SConfirmButton
            onClick={() => {
              text && onAdd();
              setText('');
            }}
          >
            {t(`add`)}
          </SConfirmButton>
        </SButtonContainer>
      </SNameChecklistModalContainer>
      <Backdrop setModal={setIsOpen} />
    </>
  );
}

export default NameChecklistModal;

const SNameChecklistModalContainer = styled.div`
  position: absolute;
  bottom: 0;
  max-width: 100%;
  height: 362px;
  background-color: ${palette.prussianBlue2};
  z-index: 999;
  width: 26rem;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  padding: 1.5rem 1rem;

  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SHeader = styled.svg`
  width: 135px;
  height: 5px;
  place-self: center;
  border-radius: 5px;
`;

const STitle = styled.p`
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 16px;
  margin: 1.25rem auto 1.25rem 0;
`;

const STextArea = styled.textarea`
  width: 100%;
  flex: 1;
  resize: none;
  border-radius: 12px;
  border: 1px solid ${palette.queenBlue};
  background-color: ${({ theme }) => theme.palette.background.searchBar};
  font-family: 'Roboto-Regular';
  font-size: 1.125rem;
  padding: 1rem;
  color: ${palette.white};

  :focus-visible {
    outline: none;
  }
`;

const SButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 1.25rem;

  button {
    max-width: 10rem;
    width: 100%;
  }
`;
