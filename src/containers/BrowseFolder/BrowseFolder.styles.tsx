import styled, { css } from 'styled-components';
import { Page } from '../../components/Page/Page';
import { SearchFilterBar } from '../../components/SearchFilterBar/SearchFilterBar';
import { palette } from '../../theme/colors';

export const SPage = styled(Page)`
  padding: 1.25rem 0 1.25rem 0;
  /* to make only the list overflow */
  position: relative;
  height: 100%;
`;

export const SList = styled.ul<{ $bottomPad?: boolean }>`
  width: 90%;
  margin: 0.1875rem auto 1.25rem auto;

  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  overflow-y: auto;

  height: calc(100% - 4.25rem);

  ${props =>
    props.$bottomPad &&
    css`
      padding-bottom: 4.375rem;
    `}

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const SSearchFilterBar = styled(SearchFilterBar)<{
  $withoutFilterButton?: boolean;
}>`
  .SSearchBarBase {
    input {
      ::placeholder {
        color: ${palette.silver};
        font-size: 1rem;
        opacity: 1;
      }

      :-ms-input-placeholder {
        color: ${palette.silver};
        font-size: 1rem;
      }

      ::-ms-input-placeholder {
        color: ${palette.silver};
        font-size: 1rem;
      }
    }
  }
  width: 90%;
  margin: auto;
  ${props =>
    props.$withoutFilterButton &&
    css`
      .SSearchBarBase {
        width: 100%;
      }
    `}
`;
