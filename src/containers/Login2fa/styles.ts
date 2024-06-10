import styled, { css } from 'styled-components';
import { Button } from '../../components/Button/Button';
import { TextField } from '../../components/TextField/TextField';
import { palette } from '../../theme/colors';
import { Page } from '../../components/Page/Page';

export const SPage = styled(Page)``;
export const SContainer = styled.div`
  width: 100%;
  height: 100%;
`;
export const SSection = styled.div`
  width: 100%;
  height: 50%;
`;
export const SImg = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0 25px 0;
  box-sizing: content-box;
`;
export const SInput = styled(TextField)<{ error: boolean }>`
  margin: 15px 0;
  box-shadow: 0px 10px 20px 0px ${palette.shadowColor};

  input {
    color: ${props => props.theme.palette.text.inputPrimary};
    font-family: 'Roboto-Regular';
    font-size: 1rem;
    ${props =>
      props.error &&
      css`
        border-color: ${palette.tartOrange};
      `}
  }
  ::placeholder {
    font-size: 1rem;
    font-family: 'Roboto-Regular';
    color: ${props => props.theme.palette.text.inputPrimary};
  }
`;
export const SParagraph = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: ${palette.grayx11gray};
  margin: 0 15px;
`;
export const SSmall = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  margin-top: 1rem;
  padding-left: 0.625rem;
  max-width: 85%;
  color: ${palette.darkGrey};
`;
export const SButton = styled(Button)`
  width: 100%;
  button {
    max-width: 100%;
  }
  margin-top: 35px;
`;
export const SLinkText = styled.p`
  width: 100%;
  color: ${palette.grayx11gray};
  text-align: center;
  margin-top: 2.1875rem;
  /* margin-top: 12%; */
`;
export const SLInk = styled.span`
  color: ${palette.honeyYellow};
  &:active {
    opacity: 0.8;
  }
  cursor: pointer;
`;
export const SForm = styled.form`
  width: 100%;
`;
export const SErroText = styled.p`
  font-size: 0.875rem;
  font-family: 'Roboto-Regular';
  color: ${palette.tartOrange};
  margin-left: 15px;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
