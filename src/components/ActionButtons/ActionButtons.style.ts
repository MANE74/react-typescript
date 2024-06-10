import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';
import { Button } from '../Button/Button';

interface ActionButtonProps {
  readonly margin?: string;
  color?: 'yellow' | 'red';
}

export const ActionButton = styled(Button)<ActionButtonProps>`
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.4rem;
  height: 45px;
  width: 100%;
  z-index: 2;
  text-align: center;
  margin-bottom: ${(props) => props.margin};

  a,
  button {
    width: 100%;
    font-family: 'Roboto-Medium';
    z-index: 2;
    font-weight: 500;
    font-size: 1rem;
    padding: 0.75rem 1em;

    background-color: ${palette.honeyYellow};
    color: ${palette.black};

    ${(props) =>
      props.color === 'red' &&
      css`
        background-color: ${palette.tartOrange};
        color: ${palette.white};
      `}
  }
`;
