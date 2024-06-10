import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import AlarmGroupSelectItem from '../../components/AlarmItem/AlarmGroupSelectItem';
import BigFloatButton from '../../components/BigFloatButton/BigFloatButton';
import Loader from '../../components/Loader/Loader';
import { Page } from '../../components/Page/Page';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { GroupType } from '../../utils/enums';
import { translate } from '../../utils/translate';
import { CreateMessageModel } from '../Chat/Chat';
import { Location } from '../GroupDetail/groupDetailSlice/types';
import { selectGroups } from '../GroupsList/groupsSlice';
import { fetchGroups } from '../GroupsList/groupsSlice/actionCreators';
import { Group } from '../GroupsList/groupsSlice/types';
import { selectUser } from '../Login/LoginSlice';
import {
  getAlarmCreateModel,
  getSelectedGroupType,
  isAlarmLoading,
  selectAlarmGroups,
  setIsLoading,
  setSelectedGroups,
  setSelectedGroupType,
} from './AlarmSlice';
import { sendAlarm } from './AlarmSlice/actionCreators';
import { GroupsArr } from './AlarmSlice/types';

function AlarmSelectGroup() {
  const { alarmId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const groups = useAppSelector(selectGroups);
  const alarmType = useAppSelector(getAlarmCreateModel);
  const selectedGroups = useAppSelector(selectAlarmGroups);
  const isLoading = useAppSelector(isAlarmLoading);
  const selectedGroupType = useAppSelector(getSelectedGroupType);

  const [groupsState, setGroupsState] = useState<GroupsArr[]>([]);

  useEffect(() => {
    dispatch(setIsLoading(true));

    if (alarmType === null) {
      navigate(`/alarm`);
    }

    if (alarmType?.NoGroup) {
      navigate('/alarm', { replace: true });
    }

    dispatch(fetchGroups());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (groups.length !== 0) {
      getAllGroups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, alarmType]);

  useEffect(() => {
    if (selectedGroups.length === 0) {
      dispatch(
        setSelectedGroups(
          alarmType?.Groups!.map((group: any) => group.GroupID)!
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarmType]);

  const getAllGroups = () => {
    if (!alarmType) return;

    // Find groups were we are member while excluding pre-selected ones
    const groupsWhereMember = _.filter(groups, function <
      T extends Group
    >(group: T): group is T {
      const foundGroup = _.find(
        alarmType.Groups,
        (foundGroup) => foundGroup.id === group.id
      );
      if (group.member && _.isNil(foundGroup) && group.groupType !== 3) {
        return true;
      }
      return false;
    });

    const organizationGroups = _.filter(groupsWhereMember, function <
      T extends Group
    >(group: T): group is T {
      if (
        (!_.isNil(group.organizationID) &&
          _.isEqual(group.organizationID, alarmType.OrganizationID)) ||
        (!_.isNil(group.subOrganizationID) &&
          _.isEqual(group.subOrganizationID, alarmType.SuborganizationID))
      ) {
        return true;
      }
      return false;
    });

    organizationGroups.sort((a, b) => a.name.localeCompare(b.name));

    const foundPreSelectedGroups = _.filter(groups, function <
      T extends Group
    >(group: T): group is T {
      const foundGroup = _.find(
        alarmType.Groups,
        (foundGroup) => foundGroup.id === group.id
      );
      if (foundGroup) {
        return true;
      }
      return false;
    });

    const fullGroupsList = _.concat(organizationGroups, foundPreSelectedGroups);

    setGroupsState(fullGroupsList);
    dispatch(setIsLoading(false));
  };

  const onGroupClick = (groupId: number, isCoAlertOrHidden: boolean) => {
    if (!isCoAlertOrHidden) {
      dispatch(setSelectedGroupType([GroupType.Normal]));
    } else {
      dispatch(setSelectedGroupType([GroupType.Hidden, GroupType.CoAlert]));
    }
    let newState = [...selectedGroups];
    if (newState.includes(groupId)) {
      newState.splice(newState.indexOf(groupId), 1);
    } else {
      newState.push(groupId);
    }

    if (
      newState.length === 0 ||
      newState.length === alarmType?.Groups?.length
    ) {
      dispatch(setSelectedGroupType([]));
    }

    dispatch(setSelectedGroups(newState));
  };

  // Fires when location state changes
  const handleSkipMap = (location: Location | null) => {
    if (!user || !alarmType) return;
    const groupsIds = _.map(selectedGroups, (grpId) => grpId);
    const messageModel: CreateMessageModel = {
      senderId: user.id,
      groupIds: groupsIds,
      emergencyTypeId: alarmType.ID!,
      subOrganisationIDForEmergencyMessage:
        alarmType.subOrganisationIDForEmergencyMessage!,
      type: 2,
      recipientIds: null,
      subject: null,
    };

    dispatch(sendAlarm(messageModel, location, navigate));
  };

  const setUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: `${position.coords.latitude} | ${position.coords.longitude}`,
          };
          handleSkipMap(pos);
        },
        (error) => {
          console.log('Geolocation Error' + error.code, error.message);
          handleSkipMap(null);
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    } else {
      handleSkipMap(null);
    }
  };

  const checkGroupsType = (groupType: number) => {
    if (groupType === 2) {
      return translate('messages_hidden');
    }
    if (groupType === 4) {
      return translate('CoAlert');
    } else {
      return null;
    }
  };

  const renderButton = () => {
    if (_.isEmpty(selectedGroups)) {
      return <></>;
    }

    if (alarmType?.SkipMap) {
      return (
        <BigFloatButton
          onClick={setUserLocation}
          tx={'messages_proceed'}
          extraPadding={false}
        />
      );
    }

    return (
      <BigFloatButton
        link={`/alarm/map/${alarmId}`}
        tx={'messages_proceed'}
        extraPadding={false}
      />
    );
  };

  if (isLoading) {
    return (
      <Page>
        <SGroupListContainer>
          <Loader />
        </SGroupListContainer>
      </Page>
    );
  }

  return (
    <SPage>
      <SGroupListContainer>
        {groupsState.map((group, key) => {
          const type = checkGroupsType(group.groupType!);
          const isCoAlertOrHidden = type ? true : false;
          const disable =
            _.find(alarmType?.Groups, (preGroup) => preGroup.id === group.id) ||
            (selectedGroupType.length > 0 &&
              !selectedGroupType.includes(group.groupType!));

          return (
            <AlarmGroupSelectItem
              id={group.id}
              name={group.name}
              membersCount={group.groupMembersCount!}
              key={key}
              checked={selectedGroups.includes(group.id)}
              onCardPress={() => {
                onGroupClick(group.id, isCoAlertOrHidden);
              }}
              type={type}
              disable={disable as unknown as boolean}
            />
          );
        })}
        {renderButton()}
      </SGroupListContainer>
    </SPage>
  );
}

const SPage = styled(Page)`
  padding: 0 1.25rem;
`;

const SGroupListContainer = styled.div`
  padding: 1.25rem 0 6rem;
  height: 100%;

  /* vertical scrolling + hide scroller bar  */
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default AlarmSelectGroup;
