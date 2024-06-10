import styled from 'styled-components';
import { palette } from '../../theme/colors';

interface CheckboxProps {
  isChecked: boolean;
  disabled?: boolean;
}

const SRadio = (props: CheckboxProps) => {
  return (
    <SCheckboxContainer>
      <SRoundButtonContainer isChecked={props.isChecked}>
        <input readOnly type="checkbox" checked={props.isChecked} disabled />
        <span />
      </SRoundButtonContainer>
    </SCheckboxContainer>
  );
};

const SCheckboxContainer = styled.div`
  align-self: center;
  position: relative;
  width: 25px;
  height: 25px;
`;

const SRoundButtonContainer = styled.label<CheckboxProps>`
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
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
    border-radius: 15px;
    border: ${(props) =>
      props.disabled
        ? `1px solid ${palette.charcoal}`
        : `1px solid ${palette.silver}`};
  }

  span:after {
    content: '';
    position: absolute;
    display: none;
  }

  input:checked ~ span {
    border: 1px solid ${palette.honeyYellow};
  }

  input:checked ~ span:after {
    display: block;
  }

  span:after {
    left: 3px;
    top: 3px;
    width: 17px;
    height: 17px;
    border-radius: 15px;
    background-color: ${palette.honeyYellow};
  }
`;

export default SRadio;
