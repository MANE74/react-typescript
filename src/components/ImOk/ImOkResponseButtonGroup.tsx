import React from 'react';
import {
  ImOkDocumentSimple,
  ImOkUser,
} from '../../containers/ImOkList/imOkSlice/types';
import {
  ButtonGroup,
  ButtonGroupContainer,
  Icon,
  ProvideStatusText,
  ResponseButton,
  Text,
} from './ImOk.styles';
import { translate } from '../../utils/translate';
import checkMark from '../../assets/imgs/general/check-mark.svg';
import { sendImOkResponse } from '../../containers/ImOkList/imOkSlice/actionCreators';
import { useAppDispatch } from '../../hooks';
import { useGeoLocation } from '../../utils/customHooks/useGeoLocation';
import { saveLocation } from '../../apis/locationAPI';
import { Button } from '../Button/Button';
import styled from 'styled-components';
import { palette } from '../../theme/colors';
import { IamOkMessageMembersType } from '../../routes/ImOk';

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
export interface ImOkResponseButtonGroupProps {
  hideResponseButtonsForUser?: boolean;
  userFromList?: ImOkUser;
  imOkDocument: ImOkDocumentSimple;
  reloadData: () => void;
  userIsImOkCreator: boolean;
  contactMemberByType: (type: IamOkMessageMembersType) => void;
  setCreateMessagesModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImOkResponseButtonGroup = React.forwardRef<
  HTMLDivElement,
  ImOkResponseButtonGroupProps
>((props, ref) => {
  const {
    reloadData,
    userIsImOkCreator,
    hideResponseButtonsForUser,
    contactMemberByType,
    imOkDocument,
    userFromList,
    setCreateMessagesModalOpen,
    // ref,
  } = props;
  const dispatch = useAppDispatch();
  const { location, isGettingLocationName } = useGeoLocation({});
  const sendResponse = async (imOk: boolean) => {
    let locationId: number | null = null;
    if (location) {
      const { id } = await saveLocation(location);
      locationId = id;
    }
    dispatch(sendImOkResponse(imOkDocument.id.toString(), imOk, locationId));
    reloadData();
  };
  return (
    <ButtonGroupContainer ref={ref}>
      {!userIsImOkCreator && !hideResponseButtonsForUser && (
        <ProvideStatusText>{translate('imOk_provideStatus')}</ProvideStatusText>
      )}
      {!hideResponseButtonsForUser && (
        <ButtonGroup>
          <ResponseButton
            $loading={isGettingLocationName}
            red
            onClick={() => sendResponse(false)}
          >
            <Text>{translate('imOk_imNotOk')}</Text>
            {userFromList?.imok !== null && !userFromList?.imok && (
              <Icon src={checkMark} />
            )}
          </ResponseButton>
          <ResponseButton
            $loading={isGettingLocationName}
            onClick={() => sendResponse(true)}
          >
            <Text>{translate('imOk_imOk')}</Text>
            {userFromList?.imok && <Icon src={checkMark} />}
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

export default ImOkResponseButtonGroup;
