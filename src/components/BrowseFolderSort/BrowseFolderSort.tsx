import * as React from 'react';
import { palette } from '../../theme/colors';
import Drawer from 'react-bottom-drawer';
import { translate } from '../../utils/translate';
import {
  SBottomLine,
  SButton,
  SCheckBoxWithSubTitle,
  SDrawerWrapper,
  STitle,
} from './BrowseFolderSort.styles';

export enum BrowseSortType {
  date = 'date',
  Alphabetically = 'Alphabetically',
}

export interface IBrowseFolderSortProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSort: (sort: BrowseSortType) => void;

  initialSort: BrowseSortType;
}
export const BrowseFolderSort = (props: IBrowseFolderSortProps) => {
  const { isOpen, setIsOpen, onSort, initialSort } = props;

  const [sort, setSort] = React.useState<BrowseSortType>(initialSort);
  const [sortStaged, setSortStaged] = React.useState<
    BrowseSortType | undefined
  >(initialSort);

  const onCloseHandle = () => {
    setIsOpen(false);
    setSortStaged(sort);
  };
  const handleFilter = () => {
    sortStaged && setSort(sortStaged);
    sortStaged && onSort(sortStaged);
    setIsOpen(false);
  };
  return (
    <SDrawerWrapper>
      <Drawer
        className="profileDrawer"
        isVisible={isOpen}
        onClose={onCloseHandle}
        hideScrollbars
      >
        <div className="content-wrapper">
          <STitle className="list-gap-item">
            {translate('groups_memberStatus')}
          </STitle>
          <SCheckBoxWithSubTitle
            className="SFilterCheckboxItem-header list-gap-item"
            selected={sortStaged === BrowseSortType.date}
            title={translate('date')!}
            onToggleCheck={() => setSortStaged(BrowseSortType.date)}
            valueId={0}
            withoutSeparator
            clickAll
          />
          <SCheckBoxWithSubTitle
            className="SFilterCheckboxItem-header list-gap-item"
            selected={sortStaged === BrowseSortType.Alphabetically}
            title={translate('alphabet')!}
            onToggleCheck={() => setSortStaged(BrowseSortType.Alphabetically)}
            valueId={0}
            separatorColor={palette.prussianBlue5}
            withoutSeparator
            clickAll
          />
        </div>
        <SButton tx={'sort'} onClick={handleFilter} />

        <SBottomLine />
      </Drawer>
    </SDrawerWrapper>
  );
};
