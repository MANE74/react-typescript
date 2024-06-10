import React from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';

interface LoaderProps {
  className?: string | undefined;
}
const Loader = (props: LoaderProps) => {
  const { className } = props;
  return (
    <LoaderWrapper className={className}>
      <LoaderContainer>
        <div></div>
      </LoaderContainer>
    </LoaderWrapper>
  );
};

export default Loader;

export const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoaderContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 60px;
    height: 60px;
    margin: 8px;
    border: 3px solid ${palette.honeyYellow};
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${palette.honeyYellow} ${palette.loaderDark}
      ${palette.loaderDark} ${palette.loaderDark};
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
