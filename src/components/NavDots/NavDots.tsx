import * as React from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
export interface INavDotsProps {
  count: number;
  currentIndex: number;
}

export const NavDots = (props: INavDotsProps) => {
  const { count, currentIndex } = props;
  return (
    <SDotsContainers>
      {Array.from(Array(count).keys()).map(index => (
        <SDot
          key={index.toString()}
          className={index === currentIndex ? 'dot-active' : undefined}
        />
      ))}
    </SDotsContainers>
  );
};

const SDotsContainers = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.625rem;

  .dot-active {
    min-width: 1.75rem;
    background-color: ${palette.honeyYellow};
  }
`;

const SDot = styled.li`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9990px;
  background-color: ${palette.gainsBoro4};

  list-style: none;
`;
