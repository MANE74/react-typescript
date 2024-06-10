import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChatListItem } from '../../components/Chat/ChatListItem';
import {
  getActiveChatGroups,
  isChatsLoading,
  selectChatListFilters,
  selectChats,
  selectIsIncomingMessages,
  selectSearchPhrase,
  setChatFilters,
  setIsChatsLoading,
} from './chatListSlice';
import {
  hideAMessage,
  fetchChats,
  resetChat,
} from './chatListSlice/actionCreators';
import _, { debounce, filter } from 'lodash';
import { Chat } from './chatListSlice/types';
import { SearchFilterBar } from '../../components/SearchFilterBar/SearchFilterBar';
import { CreateMessageButtonWrapper } from '../CreateMessage/CreateMessageList';
import { ChatListFilter } from '../../components/Chat/ChatListFilter';
import NoMessages from '../../assets/imgs/NotFound/no-result.svg';
import Loader from '../../components/Loader/Loader';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import { Group } from '../GroupsList/groupsSlice/types';
import { selectGroups } from '../GroupsList/groupsSlice';
import Options from '../../components/Options/Options';
import EyeSlash from '../../assets/imgs/chats/hide.svg';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectUser } from '../Login/LoginSlice';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { SentMessageType } from '../../utils/enums';
import { Page } from '../../components/Page/Page';
import { EmptyListFallback } from '../../components/EmptyListFallback/EmptyListFallback';
import { useNavigate } from 'react-router-dom';

interface ChatsListProps {
  overview?: boolean;
}

