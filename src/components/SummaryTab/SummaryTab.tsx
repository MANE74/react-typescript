import * as React from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';

import Arrow from '../../assets/imgs/cec/summary-right-arrow.svg';
import { isArray } from 'lodash';

const SContainer = styled.div`
  display: flex;
  justify-content: space-between;

  cursor: pointer;

  border-bottom: 1px solid ${palette.queenBlue};

  padding: 0.9375rem 0rem;
`;
const SRightContaoner = styled.div`
  display: flex;
  width: 67%;
  padding-right: 0.75rem;
`;
const SSummaryText = styled.p`
  flex-grow: 1;

  color: ${palette.white};
  font-family: 'Roboto-Medium';
  font-weight: 500;
  font-size: 0.87rem;
  line-height: 1rem;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const STitle = styled.p`
  font-family: 'Roboto-Regular';
  font-size: 0.75rem;
  line-height: 0.875rem;
  color: ${palette.white};

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export interface ISummaryTabProps {
  title: string;
  summaryText: string | string[];
  className?: string | undefined;
  onTabClick: () => void;

  customEndIcon?: string;
}

export const SummaryTab = (props: ISummaryTabProps) => {
  const { onTabClick, summaryText, title, className, customEndIcon } = props;

  const getSummaryText = (summaryText: string | string[]): string => {
    return isArray(summaryText) ? summaryText.join(', ') : summaryText;
  };

  return (
    <SContainer className={className} onClick={onTabClick}>
      <STitle>{title}</STitle>
      <SRightContaoner className={'SRightContaoner'}>
        <SSummaryText>{getSummaryText(summaryText)}</SSummaryText>
        <img src={customEndIcon ? customEndIcon : Arrow} alt="right-arrow" />
      </SRightContaoner>
    </SContainer>
  );
};
