import * as React from 'react';
import styled from 'styled-components';
import Dots from '../../../assets/imgs/cec/options-dots.svg';
import { palette } from '../../../theme/colors';

const TopCorner = styled.div`
  height: 1.3125rem;
  width: 0.5rem;
  background-color: ${palette.charcoal2};
  justify-content: flex-end;
  border-left-color: transparent;
`;

const TopCornerInner = styled.div`
  height: 21px;
  background-color: ${palette.raisinBlack};
  border-top-right-radius: 0.5rem;
  border-left-color: transparent;
  margin-top: 0;
  min-width: 0.5rem;
  border-top-left-radius: 30px;
  border-top-right-radius: 0;
`;

const SMessageContainer = styled.div`
  position: relative;
  background-color: ${palette.charcoal2};
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;

  min-height: 3rem;

  border-top-right-radius: 0;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const SMainMessageContainer = styled.div`
  position: relative;
  display: flex;
  padding-top: 10px;
  margin-bottom: 10px;
  flex-direction: row;
  max-width: 85%;
`;
const SEditMessageButtonContainer = styled.div<any>`
  z-index: 1;
  margin-top: ${props => props.margin && '4px'};
  position: absolute;
  right: 0.625rem;
  top: 0.625rem;
`;
const SDots = styled.img`
  cursor: pointer;
  float: right;
  padding-top: 0.5rem;
  padding-right: 0.2rem;
`;
const SNamTitle = styled.p`
  font-family: 'Roboto-Bold';
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${palette.cultured};
`;
const SToSubTitle = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 0.625rem;
  line-height: 0.75rem;
  color: ${palette.silver};
`;
const SMessageText = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 0.875rem;
  margin-top: 0.75rem;
  margin-bottom: 1.5rem;
  color: ${palette.white};
`;

const SFooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SWrapper = styled.div`
  padding-right: 1.5rem;
`;
const SAsSubTitle = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 0.625rem;
  margin-right: 1.5rem;

  font-style: italic;
  color: ${palette.silver};
`;
const STime = styled.p`
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 0.5rem;

  color: ${palette.silver};
`;

export interface ICecMessageProps {
  nameTitle: string;
  toSubtitle: string;
  messageText: string;
  asSubTitle: string;
  time: string;
  onDotsClick: () => void;
  className?: string | undefined;
}

export const CecMessage = (props: ICecMessageProps) => {
  const {
    asSubTitle,
    messageText,
    nameTitle,
    onDotsClick,
    time,
    toSubtitle,
    className,
  } = props;
  return (
    <SMainMessageContainer className={className}>
      <SMessageContainer className="SMessageContainer">
        <SWrapper>
          <SEditMessageButtonContainer>
            <SDots src={Dots} alt="" onClick={onDotsClick} />
          </SEditMessageButtonContainer>
          <SNamTitle>{nameTitle}</SNamTitle>
          <SToSubTitle>{toSubtitle}</SToSubTitle>
          <SMessageText>{messageText}</SMessageText>
        </SWrapper>
        <SFooterContainer>
          <SAsSubTitle>{asSubTitle}</SAsSubTitle>
          <STime>{time}</STime>
        </SFooterContainer>
      </SMessageContainer>
      <TopCorner>
        <TopCornerInner />
      </TopCorner>
    </SMainMessageContainer>
  );
};
