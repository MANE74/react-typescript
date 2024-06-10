import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { changePassword } from '../../apis/authAPI';
import { Button } from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { TextField } from '../../components/TextField/TextField';
import { palette } from '../../theme/colors';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import useForm from '../../utils/customHooks/useForm';
import { translate } from '../../utils/translate';
import { passwordSchema, validateConfirmPassword } from '../../utils/validate';
import { verifyPassword } from '../../apis/authAPI';
import { batch, useDispatch, useSelector } from 'react-redux';
import { setIsVerifyAction } from '../Login/LoginSlice/actionCreators';
import { selectIsUserVerified, setIsLoginLoading } from '../Login/LoginSlice';

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const STitle = styled.h1`
  font-size: 1.125rem;
  font-family: 'Roboto-Medium';
  color: ${palette.white};
  margin: 65px auto 0 auto;
  width: 88%;
`;

const SSubTitle = styled.h2`
  font-size: 0.875rem;
  font-family: 'Roboto-Regular';
  color: ${palette.silver};
  line-height: 1.3;
  margin: 15px auto;
  width: 88%;
`;

const SForm = styled.form`
  display: flex;
  align-items: center;
  flex: 1;
  flex-direction: column;
  width: 90%;
  margin: 1rem auto;
`;

interface STextFieldParams {
  error?: boolean;
  marginTop?: string;
}

const STextField = styled(TextField)<STextFieldParams>`
  input {
    color: ${palette.white};
    font-family: 'Roboto-Regular';
    font-size: 0.875rem;
    margin-top: ${props => props.marginTop};
    ${props =>
      props.error &&
      css`
        border-color: ${palette.tartOrange};
      `}
  }
  input::placeholder {
    font-size: 0.875rem;
    font-family: 'Roboto-Regular';
    color: ${palette.grayx11gray};
  }
`;

const SError = styled.p`
  font-size: 0.875rem;
  font-family: 'Roboto-Regular';
  color: ${palette.tartOrange};
  margin-top: 12px;
`;

interface SButtonParams {
  $error: boolean;
}

const SButton = styled(Button)<SButtonParams>`
  width: 100%;
  margin-top: 0.875rem;
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
        display: none;
      `}
  }
  margin-bottom: 3.5rem;
`;
const SStritchedSpace = styled.div`
  flex-grow: 1;
`;

export interface IChangePasswordProps {}
export interface ChangePasswordForm {
  currentPassword: string;
  password: string;
  repeatPssword: string;
}

export const ChangePassword = (props: IChangePasswordProps) => {
  const {} = props;
  const navigate = useNavigate();
  const location = useLocation();
  const confirm = useConfirmation();
  const dispatch = useDispatch()
  const isVerified = useSelector(selectIsUserVerified)
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const currentPasswordPage = location.pathname === '/change_password';
  const newPasswordPage = location.pathname === '/change_password/new';

  const validatConformedPass = (value: string, values: ChangePasswordForm) =>
    validateConfirmPassword(value, values['password']);

  const validatPass = (value: string, values: ChangePasswordForm) => {
    if (value !== values['currentPassword']) return passwordSchema(value);
    return 'the new password should be diffrent from the current password';
  };

  React.useEffect(()=>{
    dispatch(setIsVerifyAction(true));
  },[])

  React.useEffect(()=>{
    if(newPasswordPage && !inputs.currentPassword){
      navigate('/change_password')
    }
  },[])

  const { inputs, handleChange, errors, handleBlur, touched, isValid } =
    useForm<ChangePasswordForm>({
      initial: {
        currentPassword: '',
        password: '',
        repeatPssword: '',
      },
      validateSchema: {
        password: validatPass,
        repeatPssword: validatConformedPass,
      },
    });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleChange(e as React.ChangeEvent<HTMLInputElement>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPasswordPage) {
      try {
        const res = await verifyPassword ({
          password: inputs.currentPassword,
        });
       batch(() => {
         dispatch(setIsVerifyAction(true));
         dispatch(setIsLoginLoading(false));
       });
       navigate('new');
      } catch (e) {
        dispatch(setIsVerifyAction(false));
      }
    }
    if (newPasswordPage) {
      dispatch(setIsVerifyAction(false))
      try {
        setIsLoading(true);

        const res = await changePassword({
          oldPassword: inputs.currentPassword,
          newPassword: inputs.password,
        });

        setIsLoading(false);
        confirm({
          title: 'login_success',
          description: 'profile_changed_password_info',
          onSubmit: () => {
            navigate(-2);
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
    }
  };

  if (isLoading) return <Loader />;

  return (
    <SContainer>
      {currentPasswordPage && (
        <>
          <STitle>{translate('profile_current_password')}</STitle>
          <SSubTitle>{translate('profile_current_password_title')}</SSubTitle>
        </>
      )}
      {newPasswordPage && (
        <>
          <STitle>{translate('profile_password_title')}</STitle>
          <SSubTitle>{translate('login_passwordInstruction')}</SSubTitle>
        </>
      )}
      <SForm onSubmit={handleSubmit}>
        {currentPasswordPage && (
          <>
            <STextField
              isShadow
              error={!!errors.currentPassword}
              type="password"
              name="currentPassword"
              placeHolderTx={'profile_current_password'}
              value={inputs.currentPassword}
              onChange={onChange}
              onBlur={handleBlur}
              touched={touched.currentPassword ?? false}
            />
            {!isVerified && (
              <SError style={{alignSelf:'flex-start', paddingLeft:'10px'}}>{translate('pw_verify_error')}</SError>
            )}
          </>
        )}

        {newPasswordPage && (
          <>
            <STextField
              isShadow
              error={!!errors.password}
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
            <br />
            <STextField
              isShadow
              error={!!errors.repeatPssword}
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
          </>
        )}
        <SStritchedSpace />
        {newPasswordPage && !inputs.repeatPssword ? true : inputs.currentPassword && (
          <SButton
            $error={currentPasswordPage ? false : !isValid}
            disabled={currentPasswordPage ? false : !isValid}
            type="submit"
            tx={currentPasswordPage ? 'next' : 'save'}
          />
        )}
      </SForm>
    </SContainer>
  );
};
