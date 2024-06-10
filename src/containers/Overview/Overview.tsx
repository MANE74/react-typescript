import React, { useEffect } from 'react';
import styled from 'styled-components';
import Active from '../../components/Checklists/ActiveTab';
import Loader from '../../components/Loader/Loader';
import { Page } from '../../components/Page/Page';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import { ChecklistStatus } from '../../utils/enums';
import { translate } from '../../utils/translate';
import { ChatsList } from '../ChatsList/ChatsList';
import {
  getChecklists,
  isChecklistsLoading,
} from '../Checklists/checklistsSlice';
import {
  fetchChecklists,
  fetchMoreChecklists,
} from '../Checklists/checklistsSlice/actionCreators';

function Overview() {
  const checklists = useAppSelector(getChecklists);
  const isLoading = useAppSelector(isChecklistsLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (checklists.length === 0) {
      dispatch(fetchChecklists());
    }

    const interval = setInterval(() => {
      dispatch(fetchMoreChecklists());
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const getStartedChecklists = () => {
    return checklists.filter((item) => item.status === ChecklistStatus.Started);
  };

  return (
    <SPage>
      <SOverview>
        <SContainer>
          <STitle>{translate(`home_messages`)}</STitle>
          <SList>
            <ChatsList overview />
          </SList>
        </SContainer>
        <SLine />
        <SContainer>
          <STitle>{translate(`home_checklists`)}</STitle>
          <SList>
            {isLoading ? (
              <Loader />
            ) : (
              <Active
                checklists={getStartedChecklists()}
                overview
                onDotsClick={() => {}}
              />
            )}
          </SList>
        </SContainer>
      </SOverview>
    </SPage>
  );
}

export default Overview;

const SPage = styled(Page)`
  padding-bottom: 0;
`;

const SOverview = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

const SLine = styled.hr`
  margin: 1.25rem 0;
  width: 100%;
  border: 1px solid ${palette.tinyBorder};
`;

const STitle = styled.p`
  font-family: 'Roboto-Bold';
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 10px;
`;

const SList = styled.div`
  height: 100%;
  min-height: 0;

  /* vertical scrolling + hide scroller bar  */
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
