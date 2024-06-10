import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { resetPassword, validateResetToken } from '../../apis/authAPI';
import { TextField } from '../../components/TextField/TextField';
import { palette } from '../../theme/colors';
import userImg from '../../assets/imgs/general/user-login.svg';
import PasswordImg from '../../assets/imgs/login/login-password.svg';

import { translate } from '../../utils/translate';
import useForm from '../../utils/customHooks/useForm';
import { Button } from '../../components/Button/Button';
import { passwordSchema, validateConfirmPassword } from '../../utils/validate';
import Loader from '../../components/Loader/Loader';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { useTranslation } from 'react-i18next';

export interface IResetPasswordProps {
  userId?: string;
  resetToken?: string;
}

export interface ResetPasswordForm {
  password: string;
  repeatPssword: string;
}

const SUserImg = styled.img`
  margin: 2.25rem auto;
  display: block;
  width: 28%;
  border-radius: 9999px;
  box-shadow: ${props => props.theme.shadow.primary};
`;

const STitle = styled.h1`
  font-size: 1.125rem;
  font-family: 'Roboto-Medium';
  color: ${palette.silver};
  text-align: center;
  margin: 1rem auto 0 auto;
`;

const SSubTitle = styled.h2`
  font-size: 0.875rem;
  font-family: 'Roboto-Regular';
  color: ${palette.silver};
  width: 70%;
  line-height: 1.3;
  opacity: 0.5;
  text-align: center;
  margin: 1.25rem auto;
`;
const SError = styled.p`
  font-size: 0.875rem;
  font-family: 'Roboto-Regular';
  color: ${palette.tartOrange};
`;
const SForm = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
  gap: 0.815rem;
`;

interface SButtonParams {
  $error: boolean;
}

const SButton = styled(Button)<SButtonParams>`
  width: 100%;
  margin-top: 2.875rem;
  button {
    max-width: 200rem;

    width: 100%;
    font-size: 1rem;
    padding: 0.8125rem 0;
    font-family: 'Roboto-Medium';
    color: ${palette.raisinBlack3};
    ${props =>
      props.$error &&
      css`
        opacity: 0.5;
      `}
  }
`;

interface STextFieldParams {
  error?: boolean;
}

const STextField = styled(TextField)<STextFieldParams>`
  input {
    color: ${palette.white};
    font-family: 'Roboto-Regular';
    font-size: 0.9375rem;
    font-weight: 400;
    ${props =>
      props.error &&
      css`
        border-color: ${palette.tartOrange};
      `}
  }
  input::placeholder {
    font-size: 0.9375rem;
    font-weight: 400;
    font-family: 'Roboto-Regular';
    color: ${palette.grayx11gray};
  }
`;

export const ResetPassword = (props: IResetPasswordProps) => {
  const { userId, resetToken } = props;
  const confirm = useConfirmation();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();
  const init = async () => {
    if (userId && resetToken) {
      try {
        setIsLoading(true);
        await validateResetToken({
          userId: Number(userId),
          token: resetToken,
        });
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        confirm({
          title: 'warning',
          description: 'login_resetLinkExpired',
          onSubmit: () => {
            navigate('/login', { replace: true });
          },
          confirmText: 'done',
        });
      }
    } else {
      navigate('/login', { replace: true });
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  const validatConformedPass = (value: string, values: ResetPasswordForm) =>
    validateConfirmPassword(value, values['password']);

  const { inputs, handleChange, errors, handleBlur, touched, isValid } =
    useForm<ResetPasswordForm>({
      initial: {
        password: '',
        repeatPssword: '',
      },
      validateSchema: {
        password: passwordSchema,
        repeatPssword: validatConformedPass,
      },
    });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleChange(e as React.ChangeEvent<HTMLInputElement>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      await resetPassword({
        password: inputs.password,
        token: resetToken!,
        userId: Number(userId)!,
      });
      setIsLoading(false);
      confirm({
        title: 'login_success',
        description: 'profile_changed_password_info',
        onSubmit: () => {
          navigate('/login', { replace: true });
        },
        confirmText: 'done',
      });
    } catch (e) {
      setIsLoading(false);
      confirm({
        title: 'warning',
        description: 'general_network_error',
        onSubmit: () => {
          handleSubmit(e);
        },
        confirmText: 'retry',
      });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <SUserImg src={userImg} alt="" />
      <STitle>{translate('login_setUpPassword')}</STitle>
      <SSubTitle>{translate('login_passwordInstruction')}</SSubTitle>
      <SForm onSubmit={handleSubmit}>
        <STextField
          isShadow
          error={!!errors.password}
          StartAdornment={<img src={PasswordImg} alt="password icon" />}
          type="password"
          name="password"
          placeHolderTx="login_password"
          value={inputs.password}
          onChange={onChange}
          onBlur={handleBlur}
          touched={touched.password ?? false}
        />
        {touched.password && errors.password && (
          <SError>{errors.password}</SError>
        )}
        <STextField
          isShadow
          error={!!errors.repeatPssword}
          StartAdornment={<img src={PasswordImg} alt="password icon" />}
          type="password"
          name="repeatPssword"
          placeHolderTx="login_renterPass"
          value={inputs.repeatPssword}
          onChange={onChange}
          onBlur={handleBlur}
          touched={touched.repeatPssword ?? false}
        />
        {touched.repeatPssword && errors.repeatPssword && (
          <SError>{errors.repeatPssword}</SError>
        )}
        <SButton
          $error={!isValid}
          disabled={!isValid}
          type="submit"
          tx={t('create_password_button')}
        />
      </SForm>
    </div>
  );
};
