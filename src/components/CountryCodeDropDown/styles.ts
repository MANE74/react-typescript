import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';

export const Slabel = styled.label<{ readMode: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 1.5rem;
  border-radius: 12px 0px 0px 12px;
  border: 1px solid ${palette.silver2};
  ${(props) =>
    !props.readMode &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}
  img {
    height: 1.25rem;
    width: 1.25rem;
    aspect-ratio: 1;
    border-radius: 9999px;
  }
  max-width: 7.4rem;
  p {
    white-space: nowrap;
  }
`;

export const SFlexabelMargin = styled.div`
  width: 1.25rem;
  flex-shrink: 1;
`;

export const SDropDown = styled.div`
  position: absolute;

  max-height: 12.5rem;
  max-width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;

  top: calc(100% + 3px);

  border: 1px solid ${palette.white};
  border-radius: 0.7rem;

  background-color: ${palette.prussianBlue2};
`;

export const SInnerDiv = styled.ul`
  height: 10.4rem;
  margin: 1rem 0rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* scrolling bar customize  */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;
`;

interface SCountryItemParams {
  isSelected: boolean;
}
export const SCountryItem = styled.li<SCountryItemParams>`
  display: flex;
  align-items: center;
  flex-direction: row;

  border-radius: 4px;

  padding: 0.5rem 1.5rem 0.5rem 1rem;
  margin: 0rem 0rem 0rem 0;
  ${(props) =>
    props.isSelected &&
    css`
      background-color: ${palette.spaceCadet};
    `}
  &:hover {
    background-color: ${palette.spaceCadet};
    cursor: pointer;
  }

  img {
    height: 1.125rem;
    width: 1.9rem;
    border-radius: 3px;
  }
  p {
    display: inline-block;
  }

  p.name {
    flex-grow: 1;
    margin: 0 1rem 0 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
