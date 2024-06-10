import _ from 'lodash';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { batch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import styled, { css } from 'styled-components';
import ActionButtons, {
  UserAction,
} from '../../components/ActionButtons/ActionButtons';
import Loader from '../../components/Loader/Loader';
import MemberSettingsDynamicForm, {
  DynamicFormFieldType,
} from '../../components/MemberSettingsDynamicForm/MemberSettingsDynamicForm';
import { ProfilePicture } from '../../components/ProfilePicture/ProfilePicture';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import { palette } from '../../theme/colors';
import { useConfirmation } from '../../utils/ConfirmationServiceContext/confirmationContext';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import { ActiveTab, UserPermision } from '../../utils/enums';
import { SName } from '../GroupDetail';
import {
  selectGroupDetail,
  selectMemberById,
} from '../GroupDetail/groupDetailSlice';
import { fetchGroupDetail } from '../GroupDetail/groupDetailSlice/actionCreators';
import LocationIcon from '../../assets/imgs/iamokay/iamok-Location.svg';
import NoLocationIcon from '../../assets/imgs/iamokay/iamok-noLocation.svg';

import { selectImOkDocument } from '../ImOkList/imOkSlice';
import { fetchImOkDocument } from '../ImOkList/imOkSlice/actionCreators';
import {
  getIamOkMemberLocation,
  getIamOkMemberLocationName,
  handleMemberSettingsEmailClick,
  handleMemberSettingsPhoneClick,
} from './helpers';
import { Modal } from '../../components/Modal/Modal';
import MapModal from '../../components/MapModal/MapModal';
import { fetchOnCallAlertDocument } from '../OnCallAlertList/onCallAlertSlice/actionCreators';
import { selectOnCallAlertDocument } from '../OnCallAlertList/onCallAlertSlice';
import { translate } from '../../utils/translate';
import { selectUser } from '../Login/LoginSlice';
import { Page } from '../../components/Page/Page';
import {
  createMessageGetUsers,
  resetAll,
  setActiveTab,
  setSelectedUsers,
} from '../CreateMessage/createMessageSlice';
import { SelectListUser } from '../CreateMessage/createMessageSlice/types';
import Options, { OptionItemProps } from '../../components/Options/Options';
import { getImageLink } from '../../utils/formatImageLink';

export interface MemberSettingsOptionsStateType {
  isOpen: boolean;
  options?: OptionItemProps[];
}

const MemberSettings = (props: {
  isIamOkMemberSettings?: boolean;
  isOnCallAlertMemberSettings?: boolean;
}) => {
  const { isIamOkMemberSettings, isOnCallAlertMemberSettings } = props;

  const { id, memberID, imOkId, onCallAlertId } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirmation();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);

  const imOkDocument = useAppSelector(selectImOkDocument);
  const onCallAlertDocument = useAppSelector(selectOnCallAlertDocument);
  const member = useSelector((state: RootState) =>
    selectMemberById(state, Number(memberID))
  );

  const [mapModalOpen, setMapModalOpen] = React.useState(false);
  const [isUserProfile, setIsUserProfile] = React.useState(false);
  const [additionalInfo, setAdditionalinfo] = React.useState('');

  React.useEffect(() => {
    let isMounted = true; // note mutable flag
    if (`${user?.id}` === memberID) {
      if (isMounted) setIsUserProfile(true);
    }
    isIamOkMemberSettings && dispatch(fetchImOkDocument(imOkId!));
    isOnCallAlertMemberSettings &&
      dispatch(fetchOnCallAlertDocument(+onCallAlertId!));

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const groupDetail = useAppSelector(selectGroupDetail);

  useEffect(() => {
    let isMounted = true; // note mutable flag
    if (_.isUndefined(member) && id) {
      dispatch(fetchGroupDetail({ id: Number(id) }));
    }

    return () => {
      if (isMounted)
        setOptionsState(prev => ({
          isOpen: false,
        }));
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member]);

  const userPermision: UserPermision = groupDetail?.admin
    ? UserPermision.admin
    : UserPermision.member;
  const isSelectedMemberAdmin = member?.admin;

  const addUserToCreateMessage = (user: SelectListUser) =>
    new Promise<void>((resolve, reject) => {
      batch(() => {
        dispatch(resetAll());
        dispatch(setActiveTab(ActiveTab.Users));
        dispatch(setSelectedUsers([user]));
      });
      resolve();
    });

  const actions: Record<string, UserAction[]> = {
    member: [
      {
        label: 'messages_createMessage',
        fireAction: async () => {
          await addUserToCreateMessage({
            id: member?.userID!,
            displayName: member?.userName || '',
            title: '',
            creatorId: 0,
            email: '',
            phoneNumber: null,
            isSelected: true,
            admin: userPermision === UserPermision.admin,
            photoFileName: null,
          });
          navigate(`/createMessage/new`);
        },
      },
    ],
    ownProfile: [
      {
        label: 'groups_editProfile',
        fireAction: () => {
          navigate(`/profile`);
        },
      },
    ],
  };

  const checkIfNullOrEmpty = (value: any) => {
    if (_.isNil(value)) {
      return false;
    } else if (_.isEmpty(value)) {
      return false;
    } else {
      return true;
    }
  };

  const [optionsState, setOptionsState] =
    React.useState<MemberSettingsOptionsStateType>({
      isOpen: false,
    });

  const setOptionsOpen = (isOpen: boolean) => {
    setOptionsState(prev => ({ ...prev, isOpen }));
  };
  const emailField: DynamicFormFieldType = {
    visible: checkIfNullOrEmpty(member?.userEmail),
    placeHolder: 'Email Address ',
    value: member?.userEmail! || '',
    onClick: handleMemberSettingsEmailClick(
      member?.userEmail!,
      setOptionsState,
      setOptionsOpen
    ),
    editable: false,
  };
  const numberField: DynamicFormFieldType = {
    visible: checkIfNullOrEmpty(member?.phoneNumber?.split(',')[0]),
    placeHolder: 'Number Field ',
    value: member?.phoneNumber?.split(',')[0]! || '',
    onClick: handleMemberSettingsPhoneClick(
      member?.phoneNumber?.split(',')[0]!,
      setOptionsState,
      setOptionsOpen
    ),
    editable: false,
  };
  const numberField2: DynamicFormFieldType = {
    visible: checkIfNullOrEmpty(member?.phoneNumber?.split(',')[1]),
    placeHolder: 'Number Field ',
    value: member?.phoneNumber?.split(',')[1]! || '',
    onClick: handleMemberSettingsPhoneClick(
      member?.phoneNumber?.split(',')[1]!,
      setOptionsState,
      setOptionsOpen
    ),
    editable: false,
  };
  const additionalInfoField: DynamicFormFieldType = {
    visible: checkIfNullOrEmpty(additionalInfo),
    placeHolder: 'additionalInfo  ',
    value: additionalInfo,
    editable:
      userPermision === UserPermision.admin || groupDetail?.adminSetsInfo,
  };

  const renderOnCallAlertWarning = () => {
    const hasPhone = onCallAlertDocument?.users.find(
      i => i.userId === +memberID!
    )?.hasPhoneNumber;
    if (!hasPhone)
      return (
        <SOnCallAlertText>{translate('onCallAlert_noPhone')}</SOnCallAlertText>
      );
    return <></>;
  };
  const renderIamOkayLocation = () => {
    const location: string | 'NO_LOCATION' = getIamOkMemberLocationName(
      imOkDocument!,
      +memberID!
    );

    if (location === 'NO_LOCATION')
      return (
        <SIamOkLocationContainer>
          <SSmallText $isLocationText>{t('imOk_noLocation')}</SSmallText>
          <img src={NoLocationIcon} alt="NoLocationIcon" />
        </SIamOkLocationContainer>
      );
    return (
      <SIamOkLocationContainer
        $isLocation
        onClick={() => setMapModalOpen(true)}
      >
        <SSmallText $isLocationText $isLocation>
          {location}
        </SSmallText>
        <img src={LocationIcon} alt="LocationIcon" />
      </SIamOkLocationContainer>
    );
  };

  const renderMapModal = () => {
    const location = getIamOkMemberLocation(imOkDocument!, +memberID!);
    return (
      <>
        {mapModalOpen && location && (
          <Modal isOpen={mapModalOpen} setIsOpen={setMapModalOpen}>
            <MapModal
              address={location.name || ''}
              latitude={location.latitude ? +location.latitude : 0}
              longitude={location.longitude ? +location.longitude : 0}
              type={member?.userName || ''}
              withoutRecalledLabel
              withDate
              recalled={true}
              sent={
                t('imOk_updated') +
                ' ' +
                getDateFormatCustom(
                  location.lastupdated,
                  dateFormats.mothNameDateTime
                )
              }
            />
          </Modal>
        )}
      </>
    );
  };

  if (!member) {
    return <Loader />;
  }

  return (
    <SPage>
      <SProfilePictureWrapper>
        <ProfilePicture
          readyPhotoSource={getImageLink({
            imageName: member.photoFileName,
            size: 'medium',
          })}
          profilePictureFileName={''}
          diameter={112}
        />
      </SProfilePictureWrapper>
      <SUserName>{member?.userName}</SUserName>
      <SSmallText>
        {t(`groups_memberSince`)}{' '}
        {getDateFormatCustom(
          member.joined!,
          dateFormats.yearMonthDayTimeNoComma24
        )}
      </SSmallText>
      <MemberSettingsDynamicForm
        style={{ margin: '1rem 0' }}
        fields={[additionalInfoField, emailField, numberField, numberField2]}
      />
      <SSmallText>
        {t(`groups_lastVisited`)}{' '}
        {getDateFormatCustom(
          member.lastAccess!,
          dateFormats.yearMonthDayTimeNoComma24
        )}
      </SSmallText>

      {isOnCallAlertMemberSettings &&
        onCallAlertDocument &&
        renderOnCallAlertWarning()}
      {isIamOkMemberSettings && imOkDocument && renderIamOkayLocation()}
      <div style={{ flex: 1 }} />
      <ActionButtons
        actions={isUserProfile ? actions['ownProfile'] : actions['member']}
      />
      {isIamOkMemberSettings && imOkDocument && renderMapModal()}
      {optionsState.options && (
        <Options
          items={optionsState.options}
          isOpen={optionsState.isOpen}
          setIsOpen={setOptionsOpen}
          setTabBar
        />
      )}
    </SPage>
  );
};

export default MemberSettings;

export const SPage = styled(Page)`
  display: flex;
  flex-direction: column;
`;

export const SOnCallAlertText = styled.p`
  font-family: 'Roboto-Regular';
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.125rem;
  text-align: left;
  max-width: 75%;
  margin: 1rem auto 0 auto;
  color: ${palette.tartOrange};
  text-align: center;
`;

export const SSmallText = styled.p<{
  $isLocationText?: boolean;
  $isLocation?: boolean;
}>`
  color: ${palette.silver};
  font-family: 'Roboto-Regular';
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: center;

  :last-of-type {
    margin-top: 14px;
  }

  ${props =>
    props.$isLocation &&
    css`
      color: ${palette.honeyYellow};
    `}
  ${props =>
    props.$isLocationText &&
    css`
      :last-of-type {
        margin-top: 0px;
      }
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    `}
`;

export const SIamOkLocationContainer = styled.div<{ $isLocation?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 1.875rem;
  max-width: 90%;
  margin: auto;
  margin-top: 1rem;

  ${props =>
    props.$isLocation &&
    css`
      cursor: pointer;
    `}
`;

export const SProfilePictureWrapper = styled.div`
  margin-top: 1rem;
  align-self: center;
`;

export const SUserName = styled(SName)`
  margin-top: 12px;
  text-align: center;
`;
