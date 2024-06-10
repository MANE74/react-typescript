import { Layout } from '../../components/Layout/Layout';
import Alarm from '../../containers/Alarm/Alarm';
import { translate } from '../../utils/translate';

function AlarmPage() {
  return (
    <Layout
      isMessageLayout
      to="/dashboard"
      backBtn
      message={`alarm_send_alarm`}
      subMessageText={`${translate(`alarm_step`)} 1 ${translate(`alarm_of`)} 3`}
    >
      <Alarm />
    </Layout>
  );
}

export default AlarmPage;
