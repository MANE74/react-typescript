import React, { SyntheticEvent, useEffect, useState } from 'react';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getImage } from '../../apis/mediaAPI';
import {
  setAlarmCreateModel,
  setIsLoading,
} from '../../containers/Alarm/AlarmSlice';
import { sendAlarm } from '../../containers/Alarm/AlarmSlice/actionCreators';
import { EmergencyType } from '../../containers/Alarm/AlarmSlice/types';
import { CreateMessageModel } from '../../containers/Chat/Chat';
import { Location } from '../../containers/GroupDetail/groupDetailSlice/types';
import { selectUser } from '../../containers/Login/LoginSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { palette } from '../../theme/colors';

interface AlarmTypeProps {
  alarmTypeItem: EmergencyType;
  currentLang: string;
  alarmOrgEqual: boolean;
}

function AlarmType(props: AlarmTypeProps) {
  const { alarmTypeItem, currentLang, alarmOrgEqual } = props;
  const { Names, Icon, ID } = alarmTypeItem;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);

  const [image, setImage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    getAlarmImage().then((img) => {
      if (isMounted) setImage(img);
    });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAlarmImage = async () => {
    if (Icon) {
      return await getImage({ imageName: Icon, svg: true });
    }
    return '';
  };

  const getLocation = (e: SyntheticEvent) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: `${position.coords.latitude} | ${position.coords.longitude}`,
          };
          handleNavigate(e, pos);
        },
        (error) => {
          console.log('Geolocation Error' + error.code, error.message);
          handleNavigate(e, null);
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    } else {
      handleNavigate(e, null);
    }
  };

  const handleNavigate = async (
    e: SyntheticEvent,
    location?: Location | null
  ) => {
    let to;

    if (alarmTypeItem.NoGroup && alarmTypeItem.SkipMap) {
      //send alarm instantly
      if (!user || !alarmTypeItem) return;
      dispatch(setIsLoading(true));
      if (_.isUndefined(location)) return getLocation(e);

      const groupsIds = _.map(alarmTypeItem.Groups, (group) => group.id);
      const messageModel: CreateMessageModel = {
        senderId: user.id,
        groupIds: groupsIds,
        emergencyTypeId: alarmTypeItem.ID!,
        subOrganisationIDForEmergencyMessage:
          alarmTypeItem.subOrganisationIDForEmergencyMessage!,
        type: 2,
        recipientIds: null,
        subject: null,
      };

      dispatch(sendAlarm(messageModel, location, navigate));
    } else if (alarmTypeItem.NoGroup && !alarmTypeItem.SkipMap) {
      //send to map screen
      to = `map/${ID}?NoGroup`;
      dispatch(setAlarmCreateModel(alarmTypeItem));
      navigate(to);
    } else if (!alarmTypeItem.NoGroup) {
      // send to group select
      to = `selectGroup/${ID}`;
      dispatch(setAlarmCreateModel(alarmTypeItem));
      navigate(to);
    }
  };

  return (
    <AlarmContainer
      color={alarmTypeItem.Color}
      onClick={handleNavigate}
      className="item"
    >
      <SNameContainer id={`${alarmTypeItem.ID}`}>
        <SName>
          {Names?.find((item) => item.Language === currentLang)?.Name}
        </SName>
        {!alarmOrgEqual && (
          <SSubName>
            {alarmTypeItem.SuborganizationID
              ? alarmTypeItem.SuborganizationName
              : alarmTypeItem.OrganizationName}
          </SSubName>
        )}
      </SNameContainer>
      {image && <img src={image} alt="" />}
    </AlarmContainer>
  );
}

const AlarmContainer = styled.div<any>`
  color: ${palette.white};
  text-decoration: none;
  background: ${(props) => props.color || palette.danger};
  border-radius: 10px;
  min-height: 5.25rem;
  padding: 0.6rem 1.4rem;
  cursor: pointer;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  img {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
  }
`;

const SNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
`;

const SName = styled.p`
  font-family: 'Roboto-Regular';
  font-style: normal;
  font-weight: 500;
  display: flex;
  align-items: center;
  font-size:18px;
  min-width: 250px;
}
`;

const SSubName = styled.p`
  font-family: 'Roboto-Regular';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  display: flex;
  align-items: center;
  font-size: 12px;
`;

export default AlarmType;
