import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  clearSelectedGroups,
  isAlarmLoading,
  selectTypes,
  setIsLoading,
  setSelectedGroupType,
} from './AlarmSlice';
import { getEmergencyTypesAction } from './AlarmSlice/actionCreators';
import { EmergencyType } from './AlarmSlice/types';
import Loader from '../../components/Loader/Loader';
import styled from 'styled-components';
import NoAlarms from '../../assets/imgs/NotFound/no-result.svg';
import AlarmType from '../../components/AlarmItem/AlarmType';
import { getItem } from '../../utils/storage';
import { Page } from '../../components/Page/Page';
import { ReactComponent as Arrow } from '../../assets/imgs/alarms/arrow.svg';
import { selectGroups } from '../GroupsList/groupsSlice';

function Alarm() {
  const dispatch = useAppDispatch();

  const alarmTypes = useAppSelector(selectTypes);
  const isLoading = useAppSelector(isAlarmLoading);
  const groups = useAppSelector(selectGroups);

  const [alarmTypesState, setAlarmTypesState] = useState<EmergencyType[]>([]);

  // ref used to limit the amount of alarms displayed at once
  const alarmRef = useRef<HTMLDivElement>(null);
  const topArrowRef = useRef<HTMLDivElement>(null);
  const bottomArrowRef = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(18);
  // setup ref to track limit, because setTimeout does not use the updated state value
  const limitRef = useRef(limit);
  limitRef.current = limit;
  const [alarmOrgEqual, setAlarmOrgEqual] = useState(false);

  useEffect(() => {
    dispatch(getEmergencyTypesAction());
    // Clear selected groups and the type in store
    dispatch(clearSelectedGroups());
    dispatch(setSelectedGroupType([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps

    checkScrollLoop();
  }, [dispatch]);

  useEffect(() => {
    if (!_.isEmpty(alarmTypes)) {
      getUserAlarmTypes();
    }
  }, [alarmTypes]);

  useEffect(() => {
    if (!alarmRef?.current || !bottomArrowRef?.current) return;

    if (
      alarmRef.current.offsetHeight + alarmRef.current.scrollTop >=
      alarmRef.current.scrollHeight
    ) {
      bottomArrowRef.current.style.visibility = 'hidden';
    }
  }, [alarmTypesState]);

  const getUserAlarmTypes = () => {
    dispatch(setIsLoading(true));

    //Alarms can belong either to account or subaccount
    const organizationAlarms = _.filter(alarmTypes, (alarm) =>
      _.isNil(alarm.SuborganizationID)
    );
    const subOrganizationAlarms = _.filter(
      alarmTypes,
      (alarm) => !_.isNil(alarm.SuborganizationName)
    );
    const orgGroups = _.filter(groups, (grp) =>
      _.isNull(grp.subOrganizationID)
    );

    const linkedSubOrganizationsWithGroupsAlarms: any[] = [];
    var delIndexes: number[] = [];

    _.forEach(organizationAlarms, (alarm) => {
      if (!_.isNil(alarm.linkedSubOrganizationsWithGroups)) {
        _.map(alarm.linkedSubOrganizationsWithGroups, (org: any) => {
          let newOrg = {
            Names: alarm.Names,
            subtitle: org.name.trim(),
            Icon: alarm.Icon,
            Color: alarm.Color,
            Order: 0,
            SkipMap: org.skipMap,
            Groups: org.groups,
            NoGroup: org.noGroup,
            SuborganizationID: org.id,
            SuborganizationName: org.name,
            ID: alarm.ID,
            subOrganisationIDForEmergencyMessage: org.id,
          };
          linkedSubOrganizationsWithGroupsAlarms.push(newOrg);
        });
        if (
          !orgGroups.find((grp) => grp.organizationID === alarm.OrganizationID)
        ) {
          delIndexes.push(alarm.ID!);
        }
      }
    });

    // If an account alarm has hideFromMainAccountUsers === true, it should not be listed in account alarms.
    var filteredOrganizationsAlarms = _.filter(
      organizationAlarms,
      (alarm) => !alarm.hideFromMainAccountUsers
    );

    filteredOrganizationsAlarms = _.filter(
      filteredOrganizationsAlarms,
      (alarm) => !delIndexes.includes(alarm.ID!)
    );

    const fullSubOrgAlarms = _.concat(
      linkedSubOrganizationsWithGroupsAlarms,
      subOrganizationAlarms
    );

    filteredOrganizationsAlarms.sort(
      (a, b) =>
        a.OrganizationName!.localeCompare(b.OrganizationName!) ||
        a.Order! - b.Order!
    );
    fullSubOrgAlarms.sort(
      (a, b) =>
        a.SuborganizationName.localeCompare(b.SuborganizationName) ||
        a.Order - b.Order
    );

    const newArr = _.concat(filteredOrganizationsAlarms, fullSubOrgAlarms);

    const nameArr = newArr.map(
      (item) => item.OrganizationName || item.SuborganizationName
    );

    const orgsEqual = nameArr.every((val, i, arr) => val === arr[0]);

    setAlarmOrgEqual(orgsEqual);

    setAlarmTypesState(newArr);
    dispatch(setIsLoading(false));
  };

  const checkScrollLoop = () => {
    setTimeout(checkScrollLoop, 500);
    checkScroll();
  };

  const checkScroll = () => {
    const _alarmRef = alarmRef.current;
    if (!_alarmRef) return;
    if (
      _alarmRef.offsetHeight + _alarmRef.scrollTop >=
      _alarmRef.scrollHeight
    ) {
      setLimit(limitRef.current + 18);

      setTimeout(() => {
        if (!bottomArrowRef.current) return;
        if (
          _alarmRef!.offsetHeight + _alarmRef!.scrollTop >=
          _alarmRef!.scrollHeight
        ) {
          bottomArrowRef.current.style.visibility = 'hidden';
          bottomArrowRef.current.style.opacity = '0';
        } else {
          bottomArrowRef.current.style.visibility = 'visible';
          bottomArrowRef.current.style.opacity = '1';
        }
      }, 1200);
    }

    if (!topArrowRef.current) return;
    topArrowRef.current.style.visibility = 'hidden';
    topArrowRef.current.style.opacity = '0';
    if (_alarmRef.scrollTop > 0) {
      topArrowRef.current.style.visibility = 'visible';
      topArrowRef.current.style.opacity = '1';
    }
  };

  const handleScroll = (top: boolean) => {
    const scrollBy = top ? -250 : 250;
    if (alarmRef.current) {
      alarmRef.current.scrollBy({ top: scrollBy, left: 0, behavior: 'smooth' });
    }
  };

  // get the language so we know which alarm name to display
  const currentLang = getItem('language');

  if (isLoading) {
    return <Loader />;
  }

  if (alarmTypesState.length === 0) {
    return (
      <Page>
        <NoAlarmWrapper>
          <img src={NoAlarms} alt="" />
          <p>You don’t have any alarms</p>
        </NoAlarmWrapper>
      </Page>
    );
  }

  return (
    <SPage>
      <AlarmWrapper ref={alarmRef}>
        <ScrollMoreTop onClick={() => handleScroll(true)} ref={topArrowRef}>
          <Arrow />
        </ScrollMoreTop>
        {alarmTypesState.slice(0, limit).map((item, key) => (
          <AlarmType
            alarmOrgEqual={alarmOrgEqual}
            key={key}
            alarmTypeItem={item}
            currentLang={currentLang!}
          />
        ))}
        <ScrollMoreBottom
          onClick={() => handleScroll(false)}
          ref={bottomArrowRef}
        >
          <Arrow />
        </ScrollMoreBottom>
      </AlarmWrapper>
    </SPage>
  );
}

const SPage = styled(Page)`
  padding: 0 1.25rem;
`;

const NoAlarmWrapper = styled.div`
  padding-bottom: 5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    mix-blend-mode: normal;
    opacity: 0.84;
    font-weight: 500;
    font-size: 16px;
    margin-top: 1.25rem;
  }
`;

const AlarmWrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 1.25rem 0 2.7rem 0;
  display: flex;
  flex-direction: column;

  .item + * {
    margin-top: 10px;
  }

  /* vertical scrolling + hide scroller bar  */
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ScrollMore = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 23.5rem;
  height: 2.5rem;
  cursor: pointer;

  background: linear-gradient(
    0deg,
    rgba(33, 43, 61, 0) 0%,
    rgba(1, 26, 50, 0.67) 100%
  );
  backdrop-filter: blur(2px);

  transition: visibility 0.15s linear, opacity 0.15s linear;
`;

const ScrollMoreTop = styled(ScrollMore)`
  opacity: 0;
  top: 4.8rem;
  visibility: hidden;
`;

const ScrollMoreBottom = styled(ScrollMore)`
  opacity: 1;
  transform: rotate(180deg);
  bottom: 0;
`;

export default Alarm;
