import * as React from 'react';
import Like from '../../assets/imgs/iamokay/iamok-like.svg';
import Arrow from '../../assets/imgs/iamokay/iamok-arrow.svg';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { palette } from '../../theme/colors';

const SContaienr = styled.div<{ $ended?: boolean }>`
  cursor: pointer;

  padding: 1.6875rem 2rem 0.6875rem 2rem;

  /* border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px; */

  position: absolute;
  top: -1rem;

  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .margin-right {
    margin-right: 1rem;
  }
  p {
    flex-grow: 1;
  }

  background-color: ${palette.tartOrange};
  ${props =>
    props.$ended &&
    css`
      background-color: ${palette.stormGray};
    `}
`;

export interface IIamOkLinkTopBarProps {
  link: string;
  title: string;
  ended?: boolean;
  onclick?: () => void;

  endSrc?: string;
}

export const ChatScreenTopBar = (props: IIamOkLinkTopBarProps) => {
  const { link, title, ended, onclick, endSrc } = props;
  const navigate = useNavigate();

  const handlClick = () => {
    onclick ? onclick() : navigate(link);
  };

  return (
    <SContaienr onClick={handlClick} $ended={ended}>
      <img className="margin-right" src={endSrc || Like} alt="i am okay" />
      <p className="margin-right">{title}</p>
      <img src={Arrow} alt="i am okay" />
    </SContaienr>
  );
};
