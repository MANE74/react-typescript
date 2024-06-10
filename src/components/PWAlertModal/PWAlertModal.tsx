//TODO: View the document in here after you finish the component
import React, { useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { verifyPassword } from '../../apis/authAPI';
import {
  selectIsUserVerified,
  setIsLoginLoading,
} from '../../containers/Login/LoginSlice';
import { setIsVerifyAction } from '../../containers/Login/LoginSlice/actionCreators';
import { palette } from '../../theme/colors';
import useForm from '../../utils/customHooks/useForm';
import { translate } from '../../utils/translate';
import { passwordSchema } from '../../utils/validate';
import {
  SDialog,
  ModaWraper,
  OvarLay,
  SButtonWrapper,
  SCacncelButton,
  SConfirmButton,
} from '../ConfirmDialog/style';
import { TextField } from '../TextField/TextField';

interface PWVerifyModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onProceed: any;
}

export interface VerifyForm {
  password: string;
}

export const PWVerifyModal = (props: PWVerifyModalProps) => {
  const { isOpen, setIsOpen, onProceed } = props;
  const dispatch = useDispatch();
  const isVerified = useSelector(selectIsUserVerified);
  let dialogRef = React.useRef<HTMLDivElement>(null);
  const [isError, setIsError] = React.useState(false);
  const { inputs, handleChange, errors, handleBlur, touched, isValid } =
    useForm<VerifyForm>({
      initial: {
        password: '',
      },
      validateSchema: {
        password: passwordSchema,
      },
    });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleChange(e as React.ChangeEvent<HTMLInputElement>);

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
      setIsOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await verifyPassword({
        password: inputs.password,
      });
      batch(() => {
        dispatch(setIsVerifyAction(true));
        dispatch(setIsLoginLoading(false));
      });
      onProceed();
    } catch (e) {
      setIsError(true)
    }
  };

  const handleKeyDown = (event: any) => {
      if (event.key === 'Enter') {
      return handleSubmit(event)
    }
  }

  return (
    <>
      {isOpen && (
        <>
          <OvarLay />
          <ModaWraper>
            <SDialog ref={dialogRef}>
              <SAlertTitle>
                {translate(
                  'messages_broadcast_password_confirmation_modal_intro'
                )}
              </SAlertTitle>
              <SAlertForm>
                <SFieldInput>
                  <TextField
                    type="password"
                    name="password"
                    placeHolderTx="pw_verify_input_holder"
                    value={inputs.password}
                    onChange={onChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                  ></TextField>

                  {isError && (
                    <SAlertError>{translate('pw_verify_error')}</SAlertError>
                  )}
                </SFieldInput>

                <SButtonWrapper style={btnWrapper}>
                  <SCacncelButton
                    style={cancelBtn}
                    onClick={() => setIsOpen(false)}
                  >
                    {translate('cancel')}
                  </SCacncelButton>
                  <SConfirmButton
                    type="button"
                    style={confirmBtn}
                    onClick={handleSubmit}
                  >
                    {translate('messages_proceed')}
                  </SConfirmButton>
                </SButtonWrapper>
              </SAlertForm>
            </SDialog>
          </ModaWraper>
        </>
      )}
    </>
  );
};

const SAlertTitle = styled.p`
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 1rem;
  padding: 0 2rem;
`;

const SAlertForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SFieldInput = styled.div`
  width: 100%;
  input {
    font-size: 16px;
    color: ${props => palette.white};
  }
`;

const SAlertError = styled.span`
  position: absolute;
  display: flex;
  justtify-content: flex-start;
  align-items: center;
  font-size: 13px;
  margin: 10px 0;
  color: ${props => palette.tartOrange};
`;

// Overide styled components
const btnWrapper = {
  justifyContent: 'space-between',
  marginTop: 35,
};
const cancelBtn = {
  marginRight: 10,
  minWidth: '9rem',
};
const confirmBtn = {
  marginLeft: 10,
  minWidth: '9rem',
};
