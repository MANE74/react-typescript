import * as React from 'react';
import styled from 'styled-components';
import Loader from '../../components/Loader/Loader';
import { Page } from '../../components/Page/Page';
import { SearchFilterBar } from '../../components/SearchFilterBar/SearchFilterBar';
import { TitlesWithTime } from '../../components/TitlesWithTimeCard/TitlesWithTime';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectExternalContacts,
  selectExternalMessags,
  selectIsExternalMessagsLoading,
} from './externalContactsSlice';
import {
  getExternalContacts,
  getExternalMessages,
} from './externalContactsSlice/actionCreators';
import {
  getContactListNames,
  handleExternalContactsDate,
  searchedContactMessages,
} from './helpers';
import NoMessages from '../../assets/imgs/NotFound/no-result.svg';
import { EmptyListFallback } from '../../components/EmptyListFallback/EmptyListFallback';
import {
  FilterOrSelectBottomSheet,
  SelectedAllType,
} from '../../components/FilterOrSelectBottomSheet/FilterOrSelectBottomSheet';
import { sessionStorageRemove } from '../../utils/storage';
import { CreateCecMessageCtxKey } from '../CreateCecMessageContainer/CreateCecMessageContext';
import { batch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';

const SPage = styled(Page)`
  padding: 1.25rem 0 0 0;
  /* to make only the list overflow */
  position: relative;
  height: 100%;
`;

const SSearchFilterBar = styled(SearchFilterBar)`
  width: 90%;
  margin: auto;
`;

const SList = styled.ul`
  margin-top: 1.25rem;
  margin: 1.25rem auto 0rem auto;

  width: 90%;

  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  overflow-y: auto;
  height: calc(100% - 4.25rem);
  padding-bottom: 5rem;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const ExternalContacts = () => {
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>();
  const [selectedIdFilter, setSelectedIdFilter] = React.useState<
    Set<number> | undefined
  >();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const externalMessages = useAppSelector(
    selectExternalMessags(selectedIdFilter)
  )
    .slice()
    .reverse();
  const externalContacts = useAppSelector(selectExternalContacts);

  const isLoading = useAppSelector(selectIsExternalMessagsLoading);

  // return the original messages if no search term provided
  const listSource = searchedContactMessages(externalMessages, searchTerm);

  const toggleFilterOpen = () => setFilterOpen(prev => !prev);

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  const onFilter = (selected: Set<number> | SelectedAllType) => {
    toggleFilterOpen();
    if (selected === 'SELECTED_ALL' || selected === 'UNSELECTED_ALL') {
      setSelectedIdFilter(undefined);
    } else {
      setSelectedIdFilter(selected);
    }
  };

  const onMessageClick = (id: number) => {
    navigate(`${id}`);
  };

  const handleCreateMessage = () => {
    sessionStorageRemove(CreateCecMessageCtxKey);
    navigate('/createCecMessage');
  };

  React.useEffect(() => {
    batch(() => {
      dispatch(getExternalMessages());
      dispatch(getExternalContacts());
    });
  }, [dispatch]);

  const intialFilterSelected = React.useMemo(
    () => new Set(externalContacts.map(cec => cec.id)),
    []
  );

  return (
    <SPage>
      <SSearchFilterBar
        onSearch={onSearch}
        handleOpenFilter={toggleFilterOpen}
        value={searchTerm}
      />
      <FilterOrSelectBottomSheet
        hideFooter
        initialSelected={intialFilterSelected}
        isOpen={filterOpen}
        setIsOpen={setFilterOpen}
        onFilter={onFilter}
        data={externalContacts}
        keyToSearchBy="name"
        selectShapeType="box"
        selectAllTx={'cec_selectAccounts'}
      />
      {isLoading && <Loader />}
      <EmptyListFallback
        src={NoMessages}
        listLength={listSource.length}
        isLoading={isLoading}
        searchTerm={''}
        emptyListTx={'noMessages'}
        noSearchTx={'messages_not_found_search'}
      />
      {listSource.length > 0 && (
        <SList>
          {listSource.map((messaege, index) => (
            <TitlesWithTime
              key={`${messaege.id}-${index}`}
              date={handleExternalContactsDate(messaege)}
              title={getContactListNames(messaege.contactLists)}
              subTitle={messaege.text}
              subTitleSender={messaege.senderName}
              itemId={messaege.id}
              onClick={onMessageClick}
            />
          ))}
        </SList>
      )}
      <BigFloatButton
        // link={'/createCecMessage'}
        onClick={handleCreateMessage}
        tx={'messages_create_cec_message'}
      />
    </SPage>
  );
};
