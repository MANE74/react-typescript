import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import _ from 'lodash';
import {
  selectImOkList,
  selectImOkIsLoading,
  setImOkDocument,
} from './imOkSlice';
import { fetchImOkList } from './imOkSlice/actionCreators';
import { ImOkItem } from '../../components/ImOkItem/ImOkItem';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import Loader from '../../components/Loader/Loader';
import styled from 'styled-components';
import emptyList from '../../assets/imgs/NotFound/no-result.svg';
import { Page } from '../../components/Page/Page';
import { selectUser, selectCanStartIamok } from '../Login/LoginSlice';
import { EmptyListFallback } from '../../components/EmptyListFallback/EmptyListFallback';
import { useTranslation } from 'react-i18next';
import { SIamokStatus } from './im-ok.styles';

const SPage = styled(Page)`
  padding: 1.25rem 0rem;
  /* to make only the list overflow */
  position: relative;
  height: 100%;
`;

const SList = styled.ul`
  width: 90%;
  margin: auto;

  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  .gap {
    height: 0.5rem;
  }

  overflow-y: auto;
  height: calc(100%);

  padding-bottom: 3rem;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const ImOkList = () => {
  const dispatch = useAppDispatch();
  const imOkList = useAppSelector(selectImOkList);
  const isLoading = useAppSelector(selectImOkIsLoading);
  const user = useAppSelector(selectUser);
  const { t } = useTranslation();

  const canStartIamOk = useAppSelector(selectCanStartIamok);

  useEffect(() => {
    dispatch(setImOkDocument(null));
    dispatch(fetchImOkList());
    dispatch(fetchGroups());
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SPage>
      <SList>
        {imOkList.length ? (
          _.map(imOkList, imOk => <ImOkItem key={`${imOk.id}--`} imOk={imOk} />)
        ) : (
          <EmptyListFallback
            src={emptyList}
            listLength={imOkList.length}
            isLoading={false}
            searchTerm={''}
            emptyListTx={'imOk_empty'}
            noSearchTx={''}
          />
        )}
      </SList>
      {canStartIamOk && (
        <BigFloatButton link={'/startIamOk'} tx={'imOk_create'} />
      )}
      {!canStartIamOk && (
        <SIamokStatus>{t('IamOK_start_replacer')}</SIamokStatus>
      )}
    </SPage>
  );
};
