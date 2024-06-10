import { useEffect, useState } from 'react';
import { MessageFilter } from '../../components/Chat/MessageFilter';
import { FilterSection } from '../../components/SearchFilterBar/SearchFilterBar';
import { GroupsToShow } from '../../utils/global';
import { MessageFilterFilterBar } from '../ChatsList/ChatsList';
import { SelectGroupsList } from '../CreateMessage/SelectGroupsList';
import _ from 'lodash';
import styled from 'styled-components';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getSelectedGroups,
  getSelectedUsers,
  selectActiveTab,
  setActiveTab,
  setSelectedGroupType,
} from '../CreateMessage/createMessageSlice';
import { t } from 'i18next';
import { SelectUsersList } from '../CreateMessage/SelectUsersList';
import { useLayoutContext } from '../../utils/customHooks/LayoutContext';
import { SearchBarBase } from '../../components/SearchBarBase/SearchBarBase';
import {
  STabs,
  STabList,
  STab,
  STabPanel,
} from '../CreateMessage/CreateMessageList';
import { addRecipients } from './chatDetailsSlice/actionCreators';
import { Page } from '../../components/Page/Page';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import { fetchUsers } from '../CreateMessage/createMessageSlice/actionCreators';
import { selectIsLoading } from './chatDetailsSlice';
import Loader from '../../components/Loader/Loader';
import { ActiveTab } from '../../utils/enums';
import {
  selectCurrentChat,
  selectMessagesRecipients,
} from '../ChatsList/chatListSlice';
import {
  fetchCurrentChat,
  getMessagesRecipientsAction,
} from '../ChatsList/chatListSlice/actionCreators';

const GROUP_FILTER_SECTIONS: FilterSection = {
  title: 'messages_show_groups',
  type: 'checkbox',
  content: [
    {
      id: 0,
      name: GroupsToShow.MemberOfGroup,
      checked: true,
    },
    {
      id: 1,
      name: GroupsToShow.NotMemberOfGroup,
      checked: false,
    },
  ],
};

export default function AddGroups() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const layout = useLayoutContext();

  const message = useAppSelector(selectCurrentChat);
  const selectedGroups = useAppSelector(getSelectedGroups);
  const selectedUsers = useAppSelector(getSelectedUsers);
  const isLoading = useAppSelector(selectIsLoading);
  const activeTab = useAppSelector(selectActiveTab);
  const recipients = useAppSelector(selectMessagesRecipients);

  const [types, setTypes] = useState<string[]>([
    GROUP_FILTER_SECTIONS.content[0].name!,
  ]);
  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [groupFilters, setGroupFilters] = useState<FilterSection[]>([
    GROUP_FILTER_SECTIONS,
  ]);

  const showProceed = !_.isEmpty(selectedGroups) || !_.isEmpty(selectedUsers);
  const showFilter = _.isEqual(activeTab, ActiveTab.Groups);

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchUsers());
    dispatch(setSelectedGroupType([]));

    if (!message) dispatch(fetchCurrentChat(id!));
    if (!recipients) dispatch(getMessagesRecipientsAction(Number(id)));
  }, [dispatch]);

  useEffect(() => {
    setSearchText('');
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === ActiveTab.Users) {
      dispatch(fetchUsers({ sort: 'name', search: searchText }));
    }
    if (activeTab === ActiveTab.Groups) {
      dispatch(fetchGroups({ search: searchText }));
    }
  }, [searchText]);

  const handleOpenFilter = () => {
    layout.setTabsState(isFilterOpen);
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilter = () => {
    const newTypes = _.map(
      _.filter(_.head(groupFilters)?.content, (x) => x.checked),
      (value) => value.name!
    );
    setTypes(newTypes);
    layout.setTabsState(isFilterOpen);
    setIsFilterOpen(false);
  };

  const handleAddRecipients = () => {
    const selectedUsersIds = selectedUsers.map((usr) => usr.id);
    dispatch(
      addRecipients(Number(id), selectedGroups, selectedUsersIds, () => {
        navigate(`/message-details/${id}`);
      })
    );
  };

  if (isLoading) {
    return (
      <Page>
        <Loader />
      </Page>
    );
  }

  return (
    <SPage>
      {showFilter ? (
        <MessageFilterFilterBar
          onSearch={setSearchText}
          handleOpenFilter={handleOpenFilter}
        />
      ) : (
        <SSearchBarBase
          fallback={setSearchText}
          placeholderTx="documents_search"
          placeholder="Search..."
          value={searchText}
        />
      )}

      <CreateMessageListWrapper>
        <STabs
          selectedTabClassName="is-selected"
          selectedTabPanelClassName="is-selected"
        >
          <STabList>
            <STab onClick={() => dispatch(setActiveTab(ActiveTab.Groups))}>
              {t('home_groups')}
            </STab>
            <STab onClick={() => dispatch(setActiveTab(ActiveTab.Users))}>
              {t('messages_users')}
            </STab>
          </STabList>
          <STabPanel>
            <SelectGroupsList
              searchText={searchText}
              types={types}
              onlyNormal
              groupsToHide={message?.groupIDs}
            />
          </STabPanel>
          <STabPanel>
            <SelectUsersList
              searchText={searchText}
              usersToHide={recipients.map((usr) => usr.userID)}
              excludeRecipients
            />
          </STabPanel>
        </STabs>
      </CreateMessageListWrapper>

      {showProceed && (
        <ButtonWrapper>
          <BigFloatButton
            tx={'messages_proceed'}
            onClick={handleAddRecipients}
          />
        </ButtonWrapper>
      )}

      <MessageFilter
        isOpen={isFilterOpen}
        label={'messages_proceed'}
        filters={groupFilters}
        setIsOpen={handleOpenFilter}
        setCheckedState={setGroupFilters}
        onFilter={handleFilter}
      />
    </SPage>
  );
}

const SPage = styled(Page)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 0;
`;

export const CreateMessageListWrapper = styled.div`
  min-height: 0;
  height: 100%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const GroupsListWrapper = styled.div`
  flex: 1;
`;

const SSearchBarBase = styled(SearchBarBase)`
  width: 100%;
`;
