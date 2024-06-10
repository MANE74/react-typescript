import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import AlarmMap from '../../containers/Alarm/AlarmMap';
import { translate } from '../../utils/translate';

function AlarmMapPage() {
  const { alarmId } = useParams();
  const { search } = useLocation();

  return (
    <Layout
      isMessageLayout
      message={`alarm_send_alarm`}
      backBtn
      to={search === '?NoGroup' ? `/alarm` : `/alarm/selectGroup/${alarmId}`}
      subMessageText={`${translate(`alarm_step`)} 3 ${translate(`alarm_of`)} 3`}
    >
      <AlarmMap />
    </Layout>
  );
}

export default AlarmMapPage;
