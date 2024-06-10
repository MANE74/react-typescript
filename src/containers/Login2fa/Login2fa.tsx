import useForm from '../../utils/customHooks/useForm';
import twoFAPic from '../../assets/imgs/login/two-factor-authentication.svg';
import UserNameImg from '../../assets/imgs/login/login-username.svg';
import { login } from '../Login/LoginSlice/actionCreators';
import { selectUser } from '../Login/LoginSlice';
import { useNavigate } from 'react-router-dom';
import { fetchLogin2FA } from './Login2faSlice/actionCreators';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectEmail, selectPassword, setEmail, setPassword } from './Login2faSlice';
import {
  SImg,
  SParagraph,
  SInput,
  SSmall,
  SButton,
  SLinkText,
  SLInk,
  SSection,
  SForm,
  SErroText,
  SPage,
} from './styles';
import { useTranslation } from 'react-i18next';

export const Login2fa = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { t } = useTranslation();

  const user: any = useSelector(selectUser);
  const email = useSelector(selectEmail);
  const password = useSelector(selectPassword);
  const [isError, setIsError] = useState<any>(null);
  const { inputs, handleChange } = useForm({
    initial: {
      code: '',
      email: email,
      password: password,
    },
    validateSchema: {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputs.code.length === 0) {
      setIsError('* Enter verification code');
    } else {
      dispatch(
        fetchLogin2FA({
          code: inputs.code,
          email: inputs.email,
          password: inputs.password,
        })
      );
      setTimeout(() => {
        if (user.email === null) {
          setIsError('* Incorrect code');
        }
      }, 500);
    }
  };

  const onResend = () => {
    dispatch(login({ email: inputs.email, password: inputs.password }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleChange(e as React.ChangeEvent<HTMLInputElement>);

  useEffect(() => {
    if (user?.email === email) {
      setIsError(null);
      navigation('/login', { replace: true });
      dispatch(setEmail(''))
      dispatch(setPassword(''))
    }
  }, [user]);

  return (
    <SPage>
      <SImg>
        <img src={twoFAPic} alt="2faPic" />
      </SImg>

      <SSection>
        <SParagraph>{t('two_fa_title')}</SParagraph>
        <SForm onSubmit={handleSubmit}>
          <SInput
            isShadow
            error={!!isError}
            type="text"
            name="code"
            placeHolderTx={t('two_fa_input_placeholder')}
            value={inputs.code}
            onChange={onChange}
            StartAdornment={<img src={UserNameImg} alt="username icon" />}
          />
          <>
            {isError ? (
              <SErroText>{t('two_fa_input_error')}</SErroText>
            ) : (
              <div />
            )}
            <div style={{ height: 40 }} />
          </>
          <SSmall>
            {t(`two_fa_info_text`, { phone: user.TwoFactorAuthPhone })}
          </SSmall>
          <SButton text={t('two_fa_submit')} />
        </SForm>
        <SLinkText>
          {t('two_fa_resend_text')}
          <SLInk onClick={onResend}> {t('two_fa_resend_button')}</SLInk>
        </SLinkText>
      </SSection>
    </SPage>
  );
};
