import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import _ from 'lodash';
import {
  selectOnCallAlertIsLoading,
  selectOnCallAlertList,
  setOnCallAlertDocument,
} from './onCallAlertSlice';
import { fetchOnCallAlertList } from './onCallAlertSlice/actionCreators';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import Loader from '../../components/Loader/Loader';
import styled from 'styled-components';
import emptyList from '../../assets/imgs/NotFound/no-result.svg';
import { OnCallAlertItem } from '../../components/OnCallAlertItem/OnCallAlertItem';
import { Page } from '../../components/Page/Page';
import { selectCanStartOnCallAlert } from '../Login/LoginSlice';
import { EmptyListFallback } from '../../components/EmptyListFallback/EmptyListFallback';
import { OnCallAlertStatus } from '../../components/OnCallAlert/OnCallAlert.styles';
import { useTranslation } from 'react-i18next';

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

  overflow-y: auto;
  height: calc(100%);

  padding-bottom: 3rem;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const OnCallAlert = () => {
  const dispatch = useAppDispatch();
  const onCallAlertList = useAppSelector(selectOnCallAlertList);
  const isLoading = useAppSelector(selectOnCallAlertIsLoading);

  const canStartOnCallAlert = useAppSelector(selectCanStartOnCallAlert);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(setOnCallAlertDocument(null));
    dispatch(fetchOnCallAlertList());
    dispatch(fetchGroups());
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SPage>
      <SList>
        {onCallAlertList.length ? (
          _.map(onCallAlertList, (item) => (
            <OnCallAlertItem key={`${item.id}-+`} onCallAlert={item} />
          ))
        ) : (
          <EmptyListFallback
            src={emptyList}
            listLength={onCallAlertList.length}
            isLoading={false}
            searchTerm={''}
            emptyListTx={'onCallAlert_empty'}
            noSearchTx={''}
          />
        )}
      </SList>
      {canStartOnCallAlert && (
        <BigFloatButton
          link={'/startOnCallAlert'}
          tx={'alarm_start_oncall_alert'}
        />
      )}
      {!canStartOnCallAlert && (
        <OnCallAlertStatus>{t('onCallAlert_start_replacer')}</OnCallAlertStatus>
      )}
    </SPage>
  );
};
