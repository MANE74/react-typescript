import * as React from 'react';
import styled, { css, Keyframes, keyframes } from 'styled-components';
import Addition from '../../assets/imgs/support/tutorial-addition.svg';
import Substract from '../../assets/imgs/support/tutorial-substract.svg';
import { palette } from '../../theme/colors';

const SButton = styled.button<{ isOpen: boolean }>`
  background: none;
  border: none;

  display: flex;
  flex-direction: row;
  align-items: center;

  max-width: 100%;

  padding: 0.5rem;
  margin-top: 1.25rem;

  p {
    flex-grow: 1;
    margin-left: 0.875rem;

    font-family: 'Roboto-Regular';
    font-size: 0.875rem;
    color: ${palette.white};
    text-align: left;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  img {
    height: 1rem;
    width: 1rem;
  }
`;

const SWrapper = styled.div<{ isOpen: boolean }>`
  margin-left: 1.875rem;
  padding: 0.125rem 0.5rem;
  /* transation  ============= start */
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  ${props =>
    props.isOpen &&
    css`
      max-height: 1000px;
      opacity: 1;
    `};
  transition: all 0.3s ease;
  /* transation  ============= end */
`;
/* // const STextContent = styled.div` */
const STextContent = styled.div<{ isOpen: boolean }>`
  margin-left: 1.875rem;
  padding: 0.125rem 0.5rem;
  /* transation  ============= start */
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  ${props =>
    props.isOpen &&
    css`
      max-height: 1000px;
      opacity: 1;
    `};
  transition: all 0.3s ease;
  /* transation  ============= end */
  p {
    color: ${palette.silver};
    font-family: 'Roboto-Regular';
    font-size: 0.875rem;
    line-height: 22px;
    margin: 0;
  }
`;

const SContainer = styled.div<{ isOpen: boolean }>``;
export interface ICollapsibleCardProps {
  title: string;
  children?: React.ReactNode | React.ReactNode[];
  textContent?: string;
  initialIsOpen?: boolean;
}
export const CollapsibleCard = (props: ICollapsibleCardProps) => {
  const { initialIsOpen = false, children, title, textContent } = props;
  const [isOpen, setIsOpen] = React.useState(initialIsOpen);

  const toggleCollapsed = () => {
    setIsOpen(prev => !prev);
  };

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const contnetRef = React.useRef<HTMLDivElement>(null);

  const renderContent = () =>
    textContent ? (
      <STextContent isOpen={isOpen} ref={contnetRef}>
        <p>{textContent}</p>
      </STextContent>
    ) : (
      <SWrapper isOpen={isOpen} ref={contnetRef}>
        {children}
      </SWrapper>
    );

  return (
    <SContainer isOpen={isOpen}>
      <SButton isOpen={isOpen} ref={buttonRef} onClick={toggleCollapsed}>
        {isOpen ? (
          <img src={Substract} alt="opend" />
        ) : (
          <img src={Addition} alt="closed" />
        )}
        <p>{title}</p>
      </SButton>
      {renderContent()}
    </SContainer>
  );
};
