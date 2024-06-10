import styled, { css } from 'styled-components';
import Options from '../../components/Options/Options';
import { Page } from '../../components/Page/Page';
import { palette } from '../../theme/colors';

export const SPage = styled(Page)<{ $paddingBottom?: number }>`
  ${props =>
    css`
      padding: 1.25rem 1.25rem ${props.$paddingBottom || 0}px 1.5rem;
    `}
  /* to make only the list overflow */
  position: relative;
  height: 100%;
`;

export const SOptions = styled(Options)`
  padding: 0;
  .cancel {
    flex-shrink: 0;
    p {
      color: ${palette.honeyYellow};
    }
  }
`;

export const SIamokStatus = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem 1.2rem;
  background-color: ${palette.stormGray};
  font-family: 'Roboto-Medium';
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  color: ${palette.white};
  line-height: 1.5rem;
`;
