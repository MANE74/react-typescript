import * as React from 'react';
import { palette } from '../../theme/colors';
import Drawer from 'react-bottom-drawer';
import { useSelectlist } from '../../utils/customHooks/useSelectList';
import { translate } from '../../utils/translate';
import {
  SButton,
  SCheckBoxWithSubTitle,
  SDrawerWrapper,
  SList,
  STitle,
} from '../../components/DocumentFilter/DocumentFilter';

type SelectedAllType = 'SELECTED_ALL' | 'UNSELECTED_ALL';
type MemberFilterType = ('MEMBER' | 'NOT_MEMBER')[];
interface DataSelectableListType {
  id: number;
  name: string;
  imageName?: string;
}

export interface ChecklistFilters {
  selectedData?: Set<number> | SelectedAllType;
  memberFilter?: MemberFilterType;
}

export interface IChecklistFilterProps<T> {
  data?: T[];

  initialtMemberFilter?: MemberFilterType;
  initialSelectedData?: Set<number>;

  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFilter: (filters: ChecklistFilters) => void;
}

const ChecklistFilter = <T extends DataSelectableListType>(
  props: IChecklistFilterProps<T>
) => {
  const {
    isOpen,
    setIsOpen,
    onFilter,
    data,
    initialtMemberFilter,
    initialSelectedData,
  } = props;

  const _initialtMemberFilter = React.useMemo(() => new Set(['MEMBER']), []);

  const {
    handleSelect: handleMemberSelect,
    stagedSelectedItems: stagedMemberSelectedItems,
    onFinishSelecting: onFinishMemberSelecting,
  } = useSelectlist({
    data: [{ id: 'MEMBER' }, { id: 'NOT_MEMBER' }],
    multiStage: true,
    initialSelected: _initialtMemberFilter,
  });

  const {
    handleSelect,
    isStagedSelectedAll,
    isNonStagedSelected,
    stagedSelectedItems,
    onFinishSelecting,
  } = useSelectlist({
    data: data ?? [],
    multiStage: true,
    initialSelected: initialSelectedData,
  });

  const onCloseHandle = () => {
    onFinishSelecting(false);
    onFinishMemberSelecting(false);
    setIsOpen(false);
  };

  const handleFilter = () => {
    onFinishSelecting(true);
    onFinishMemberSelecting(true);
    onFilter({
      selectedData:
        data && isStagedSelectedAll
          ? 'SELECTED_ALL'
          : isNonStagedSelected
          ? 'UNSELECTED_ALL'
          : (new Set(stagedSelectedItems) as Set<number>),
      memberFilter: Array.from(stagedMemberSelectedItems) as MemberFilterType,
    });
  };

  return (
    <SDrawerWrapper>
      <Drawer
        className="profileDrawer"
        isVisible={isOpen}
        onClose={onCloseHandle}
        hideScrollbars
      >
        <STitle>{translate('checklist_filter_groups_title')}</STitle>
        {initialtMemberFilter && (
          <>
            <SCheckBoxWithSubTitle
              className="SFilterCheckboxItem-header"
              selected={stagedMemberSelectedItems.has('MEMBER')}
              title={translate('groups_filter_member')!}
              onToggleCheck={() => handleMemberSelect('MEMBER')}
              valueId={0}
              checkBoxType={'box'}
              withoutSeparator
              clickAll
            />
            <SCheckBoxWithSubTitle
              className="SFilterCheckboxItem-header"
              selected={stagedMemberSelectedItems.has('NOT_MEMBER')}
              title={translate('group_not_member')!}
              onToggleCheck={() => handleMemberSelect('NOT_MEMBER')}
              valueId={0}
              checkBoxType={'box'}
              separatorColor={palette.prussianBlue5}
              clickAll
            />
          </>
        )}

        {data && (
          <>
            <STitle>{translate('checklist_filter_accounts_title')}</STitle>
            <SList className="SList">
              <SCheckBoxWithSubTitle
                className="SFilterCheckboxItem-header"
                selected={isStagedSelectedAll}
                title={translate('cec_selectAccounts')!}
                onToggleCheck={() => handleSelect()}
                valueId={0}
                checkBoxType={'box'}
                withoutSeparator
                clickAll
              />
              {data.map((item, index) => (
                <SCheckBoxWithSubTitle
                  className="SFilterCheckboxItem"
                  selected={stagedSelectedItems.has(item.id)}
                  title={item.name}
                  onToggleCheck={handleSelect}
                  key={`${item.id}-${index}`}
                  valueId={item.id}
                  checkBoxType={'box'}
                  withoutSeparator
                  clickAll
                />
              ))}
            </SList>
          </>
        )}

        <SButton
          $valid={!true}
          disabled={!true}
          tx={'messages_filter'}
          onClick={handleFilter}
        />
      </Drawer>
    </SDrawerWrapper>
  );
};

export default ChecklistFilter;
