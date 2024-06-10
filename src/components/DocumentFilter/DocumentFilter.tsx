import * as React from 'react';
import styled, { css } from 'styled-components';
import { palette } from '../../theme/colors';
import Drawer from 'react-bottom-drawer';
import { useSelectlist } from '../../utils/customHooks/useSelectList';
import { CheckBoxWithSubTitle } from '../CheckBoxWithSubTitle/CheckBoxWithSubTitle';
import { translate } from '../../utils/translate';
import { Button } from '../Button/Button';

export const SCheckBoxWithSubTitle = styled(CheckBoxWithSubTitle)`
  .STitle {
    font-family: 'Roboto-Regular';
    font-weight: 400;
    font-size: 0.875rem;
  }
`;

export const SDrawerWrapper = styled.div`
  .profileDrawer {
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1001;
    @media (min-width: 450px) {
      max-width: 26rem;
      margin: auto;
    }
    background-color: ${palette.prussianBlue2};
    max-height: 75vh;
  }
  .profileDrawer__backdrop {
    z-index: 1000;
  }
  .profileDrawer__handle-wrapper {
  }
  .profileDrawer__handle {
    width: 36%;
    margin-top: 1.3125rem;
  }
  .profileDrawer__content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  p.STitle {
    margin-left: 0rem;
    font-weight: 400;
  }
`;

export const SList = styled.ul`
  padding-bottom: 0.5rem;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const STitle = styled.h1`
  margin-bottom: 0.25rem;
  &:not(:first-child) {
    margin-top: 1.25rem;
  }

  font-weight: 500;
  font-size: 1rem;
  font-family: 'Roboto-Medium';
  color: ${palette.white};
  line-height: 1.18rem;
`;

interface SButtonParams {
  $valid?: boolean;
}

export const SButton = styled(Button)<SButtonParams>`
  width: 100%;
  margin-top: 0.8125rem;
  button {
    max-width: 100rem;
    width: 100%;
    font-size: 1rem;
    padding: 0.8125rem 0;
    font-family: 'Roboto-Medium';
    color: ${palette.raisinBlack3};
    ${props =>
      props.$valid &&
      css`
        opacity: 0.5;
        cursor: not-allowed;
      `}
  }
`;

type SelectedAllType = 'SELECTED_ALL' | 'UNSELECTED_ALL';
type MemberFilterType = ('MEMBER' | 'NOT_MEMBER')[];

interface DataSelectableListType {
  id: number;
  name: string;
  imageName?: string;
}

export interface DocumentFilters {
  selectedData?: Set<number> | SelectedAllType;
  showEmptyFolders: boolean;
  memberFilter?: MemberFilterType;
}

export interface IDocumentFilterProps<T> {
  data?: T[];

  initialtShowEmptyFolders: boolean;
  initialtMemberFilter?: Set<'MEMBER' | 'NOT_MEMBER'>;
  initialSelectedData?: Set<number>;

  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

  onFilter: (filters: DocumentFilters) => void;
  resetStaged: () => void;
  onChange?: (filters: DocumentFilters) => void;
}

export const DocumentFilter = <T extends DataSelectableListType>(
  props: IDocumentFilterProps<T>
) => {
  const {
    isOpen,
    setIsOpen,

    onFilter,
    onChange,
    resetStaged,

    data,

    initialtShowEmptyFolders,
    initialtMemberFilter,
    initialSelectedData,
  } = props;

  const [showEmptyFolders, setShowEmptyFolders] = React.useState<boolean>(
    initialtShowEmptyFolders
  );
  const [stagedShowEmptyFolders, setStagedShowEmptyFolders] =
    React.useState<boolean>(initialtShowEmptyFolders);

  const toggleEmptyFolder = () => {
    setStagedShowEmptyFolders(prev => {
      handleChange(!prev);
      return !prev;
    });
  };

  const applyEmptyFolderChange = (
    apply: boolean,
    _stagedShowEmptyFolders?: boolean
  ) => {
    if (apply) {
      if (_stagedShowEmptyFolders !== undefined)
        setShowEmptyFolders(_stagedShowEmptyFolders);
    } else {
      setStagedShowEmptyFolders(showEmptyFolders);
    }
  };

  const {
    handleSelect: handleMemberSelect,
    stagedSelectedItems: stagedMemberSelectedItems,
    onFinishSelecting: onFinishMemberSelecting,
  } = useSelectlist({
    data: [{ id: 'MEMBER' }, { id: 'NOT_MEMBER' }],
    multiStage: true,
    initialSelected: initialtMemberFilter,
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

    applyEmptyFolderChange(false);

    resetStaged();
    setIsOpen(false);
  };

  const handleFilter = () => {
    onFilter({
      selectedData:
        data && isStagedSelectedAll
          ? 'SELECTED_ALL'
          : isNonStagedSelected
          ? 'UNSELECTED_ALL'
          : (new Set(stagedSelectedItems) as Set<number>),
      showEmptyFolders: stagedShowEmptyFolders,
      memberFilter: Array.from(stagedMemberSelectedItems) as MemberFilterType,
    });

    onFinishSelecting(true);
    onFinishMemberSelecting(true);

    applyEmptyFolderChange(true, stagedShowEmptyFolders);
  };

  const handleChange = (_stagedShowEmptyFolders?: boolean) => {
    onChange &&
      onChange({
        showEmptyFolders: _stagedShowEmptyFolders ?? stagedShowEmptyFolders,
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
              onToggleCheck={() => {
                handleMemberSelect('MEMBER');
                handleChange();
              }}
              valueId={0}
              checkBoxType={'box'}
              withoutSeparator
              clickAll
            />
            <SCheckBoxWithSubTitle
              className="SFilterCheckboxItem-header"
              selected={stagedMemberSelectedItems.has('NOT_MEMBER')}
              title={translate('group_not_member')!}
              onToggleCheck={() => {
                handleMemberSelect('NOT_MEMBER');
                handleChange();
              }}
              valueId={0}
              checkBoxType={'box'}
              separatorColor={palette.prussianBlue5}
              clickAll
            />
          </>
        )}
        <SCheckBoxWithSubTitle
          className="SFilterCheckboxItem-header"
          selected={stagedShowEmptyFolders}
          title={translate('documents_show_empty_folders')!}
          onToggleCheck={toggleEmptyFolder}
          valueId={0}
          checkBoxType={'box'}
          withoutSeparator={!data}
          separatorColor={palette.prussianBlue5}
          clickAll
        />
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

// for sake of time will make uit hard coded , not generic for now
// {moreFilters && (
//   <>
//     {moreFilters?.map(filter => (
//       <SList className="SList">
//         {filter.content.map(content => (
// <CheckBoxWithSubTitle
//   className="SFilterCheckboxItem-header"
//   selected={isStagedSelectedAll}
//   title={translate('cec_selectAccounts')!}
//   onToggleCheck={handleSelect}
//   valueId={0}
//   checkBoxType={'box'}
//   withoutSeparator
//   clickAll
// />
//         ))}
//       </SList>
//     ))}
//   </>
// )}
