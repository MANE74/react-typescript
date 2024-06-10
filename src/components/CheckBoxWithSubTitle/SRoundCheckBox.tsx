import styled, { css, keyframes } from 'styled-components';
import { palette } from '../../theme/colors';

interface SRoundCheckBox {
  backgroundActiveColor?: string;
  backgroundColor?: string;

  borderColor?: string;
  borderDisabled?: string;

  borderHoverColor?: string;
  borderActiveColor?: string;
}

const bounce = keyframes`
    50% {
        transform:   scale(1.2);
    }
    75% {
        transform:   scale(.9);
    }
    100% {
        transform:  scale(1);
    }
`;

export const SCircleCheckBox = styled.input.attrs({
  type: 'checkbox',
})<SRoundCheckBox>`
  --background: ${props => props.backgroundColor || css`transparent`};
  --backgroundActive: ${props =>
    props.backgroundActiveColor || palette.honeyYellow};

  --border: ${props => props.borderColor || palette.silver};
  --border-active: ${props => props.borderActiveColor || palette.honeyYellow};
  --border-disabled: ${props => props.borderDisabled || palette.charcoal};

  --border-hover: ${props => props.borderHoverColor || palette.lavendarGray};
  --shadow-spread: 0px;

  -webkit-appearance: none;
  appearance: none;
  background-color: --background;
  margin: 0;

  width: 1.56rem;
  height: 1.56rem;
  aspect-ratio: 1;
  border: 1px solid var(--border);
  border-radius: 99rem;
  cursor: pointer;

  transition: box-shadow 0.3s;
  box-shadow: inset 0 0 0 var(--shadow-spread)
    var(--shadow-border-color, var(--border));

  &:not(:disabled):hover {
    --shadow-spread: 1.5px;
    --shadow-border-color: var(--border-hover);
  }

  &:disabled {
    cursor: not-allowed;
    --border: var(--border-disabled);
  }

  &:checked {
    --border: var(--border-active);
  }
  &:checked:hover {
    --shadow-border-color: var(--border-active);
  }

  display: grid;
  place-content: center;

  position: relative;

  &::after {
    content: '';
    width: 1rem;
    height: 1rem;
    aspect-ratio: 1;
    background-color: var(--backgroundActive);
    border-radius: 99rem;
    transform: translateZ(0) scale(var(--scale, 0));
  }

  &:checked::after {
    --scale: 0;
    animation: ${bounce} 0.4s linear forwards 0.2s;
  }
`;
