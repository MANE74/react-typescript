import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { palette } from '../../theme/colors';
import { translate } from '../../utils/translate';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  to?: string;
  text?: string;
  tx?: string;
  type?: 'button' | 'reset' | 'submit';
  size?: 'small' | 'medium' | 'large' | 'meduimFullWidth';
  marginVertical?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  isLoadingTx?: string;
}

interface SButtonProps {}

const SButton = styled.div<SButtonProps>`
  a,
  button {
    cursor: pointer;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${palette.honeyYellow};
    color: ${props => props.theme.palette.text.buttonPrimary};
    border-radius: 1.4rem;
    height: 45px;
    max-width: 22rem;
    border: none;
    width: 100%;

    font-size: 1rem;
    font-family: 'Roboto-Medium';
    font-weight: 500;
    &:active {
      opacity: 0.8;
    }
  }
`;

export const Button = (props: ButtonProps) => {
  const {
    to,
    text,
    marginVertical,
    type,
    onClick,
    tx,
    className,
    isLoading,
    isLoadingTx,
    ...res
  } = props;

  const { t } = useTranslation();
  const buttonText = tx ? t(`${tx}`) : text;

  if (to)
    return (
      <SButton className={className}>
        <Link className="link" to={to} onClick={onClick}>
          {buttonText}
        </Link>
      </SButton>
    );

  return (
    <SButton className={className}>
      <button type={type} onClick={onClick} {...res}>
        {isLoading ? translate(isLoadingTx || 'loading') : buttonText}
      </button>
    </SButton>
  );
};
