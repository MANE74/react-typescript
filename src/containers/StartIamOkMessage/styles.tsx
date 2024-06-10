import styled, { css } from 'styled-components';
import { Button } from '../../components/Button/Button';
import { SimpleText } from '../../components/Chat/ChatListItem.styles';
import { MessageFilter } from '../../components/Chat/MessageFilter';
// import { SimpleText } from '../../components/ChatListItem/ChatListItem.styles';
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

export const SList = styled.ul<{ $buttonPadding?: boolean }>`
  /* for better shadow  */
  padding: 0 5%;

  ${props =>
    props.$buttonPadding &&
    css`
      padding: 0 5% 15% 5%;
    `}
  margin: auto;
  margin-top: 0.875rem;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 0.5rem; */
  overflow-y: auto;
  height: calc(100% - 4.5rem);

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const SLine = styled.hr`
  margin: 0 0 1px 0;
  height: 1px;
  border: none;
  background-color: ${palette.queenBlue};
  border-radius: 49px;
`;

export const SItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.9375rem 0;
  border-bottom: 1px solid ${palette.queenBlue};

  &.input {
    cursor: default;
  }
  .left {
    width: 5rem;
  }

  cursor: pointer;
`;

export const SInput = styled.input`
  background-color: transparent;
  border: none;
  font-family: 'Roboto-Regular';
  font-size: 0.875rem;
  color: ${palette.white};
  flex-grow: 1;
  margin-right: 1rem;
  :focus-visible {
    outline: none;
  }
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
  }
`;

export const SSimpleText = styled(SimpleText)`
  padding-left: 0;
`;

export const SIcon = styled.img`
  cursor: text;
  vertical-align: text-bottom;
  margin-right: 0.75rem;

  &.pencil {
    cursor: text;
  }
`;

export const SMessageFilter = styled(MessageFilter)`
  position: absolute;
  left: 0;
  right: 0;
  transform: none;
  width: auto;
`;
