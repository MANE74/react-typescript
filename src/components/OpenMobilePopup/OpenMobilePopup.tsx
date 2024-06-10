import * as React from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';

const SBackdrop = styled.div`
  background-color: ${palette.backDrop};
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9996;
  left: 0;
  top: 0;
`;

const SPopup = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9997;
  max-height: 50vh;
  padding: 1.75rem;
  @media (min-width: 450px) {
    padding: 1.875rem 17.5vw;
  }
  background-color: ${palette.prussianBlue2};
  color: ${palette.white};

  border-top-right-radius: 0.325rem;
  border-top-left-radius: 0.325rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

const STitle = styled.p`
  text-align: center;
  font-family: 'Roboto-Medium';
  @media (min-width: 400px) {
    font-size: 1.25rem;
    line-height: 2.5rem;
  }
  font-size: 1rem;
`;

const Slink = styled.a`
  width: 100%;
  @media (min-width: 400px) {
    max-width: 35vw;
  }
  font-size: 1rem;
  padding: 0.875rem 0;
  line-height: 1.18rem;
  font-family: 'Roboto-Medium';
  color: ${palette.raisinBlack3};
  background-color: ${palette.honeyYellow};
  border-radius: 1.56rem;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
`;

const STextButton = styled.p`
  text-decoration: none;
  cursor: pointer;
  color: ${palette.honeyYellow};
`;

export interface IOpenMobilePopupProps {
  link: string;
  onOpenMobileApp: () => void;
  onStayWebApp: () => void;
}

export const OpenMobilePopup = (props: IOpenMobilePopupProps) => {
  const { onOpenMobileApp, link, onStayWebApp } = props;
  return (
    <>
      <SPopup>
        <STitle>{translate('popup_continueInMobile')}</STitle>
        <Slink
          onClick={onOpenMobileApp}
          href={link}
          target="_blank"
          rel="noreferrer noopener"
        >
          {translate('popup_goToMobile')}
        </Slink>
        <STextButton onClick={onStayWebApp}>
          {translate('popup_stayBrowser')}
        </STextButton>
      </SPopup>
      <SBackdrop />
    </>
  );
};
