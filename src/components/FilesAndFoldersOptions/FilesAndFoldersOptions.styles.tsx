import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';
import Options from '../Options/Options';

export const SOptions = styled(Options)`
  padding: 0;
  .cancel {
    flex-shrink: 0;
    p {
      color: ${palette.honeyYellow};
    }
  }
  .SOptionsList {
    margin-bottom: 0.625rem;
  }
`;

export const SInfoContainer = styled.div`
  padding: 1.25rem;
  background-color: ${palette.prussianBlue2};
  border-radius: 14px;
  margin-bottom: 0.5rem;

  min-height: 0;

  display: flex;
  flex-direction: column;
  font-family: 'Roboto-Regular';

  .STitle {
    color: ${palette.white};
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  .SSubTitle {
    color: ${palette.silver};
    font-size: 0.875rem;
    font-weight: 400;
  }
  .SSubTitleValue {
    color: ${palette.white};
    font-size: 0.875rem;
    font-weight: 500;
    text-align: end;
  }

  .STitle {
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .SharedItem {
    &:not(:last-child) {
      margin-bottom: 0.625rem;
    }
  }
`;

export const SSharedContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
`;
export const SRow = styled.div<{ $scroll?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin-top: 0.625rem;

  ${props =>
    props.$scroll &&
    css`
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
      }
      -ms-overflow-style: none;
      scrollbar-width: none;
    `}
`;

export const SLine = styled.hr`
  width: 100%;
  border: 1px solid ${palette.prussianBlue5};
  margin: 1.25rem 0 0.625rem 0;
`;
