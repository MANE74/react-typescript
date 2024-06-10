import * as React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';
import _ from 'lodash';
import { SelectOrgsList } from './SelectOrgsList';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import { getSelectedOrgs } from './broadcastSlice';
import { translate } from '../../utils/translate';

export const Broadcast = () => {
  const selectedOrgs = useAppSelector(getSelectedOrgs);

  return (
    <SBroadcastContainer>
      <InfoBox>
        <p>{translate('broadcast_intro_text')}</p>
      </InfoBox>
      <BroadcastListWrapper>
        <SelectOrgsList />

        {!_.isEmpty(selectedOrgs) && (
          <CreateMessageButtonWrapper>
            <BigFloatButton link={'/broadcast/new'} tx={'messages_proceed'} />
          </CreateMessageButtonWrapper>
        )}
      </BroadcastListWrapper>
    </SBroadcastContainer>
  );
};

const SBroadcastContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
`;

const BroadcastListWrapper = styled.div``;

const InfoBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid;
  border-color: ${palette.queenBlue};
  background-color: ${palette.prussianBlue2};
  margin: 0 1rem;
  p {
    font-size: 12px;
    line-height: 1.5;
  }
`;

const CreateMessageButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
