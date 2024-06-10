import * as React from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as InfoIcon } from '../../assets/imgs/general/tutorial_info.svg';
import { ReactComponent as CloseIcon } from '../../assets/imgs/general/close_icon.svg';

export interface ITutorialBarProps {
  link: string;
}

const SFlexContainer = styled.div`
  display: flex;
  min-width: 0;
  svg {
    width: 1.375rem;
  }
`;
const TutorialWidth = css`
  width: calc(100% - (${({ theme }) => theme.globalSizes.sideBarWidth}));
`;

const STutorialBar = styled.div`
  display: flex;
  position: fixed;
  z-index: 9999;
  right: 0;

  top: 3.81rem;
  @media (min-width: 450px) {
    top: 4.81rem;
  }

  padding: 1rem 2.5rem;
  ${TutorialWidth}
  height: ${({ theme }) => theme.globalSizes.tutorialBarHeight};
  background-color: ${({ theme }) => theme.palette.background.tutorialBar};

  justify-content: space-between;
  align-items: center;

  svg {
    width: 0.9rem;
  }
`;
const STitle = styled.p`
  font-family: 'Roboto-Regular';
  font-size: 1.125rem;
  margin-left: 0.375rem;
`;

const SSpace = styled.div`
  width: 0.9;
`;

export const TutorialBar = (props: ITutorialBarProps) => {
  const { link } = props;
  return (
    <STutorialBar>
      <SSpace />
      <SFlexContainer>
        <InfoIcon />
        <STitle>How it works?</STitle>
      </SFlexContainer>
      <CloseIcon />
    </STutorialBar>
  );
};
