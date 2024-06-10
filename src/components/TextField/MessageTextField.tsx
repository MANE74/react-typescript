import { ReactNode, SVGProps, useEffect } from 'react';
import styled, { css } from 'styled-components';
import sendIcon from '../../assets/imgs/general/send-icon.svg';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';

interface TextFieldProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'ref'
  > {
  type: 'text' | 'password' | 'email' | 'url';
  touched?: boolean;
  placeHolderTx?: string;
  StartAdornment?: ReactNode | React.FC<SVGProps<SVGAElement>>;
  isShadow?: boolean;
  onSubmit: any;
  setTabBar: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MessageTextField = (props: TextFieldProps) => {
  const {
    type,
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    className,
    placeHolderTx,
    StartAdornment,
    isShadow = false,
    onSubmit,
    setTabBar,
    setIsOpen,
    isOpen,
    ...res
  } = props;

  const i18nPlacholder = placeHolderTx && translate(placeHolderTx);
  const placholderContet = i18nPlacholder || placeholder;

  useEffect(() => {
    setTabBar(!isOpen);
  }, [isOpen, setTabBar]);

  return (
    <>
      <SMessageTextField shadow={isShadow}>
        <SMessageInput
          className={className}
          type="text"
          name={name}
          placeholder={placholderContet}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          {...res}
        />
        <SButton type="button" onClick={onSubmit}>
          <img src={sendIcon} alt="" />
        </SButton>
      </SMessageTextField>
    </>
  );
};

const SMessageTextField = styled.div<{ shadow?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${palette.prussianBlue2};
  padding: 5px 10px;
  ${(props) =>
    props.shadow &&
    css`
      box-shadow: ${props.theme.shadow.primary};
    `}
`;

const SMessageInput = styled.input`
  width: 100%;
  padding: 1rem;
  width: 100%;
  height: 2.5rem;
  background-color: ${palette.ebony};
  border: 1px solid ${palette.ebony};
  border-radius: 2rem;
  font-size: 14px;
  color: ${palette.white};
  &:focus {
    border: 1px solid ${palette.ebony};
    outline: 0;
  }
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px ${palette.ebony} inset;
    -webkit-text-fill-color: ${palette.white};
  }
`;

const SButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin-left: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;
