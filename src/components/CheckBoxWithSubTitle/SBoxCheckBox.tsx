import styled, { css, keyframes } from 'styled-components';
import { palette } from '../../theme/colors';

interface SBoxCheckBoxProps {
  backgroundColor?: string;
  borderColor?: string;
  borderHoverColor?: string;
  borderActiveColor?: string;
  borderDisabled?: string;
  markColor?: string;
}

const bounce = keyframes`
    50% {
        transform:  rotate(45deg)  scale(1.2);
    }
    75% {
        transform:  rotate(45deg)  scale(.9);
    }
    100% {
        transform: rotate(45deg)  scale(1);
    }
`;

export const SBoxCheckBox = styled.input.attrs({
  type: 'checkbox',
})<SBoxCheckBoxProps>`
  --background-color: ${props => props.backgroundColor || css`transparent`};
  --border: ${props => props.borderColor || palette.silver};
  --border-hover: ${props => props.borderHoverColor || palette.lavendarGray};
  --border-active: ${props => props.borderActiveColor || palette.honeyYellow};
  --border-disabled: ${props => props.borderDisabled || palette.charcoal};

  --shadow-spread: 0px;

  -webkit-appearance: none;
  appearance: none;
  background-color: var(--background-color);
  margin: 0;

  min-width: 25px;
  min-height: 25px;
  aspect-ratio: 1;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  cursor: pointer;

  transition: box-shadow 0.3s;
  box-shadow: inset 0 0 0 var(--shadow-spread)
    var(--shadow-border-color, var(--border));

  &:not(:disabled):not(:checked):hover {
    --shadow-spread: 1.5px;
    --shadow-border-color: var(--border-hover);
  }

  &:disabled {
    cursor: not-allowed;
    --border: var(--border-disabled);
  }

  &:checked {
    --background-color: var(--border-active);
    --border: var(--border-active);
    --shadow-spread: 11px;
    --shadow-border-color: var(--border-active);
  }

  display: grid;
  place-content: center;

  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 8px;
    top: 4px;
    width: 7px;
    height: 13px;
    border: solid ${props => props.markColor || palette.black};
    border-width: 0 2px 2px 0;

    transform: rotate(45deg) translateZ(0) scale(var(--scale, 0));
  }

  &:checked::after {
    --scale: 0;
    animation: ${bounce} 0.4s linear forwards 0.2s;
  }
`;
