import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '../../components/Loader/Loader';
import MapDisplay from '../../components/Map/MapDisplay';
import { Page } from '../../components/Page/Page';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { defaultLat, defaultLng } from '../../utils/geocoder';
import { CreateMessageModel } from '../Chat/Chat';
import { Location } from '../GroupDetail/groupDetailSlice/types';
import { selectUser } from '../Login/LoginSlice';
import {
  getAlarmCreateModel,
  isAlarmLoading,
  selectAlarmGroups,
  setSelectedGroups,
} from './AlarmSlice';
import { sendAlarm } from './AlarmSlice/actionCreators';

function AlarmMap() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [location, setLocation] = useState<google.maps.LatLngLiteral>({
    lat: defaultLat,
    lng: defaultLng,
  });

  const isLoading = useAppSelector(isAlarmLoading);
  const user = useAppSelector(selectUser);
  const selectedGroups = useAppSelector(selectAlarmGroups);
  const alarmType = useAppSelector(getAlarmCreateModel);

  useEffect(() => {
    if (alarmType?.NoGroup) {
      if (_.isEmpty(alarmType.Groups) || alarmType === null) {
        navigate(`/alarm`);
      }
    } else {
      if (_.isEmpty(selectedGroups) || alarmType === null) {
        navigate(`/alarm`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (alarmType?.NoGroup && alarmType.Groups) {
      const groupIds = alarmType.Groups.map((grp) => grp.id);
      dispatch(setSelectedGroups(groupIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarmType]);

  const onSendAlarmClick = async () => {
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

    const loc: Location = {
      name: null,
      latitude: location.lat,
      longitude: location.lng,
    };

    dispatch(sendAlarm(messageModel, loc, navigate));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SPage>
      <MapDisplay
        location={location}
        setLocation={setLocation}
        buttonColor="red"
        onButtonClick={onSendAlarmClick}
        buttonTx="alarm_send_alarm"
      />
    </SPage>
  );
}

const SPage = styled(Page)`
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0 0 0;
`;

export default AlarmMap;
