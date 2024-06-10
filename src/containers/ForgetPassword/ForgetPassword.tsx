import * as React from 'react';
import BackGroundImg from '../../assets/imgs/login/two-factor-authentication.svg';
import styled, { css } from 'styled-components';
import { translate } from '../../utils/translate';
import { palette } from '../../theme/colors';
import { TextField } from '../../components/TextField/TextField';
import { Button } from '../../components/Button/Button';
import UserNameImg from '../../assets/imgs/login/login-username.svg';

import useForm from '../../utils/customHooks/useForm';
import { emailSchema } from '../../utils/validate';
import { forgetPassword } from '../../apis/authAPI';
import { useNavigate } from 'react-router-dom';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import Loader from '../../components/Loader/Loader';
import { Page } from '../../components/Page/Page';

const SPage = styled(Page)`
  display: flex;
  flex-direction: column;
  padding-top: 0;
`;

const SContainer = styled.div``;

interface SInstructionParams {
  isError?: boolean;
}
const SInstruction = styled.p<SInstructionParams>`
  margin-top: 1.5rem;
  margin-left: 1px;
  flex-grow: 1;
  font-size: 0.875rem;

  font-family: 'Roboto-Regular';
  color: ${palette.gainsBoro};
  opacity: 0.55;

  text-align: left;
  width: 100%;
  ${(props) =>
    props.isError &&
    css`
      color: ${palette.tartOrange};
      opacity: 1;
      flex-grow: 0;
    `}
  span {
    color: ${palette.slimyGreen};
  }
`;
const SBackGroundImg = styled.img`
  margin: 0 auto 1rem auto;
  display: block;
`;

const Stitle = styled.h1`
  font-size: 1.125rem;
  padding-left: 4px;
  font-family: 'Roboto-Medium';
  color: ${palette.silverSand};

  margin: 0 auto 1rem auto;
`;

const SForm = styled.form`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
`;
interface STextFieldParams {
  error: boolean;
}

const STextField = styled(TextField)<STextFieldParams>`
  input {
    color: ${palette.white};
    font-family: 'Roboto-Regular';
    font-size: 0.9375rem;
    ${(props) =>
      props.error &&
      css`
        border-color: ${palette.tartOrange};
      `}
  }
  input::placeholder {
    font-size: 0.9375rem;
    font-family: 'Roboto-Regular';
    color: ${palette.grayx11gray};
  }
`;

interface SButtonParams {
  $error?: boolean;
}

const SButton = styled(Button)<SButtonParams>`
  width: 100%;
  margin-bottom: 3.125rem;

  button {
    max-width: 200rem;

    width: 100%;
    font-size: 1rem;
    padding: 0.8125rem 0;
    font-family: 'Roboto-Medium';
    color: ${palette.raisinBlack3};
    ${(props) =>
      props.$error &&
      css`
        opacity: 0.5;
      `}
  }
`;

export interface ForgetPasswordForm {
  email: string;
}

export const ForgetPassword = () => {
  const { inputs, handleChange, errors, handleBlur, touched } =
    useForm<ForgetPasswordForm>({
      initial: {
        email: '',
      },
      validateSchema: {
        email: emailSchema,
      },
    });
  const confirm = useConfirmation();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleChange(e as React.ChangeEvent<HTMLInputElement>);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await forgetPassword({ email: inputs.email });
      setIsLoading(false);
      confirm({
        title: 'login_success',
        description: 'login_forgot_password_success_text',
        onSubmit: () => {
          navigate('/login', { replace: true });
        },
        confirmText: 'done',
      });
    } catch {
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
    <SPage>
      <SContainer>
        <SBackGroundImg
          src={BackGroundImg}
          alt="forget password background image "
        />
        <Stitle>{translate('login_forgot_password')}</Stitle>
      </SContainer>
      {/* login_enterEmail */}
      <SForm onSubmit={handleSubmit}>
        <STextField
          isShadow
          error={!!errors.email}
          StartAdornment={<img src={UserNameImg} alt="username icon" />}
          type="text"
          name="email"
          placeHolderTx="login_email"
          value={inputs.email}
          onChange={onChange}
          onBlur={handleBlur}
          touched={touched.email ?? false}
        />
        {touched.email && errors.email && (
          <SInstruction isError>{errors.email}</SInstruction>
        )}
        <SInstruction>
          <span>*</span> {translate('login_forgot_password_instructions')}
        </SInstruction>

        {inputs.email && !errors.email && (
          <SButton
            // $error={!inputs.email || !!errors.email}
            // disabled={!inputs.email || !!errors.email}
            type="submit"
            tx="next"
          />
        )}
      </SForm>
    </SPage>
  );
};
