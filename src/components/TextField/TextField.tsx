import { ReactNode, SVGProps, SyntheticEvent, useState } from 'react';
import styled, { css } from 'styled-components';
import eyePasswordImg from '../../assets/imgs/general/eye-password.svg';
import eyeTextImg from '../../assets/imgs/general/eye-text.svg';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';
const STextField = styled.div<{ shadow?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  ${props =>
    props.shadow &&
    css`
      box-shadow: ${props.theme.shadow.primary};
    `}
  width: 100%;
  border-radius: 0.93rem;
`;

interface SInputParams {
  isPasswordType: boolean;
  isStartAdronment: boolean;
}
const SInput = styled.input<SInputParams>`
  width: 100%;
  padding: 1rem;
  caret-color: ${palette.white};
  ${props =>
    props.isPasswordType &&
    css`
      padding-right: 3.5rem;
    `}
  ${props =>
    props.isStartAdronment &&
    css`
      padding-left: 3rem;
    `}
  background: ${palette.fadedDarkBlue};
  background-color: ${palette.fadedDarkBlue};
  border: 1px solid ${palette.siamiBlue};
  &:focus {
    border: 1px solid ${palette.siamiBlue};
    outline: 0;
  }
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px ${palette.fadedDarkBlue} inset;
    -webkit-text-fill-color: ${palette.grayx11gray};
  }
  border-radius: 0.93rem;
`;
const SButton = styled.button`
  position: absolute;
  background: none;
  border: none;
  right: 1.3rem;
  cursor: pointer;
  img {
    width: 1.31rem;
  }
`;

const SAdronment = styled.div`
  position: absolute;
  position: absolute;
  left: 1.3rem;
  max-width: 1.5rem;
  max-height: 2rem;
  overflow: hidden;
`;

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
}

export const TextField = (props: TextFieldProps) => {
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
    onClick,
    ...res
  } = props;
  const [passwordType, setPasswordType] = useState('password');

  const handleVisibility = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
    } else {
      setPasswordType('password');
    }
  };

  const isStartAdronment = !!StartAdornment;
  const isPasswordType = type === 'password';

  const i18nPlacholder = placeHolderTx && translate(placeHolderTx);
  const placholderContet = i18nPlacholder || placeholder;

  return (
    <STextField shadow={isShadow} className={className} onClick={onClick}>
      {StartAdornment && <SAdronment>{StartAdornment}</SAdronment>}
      <SInput
        isPasswordType={isPasswordType}
        isStartAdronment={isStartAdronment}
        type={isPasswordType ? passwordType : type}
        name={name}
        placeholder={placholderContet}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...res}
      />
      {isPasswordType && (
        <SButton type="button" onClick={handleVisibility}>
          {passwordType === 'text' ? (
            <img src={eyeTextImg} alt="" />
          ) : (
            <img src={eyePasswordImg} alt="" />
          )}
        </SButton>
      )}
    </STextField>
  );
};
