import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { STabPanel, STabs } from './Checklists';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  editChecklistGroups,
  fetchGroups,
  fetchUsers,
  startChecklistAction,
} from './checklistsSlice/actionCreators';
import {
  getActiveChecklist,
  getChecklistName,
  getPreSelectedGroups,
  getSelectedGroups,
  getSelectedUsers,
  isChecklistsLoading,
  selectHasMultipleAccounts,
  selectUsers,
  setSelectedGroups,
  setSelectedUsers,
} from './checklistsSlice';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { useNavigate } from 'react-router-dom';
import { STab, STabList } from '../CreateMessage/CreateMessageList';
import { ActiveTab } from '../../utils/enums';
import {
  ChecklistSelectGroupsList,
  SelectedGroup,
} from './ChecklistSelectGroupsList';
import { ChecklistSelectUsersList } from './ChecklistSelectUsersList';
import { Page } from '../../components/Page/Page';
import { selectUserRoles } from '../Login/LoginSlice';
import { MessageFilterFilterBar } from '../ChatsList/ChatsList';
import ChecklistFilter, { ChecklistFilters } from './ChecklistFilter';
import {
  selectGroupsAccountsWithFilter,
  selectChecklistGroupsWithSearchFilter,
} from './checklistsSlice';
import Loader from '../../components/Loader/Loader';
import { getCheckListTemplateUsersCount } from './helpers';
import { SearchBarBase } from '../../components/SearchBarBase/SearchBarBase';
import { getGroupMembers } from '../../apis/groupsAPI';

interface CreateChecklistProps {
  start?: boolean;
  edit?: boolean;
  id?: string;
}

