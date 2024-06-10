import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { MessageFilterFilterBar } from '../ChatsList/ChatsList';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { FilterSection } from '../../components/SearchFilterBar/SearchFilterBar';
import _ from 'lodash';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { connect } from 'react-redux';
import {
  getForwardedMessage,
  getSelectedGroups,
  getSelectedGroupType,
  getSelectedUsers,
  selectActiveTab,
  selectGroupMembers,
  setActiveTab,
} from './createMessageSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { MessageFilter } from '../../components/Chat/MessageFilter';
import { GroupsToShow } from '../../utils/global';
import { Page } from '../../components/Page/Page';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import { fetchUsers, sendAMessage } from './createMessageSlice/actionCreators';
import { ActiveTab, GroupType } from '../../utils/enums';
import { selectUser, selectUserRoles } from '../Login/LoginSlice';
import { SearchBarBase } from '../../components/SearchBarBase/SearchBarBase';
import { SelectGroupsList } from './SelectGroupsList';
import { SelectUsersList } from './SelectUsersList';
import { CreateMessageModel } from '../Chat/Chat';
import { useNavigate } from 'react-router-dom';
import { isSameUser, onlyInSelectListUser } from './helpers';

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

interface CreateMessageProps {
  forward?: boolean;
  fromHoldingStatement?: boolean;
}

const CreateMessageList = (props: CreateMessageProps) => {
  const { forward } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedUsers = useAppSelector(getSelectedUsers);
  const selectedGroups = useAppSelector(getSelectedGroups);
  const membersinSelectedGroups = useAppSelector(selectGroupMembers);
  // extra users that are in the selected user and don't come as a part of the group members
  // !! I HAVE NO IDEA WHATS GOING ON HERE BUT IT WAS CAUSING INVALID USER COUNT SOMETIMES WHEN DESELECTING GROUPS SO I JUST REMOVED THE DUPLICATES FOR NOW
  const onlyInSelectedList = _.uniqBy(
    onlyInSelectListUser(selectedUsers, membersinSelectedGroups, isSameUser),
    function (e) {
      return e.id;
    }
  );

  const selectedType = useAppSelector(getSelectedGroupType);
  const activeTab = useAppSelector(selectActiveTab);
  const roles = useAppSelector(selectUserRoles);
  const user = useAppSelector(selectUser);
  const forwardMessage = useAppSelector(getForwardedMessage);

  const [searchText, setSearchText] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [types, setTypes] = useState<string[]>([
    GROUP_FILTER_SECTIONS.content[0].name!,
  ]);
  const [groupFilters, setGroupFilters] = useState<FilterSection[]>([
    GROUP_FILTER_SECTIONS,
  ]);

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchUsers({ sort: 'name' }));
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === ActiveTab.Users) {
      dispatch(fetchUsers({ sort: 'name', search: searchText }));
    }
    if (activeTab === ActiveTab.Groups) {
      dispatch(fetchGroups({ search: searchText }));
    }
  }, [searchText]);

  const handleOpenFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleForward = () => {
    const groupIDs = _.map(selectedGroups, (grp) => grp.id);
    const recipientIDs = _.map(selectedUsers, (usr) => usr.id);

    if (!forwardMessage) return;
    const {
      documentFileNames,
      audioFileNames,
      photoFileNames,
      text,
      locationID,
    } = forwardMessage;

    const messageModel: CreateMessageModel = {
      senderId: user?.id,
      groupIds: groupIDs,
      recipientIds: recipientIDs.includes(user?.id!)
        ? recipientIDs
        : [...recipientIDs, user?.id!],
      documentFileNames,
      audioFileNames,
      photoFileNames,
      text: text,
      locationId: locationID,
      type: 12,
    };

    dispatch(sendAMessage(messageModel, navigate));
  };

  const handleFilter = () => {
    setFilterOpen(!filterOpen);
    const newTypes = _.map(
      _.filter(_.head(groupFilters)?.content, (x) => x.checked),
      (value) => value.name!
    );
    setTypes(newTypes);
  };

  const canSeeFilter = roles?.includes('SeeOrgGroups');
  const disabled = _.isEmpty(selectedType)
    ? false
    : !selectedType.includes(GroupType.Normal);

  const renderButton = () => (
    <CreateMessageButtonWrapper>
      {forward ? (
        <BigFloatButton onClick={handleForward} tx="messages_proceed" />
      ) : (
        <BigFloatButton link={'/createMessage/new'} tx={'messages_proceed'} />
      )}
    </CreateMessageButtonWrapper>
  );

  return (
    <SPage>
      {canSeeFilter ? (
        <MessageFilterFilterBar
          onSearch={setSearchText}
          handleOpenFilter={handleOpenFilter}
          withoutFilterButton={activeTab === ActiveTab.Users}
          value={searchText}
        />
      ) : (
        <SearchBarBase fallback={setSearchText} value={searchText} />
      )}
      <CreateMessageListWrapper>
        <STabs
          selectedTabClassName="is-selected"
          selectedTabPanelClassName="is-selected"
        >
          <STabList $disabled={disabled}>
            <STab onClick={() => dispatch(setActiveTab(ActiveTab.Groups))}>
              {t('home_groups')} ({selectedGroups.length})
            </STab>
            <STab onClick={() => dispatch(setActiveTab(ActiveTab.Users))}>
              {t('messages_users')} (
              {[...onlyInSelectedList, ...membersinSelectedGroups].length})
            </STab>
          </STabList>
          <STabPanel>
            <SelectGroupsList searchText={searchText} types={types} />
            {!_.isEmpty(selectedGroups) && renderButton()}
          </STabPanel>
          <STabPanel>
            <SelectUsersList searchText={searchText} />
            {!_.isEmpty(selectedUsers) && renderButton()}
          </STabPanel>
        </STabs>
      </CreateMessageListWrapper>
      <MessageFilter
        label={'messages_proceed'}
        isOpen={filterOpen}
        filters={groupFilters}
        setIsOpen={handleOpenFilter}
        setCheckedState={setGroupFilters}
        onFilter={handleFilter}
      />
    </SPage>
  );
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(null, mapDispatchToProps)(CreateMessageList);

const SPage = styled(Page)`
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
`;

export const CreateMessageButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const CreateMessageListWrapper = styled.div`
  height: 100%;
  min-height: 0;
`;

export const NoMessagesWrapper = styled.div`
  margin-top: 10vh;
  text-align: center;

  p {
    margin-top: 1.2rem;
    font-family: 'Roboto-Regular';
    font-weight: 500;
    font-size: 16px;
    line-height: 34px;
    mix-blend-mode: normal;
    color: ${palette.platinum};
  }
`;

export const STabs = styled(Tabs)`
  font-size: 12px;
  width: 100%;
  padding-top: 0px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const STabList = styled(TabList)<any>`
  display: ${(props) => (props.$disabled ? 'none' : 'flex')};
  list-style-type: none;
  margin: 0;
`;

export const STab = styled(Tab)<any>`
  cursor: pointer;
  color: ${(props) => props.disabled && palette.silver};
  width: 50%;
  text-align: center;
  user-select: none;
  padding: 30px 0 10px 0;
  border-bottom: 1px solid ${palette.queenBlue};
  font-family: 'Roboto-Regular';
  font-size: 14px;

  &.is-selected {
    border-bottom: 2px solid ${palette.honeyYellow};
    color: ${palette.honeyYellow};
    margin-bottom: -0.5px;
  }

  &:focus {
    outline: none;
  }
`;

export const STabPanel = styled(TabPanel)`
  &.is-selected {
    height: 100%;
    min-height: 0;
    display: block;
  }
`;
