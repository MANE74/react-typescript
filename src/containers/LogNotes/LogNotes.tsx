import * as React from 'react';
import styled from 'styled-components';
import Loader from '../../components/Loader/Loader';
import { Page } from '../../components/Page/Page';
import { SearchBarBase } from '../../components/SearchBarBase/SearchBarBase';
import { TitlesWithTime } from '../../components/TitlesWithTimeCard/TitlesWithTime';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { isChatsLoading, selectLogNotes } from '../ChatsList/chatListSlice';
import {
  deleteAMessage,
  fetchLogNotes,
} from '../ChatsList/chatListSlice/actionCreators';
import Trash from '../../assets/imgs/chats/trash.svg';

import NoMessages from '../../assets/imgs/NotFound/no-result.svg';

import {
  getMessageSubject,
  handleDate,
  messageShowGenerator,
} from '../HoldingStatement/helpers';
import { selectUser } from '../Login/LoginSlice';
import Options from '../../components/Options/Options';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { EmptyListFallback } from '../../components/EmptyListFallback/EmptyListFallback';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { useNavigate } from 'react-router-dom';

export const LogNotes = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirmation();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const logNotes = useAppSelector(selectLogNotes);
  const isLoading = useAppSelector(isChatsLoading);

  const [searchTerm, setSearchTerm] = React.useState<string | undefined>();
  const [optionsOpen, setOptionsOpen] = React.useState<boolean>(false);
  const [selectedChatId, setSelectedChatId] = React.useState<number>();

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleHide = (id: number) => () => {
    confirm({
      title: 'messages_delete_title',
      description: 'messages_logNotes_deleteConfirmDesc',
      onSubmit: () => {
        dispatch(deleteAMessage(id, navigate, true));
        setOptionsOpen(false);
      },
      onCancel: () => {
        setOptionsOpen(false);
      },
      confirmText: 'logNote_delete_button',
      cancelText: 'cancel',
    });
  };

  const onclickDots = (id: number) => {
    setSelectedChatId(id);
    setOptionsOpen(!optionsOpen);
  };

  React.useEffect(() => {
    try {
      dispatch(fetchLogNotes({ search: searchTerm }));
    } catch (e) {
      console.log(e);
    }
  }, [dispatch, searchTerm]);

  const handleClick = (id: number) => {
    navigate(`/log-note/${id}`);
  };

  return (
    <SPage>
      <SSearchBarBase
        placeholderTx="documents_search"
        placeholder="Search..."
        fallback={onSearch}
        value={searchTerm}
      />

      {isLoading && <Loader />}
      <EmptyListFallback
        src={NoMessages}
        listLength={logNotes.length}
        isLoading={isLoading}
        searchTerm={''}
        emptyListTx={'noLogNotes'}
        noSearchTx={'messages_not_found_search'}
      />
      {logNotes.length > 0 && !isLoading && (
        <>
          <Options
            isOpen={optionsOpen}
            setIsOpen={setOptionsOpen}
            setTabBar
            items={[
              {
                name: 'logNote_delete_button',
                icon: Trash,
                callback: handleHide(selectedChatId!),
              },
            ]}
          />

          <SList>
            {logNotes.map(logNote => (
              <TitlesWithTime
                onClick={() => handleClick(logNote.id)}
                itemId={logNote.id}
                key={`${logNote.id}`}
                title={getMessageSubject(logNote)}
                subTitle={messageShowGenerator(logNote, user?.id!)}
                date={handleDate(logNote, 'sent')!}
                time={
                  handleDate(logNote, 'lastReplySent') ??
                  handleDate(logNote, 'sent')!
                }
                onMoreOptionClick={onclickDots}
              />
            ))}
          </SList>
        </>
      )}
      <BigFloatButton link={'/log-note/new'} tx={'logNotes_create'} />
    </SPage>
  );
};

const SPage = styled(Page)`
  padding-bottom: 0;
  position: relative;
  display: flex;
  flex-direction: column;
`;
const SList = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  * + * {
    margin-top: 0.5rem;
  }
  margin-top: 1.25rem;
  overflow-y: auto;
  height: 100%;
  min-height: 0;
  padding-bottom: 5rem;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SSearchBarBase = styled(SearchBarBase)`
  width: 100%;
`;

export const NoMessagesWrapper = styled.div`
  text-align: center;
  margin-top: 1rem;
  p {
    font-family: 'Roboto-Medium';
    font-size: 1rem;
    margin-top: 1rem;
  }
`;
