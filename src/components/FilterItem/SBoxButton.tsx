import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';

interface CheckboxProps {
  isChecked: boolean;
  disabled?: boolean;
  stopPropagation?: boolean;
  onClick?: () => void;
  grey?: boolean;
}

const SCheckbox = (props: CheckboxProps) => {
  const { isChecked, disabled, stopPropagation, onClick, grey } = props;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    stopPropagation && e.stopPropagation();
    onClick && !disabled && onClick();
  };

  return (
    <SCheckboxContainer onClick={handleClick}>
      <SBoxButtonContainer
        isChecked={isChecked}
        disabled={disabled}
        grey={grey}
      >
        <input readOnly type="checkbox" checked={isChecked} disabled />
        <span />
      </SBoxButtonContainer>
    </SCheckboxContainer>
  );
};

export const SCheckboxContainer = styled.div`
  align-self: center;
  position: relative;
  width: 25px;
  height: 25px;
`;

export const SBoxButtonContainer = styled.label<CheckboxProps>`
  padding-left: 35px;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
    height: 0;
    width: 0;
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: transparent;
    border-radius: 4px;
    border: ${(props) =>
      props.disabled
        ? `1px solid ${palette.charcoal}`
        : `1px solid ${palette.silver}`};

    ${(props) =>
      props.isChecked &&
      css`
        border: 1px solid ${palette.honeyYellow};
        background-color: ${palette.honeyYellow};
      `}

    ${(props) =>
      props.disabled &&
      props.grey &&
      css`
        border: 1px solid ${palette.silver};
        background-color: ${palette.silver};
      `}
  }

  span:after {
    content: '';
    position: absolute;
    display: none;
  }

  input:checked ~ span:after {
    display: inline;
  }

  span:after {
    left: 8px;
    top: 4px;
    width: 7px;
    height: 13px;
    border: solid ${palette.black};
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

export default SCheckbox;
