import { menuItemName } from '../../apis/mediaAPI';
import { BASE_URL } from '../../apis/utils/provider';

// [TODO]: need to update the links
export const tutorialLinks: Record<menuItemName, string> = {
  groups: '/groups',
  messages: '/chat',
  checklists: '/checklists',
  documents: '/documents',
  muster: '/imOk',
  profile: '/profile',
  group_alarm: '/group_alarm',
};

export const getHtmlready = (html: string | null) => {
  return html
    ?.replace(/{apiurl}/g, `${BASE_URL}/`)
    .replace(/<video /g, "<div class='video-wrapper'><video ")
    .replace(/<\/video>/g, '</video></div>');
};
