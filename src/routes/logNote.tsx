import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Chat } from '../containers/Chat/Chat';
import { selectLogNoteById } from '../containers/ChatsList/chatListSlice';
import { fetchChats } from '../containers/ChatsList/chatListSlice/actionCreators';
import { Chat as ChatType } from '../containers/ChatsList/chatListSlice/types';
import { useAppDispatch, useAppSelector } from '../hooks';

export const LogNotePage = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();

  const _message: ChatType | undefined = useAppSelector(
    selectLogNoteById(+id!)
  );

  useEffect(() => {
    if (!_message) dispatch(fetchChats({}));
  }, []);

  return (
    <Layout isMessageLayout to="/log-notes" message={'logNote'}>
      <Chat id={id} setSubMessage />
    </Layout>
  );
};
