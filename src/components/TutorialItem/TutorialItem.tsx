import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getImage } from '../../apis/mediaAPI';
import { palette } from '../../theme/colors';
import { useImage } from '../../utils/customHooks/useImage';
import { SGriditemLink } from '../GridItemLink/SGridItemLink';

export interface ITutorialItemProps {
  title: string | null;
  icon: string | null;
  link: string;
}
export const TutorialItem = (props: ITutorialItemProps) => {
  const { title, icon, link } = props;

  return (
    <SItem to={link}>
      {icon && <img src={icon} alt={title || ''} />}
      <p>{title}</p>
    </SItem>
  );
};

const SItem = styled(SGriditemLink)`
  border: 1px solid ${palette.queenBlue};
  background-color: ${palette.unitedNationsBlue};
  width: 100%;

  img {
    height: 36%;
    margin-bottom: 12%;
    min-width: 0;
    position: relative;
  }

  p {
    font-size: 0.875rem;
    font-family: 'Roboto-Regular';
    color: ${({ theme }) => theme.palette.text.menuPrimary};
    text-align: center;
    text-align-last: center;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
