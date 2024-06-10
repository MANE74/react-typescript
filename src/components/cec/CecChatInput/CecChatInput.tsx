import * as React from 'react';
import styled, { css } from 'styled-components';
import { palette } from '../../../theme/colors';
import SendIcon from '../../../assets/imgs/cec/cec-send-icon.svg';
import { count } from 'sms-length';

const SChatInputContainer = styled.div`
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  z-index: 15;
  width: 100%;
  height: 5rem;
  background-color: ${palette.prussianBlue2};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0.625rem 1.25rem;
`;
const SContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const STextContainer = styled.form<{ $withMargin?: boolean }>`
  ${props =>
    props.$withMargin &&
    css`
      margin-right: 1.25rem;
    `}
  width: 100%;
`;

const STextInput = styled.input`
  resize: none;
  border-radius: 73px;
  border: none;
  line-height: 1rem;
  background-color: ${palette.ebony};
  color: ${palette.white};
  height: 2.5rem;
  width: 100%;
  padding-left: 0.75rem;
  padding-right: 3.9rem;
  overflow: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  :focus-visible {
    outline: none;
  }
`;

const STextInputWrapper = styled.div`
  position: relative;
`;

const STextCounter = styled.p`
  position: absolute;
  font-family: 'Roboto-Regular';
  right: 0.6875rem;
  top: 50%;
  font-size: 0.5625rem;
  transform: translateY(-50%);
  color: ${palette.gainsBoro3};
`;

const SIcon = styled.button<{ $notValid?: boolean }>`
  border: 0;
  background-color: transparent;
  outline: 0;
  min-width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  ${props =>
    props.$notValid &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
`;

const SFooter = styled.svg`
  width: 135px;
  height: 5px;
  place-self: center;
  border-radius: 5px;
  opacity: 0.4;
`;

export interface ICecChatInputProps {
  onMessageSend: (text: string) => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;

  limit?: number;
  textLenght?: number;
}

export const CecChatInput = (props: ICecChatInputProps) => {
  const { onMessageSend, text, setText, limit, textLenght } = props;

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ـtext = e.target.value;
    if (limit) {
      if (count(ـtext).length <= limit) {
        setText(ـtext);
      }
    } else {
      setText(ـtext);
    }
  };

  React.useEffect(() => {
    if (textLenght && limit) {
      if (textLenght > limit) {
        setText(prev => {
          const cloned = prev;
          return cloned.slice(0, limit - textLenght);
        });
      }
    }
  }, [limit]);

  const notValid =
    limit && textLenght
      ? textLenght === 0 || textLenght > limit
      : text.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMessageSend(text);
  };

  return (
    <SChatInputContainer>
      <SContentContainer>
        <STextContainer $withMargin={!notValid} onSubmit={handleSubmit}>
          <STextInputWrapper>
            <STextInput value={text} onChange={onTextChange} />
            {limit && (
              <STextCounter>
                {textLenght}/{limit}
              </STextCounter>
            )}
          </STextInputWrapper>
        </STextContainer>

        {!notValid && (
          <SIcon $notValid={notValid} onClick={handleSubmit}>
            <img src={SendIcon} alt="send" />
          </SIcon>
        )}
      </SContentContainer>
      <SFooter fill={palette.dustyGray}>
        <rect width="135" height="5" />
      </SFooter>
    </SChatInputContainer>
  );
};
