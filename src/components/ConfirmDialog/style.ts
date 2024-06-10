import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';

export const OvarLay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
`;
export const ModaWraper = styled.div`
  position: fixed;
  // top: 120px;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
export const SDialog = styled.div`
  z-index: 100;
  background: ${palette.prussianBlue2};
  position: relative;
  margin: 10rem auto;
  border-radius: 3px;
  width: 23rem;
  padding: 30px 20px;
  text-align: center;
  font-family: 'Roboto-Regular';

  box-shadow: 0px 11px 15px rgba(90, 90, 90, 0.1);
  backdrop-filter: blur(21.7463px);
  /* Note: backdrop-filter has minimal browser support */

  border-radius: 5px;
`;
export const Title = styled.p`
  font-size: 18px;
  font-family: 'Roboto-Medium';
  font-weight: 500;
  margin-bottom: 1rem;
  color: ${palette.white};
`;

export const Description = styled.p`
  color: ${palette.white};
`;

export const SButtonWrapper = styled.div`
  display: flex;
  margin-top: 2rem;
  justify-content: space-evenly;
  width: 100%;
`;

const SButton = styled.button`
  cursor: pointer;
  font-family: 'Roboto-Medium';
  font-size: 16px;
  height: 45px;
  min-width: 7.5rem;
  padding: 0 2rem;
  border: 0;
  border-radius: 25.5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SCacncelButton = styled(SButton)`
  color: ${palette.white};
  background-color: transparent;
  border: 1px solid ${palette.honeyYellow};
`;

export const SConfirmButton = styled(SButton)<{
  confirmStyle?: 'standard' | 'green' | 'red' | 'fit-big-text';
}>`
  color: ${props =>
    props.confirmStyle === 'green'
      ? palette.white
      : props.confirmStyle === 'red'
      ? palette.white
      : palette.raisinBlack3};

  background-color: ${props =>
    props.confirmStyle === 'green'
      ? palette.applGreen
      : props.confirmStyle === 'red'
      ? palette.tartOrange
      : palette.honeyYellow};

  ${props =>
    props.confirmStyle === 'fit-big-text' &&
    css`
      padding: 0 0.7rem;
    `}
`;
