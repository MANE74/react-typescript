import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';
import { Button } from '../Button/Button';
import { CheckBoxWithSubTitle } from '../CheckBoxWithSubTitle/CheckBoxWithSubTitle';
import { SearchBarBase } from '../SearchBarBase/SearchBarBase';

export const SFilter = styled.div`
  position: absolute;
  padding: 20px;
  background-color: ${palette.prussianBlue2};
  max-height: 75vh;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 1001;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
`;

export const SFooter = styled.svg`
  width: 135px;
  height: 15px;

  max-height: 12px;
  margin-top: 1.375rem;
  place-self: center;
  border-radius: 5px;
  opacity: 0.4;
`;

export const STitle = styled.h1`
  margin-bottom: 1.25rem;
  margin-left: 2px;
  text-align: left;
  font-size: 1rem;
  font-family: 'Roboto-Medium';
  color: ${palette.white};
  line-height: 19px;
`;
export const SList = styled.ul<{ $isRound?: boolean }>`
  margin-top: 2.56rem;
  padding-bottom: 0.5rem;

  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${(props) =>
    props.$isRound &&
    css`
      gap: 2.56rem;
    `}

  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

interface SButtonParams {
  $valid?: boolean;
}

export const SButton = styled(Button)<SButtonParams>`
  width: 100%;
  margin-top: 0.8125rem;
  button {
    width: 100%;
    font-size: 1rem;
    padding: 0.8125rem 0;
    max-width: 100rem;
    font-family: 'Roboto-Medium';
    color: ${palette.raisinBlack3};
    ${(props) =>
      props.$valid &&
      css`
        opacity: 0.5;
        cursor: not-allowed;
      `}
  }
`;

export const SSearchBarBase = styled(SearchBarBase)`
  input {
  }
  input::placeholder {
    font-size: 1rem;
    vertical-align: middle;
  }
`;

export const SHeader = styled.svg`
  width: 135px;
  max-height: 5px;
  flex: 1;
  place-self: center;
  margin-bottom: 1.875rem;
  border-radius: 5px;
`;

export const SCheckBoxTitle = styled(CheckBoxWithSubTitle)`
  .STitle {
    margin-left: 0px;
  }
`;
