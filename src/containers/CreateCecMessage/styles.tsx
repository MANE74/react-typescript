import styled from 'styled-components';
import { Button } from '../../components/Button/Button';
import { CheckBoxWithSubTitle } from '../../components/CheckBoxWithSubTitle/CheckBoxWithSubTitle';
import { palette } from '../../theme/colors';

export const SProceedButton = styled(Button)`
  width: 90%;
  margin: auto;
  position: absolute;
  bottom: 30px;
  transform: translateX(-50%);

  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    position: fixed;
    bottom: 15vh;
  }
  left: 50%;
  z-index: 11;
  button {
    width: 100%;
    font-size: 1rem;
    padding: 0.8125rem 0;
    max-width: 100rem;
    text-align: center;
    font-family: 'Roboto-Medium';
    z-index: 2;
    height: 3rem;
    color: ${palette.raisinBlack3};
  }
`;

export const SList = styled.ul`
  width: 90%;
  margin: auto;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 0.5rem; */
  overflow-y: auto;
  height: calc(100%);

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const SCheckBoxWithSubTitle = styled(CheckBoxWithSubTitle)`
  &:first-child {
    padding: 0px 0px 1rem 0px;
  }
  .STitle {
    margin-left: 0rem;
  }
`;
