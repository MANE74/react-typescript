import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const SGriditemLink = styled(Link)<{ $needDangerStyle?: boolean, disabled?: boolean }>`
  text-decoration: none;

  width: 26%;
  min-width: 4.6rem;
  max-width: 6.25rem;
  min-height: 4.6rem;
  aspect-ratio: 1;

  margin: 2.25%;
  padding: 0 0.4rem;

  opacity: ${({ disabled }) => disabled ? '0.6' : '1'};

  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.palette.border.primary};
  /* maybe we will need that shadow again in the future ?  */
  /* box-shadow: 0px 20px 20px 2px
  ${({ theme }) => theme.palette.shadow.menuPrimary}; */

  background-color: ${({ theme, $needDangerStyle }) =>
    $needDangerStyle
      ? theme.palette.background.danger
      : theme.palette.background.secondary};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`;
export const SGriditemA = styled.a<{ $needDangerStyle?: boolean, disabled?: boolean }>`
  text-decoration: none;

  width: 26%;
  min-width: 4.6rem;
  max-width: 6.25rem;
  min-height: 4.6rem;
  aspect-ratio: 1;

  margin: 2.25%;
  padding: 0 0.4rem;

  opacity: ${({ disabled }) => disabled ? '0.6' : '1'};

  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.palette.border.primary};
  /* maybe we will need that shadow again in the future ?  */
  /* box-shadow: 0px 20px 20px 2px
  ${({ theme }) => theme.palette.shadow.menuPrimary}; */

  background-color: ${({ theme, $needDangerStyle }) =>
    $needDangerStyle
      ? theme.palette.background.danger
      : theme.palette.background.secondary};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
