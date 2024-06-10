import * as React from 'react';
import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';

const STextField = styled.div<{ 
  shadow?: boolean; 
  hasError?: boolean 
}>`
  position: relative;
  ${props =>
    props.shadow &&
    css`
      box-shadow: ${props.theme.shadow.primary};
    `}
  width: 100%;
  display: flex;
  input {
    color: ${props => props.hasError ? palette.danger : palette.white};
    font-family: 'Roboto-Regular';
    font-size: 0.93rem;
  }
  input::placeholder {
    font-size: 0.93rem;
    font-family: 'Roboto-Regular';
    color: ${palette.grayx11gray};
  }
`;

interface SInputParams {
  isEndAdronment?: boolean;
  hasError?: boolean;
}
const SInput = styled.input<SInputParams>`
  width: 100%;
  padding: 1rem;
  ${props =>
    props.isEndAdronment &&
    css`
      padding-right: 3.5rem;
    `}

  background: ${palette.fadedDarkBlue};
  background-color: ${palette.fadedDarkBlue};
  border: 1px solid ${props => props.hasError ? palette.danger : palette.siamiBlue};
  &:focus {
    border: 1px solid ${props => props.hasError ? palette.danger : palette.siamiBlue};
    outline: 0;
  }
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px ${palette.fadedDarkBlue} inset;
    -webkit-text-fill-color: ${palette.grayx11gray};
  }
  border-radius: 0 0.93rem 0.93rem 0;

  /* color: ${props => props.theme.palette.text.inputPrimary}; */

  color: ${palette.white};
  font-family: 'Roboto-Regular';
`;

const SAdronment = styled.div`
  position: absolute;
  top: 50%;
  right: 1.3rem;
  max-width: 2rem;
  max-height: 2rem;
  overflow: hidden;
  transform: translateY(-50%);
`;
export interface ICountryCodeTextFieldProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'ref' | 'onClick'
  > {
  placeHolderTx?: string;
  EndAdornment?: React.ReactNode | React.FC<React.SVGProps<SVGAElement>>;
  StartAdornment?: React.ReactNode | React.FC<React.SVGProps<SVGAElement>>;
  onClick?: () => void;
  hasError?: boolean;
}

export const CountryCodeTextField = (props: ICountryCodeTextFieldProps) => {
  const {
    onChange,
    onBlur,
    onClick,
    value,
    name,
    className,
    type,
    placeHolderTx,
    placeholder,
    EndAdornment,
    StartAdornment,
    hasError= false,
    ...res
  } = props;

  const i18nPlacholder = placeHolderTx && translate(placeHolderTx);
  const placholderContet = i18nPlacholder || placeholder;
  return (
    <STextField onClick={onClick} hasError={hasError}>
      {StartAdornment && StartAdornment}
      <SInput
        isEndAdronment={!!EndAdornment}
        className={className}
        type={type}
        name={name}
        placeholder={placholderContet}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...res}
        hasError={hasError}
      />
      {EndAdornment && <SAdronment>{EndAdornment}</SAdronment>}
    </STextField>
  );
};
