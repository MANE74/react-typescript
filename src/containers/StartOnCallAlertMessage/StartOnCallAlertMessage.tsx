import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { MessageFilter } from '../../components/Chat/MessageFilter';
// import { MessageFilter } from '../../components/ChatListItem/MessageFilter';
import { CheckBoxWithSubTitle } from '../../components/CheckBoxWithSubTitle/CheckBoxWithSubTitle';
import { IamOkGroupSelectItem } from '../../components/IamOkGroupSelectItem/IamOkGroupSelectItem';
import Loader from '../../components/Loader/Loader';
import {
  FilterSection,
  SearchFilterBar,
} from '../../components/SearchFilterBar/SearchFilterBar';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { MessageGroupTypes } from '../../utils/enums';
import { translate } from '../../utils/translate';
import {
  getGroupsNameById,
  isCurrentUserTheOnlyMemberOfGroup,
} from '../CreateHoldingStatement/helpers';
import { checkHasMultipleAccounts } from '../Documents/helpers';
import {
  selectGroupsIsLoading,
  selectGroupsNoCANoCOWithFilter,
  selectIamOkGroupsWithFilter,
} from '../GroupsList/groupsSlice';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import { selectUser } from '../Login/LoginSlice';
import { getCurrentUserById } from '../Login/LoginSlice/actionCreators';
import {
  MemberNotMemberGroupsFilters,
  MemberNotMemberFiltersTX,
} from './helpers';
import { useStartOnCallAlertMessageCtx } from './StartOnCallAlertMessageContext';
import { SList, SMessageFilter, SProceedButton } from './styles';

export const SSearchFilterBar = styled(SearchFilterBar)<{
  $withoutFilterButton?: boolean;
}>`
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

const GROUP_FILTER_SECTIONS: FilterSection[] = [
  {
    title: 'messages_show_groups',
    type: 'checkbox',
    content: [
      {
        id: 0,
        name: MemberNotMemberFiltersTX[
          MemberNotMemberGroupsFilters.MemberOfGroup
        ],
        checked: true,
      },
      {
        id: 1,
        name: MemberNotMemberFiltersTX[
          MemberNotMemberGroupsFilters.NotMemberOfGroup
        ],
        checked: false,
      },
    ],
  },
];

export const StartOnCallAlertMessage = () => {
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>();
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [groupFilters, setGroupFilters] = React.useState<FilterSection[]>(
    GROUP_FILTER_SECTIONS
  );

  const isLoading = useAppSelector(selectGroupsIsLoading);
  const groups = useAppSelector(
    selectGroupsNoCANoCOWithFilter(
      groupFilters[0].content
        .filter(filter => filter.checked)
        .map(filter => filter.id),
      searchTerm
    )
  );
  const user = useAppSelector(selectUser);
  const confirm = useConfirmation();

  const { setTabsState } = useLayoutContext();
  const { setGroupIds, groupIds } = useStartOnCallAlertMessageCtx();
  const isSeeOrgGroups = user?.roles?.includes('SeeOrgGroups');
  const isHasMultipleAccounts = checkHasMultipleAccounts(groups);

  const [selectedGroupId, setSelectedGroupId] = React.useState<
    number | undefined
  >(groupIds);

  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  React.useEffect(() => {
    dispatch(fetchGroups());
    if (!user) dispatch(getCurrentUserById());
  }, []);

  const canProceed = selectedGroupId !== undefined;

  const withMemberFilter = user?.roles?.includes('SeeOrgGroups');

  const handleProceed = async () => {
    const checkGroups = await isCurrentUserTheOnlyMemberOfGroup(
      [selectedGroupId!],
      user!.id
    );
    if (checkGroups.is) {
      if (checkGroups.singleCurrentUserGroupIds) {
        const singleGroupUser = getGroupsNameById(
          checkGroups.singleCurrentUserGroupIds,
          groups
        );

        confirm({
          title: 'warning',
          description: translate('select_single_user_group_error')!,
          onSubmit: () => {},
          confirmText: 'ok',
        });
        return;
      }
    }
    setGroupIds(selectedGroupId);
    navigation('summary');
  };

  const toggleFilterOpen = () => setFilterOpen(prev => !prev);

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <>
      <SSearchFilterBar
        onSearch={onSearch}
        handleOpenFilter={toggleFilterOpen}
        withoutFilterButton={!isSeeOrgGroups}
        $withoutFilterButton={!isSeeOrgGroups}
        value={searchTerm}
      />
      <SMessageFilter
        setTabBar={setTabsState}
        label={'filter'}
        isOpen={filterOpen}
        filters={groupFilters}
        setIsOpen={setFilterOpen}
        setCheckedState={setGroupFilters}
        onFilter={groupFiltersNew => {
          setGroupFilters(groupFiltersNew);
          toggleFilterOpen();
        }}
      />
      <SList $buttonPadding={canProceed}>
        {groups.map((group, index) => {
          return (
            <IamOkGroupSelectItem
              key={`${group.id}-${index}`}
              group={group}
              withSubtitle={isHasMultipleAccounts}
              selected={selectedGroupId === group.id}
              onToggleCheck={setSelectedGroupId}
            />
          );
        })}
      </SList>
      {canProceed && <SProceedButton tx="proceed" onClick={handleProceed} />}
    </>
  );
};
