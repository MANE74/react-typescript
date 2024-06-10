import React, { useEffect, useState } from 'react';
import { UserById } from '../../apis/userAPI/types';
import { getUserById } from '../../apis/userAPI';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectUser } from '../Login/LoginSlice';
import { useNavigate, useParams } from 'react-router-dom';
import ActionButtons, {
  UserAction,
} from '../../components/ActionButtons/ActionButtons';
import { setSelectedUsersAction } from '../CreateMessage/createMessageSlice/actionCreators';
import {
  MemberSettingsOptionsStateType,
  SPage,
  SProfilePictureWrapper,
  SSmallText,
  SUserName,
} from '../MemberSettings/MemberSettings';
import { ProfilePicture } from '../../components/ProfilePicture/ProfilePicture';
import MemberSettingsDynamicForm, {
  DynamicFormFieldType,
} from '../../components/MemberSettingsDynamicForm/MemberSettingsDynamicForm';
import { dateFormats, getDateFormatCustom } from '../../utils/date';
import { translate } from '../../utils/translate';
import _ from 'lodash';
import Loader from '../../components/Loader/Loader';
import {
  handleMemberSettingsEmailClick,
  handleMemberSettingsPhoneClick,
} from '../MemberSettings/helpers';
import Options from '../../components/Options/Options';

function Member() {
  const { memberID } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);

  const [isUserProfile, setIsUserProfile] = useState(false);
  const [member, setMember] = useState<UserById | null>(null);

  useEffect(() => {
    if (`${user?.id}` === memberID) {
      setIsUserProfile(true);
    }
    getMember();
    return () => {
      setOptionsState(prev => ({
        isOpen: false,
      }));
    };
  }, []);

  const getMember = async () => {
    setMember(await getUserById(Number(memberID)));
  };

  const actions: Record<string, UserAction[]> = {
    member: [
      {
        label: 'messages_createMessage',
        fireAction: () => {
          dispatch(
            setSelectedUsersAction([
              {
                id: member?.id!,
                displayName: member?.displayName || '',
                title: member?.title || '',
                creatorId: user?.id!,
                email: member?.email || '',
                phoneNumber: member?.phoneNumber || null,
                isSelected: true,
                admin: false,
                photoFileName: member?.photoFileName || null,
              },
            ])
          );
          navigate(`/createMessage/new`);
        },
      },
    ],
    ownProfile: [
      {
        label: 'groups_editProfile',
        fireAction: () => {
          dispatch(
            setSelectedUsersAction([
              {
                id: member?.id,
                name: member?.displayName,
                isChecked: true,
              },
            ])
          );
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
    visible: checkIfNullOrEmpty(member?.email),
    placeHolder: 'Email Address ',
    value: member?.email! || '',
    onClick: handleMemberSettingsEmailClick(
      member?.email!,
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
    visible: checkIfNullOrEmpty(member?.title),
    placeHolder: 'additionalInfo  ',
    value: member?.title,
    editable: false,
  };

  if (!member) return <Loader />;

  return (
    <SPage>
      <SProfilePictureWrapper>
        <ProfilePicture
          profilePictureFileName={member.photoFileName || null}
          diameter={112}
        />
      </SProfilePictureWrapper>
      <SUserName>{member.displayName}</SUserName>
      <SSmallText>
        {translate(`groups_memberSince`)}{' '}
        {getDateFormatCustom(member.created!, dateFormats.yearMonthDay)}
      </SSmallText>
      <MemberSettingsDynamicForm
        style={{ margin: '1rem 0' }}
        fields={[additionalInfoField, emailField, numberField, numberField2]}
      />
      <SSmallText>
        {translate(`groups_lastVisited`)}{' '}
        {getDateFormatCustom(member.lastAccess!, dateFormats.yearMonthDay)}
      </SSmallText>
      <div style={{ flex: 1 }} />
      <ActionButtons
        actions={isUserProfile ? actions['ownProfile'] : actions['member']}
      />
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
}

export default Member;