function CreateChecklist(props: CreateChecklistProps) {
  const { start, edit, id } = props;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedUsers = useAppSelector(getSelectedUsers);
  const selectedGroups = useAppSelector(getSelectedGroups);

  const checklistName = useAppSelector(getChecklistName);
  const roles = useAppSelector(selectUserRoles);
  const isMultipleAccounts = useAppSelector(selectHasMultipleAccounts);
  const isLoading = useAppSelector(isChecklistsLoading);
  const checklist = useAppSelector(getActiveChecklist);
  const preSelectedGroups = useAppSelector(getPreSelectedGroups);
  const users = useAppSelector(selectUsers);

  const isSeeOrgGroups = roles?.includes('SeeOrgGroups');

  const [activeTab, setActiveTab] = useState(ActiveTab.Groups);
  const [searchText, setSearchText] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = React.useState<ChecklistFilters>({
    memberFilter: isSeeOrgGroups ? ['MEMBER'] : undefined,
    selectedData: isMultipleAccounts ? 'SELECTED_ALL' : undefined,
  });

  useEffect(() => {
    if (isMultipleAccounts && filters.selectedData === undefined) {
      setFilters((prev) => ({
        ...prev,
        selectedData: isMultipleAccounts ? 'SELECTED_ALL' : undefined,
      }));
    }
  }, [isMultipleAccounts]);

  const checklistGroups = useAppSelector(
    selectChecklistGroupsWithSearchFilter(searchText, filters)
  );
  const groupAccounts = useAppSelector(selectGroupsAccountsWithFilter(filters));

  useEffect(() => {
    dispatch(fetchGroups({ menuitem: 'checklists' }));
    dispatch(fetchUsers({ menuitem: 'checklists' }));
  }, [dispatch]);

  useEffect(() => {
    if (!_.isEmpty(preSelectedGroups)) preSelectGroups(preSelectedGroups);
  }, [preSelectedGroups]);

  useEffect(() => {
    if (!checklistName && !edit) navigate('/checklists');
    if (edit && !checklist) navigate('/checklists');
  }, [checklistName, edit]);

  const handleEditAccess = () => {
    const sharedGroupIDs = checklistGroups
      .filter((e) => checklist?.sharedGroups.includes(e.id) && e.member)
      .map((grp) => grp.id);

    var selectedGroupIds = selectedGroups.map((grp) => grp.id);

    const unselectedGroupsIds = _.filter(
      sharedGroupIDs,
      (grpID) => !_.includes(selectedGroupIds, grpID)
    );

    selectedGroupIds = selectedGroupIds.filter(
      (grpId) => !_.includes(checklist?.sharedGroups, grpId)
    );

    dispatch(
      editChecklistGroups(
        Number(id),
        selectedGroupIds,
        unselectedGroupsIds,
        () => navigate(`/checklist/${id}`)
      )
    );
  };

  const preSelectGroups = async (selectedGroups: SelectedGroup[]) => {
    const tempUserArr = [];

    for await (const group of selectedGroups) {
      const groupMembers = await getGroupMembers({ id: group.id });
      for (let groupMember of groupMembers) {
        const found = _.find(users, (user) => user.id === groupMember.userID);
        if (found) {
          tempUserArr.push(found);
        }
      }
    }

    dispatch(setSelectedUsers(tempUserArr));
    dispatch(setSelectedGroups(selectedGroups));
  };

  const handleFilter = (filters: ChecklistFilters) => {
    setFilters(filters);
    setFilterOpen(!filterOpen);
  };

  const handleStartChecklist = () => {
    const selectedGroupIds = selectedGroups.map((grp) => grp.id);

    dispatch(startChecklistAction(Number(id), selectedGroupIds, navigate));
  };
  const canSeeFilter =
    roles?.includes('SeeOrgGroups') && activeTab == ActiveTab.Groups;

  if (isLoading) return <Loader />;

  return (
    <SPage noBottomPadding>
      {canSeeFilter ? (
        <MessageFilterFilterBar
          onSearch={setSearchText}
          handleOpenFilter={() => setFilterOpen(!filterOpen)}
          margin
        />
      ) : (
        <SSearchBarBase
          fallback={setSearchText}
          placeholderTx="documents_search"
          value={searchText}
        />
      )}
      <div>
        <STutorialText>
          {t(`checklists_template_create_users_intro`)}
        </STutorialText>
      </div>
      <STabContainer>
        <STabs
          selectedTabClassName="is-selected"
          selectedTabPanelClassName="is-selected"
        >
          <STabList>
            <STab onClick={() => setActiveTab(ActiveTab.Groups)}>
              {t('documents_groups')} ({selectedGroups.length})
            </STab>
            <STab onClick={() => setActiveTab(ActiveTab.Users)}>
              {t('messages_users')} (
              {getCheckListTemplateUsersCount(selectedUsers)})
            </STab>
          </STabList>
          <STabPanel>
            <ChecklistSelectGroupsList
              groups={
                start
                  ? checklistGroups.filter(
                      (e) => checklist?.sharedGroups.includes(e.id) && e.member
                    )
                  : checklistGroups
              }
            />
          </STabPanel>
          <STabPanel>
            <ChecklistSelectUsersList start={start} searchText={searchText} />
          </STabPanel>
        </STabs>
      </STabContainer>
      {(!_.isEmpty(selectedUsers) || !_.isEmpty(selectedGroups)) && (
        <SButtonWrapper>
          {edit ? (
            <BigFloatButton onClick={handleEditAccess} tx={'proceed'} />
          ) : start ? (
            <BigFloatButton onClick={handleStartChecklist} tx={'proceed'} />
          ) : (
            <BigFloatButton link={'/checklists/new'} tx={'proceed'} />
          )}
        </SButtonWrapper>
      )}

      <ChecklistFilter
        isOpen={filterOpen}
        setIsOpen={() => setFilterOpen(!filterOpen)}
        onFilter={handleFilter}
        data={isMultipleAccounts ? groupAccounts : undefined} // if subbaccounts
        initialtMemberFilter={filters.memberFilter}
        initialSelectedData={
          filters.selectedData === 'SELECTED_ALL'
            ? new Set(groupAccounts.map((g) => g.id))
            : filters.selectedData !== 'UNSELECTED_ALL'
            ? filters.selectedData
            : undefined
        }
      />
    </SPage>
  );
}

export default CreateChecklist;

const SPage = styled(Page)`
  display: flex;
  flex-direction: column;
`;

const SSearchBarBase = styled(SearchBarBase)`
  margin: 0 0 1.25rem 0;
`;

const STutorialText = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 14px;
  font-style: italic;
`;

const STabContainer = styled.div`
  min-height: 0;
  height: 100%;
`;

const SButtonWrapper = styled.div``;
