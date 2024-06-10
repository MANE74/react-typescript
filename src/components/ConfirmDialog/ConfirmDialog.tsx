import * as React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { TextField } from '../TextField/TextField';
import {
  SDialog,
  ModaWraper,
  OvarLay,
  SCacncelButton,
  SConfirmButton,
  Title,
  SButtonWrapper,
  Description,
} from './style';

interface IConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onSubmit?: (text?: string) => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  dismiss: () => void;
  inputBox?: boolean;
  initialInputValue?: string;
  placeholderTx?: string;
  confirmStyle?: 'standard' | 'green' | 'red' | 'fit-big-text';
}

const ConfirmDialog = (props: IConfirmDialogProps) => {
  const {
    isOpen,
    title,
    description,
    onSubmit,
    onCancel,
    confirmText,
    cancelText,
    isLoading,
    dismiss,
    inputBox,
    placeholderTx,
    confirmStyle,
    initialInputValue,
  } = props;

  const { t } = useTranslation();
  const titleTx = title ? t(`${title}`) : null;
  const confirmTx = confirmText ? t(`${confirmText}`) : t('ok');
  const cancelTx = cancelText ? t(`${cancelText}`) : t('cancel');
  const descTx = t(`${description}`);

  let dialogRef = React.useRef<HTMLDivElement>(null);
  const [text, setText] = React.useState<string | undefined>(initialInputValue);

  React.useEffect(() => {
    setText(initialInputValue);
  }, [initialInputValue]);

  React.useLayoutEffect(() => {
    if (document.addEventListener) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      if (document.removeEventListener) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClickOutside = (e: MouseEvent) => {
    if (dialogRef && !dialogRef.current?.contains(e.target as Node)) {
      dismiss();
    }
  };
  const handleSubmit = (text?: string) => {
    if (onSubmit) {
      if (inputBox) {
        if (text) {
          onSubmit(text);
          setText('');
        }
      } else {
        onSubmit();
      }
    }
  };

  return isOpen
    ? ReactDOM.createPortal(
        <React.Fragment>
          <OvarLay />
          <ModaWraper>
            <SDialog ref={dialogRef}>
              <STextContainer>
                {titleTx && <Title>{titleTx}</Title>}
                {description && <Description>{descTx}</Description>}
              </STextContainer>
              {inputBox && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(text);
                  }}
                >
                  <STextField
                    type="text"
                    placeholder={t(`${placeholderTx}`)}
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                  />
                </form>
              )}
              <SButtonWrapper>
                {onCancel && (
                  <SCacncelButton onClick={onCancel}>{cancelTx}</SCacncelButton>
                )}
                {onSubmit && (
                  <SConfirmButton
                    onClick={() => handleSubmit(text)}
                    confirmStyle={confirmStyle}
                  >
                    {confirmTx}
                  </SConfirmButton>
                )}
              </SButtonWrapper>
            </SDialog>
          </ModaWraper>
        </React.Fragment>,
        document.body
      )
    : null;
};

export default ConfirmDialog;

const STextField = styled(TextField)`
  margin-top: 0.625rem;

  input {
    caret-color: black;
    background-color: ${palette.white};
    font-family: 'Roboto-Regular';
    font-size: 1rem;

    ::placeholder {
      color: ${palette.silver};
      font-weight: 400;
      font-size: 1rem;
      font-family: 'Roboto-Regular';
    }
  }
`;

const STextContainer = styled.div`
  padding: 0 2rem;
`;
