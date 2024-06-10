import { ReactComponent as AlarmIcon } from '../../assets/imgs/dashBoard/dashBoard-alarm.svg';
import { ReactComponent as AlertIcon } from '../../assets/imgs/dashBoard/dashBoard-alert.svg';
import { ReactComponent as CheckLsitIcon } from '../../assets/imgs/dashBoard/dashBoard-checkList.svg';
import { ReactComponent as DocumentIcon } from '../../assets/imgs/dashBoard/dashBoard-document.svg';
import { ReactComponent as GroupsIcon } from '../../assets/imgs/dashBoard/dashBoard-groups.svg';
import { ReactComponent as IamOkayIcon } from '../../assets/imgs/dashBoard/dashBoard-iamOkay.svg';
import { ReactComponent as MessageIcon } from '../../assets/imgs/dashBoard/dashBoard-message.svg';
import { ReactComponent as NewsIcon } from '../../assets/imgs/dashBoard/dashBoard-news.svg';
import { ReactComponent as WwwIcon } from '../../assets/imgs/dashBoard/dashBoard-www.svg';
import { ReactComponent as BroadCastIcon } from '../../assets/imgs/dashBoard/dashBoard-broadCast.svg';
import { ReactComponent as CallIcon } from '../../assets/imgs/dashBoard/dashBoard-call.svg';
import { ReactComponent as HoldingStatmentIcon } from '../../assets/imgs/dashBoard/dashBoard-holdingStatment.svg';
import { ReactComponent as LogFileIcon } from '../../assets/imgs/dashBoard/dashBoard-logFile.svg';
import { ReactComponent as OverViewIcon } from '../../assets/imgs/dashBoard/dashBoard-overView.svg';
import { ReactComponent as PersonalAlarmIcon } from '../../assets/imgs/dashBoard/dashBoard-personalAlarm.svg';
import { ReactComponent as PanicIcon } from '../../assets/imgs/dashBoard/dashBoard-panic.svg';
import { ReactComponent as AlonWokrkerIcon } from '../../assets/imgs/dashBoard/dashBoard-alone-worker.svg';
import { getItem } from '../../utils/storage';
import { User } from '../../apis/authAPI';

const user: User = getItem('user');
const organizationWebsite = user?.organizationWebsite;

export const menu: Record<string, MenuItem> = {
  groups: { Icon: GroupsIcon, tx: 'home_groups', navLink: 'groups' },
  messages: {
    Icon: MessageIcon,
    tx: 'home_messages',
    navLink: 'chat',
  },
  news: { Icon: NewsIcon, tx: 'home_news', navLink: 'news' },
  checklists: {
    Icon: CheckLsitIcon,
    tx: 'home_checklists',
    navLink: 'checklists',
  },
  documents: { Icon: DocumentIcon, tx: 'home_documents', navLink: 'documents' },
  muster: { Icon: IamOkayIcon, tx: 'home_muster', navLink: 'imOk' },
  organization_website: {
    Icon: WwwIcon,
    tx: 'home_organizationWebsite',
    navLink: organizationWebsite || '/',
  },
  alarm: { Icon: AlarmIcon, tx: 'home_alarm', navLink: 'alarm' },
  // roles
  HoldingStatement: {
    Icon: HoldingStatmentIcon,
    tx: 'home_holdingStatement',
    navLink: 'holding-statement',
  },
  oncall_alert: {
    Icon: AlertIcon,
    tx: 'home_onCallAlerts',
    navLink: 'onCallAlert',
  },
  Overview: { Icon: OverViewIcon, tx: 'home_overview', navLink: 'overview' },
  ExternalContacts: {
    Icon: CallIcon,
    tx: 'home_externalContacts',
    navLink: 'cec',
  },
  LogNotes: { Icon: LogFileIcon, tx: 'home_logNotes', navLink: 'log-notes' },
  Informationsutskick: {
    Icon: BroadCastIcon,
    tx: 'home_informationsutskick',
    navLink: 'broadcast',
  },
  group_alarm_work_alone: {
    Icon: AlonWokrkerIcon,
    navLink: 'aloneWorker',
    tx: 'lone_worker_timer'
  },
  group_alarm: {
    Icon: PanicIcon,
    navLink: 'panic',
    tx: 'home_panic_button'
  }
};

export interface MenuItem {
  tx: string;
  navLink: string;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}
