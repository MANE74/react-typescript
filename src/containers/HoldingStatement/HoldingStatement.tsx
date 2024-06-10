import * as React from 'react';
import { HoldingStatementCard } from '../../components/HoldingStatementCard/HoldingStatementCard';

import { Page } from '../../components/Page/Page';
import styled from 'styled-components';

import { SearchFilterBar } from '../../components/SearchFilterBar/SearchFilterBar';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { translate } from '../../utils/translate';
import { selectUser } from '../Login/LoginSlice';
import {
  getMessageSender,
  getMessageSubject,
  getRecipientsMedia,
  handleDate,
  messageShowGenerator,
  getStatementTitle,
} from './helpers';
import Loader from '../../components/Loader/Loader';
import { ChatListFilter } from '../../components/Chat/ChatListFilter';
import { useStatementFilterdAndPagination } from '../../utils/customHooks/useStatementFilterdAndPagination';
import NoMessages from '../../assets/imgs/NotFound/no-result.svg';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { useNavigate } from 'react-router-dom';
import { palette } from '../../theme/colors';
import {
  getActiveStatementGroups,
  isChatsLoading,
  selectHoldingStatement,
  selectHoldingStatementWithFilter,
} from '../ChatsList/chatListSlice';
import {
  deleteAMessage,
  deleteHoldingStatement,
  fetchHoldingStatement,
} from '../ChatsList/chatListSlice/actionCreators';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import Options from '../../components/Options/Options';
import Trash from '../../assets/imgs/chats/trash.svg';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';

const SPage = styled(Page)`
  padding: 1.25rem 0 1.5rem 0;
  /* to make only the list overflow */
  position: relative;
  height: 100%;
`;

const SSearchFilterBar = styled(SearchFilterBar)`
  width: 90%;
  margin: auto;
  input {
    ::placeholder {
      color: ${palette.silver};
      font-size: 1rem;
      opacity: 1;
    }

    :-ms-input-placeholder {
      color: ${palette.silver};
    }

    ::-ms-input-placeholder {
      color: ${palette.silver};
    }
  }
`;

const SList = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.25rem;

  overflow-y: auto;
  height: calc(100% - 4.5rem);

  padding-bottom: 4.375rem;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SLoader = styled(Loader)`
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
`;

export const NoMessagesWrapper = styled.div`
  text-align: center;
  margin-top: 6rem;
  p {
    font-family: 'Roboto-Medium';
    font-size: 1rem;
    margin-top: 1rem;
  }
`;

export const HoldingStatement = () => {
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [selectedGroups, setSelectedGroups] = React.useState<Array<number>>([]);

  const confirm = useConfirmation();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeGroups = useAppSelector(getActiveStatementGroups);
  const isLoading = useAppSelector(isChatsLoading);
  const [filterOnlyGroupIds, setFilterOnlyGroupIds] = React.useState<
    number[] | undefined
  >();
  const statements = useAppSelector(
    selectHoldingStatementWithFilter(filterOnlyGroupIds, activeGroups)
  );

  const [searchTerm, setSearchTerm] = React.useState<string | undefined>();
  const [optionsOpen, setOptionsOpen] = React.useState<boolean>(false);
  const [selectedChatId, setSelectedChatId] = React.useState<number>();

  const chatListContainer = React.useRef<HTMLUListElement>(null);

  const toggleFilterOpen = () => setFilterOpen(prev => !prev);

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  const submitFilteredGroups = () => {
    setFilterOpen(false);
    setFilterOnlyGroupIds(selectedGroups);
  };

  const scrolled = () => {};

  const handleRedirect = (id: number) => {
    navigate(`/message/${id}/fromHoldingStatement`);
  };
  const handleHide = (id: number) => () => {
    confirm({
      title: 'messages_delete_title',
      description: 'statement_deleteConfirmDesc',
      onSubmit: () => {
        dispatch(deleteHoldingStatement(id, searchTerm));
        setOptionsOpen(false);
      },
      onCancel: () => {
        setOptionsOpen(false);
      },
      confirmText: 'messages_delete',
      cancelText: 'cancel',
    });
  };
  const onclickDots = (id: number) => {
    setSelectedChatId(id);
    setOptionsOpen(!optionsOpen);
  };

  React.useEffect(() => {
    dispatch(fetchGroups());
  }, []);
  React.useEffect(() => {
    try {
      dispatch(fetchHoldingStatement({ search: searchTerm }));
    } catch (e) {
      console.log(e);
    }
  }, [dispatch, searchTerm]);

  return (
    <SPage>
      <SSearchFilterBar
        onSearch={onSearch}
        handleOpenFilter={toggleFilterOpen}
        value={searchTerm}
      />
      <ChatListFilter
        serachbarTitle="documents_filter_groups"
        title="groups_all"
        label={'messages_filter'}
        isOpen={filterOpen}
        groupsList={activeGroups}
        setIsOpen={toggleFilterOpen}
        selected={selectedGroups}
        setSelected={setSelectedGroups}
        onFilter={submitFilteredGroups}
      />
      {isLoading && <SLoader />}
      {statements.length === 0 && !isLoading && (
        <NoMessagesWrapper>
          <img src={NoMessages} alt="" />
          <p>{translate('statement_empty')}</p>
        </NoMessagesWrapper>
      )}
      {statements.length > 0 && (
        <>
          <Options
            isOpen={optionsOpen}
            setIsOpen={setOptionsOpen}
            setTabBar
            items={[
              {
                name: 'messages_delete',
                icon: Trash,
                callback: handleHide(selectedChatId!),
              },
            ]}
          />
          <SList ref={chatListContainer} onScroll={scrolled}>
            {statements.map(statement => (
              <HoldingStatementCard
                key={`${statement.id}`}
                date={handleDate(statement, 'sent')!}
                time={
                  handleDate(statement, 'lastReplySent') ??
                  handleDate(statement, 'sent')!
                }
                title={getStatementTitle(statement)}
                subTitleName={getMessageSender(statement, user?.id!)}
                subTitle={messageShowGenerator(statement, user?.id!)}
                subject={getMessageSubject(statement)}
                media={getRecipientsMedia(statement)}
                id={statement.id}
                onClick={handleRedirect}
                searchText={searchTerm}
                onMoreOptionClick={onclickDots}
              />
            ))}
          </SList>
        </>
      )}
      <BigFloatButton
        link={'/createHoldingStatement'}
        tx={'statement_create'}
      />
    </SPage>
  );
};
