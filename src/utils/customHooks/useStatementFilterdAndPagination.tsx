import { includes, isEmpty } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { getChats } from '../../apis/chatAPI';
import {
  getActiveStatementGroups,
  loadMore,
} from '../../containers/ChatsList/chatListSlice';
import { Chat } from '../../containers/ChatsList/chatListSlice/types';
import { selectGroups } from '../../containers/GroupsList/groupsSlice';
import { fetchGroups } from '../../containers/GroupsList/groupsSlice/actionCreators';
import { Group } from '../../containers/GroupsList/groupsSlice/types';
import { getHoldingStatement } from '../../containers/HoldingStatement/helpers';
import { useAppDispatch, useAppSelector } from '../../hooks';

interface Pagination {
  page: number;
  skip: number;
  take: number;
}

const _getChats = async (
  search: string | undefined,
  take: number,
  skip: number,

  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setStatement: React.Dispatch<React.SetStateAction<Chat[]>>,
  statement: Chat[],
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>,
  getNextPage: () => void,
  setMaxReq: React.Dispatch<React.SetStateAction<number>>,
  maxReq: number,
  setIsLoadingPaginat?: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setIsLoading && setIsLoading(true);
    setIsLoadingPaginat && setIsLoadingPaginat(true);
    const chats = await getChats({
      search: search || '',
      // pagintaing holding statment cause problem because of the filtring
      // will keep the logic if the backend decide to make a stand alone request for the holding statment
      // take,
      // skip,
    });

    // if (getHoldingStatement(chats).length === 0) {
    //   setMaxReq(prev => prev + 1);
    //   if (maxReq >= 6) {
    //     setHasMore(false);
    //     setMaxReq(0);
    //     setIsLoading && setIsLoading(false);
    //     setIsLoadingPaginat && setIsLoadingPaginat(false);
    //   }
    //   setIsLoading && setIsLoading(false);
    //   setIsLoadingPaginat && setIsLoadingPaginat(false);
    //   return;
    // }
    setStatement([...getHoldingStatement(chats)]);

    setIsLoading && setIsLoading(false);
    setIsLoadingPaginat && setIsLoadingPaginat(false);
  } catch (error) {
    console.log('error log ', error);
    setIsLoading && setIsLoading(false);
    setIsLoadingPaginat && setIsLoadingPaginat(false);
    setError(`${error}`);
  }
};

export const filterStatement = (
  statements: Chat[],
  onlyIds: number[] | undefined,
  groups: Group[]
): Chat[] => {
  if (!onlyIds) return statements;
  return statements.filter(
    messageItem => includes(onlyIds, messageItem.groupID) || isEmpty(groups)
  );
};

export const useStatementFilterdAndPagination = () => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector(selectGroups);

  const [statement, setStatement] = useState<Chat[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const selectCallback = useCallback(getActiveStatementGroups(statement), [
    statement,
  ]);
  const activeGroups = useAppSelector(selectCallback);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [filterOnlyGroupIds, setFilterOnlyGroupIds] = useState<
    number[] | undefined
  >();
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    skip: 0,
    take: 12,
  });
  const [isLoadingPaginat, setIsLoadingPaginat] = useState<boolean>(false);

  const [maxReq, setMaxReq] = useState<number>(0);

  const getNextPage = () => {
    // console.log('next page ');
    // if (!hasMore) return;
    // setPagination(prev => {
    //   return {
    //     page: prev.page + 1,
    //     skip: (prev.page + 1) * prev.take,
    //     take: prev.take,
    //   };
    // });
  };

  useEffect(() => {
    _getChats(
      searchTerm,
      pagination.take,
      pagination.skip,

      setError,
      setStatement,
      statement,
      setHasMore,
      getNextPage,
      setMaxReq,
      maxReq,
      undefined,
      setIsLoading
    );
    return () => {};
  }, [searchTerm]);

  // useEffect(() => {
  //   _getChats(
  //     searchTerm,
  //     pagination.take,
  //     pagination.skip,
  //     setError,
  //     setStatement,
  //     statement,
  //     setHasMore,
  //     getNextPage,
  //     setMaxReq,
  //     maxReq,
  //     setIsLoadingPaginat
  //   );
  //   return () => {};
  // }, [pagination]);

  const init = async () => {
    const _ = dispatch(fetchGroups());
  };
  useEffect(() => {
    init();
  }, []);

  return {
    getNextPage,
    statements: filterStatement(statement, filterOnlyGroupIds, groups),
    isLoading,
    error,
    setSearchTerm,
    setFilterOnlyGroupIds,
    activeGroups,
    hasMore,
    isLoadingPaginat,
    searchTerm
  };
};
