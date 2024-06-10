import { Layout } from '../../components/Layout/Layout';
import AlarmSelectGroup from '../../containers/Alarm/AlarmSelectGroup';
import { translate } from '../../utils/translate';

function AlarmSelectGroupPage() {
  return (
    <Layout
      isMessageLayout
      to="/alarm"
      backBtn
      message={`alarm_send_alarm`}
      subMessageText={`${translate(`alarm_step`)} 2 ${translate(`alarm_of`)} 3`}
    >
      <AlarmSelectGroup />
    </Layout>
  );
}

export default AlarmSelectGroupPage;
