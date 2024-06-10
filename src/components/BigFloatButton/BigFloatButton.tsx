import React from 'react';
import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface BigFloatButtonProps {
  tx: string;
  link?: string;
  onClick?: () => void;
  extraPadding?: boolean;
  style?: React.CSSProperties;
  color?: 'yellow' | 'red';
  className?: string | undefined;
}

const BigFloatButton = (props: BigFloatButtonProps) => {
  const {
    tx,
    link,
    onClick,
    style,
    extraPadding = true,
    color,
    className,
  } = props;
  const { t } = useTranslation();
  return (
    <>
      {link != null ? (
        <Base
          className={className}
          as={Link}
          style={style}
          to={link}
          $extraPadding={extraPadding}
          color={color}
        >
          {t(tx)}
        </Base>
      ) : (
        <Base
          className={className}
          as="button"
          style={style}
          onClick={onClick}
          $extraPadding={extraPadding}
          color={color}
        >
          {t(tx)}
        </Base>
      )}
    </>
  );
};
export default BigFloatButton;

interface BaseProps {
  $extraPadding: boolean;
  type?: 'yellow' | 'red';
}

const Base = styled.div<BaseProps>`
  cursor: pointer;
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: ${props => (props.$extraPadding ? '6.688rem' : '3.125rem')};
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.4rem;
  height: 45px;
  width: 90%;
  max-width: 22rem;
  border: none;
  z-index: 5;

  font-size: 1rem;
  font-family: 'Roboto-Medium';
  font-weight: 500;

  background-color: ${palette.honeyYellow};
  color: ${palette.black};

  ${props =>
    props.color === 'red' &&
    css`
      background-color: ${palette.tartOrange};
      color: ${palette.white};
    `}
`;
