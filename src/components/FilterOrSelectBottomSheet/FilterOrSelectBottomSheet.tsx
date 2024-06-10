import * as React from 'react';

import { palette } from '../../theme/colors';
import { useSelectlist } from '../../utils/customHooks/useSelectList';
import { translate } from '../../utils/translate';

import { CheckBoxWithSubTitlePhotoWrapper } from '../CheckBoxWithSubTitle/CheckBoxWithSubTitlePhotoWrapper';
import { searchData } from '../../containers/ExternalContacts/helpers';
import {
  SButton,
  SCheckBoxTitle,
  SFilter,
  SHeader,
  SList,
  SSearchBarBase,
  STitle,
} from './styles';
import { Backdrop } from '../Backdrop/Backdrop';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';

interface DataSelectableListType {
  id: number;
  name: string;
  imageName?: string;
}

export type SelectedAllType = 'SELECTED_ALL' | 'UNSELECTED_ALL';

export interface IFilterOrSelectBottomSheet<T> {
  data: T[];
  keyToSearchBy?: keyof {
    [P in keyof T as T[P] extends string | null ? P : never]: any;
  };

  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFilter: (selected: Set<number> | SelectedAllType) => void;

  initialSelected: Set<number>;

  titleTx?: string;
  searchPlacholderTx?: string;
  selectAllTx?: string;
  filterTx?: string;

  selectShapeType?: 'box' | 'circle';

  withPhoto?: boolean;
  atLeastOneReq?: boolean;

  atLeastOneReqTx?: string;

  hideFooter?: boolean;

  hideCurrentUserId?: number;
}

export const FilterOrSelectBottomSheet = <T extends DataSelectableListType>(
  props: IFilterOrSelectBottomSheet<T>
) => {
  const {
    isOpen,
    setIsOpen,
    onFilter,
    data,

    titleTx = 'messages_filter_by_contacts_lists',
    filterTx = 'messages_filter',
    searchPlacholderTx = 'documents_search',
    selectAllTx = 'select_all',

    selectShapeType = 'circle',
    keyToSearchBy = 'name',

    withPhoto = false,
    atLeastOneReq = false,

    initialSelected,
    hideFooter,
    atLeastOneReqTx,

    hideCurrentUserId,
  } = props;

  const _data = React.useMemo(
    () =>
      hideCurrentUserId
        ? data.filter(item => item.id !== hideCurrentUserId)
        : data,
    [data, hideCurrentUserId]
  );
  const _initialSelected = React.useMemo(
    () =>
      hideCurrentUserId
        ? new Set(
            Array.from(initialSelected).filter(id => id !== hideCurrentUserId)
          )
        : initialSelected,
    [initialSelected, hideCurrentUserId]
  );

  const {
    handleSelect,
    isSelectedAll,
    selectedItems,
    isStagedSelectedAll,
    isNonStagedSelected,
    stagedSelectedItems,
    onFinishSelecting,
  } = useSelectlist({
    data: _data,
    multiStage: true,
    initialSelected: _initialSelected,
  });

  const [searchTerm, setSearchTerm] = React.useState<string | undefined>();

  const listSource = searchData(_data, searchTerm, keyToSearchBy);

  const confirm = useConfirmation();

  const layout = useLayoutContext();
  let isInit = true;

  React.useLayoutEffect(() => {
    if (hideFooter) {
      layout.setTabsState(!isOpen);
    }
  }, [isOpen]);

  const onCloseHandle = () => {
    onFinishSelecting(false);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleFilter = () => {
    if (!filterValid) {
      confirm({
        title: 'warning',
        description: translate(
          atLeastOneReqTx || 'messages_no_member_modal_info'
        )!,
        onSubmit: () => {},
        confirmText: 'ok',
      });
      return;
    }
    onFinishSelecting(true);
    setSearchTerm('');
    onFilter(
      isStagedSelectedAll
        ? 'SELECTED_ALL'
        : isNonStagedSelected
        ? 'UNSELECTED_ALL'
        : hideCurrentUserId
        ? (new Set([
            ...Array.from(stagedSelectedItems),
            hideCurrentUserId,
          ]) as Set<number>)
        : (new Set(stagedSelectedItems) as Set<number>)
    );
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const filterValid = atLeastOneReq ? stagedSelectedItems.size !== 0 : true;

  return (
    <>
      {isOpen && (
        <>
          <SFilter>
            <SHeader>
              <rect width="400" height="100" fill={palette.silver} />
            </SHeader>
            <STitle>{translate(titleTx)}</STitle>
            <SSearchBarBase
              placeholderTx={searchPlacholderTx}
              fallback={handleSearch}
              value={searchTerm}
            />
            <SList $isRound={selectShapeType === 'circle'} className="SList">
              <SCheckBoxTitle
                className="SFilterCheckboxItem-header"
                selected={isStagedSelectedAll}
                title={translate(selectAllTx)!}
                onToggleCheck={handleSelect}
                valueId={0}
                checkBoxType={selectShapeType}
                withoutSeparator
                clickAll
              />

              {listSource.map((item, index) =>
                withPhoto ? (
                  <CheckBoxWithSubTitlePhotoWrapper
                    className="SFilterCheckboxItem"
                    selected={stagedSelectedItems.has(item.id)}
                    title={item.name}
                    onToggleCheck={handleSelect}
                    valueId={item.id}
                    key={`${item.id}-${index}`}
                    checkBoxType={selectShapeType}
                    imageName={item.imageName}
                    withoutSeparator
                    clickAll
                  />
                ) : (
                  <SCheckBoxTitle
                    className="SFilterCheckboxItem"
                    selected={stagedSelectedItems.has(item.id)}
                    title={item.name}
                    onToggleCheck={handleSelect}
                    key={`${item.id}-${index}`}
                    valueId={item.id}
                    checkBoxType={selectShapeType}
                    withoutSeparator
                    clickAll
                  />
                )
              )}
            </SList>

            <SButton
              // $valid={!filterValid}
              // disabled={!filterValid}
              tx={filterTx}
              onClick={handleFilter}
            />
          </SFilter>
          <Backdrop onClick={onCloseHandle} setModal={setIsOpen} />
        </>
      )}
    </>
  );
};
