import React from 'react';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { ReactComponent as CoSafeLogo } from '../../assets/imgs/general/cosafe-logo.svg';

interface SplashProps {
  className?: string | undefined;
}
const Splash = (props: SplashProps) => {
  const { className } = props;
  return (
    <SplashWrapper className={className}>
      <SplashContainer>
        <CoSafeLogo/>
      </SplashContainer>
    </SplashWrapper>
  );
};

export default Splash;

export const SplashWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  margin: -8px;
  background-color: ${palette.darkblack};
`;

export const SplashContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-width: 26rem;
  width: 100%;
  background-color: ${palette.navyBlue};
`;
