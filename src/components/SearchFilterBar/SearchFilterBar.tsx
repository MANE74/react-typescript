import React from 'react';
import { SearchBarBase } from '../SearchBarBase/SearchBarBase';
import { ReactComponent as FilterIcon } from '../../assets/imgs/general/filter-icon.svg';
import styled from 'styled-components';

export interface SectionFilterItem {
  id: number;
  name?: string;
  nameTx?: string;
  checked: boolean;
}

export interface FilterSection {
  title?: string;
  type: 'checkbox' | 'radio';
  content: SectionFilterItem[];
}

export interface ISearchFilterBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onSearch: (value: string) => void;
  handleOpenFilter: () => void;
  withoutFilterButton?: boolean;
  forwardedRef?: any;
  // making the value required , in order not to forget it in future implementation
  // it's currently used only in counting the length of value , to update firefox clear button
  value: string | undefined;
}

export const SearchFilterBar = (props: ISearchFilterBarProps) => {
  const {
    className,
    onSearch,
    handleOpenFilter,
    forwardedRef,
    value,
    withoutFilterButton = false,
  } = props;

  return (
    <SContainer className={className}>
      <SSearchBarBase
        className="SSearchBarBase"
        placeholderTx="documents_search"
        placeholder="Search..."
        fallback={onSearch}
        forwardedRef={forwardedRef}
        value={value}
      />
      {!withoutFilterButton && (
        <SFilterButton onClick={handleOpenFilter}>
          <FilterIcon />
        </SFilterButton>
      )}
    </SContainer>
  );
};

const SContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SSearchBarBase = styled(SearchBarBase)`
  width: 100%;
`;

const SFilterButton = styled.button`
  cursor: pointer;
  margin-left: 10px;
  min-height: 3.25rem;
  min-width: 3.25rem;
  background-color: ${({ theme }) => theme.palette.background.searchBar};
  border: 1px solid ${({ theme }) => theme.palette.border.primary};
  border-radius: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
