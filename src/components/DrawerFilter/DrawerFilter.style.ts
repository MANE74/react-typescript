import styled from 'styled-components';
import { palette } from '../../theme/colors';

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${palette.prussianBlue2};
  border-radius: 5px;
  height: 100%;
`;

export const FilterTitle = styled.h1`
  font-size: 1rem;
  color: ${palette.white};
  text-align: center;
  width: 100%;
  margin: 0.25rem 0 1.25rem;
`;

export const FilterButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 51vh;
  overflow-y: auto;
  border: 0;
  background-color: ${palette.prussianBlue2};
  
  /* IE and Edge */
  -ms-overflow-style: none;

  /* Firefox */
  scrollbar-width: none;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FilterButton = styled.button`
  cursor:pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 3.5rem;
  font-size: 0.9rem;
  text-align: left;
  border: 0;
  padding: 0.25rem 1rem;
  color: ${palette.white};
  border-bottom: 0.25px solid ${palette.lightGrey};
  background-color: ${palette.prussianBlue2};

  svg {
  }
`;

export const FilterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;

export const FilterActionCancel = styled.button`
  min-width: 45%;
  color: ${palette.white};
  background-color: ${palette.prussianBlue2};
  border: 1px solid ${palette.gold};
  border-radius: 1.375rem;
  font-family: 'Roboto-Medium';
  z-index: 2;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.75rem 1em;
  cursor:pointer;
`;

export const FilterActionApply = styled.button`
  min-width: 45%;
  color: ${palette.prussianBlue2};
  background-color: ${palette.gold};
  border: 1px solid ${palette.gold};
  border-radius: 1.375rem;
  font-family: 'Roboto-Medium';
  z-index: 2;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.75rem 1em;
  cursor:pointer;
`;