export const ChatsList = (props: ChatsListProps) => {
  const confirm = useConfirmation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const chats: Chat[] = useAppSelector(selectChats);
  const groups: Group[] = useAppSelector(selectGroups);
  const activeChatGroups: Group[] = useAppSelector(getActiveChatGroups);
  const isLoading: boolean = useAppSelector(isChatsLoading);
  const user = useAppSelector(selectUser);
  const incomingMessages = useAppSelector(selectIsIncomingMessages);
  const searchPhrase = useAppSelector(selectSearchPhrase);
  const chatFilters = useAppSelector(selectChatListFilters);

  const chatListContainer = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<number | undefined>(
    undefined
  );
  const [selectedFilterGroups, setSelectedFilterGroups] = useState<number[]>(
    []
  );
  const [filteredChats, setFilteredChats] = useState<Chat[]>(chats);
  const [limit, setLimit] = useState(12);
  const searchRef = useRef<any>(null);

  useEffect(() => {
    dispatch(resetChat());
    if (chats.length === 0) {
      dispatch(fetchChats({ search: '' }));
      dispatch(fetchGroups());
    }

    setSearchText(searchPhrase);
    if (searchRef.current) {
      searchRef.current.value = searchPhrase;
    }

    if (!_.isEmpty(chatFilters)) {
      setSelectedFilterGroups(chatFilters);
      const newChats = _.filter(
        chats,
        (messageItem) =>
          _.includes(chatFilters, messageItem.groupID) || _.isEmpty(groups)
      );
      filterAndSortChats(newChats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (chats.length > 0 && incomingMessages) {
      dispatch(fetchChats({ search: '' }));
      if (!_.isEmpty(chatFilters)) {
        setSelectedFilterGroups(chatFilters);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingMessages]);

  useEffect(() => {
    if (_.isEmpty(chatFilters)) {
      filterAndSortChats(chats);
    }
  }, [chats]);

  const filterAndSortChats = (_chats: Chat[]) => {
    let newChats = [..._chats];
    let sortedChats = newChats.sort((a, b) => {
      const first = a.lastReplySent || a.sent;
      const second = b.lastReplySent || b.sent;

      return second.localeCompare(first);
    });
    setFilteredChats(
      _.filter(
        sortedChats,
        message => message.type !== SentMessageType.LogNotes
      )
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handler = useCallback(
    debounce(() => {
      if (chatListContainer.current) {
        chatListContainer.current.scrollBy(0, -200);
      }

      setLimit(limit + 12);
    }, 1000),
    [limit]
  );

  const onFilterClick = () => {
    setFilterOpen(!filterOpen);
  };

  const submitFilteredGroups = () => {
    setFilterOpen(false);
    const newChats = _.filter(
      chats,
      messageItem =>
        _.includes(selectedFilterGroups, messageItem.groupID) ||
        _.isEmpty(groups)
    );
    dispatch(setChatFilters(selectedFilterGroups));
    filterAndSortChats(newChats);
  };

  const handleHide = (id: number) => {
    confirm({
      title: 'confirmLeaveGroupTitle',
      description: 'deleteMessage',
      onSubmit: () => {
        dispatch(hideAMessage(id, filteredChats));
        setOptionsOpen(false);
      },
      onCancel: () => {
        setOptionsOpen(false);
      },
      confirmText: 'messages_hide',
      cancelText: 'cancel',
    });
  };

  const onclickDots = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    setSelectedChatId(id);
    setOptionsOpen(!optionsOpen);
  };

  const handleSearch = (searchText: string) => {
    dispatch(setIsChatsLoading(true));
    setSearchText(searchText);
    dispatch(fetchChats({ search: searchText }));
  };

  const scrolled = () => {
    if (!chatListContainer.current) {
      return;
    }
    if (limit >= filteredChats.length) {
      return;
    }

    if (
      chatListContainer.current.offsetHeight +
        chatListContainer.current.scrollTop +
        50 >=
      chatListContainer.current.scrollHeight
    ) {
      handler();
    }
  };

  const navigateToChat = (id: number) => {
    navigate(`/message/${id}`, {
      replace: true,
      state: { fromOverview: props.overview },
    });
  };

  // Filter out all null values
  const groupsWithPhotos = _.filter(groups, grp => !!grp.imageFileName);

  return (
    <SPage overview={props.overview}>
      {!props.overview && (
        <>
          <MessageFilterFilterBar
            onSearch={handleSearch}
            handleOpenFilter={() => onFilterClick()}
            forwardedRef={searchRef}
            value={searchText}
          />
          {!_.isEmpty(activeChatGroups) && (
            <ChatListFilter
              serachbarTitle="documents_filter_groups"
              title="groups_all"
              label={'messages_filter'}
              isOpen={filterOpen}
              groupsList={activeChatGroups}
              chatsSearchText={searchText}
              setIsOpen={onFilterClick}
              selected={selectedFilterGroups}
              setSelected={setSelectedFilterGroups}
              onFilter={submitFilteredGroups}
            />
          )}
        </>
      )}
      {filteredChats.length === 0 && !isLoading && (
        <EmptyListFallback
          src={NoMessages}
          listLength={filteredChats.length}
          isLoading={false}
          searchTerm={''}
          emptyListTx={'noMessages'}
          noSearchTx={''}
        />
      )}
      {isLoading && <Loader />}
      {filteredChats.length > 0 && !isLoading && (
        <>
          <Options
            isOpen={optionsOpen}
            setIsOpen={setOptionsOpen}
            setTabBar
            items={[
              {
                name: 'messages_hide',
                icon: EyeSlash,
                callback: () => {
                  handleHide(selectedChatId!);
                },
              },
            ]}
          />

          <>
            <MessageList
              ref={chatListContainer}
              onScroll={scrolled}
              overview={props.overview}
            >
              {filteredChats.slice(0, limit).map((chat, key) => {
                const foundGroups = _.filter(groupsWithPhotos, grp =>
                  chat.groupIDs.includes(grp.id)
                );
                return (
                  <ChatListItem
                    key={key}
                    message={chat}
                    handleDots={onclickDots}
                    onClick={navigateToChat}
                    userId={user?.id!}
                    overview={props.overview}
                    searchText={searchText}
                    groupPictures={foundGroups.map(grp => grp.imageFileName!)}
                  />
                );
              })}
            </MessageList>
          </>
        </>
      )}
      {!props.overview && (
        <CreateMessageButtonWrapper>
          <BigFloatButton
            link={'/createMessage'}
            tx={'messages_createMessage'}
          />
        </CreateMessageButtonWrapper>
      )}
    </SPage>
  );
};

const SPage = styled(Page)<any>`
  padding: ${props => (props.overview ? '0' : '1.25rem 1.25rem 0')};
  display: flex;
  flex-direction: column;
`;

export const MessageList = styled.div<any>`
  margin: ${props => (props.overview ? '0' : '1.25rem 0 0')};
  padding-bottom: ${props => (props.overview ? '0' : '5rem')};

  height: ${props => props.height || '100%'};

  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const MessageFilterFilterBar = styled(SearchFilterBar)<any>`
  width: 100%;
  margin-bottom: ${props => props.margin && '1.25rem'};
`;
