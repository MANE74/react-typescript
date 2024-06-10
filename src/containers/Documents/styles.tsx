import styled, { css } from 'styled-components';
import { Button } from '../../components/Button/Button';
import Options from '../../components/Options/Options';
import { palette } from '../../theme/colors';

interface SDocumentButtonProps {
  $right?: boolean;
  $allSpace?: boolean;
}

export const SDocumentButton = styled(Button)<SDocumentButtonProps>`
  width: 42%;

  position: absolute;
  bottom: 30px;

  ${props =>
    !props.$right &&
    css`
      left: 1.25rem;
    `}
  ${props =>
    props.$right &&
    css`
      right: 1.25rem;
    `}
    ${props =>
    props.$allSpace &&
    css`
      width: 90%;
      left: 50%;
      transform: translate(-50%, 0);
    `}

  z-index: 11;

  button,
  .link {
    width: 100%;
    max-width: 1000rem;
    font-size: 1rem;
    padding: 0.8125rem 0;
    text-align: center;
    /* font-family: 'Roboto-Regular';
    font-weight: 500; */
    font-family: 'Roboto-Medium';
    font-weight: 500;
    z-index: 2;
    height: 3rem;
    color: ${palette.raisinBlack3};
  }
`;

export const SOptions = styled(Options)`
  padding: 0;
  .cancel {
    p {
      color: ${palette.honeyYellow};
    }
  }
  .SOptionsList {
    margin-bottom: 0.625rem;
  }
`;

export const SHiddenInput = styled.input`
  display: none;
`;
