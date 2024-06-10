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
