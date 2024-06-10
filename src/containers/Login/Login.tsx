import { useDispatch, useSelector } from 'react-redux';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Page } from '../../components/Page/Page';
import useForm from '../../utils/customHooks/useForm';
import { getItem } from '../../utils/storage';
import { login, getSsoUrl, SsoLogin } from './LoginSlice/actionCreators';
import userImg from '../../assets/imgs/login/two-factor-authentication.svg';
import UserNameImg from '../../assets/imgs/login/login-username.svg';
import PasswordImg from '../../assets/imgs/login/login-password.svg';
import { Button } from '../../components/Button/Button';
import { TextField } from '../../components/TextField/TextField';
import { emailSchema } from '../../utils/validate';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';
import {
  selectLoginError,
  selectLoginIsLoading,
  setAlertMessage,
  setIsError,
} from './LoginSlice';
import Loader from '../../components/Loader/Loader';
import { useEffect } from 'react';
import { getFragmentParams } from './helpers';
import _ from 'lodash';
import { setEmail, setPassword } from '../Login2fa/Login2faSlice';

interface LoginProps {
  mode?: 'login' | 'sso';
}

export const Login = (props: LoginProps) => {
  const { mode = 'login' } = props;

  const isLogin = mode === 'login';
  const isSso = mode === 'sso';
  const { inputs, handleChange, errors, handleBlur, touched, isValid } =
    useForm<LoginForm>({
      initial: {
        email: '',
        password: '',
      },
      validateSchema: {
        email: emailSchema,
      },
    });

  const dispatch = useDispatch();
  const loginError = useSelector(selectLoginError);
  const isLoading = useSelector(selectLoginIsLoading);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    var sso = searchParams.get('sso'); // Email address
    const ssoProvider = searchParams.get('sso_provider');
    var code = searchParams.get('code');
    const error = searchParams.get('error');
    var mobile: string | number | null = searchParams.get('mobile');
    const fragmentParams = getFragmentParams();

    if (searchParams.toString() === '' && _.isEmpty(fragmentParams)) {
      return;
    }

    if (!code) {
      if (!_.isEmpty(fragmentParams) && fragmentParams.id_token) {
        code = fragmentParams.id_token;
      }
    }

    if (!sso) {
      if (!_.isEmpty(fragmentParams) && fragmentParams.state) {
        // This is intentional because it was encoded twice.
        sso = decodeURIComponent(
          decodeURIComponent(fragmentParams.state)
        ).substring(4);
      }
    }

    // It does not get encoded correctly in some cases
    if (sso && sso.endsWith('&mobile=1')) {
      mobile = 1;
      sso = sso.slice(0, -9);
    }

    if (sso && code && !mobile) {
      dispatch(SsoLogin({ code, email: sso }));
    }

    if (ssoProvider && code && !mobile) {
      dispatch(SsoLogin({ email: null, code, provider: ssoProvider }));
    }

    if (sso && mobile) {
      // Redirect to mobile app
      var path = '&sso=' + sso;

      if (code) {
        path += '&code=' + code;
      }

      if (ssoProvider) {
        path += '&sso_provider=' + ssoProvider;
      }

      if (error) {
        path += '&error=' + error;
      }

      window.location.href =
        process.env.REACT_APP_OPEN_MOBILE_APP + encodeURIComponent(path);
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(setAlertMessage(true));
    dispatch(setEmail(''));
    dispatch(setPassword(''));
    dispatch(setIsError(null));
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      dispatch(login({ email: inputs.email, password: inputs.password }));
    }
    if (isSso) {
      dispatch(getSsoUrl(inputs.email));
    }
  };

  const user = getItem('user');

  useEffect(() => {
    if (user?.TwoFactorAuthCodeRequired === true) {
      dispatch(setEmail(inputs.email));
      dispatch(setPassword(inputs.password));
      navigate('/2fa', { replace: true });
    } else {
      if (from !== '/') {
        if (user) navigate(from, { replace: true });
      } else {
        if (user) navigate('/dashboard', { replace: true });
      }
    }
  }, [user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleChange(e as React.ChangeEvent<HTMLInputElement>);

  if (isLoading) return <Loader />;
  return (
    <SPage>
      <SUserImg src={userImg} alt="" />
      <STitle>{translate('login_title')}</STitle>
      <SForm onSubmit={handleSubmit}>
        <STextField
          isShadow
          error={!!loginError}
          StartAdornment={<img src={UserNameImg} alt="username icon" />}
          type="text"
          name="email"
          className="email"
          placeHolderTx="login_email"
          value={inputs.email}
          onChange={onChange}
          onBlur={handleBlur}
          touched={touched.email ?? false}
        />

        {isLogin ? (
          <STextField
            isShadow
            error={!!loginError}
            StartAdornment={<img src={PasswordImg} alt="password icon" />}
            type="password"
            name="password"
            placeHolderTx="login_password"
            value={inputs.password}
            onChange={onChange}
            onBlur={handleBlur}
            touched={touched.password ?? false}
          />
        ) : (
          <>
            {loginError ? <SErroText>{loginError}</SErroText> : <></>}
            <div style={{ height: 55.5 }} />
          </>
        )}
        {isLogin ? (
          <STextContainer>
            {loginError ? <SErroText>{loginError}</SErroText> : <div />}
            <SForgotPassLink to="../forgetPassword">
              {translate('login_forgot_password')}
            </SForgotPassLink>
          </STextContainer>
        ) : (
          <div style={{ height: 24 }} />
        )}
        <SButton disabled={!isValid} type="submit" tx="login_login" />
        <SSSoLink to={isLogin ? '../sso' : '../login'}>
          {isLogin
            ? translate('login_signOnSso')
            : translate('login_withCosafe')}
        </SSSoLink>
        <SPrivacyText>
          {translate('login_privacyPolicyNotice')}{' '}
          <a
            target="_blank"
            href="https://cosafe.se/integritetspolicy/"
            rel="noreferrer noopener"
          >
            {translate('privacyPolicy')}
          </a>
        </SPrivacyText>
      </SForm>
    </SPage>
  );
};

const SForm = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
`;

const SPage = styled(Page)`
  padding-top: 0;
  background-color: ${props => props.theme.palette.background.primary};
`;

const SUserImg = styled.img`
  margin: 0 auto;
  display: block;
`;
export interface LoginForm {
  code?: string;
  email: string;
  password: string;
}

interface STextFieldParams {
  error: boolean;
}

const STextField = styled(TextField)<STextFieldParams>`
  input {
    color: ${palette.grayx11gray};
    font-family: 'Roboto-Regular';
    font-size: 1rem;
    ${props =>
      props.error &&
      css`
        border-color: ${palette.tartOrange};
      `}
  }
  input::placeholder {
    font-size: 1rem;
    font-family: 'Roboto-Regular';
    color: ${palette.grayx11gray};
  }

  &.email {
    margin-bottom: 0.625rem;
  }
`;

const STitle = styled.h1`
  font-size: 1.125rem;
  font-family: 'Roboto-Medium';
  color: ${palette.silver};
  text-align: left;
  padding-left: 4px;
  margin: 1rem auto 1rem auto;
`;

export const SForgotPassLink = styled(Link)`
  font-size: 0.875rem;
  font-family: 'Roboto-Regular';
  color: ${palette.honeyYellow};
  text-decoration: none;
`;

const SErroText = styled.p`
  font-size: 0.875rem;
  font-family: 'Roboto-Regular';
  color: ${palette.tartOrange};
  margin-right: auto;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
export const STextContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 0.625rem;
`;
const SSSoLink = styled(Link)`
  text-decoration: none;
  align-self: center;
  font-size: 1rem;
  font-family: 'Roboto-Regular';
  color: ${palette.honeyYellow};
  margin: 2rem 0 1.75rem 0;
`;
const SPrivacyText = styled.p`
  text-align: center;
  max-width: 80%;
  font-size: 1rem;
  font-family: 'Roboto-Regular';
  a {
    color: ${palette.honeyYellow};
    text-decoration: none;
    /* cursor: pointer; */
  }
`;

interface SButtonParams {
  $error?: boolean;
}
const SButton = styled(Button)<SButtonParams>`
  width: 100%;
  margin-top: 1.5rem;
  button {
    max-width: 200rem;
    ${props =>
      props.$error &&
      css`
        opacity: 0.5;
      `}
  }
`;
