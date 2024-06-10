import React from 'react';
import {
  ButtonGroup,
  ButtonGroupContainer,
  Icon,
  ProvideStatusText,
  ResponseButton,
  Text,
} from './OnCallAlert.styles';
import { translate } from '../../utils/translate';
import BigFloatButton from '../BigFloatButton/BigFloatButton';
import checkMark from '../../assets/imgs/general/check-mark.svg';
import { useAppDispatch } from '../../hooks';
import {
  OnCallAlertDocumentSimple,
  OnCallAlertUser,
} from '../../containers/OnCallAlertList/onCallAlertSlice/types';
import { OnCallAlertStatusType } from '../../utils/enums';
import { sendOnCallAlertResponse } from '../../containers/OnCallAlertList/onCallAlertSlice/actionCreators';
import styled from 'styled-components';
import { Button } from '../Button/Button';
import { palette } from '../../theme/colors';
import { OnCallAlertkMessageMembersType } from '../../routes/OnCallAlert';

const SCreatMessageButton = styled(Button)`
  margin: auto;
  z-index: 11;

  width: 100%;
  button {
    max-width: 100rem;
    font-size: 1rem;
    padding: 0.8125rem 0;
    text-align: center;
    font-family: 'Roboto-Medium';
    z-index: 2;
    height: 3rem;

    color: ${palette.raisinBlack3};
  }
`;

export interface OnCallAlertResponseButtonGroupProps {
  hideResponseButtonsForUser?: boolean;
  userFromList?: OnCallAlertUser;
  onCallAlertDocument: OnCallAlertDocumentSimple;
  reloadData: () => void;
  userIsImOkCreator: boolean;
  contactMemberByType: (type: OnCallAlertkMessageMembersType) => void;
  setCreateMessagesModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const OnCallAlertResponseButtonGroup = React.forwardRef<
  HTMLDivElement,
  OnCallAlertResponseButtonGroupProps
>((props, ref) => {
  const {
    reloadData,
    userIsImOkCreator,
    hideResponseButtonsForUser,
    contactMemberByType,
    onCallAlertDocument,
    userFromList,
    setCreateMessagesModalOpen,
  } = props;
  const dispatch = useAppDispatch();

  const sendResponse = async (status: number) => {
    dispatch(sendOnCallAlertResponse(onCallAlertDocument.id, status));
    // reloadData();
  };
  return (
    <ButtonGroupContainer ref={ref}>
      {!userIsImOkCreator && !hideResponseButtonsForUser && (
        <ProvideStatusText>{translate('imOk_provideStatus')}</ProvideStatusText>
      )}
      {!hideResponseButtonsForUser && (
        <ButtonGroup>
          <ResponseButton
            red
            onClick={() => sendResponse(OnCallAlertStatusType.NotAvailable)}
          >
            <Text>{translate('onCallAlert_unavailable')}</Text>
            {userFromList?.status === OnCallAlertStatusType.NotAvailable && (
              <Icon src={checkMark} />
            )}
          </ResponseButton>
          <ResponseButton
            onClick={() => sendResponse(OnCallAlertStatusType.Available)}
          >
            <Text>{translate('onCallAlert_available')}</Text>
            {userFromList?.status === OnCallAlertStatusType.Available && (
              <Icon src={checkMark} />
            )}
          </ResponseButton>
        </ButtonGroup>
      )}
      {userIsImOkCreator && (
        <SCreatMessageButton
          onClick={() => setCreateMessagesModalOpen(true)}
          tx={'imOk_createMessage'}
        />
      )}
    </ButtonGroupContainer>
  );
});

export default OnCallAlertResponseButtonGroup;
