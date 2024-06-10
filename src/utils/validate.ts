import { translate } from './translate';

export interface ValidateProps {
  value: string;
  values: any;
  validator: (input: any, values: any) => string | null;
}

export const validate = (props: ValidateProps): string | null => {
  const { validator, value, values } = props;
  return validator(value, values);
};

export const emailSchema = (input: string): string | null => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!input) {
    return translate('login_enterEmail');
  } else if (!emailRegex.test(input)) {
    return translate('login_enterValidEmail');
  } else {
    return null;
  }
};

export const passwordSchema = (input: string): string | null => {
  const passwordCapital = /^(?=.*[A-Z]).+$/;
  const passwordSpecialCharacter = /^(?=.*[@$!%*?&-.]).+$/;
  const passowrdDigits = /^(?=.*\d).+$/;
  const passowrd10characters = /^[A-Za-z\d@$!%*?&-.]{10,}$/;
  if (!input) {
    return translate('login_PasswordMissing');
  } else if (!passwordCapital.test(input)) {
    return translate('login_passwordMissingUppercase');
  } else if (!passwordSpecialCharacter.test(input)) {
    return translate('login_passwordMissingSpecialChar');
  } else if (!passowrdDigits.test(input)) {
    return translate('login_passwordMissingNumber');
  } else if (!passowrd10characters.test(input)) {
    return translate('login_password10Char');
  } else {
    return null;
  }
};

export const validateConfirmPassword = (
  confirmedPassword: string,
  originalPassword: string
): string | null => {
  if (!originalPassword) {
    return translate('login_PasswordMissing');
  } else if (!confirmedPassword) {
    return translate('login_confirmPassword');
  } else if (confirmedPassword !== originalPassword) {
    return translate('login_passwordWrongConfirmation');
  } else {
    return null;
  }
};
