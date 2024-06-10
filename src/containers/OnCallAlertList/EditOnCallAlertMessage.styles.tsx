import styled, { css } from 'styled-components';
import { Button } from '../../components/Button/Button';
import { Page } from '../../components/Page/Page';
import { palette } from '../../theme/colors';

export const SPage = styled(Page)`
  position: relative;
  height: 100%;
`;
export const SLine = styled.hr`
  margin: 0 0 1px 0;
  height: 1px;
  border: none;
  background-color: ${palette.queenBlue};
  border-radius: 49px;
`;

export const SItem = styled.div<{ $smallFont?: boolean; $textArea?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.6rem 0;

  ${props =>
    props.$textArea &&
    css`
      margin-top: 4px;
      align-items: flex-start;
    `}

  &.input {
    cursor: default;
  }
  .left {
    width: 5rem;
  }
  margin-bottom: 0.3125rem;

  cursor: pointer;
`;

export const SSaveButton = styled(Button)`
  width: 90%;
  margin: auto;
  position: absolute;
  bottom: 30px;
  transform: translateX(-50%);
  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    position: fixed;
    // if bottom bar
    /* bottom: 15vh; */
    bottom: 3vh;
  }
  left: 50%;
  z-index: 11;
  button {
    width: 100%;
    max-width: 100rem;

    font-size: 1rem;
    padding: 0.8125rem 0;
    text-align: center;
    font-family: 'Roboto-Medium';
    z-index: 2;
    height: 3rem;
    color: ${palette.raisinBlack3};
  }
`;

export const SInput = styled.input`
  background-color: transparent;
  border: none;
  font-family: 'Roboto-Regular';
  color: ${palette.white};
  :focus-visible {
    outline: none;
  }
  outline: none;
  padding: 0px;
  flex-grow: 1;
  margin-right: 1.875rem;
  font-size: 0.875rem;

  ::placeholder {
    color: ${palette.silver};
    font-size: 0.875rem;
    opacity: 1;
  }

  :-ms-input-placeholder {
    color: ${palette.silver};
    font-size: 0.875rem;
  }

  ::-ms-input-placeholder {
    color: ${palette.silver};
    font-size: 0.875rem;
    line-height: 1.125rem;
  }
`;

export const STextArea = styled.textarea`
  resize: none;

  background-color: transparent;
  border: none;
  font-family: 'Roboto-Regular';
  font-size: 0.75rem;
  color: ${palette.white};
  ::placeholder {
    color: ${palette.silver};
    font-size: 0.75rem;

    opacity: 1;
  }

  :-ms-input-placeholder {
    color: ${palette.silver};
    font-size: 0.75rem;
  }

  ::-ms-input-placeholder {
    color: ${palette.silver};
    font-size: 0.75rem;
    line-height: 1.125rem;
  }

  flex-grow: 1;
  margin-right: 1.875rem;

  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  outline: none;
  padding: 0px 0px 10px 0;
`;

export const STitle = styled.p`
  color: ${palette.white};
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 0.875rem;

  width: 4.875rem;
`;

export const SIcon = styled.img`
  vertical-align: text-bottom;
  margin-right: 0.75rem;
  width: 0.75rem;
  height: 0.75rem;
`;
