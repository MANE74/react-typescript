import styled, { css } from 'styled-components';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { SearchFilterBar } from '../../components/SearchFilterBar/SearchFilterBar';
import { palette } from '../../theme/colors';

export const SContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;
export const SSearcFilterBar = styled(SearchFilterBar)`
  width: 100%;
  margin: auto;
  padding: 0 0 1.25rem 0;
  box-sizing: border-box;
`;
export const SfoldersBox = styled.div<{ length: boolean }>`
  ${(props) =>
    props.length &&
    css`
      padding-bottom: 100px;
    `};
  padding-right: 15px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;
export const STutorialText = styled.p`
  font-size: 13px;
  font-weight: 400;
  line-height: 25px;
  font-style: italic;
  align-self: start;
`;
export const SButton = styled.button`
  position: absolute;
  width: 95%;
  height: 45px;
  color: black;
  display: flex;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  font-style: normal;
  align-items: center;
  border-radius: 25px;
  justify-content: center;
  background: ${palette.honeyYellow};
  border: 1px solid ${palette.honeyYellow};
  bottom: 20px;
`;
export const DialogWIndow = styled(ConfirmDialog)``;
