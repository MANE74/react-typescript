import React from 'react';
import {
  SidebarSection,
  SSection,
  SSidebarWrapper,
} from '../../../containers/Sidebar/Sidebar';
import { Layout } from '../../Layout/Layout';
import SettingsIcon from '../../../assets/imgs/general/settings.svg';
import QuestionIcon from '../../../assets/imgs/general/question.svg';
import SidebarElement from '../../../containers/Sidebar/SidebarElement';

const supportElements: SidebarSection[] = [
  {
    name: 'profile_support_video_tutorials',
    icon: SettingsIcon,
    to: '/video-tutorials',
  },
  {
    name: 'profile_support_internal_support',
    icon: QuestionIcon,
    to: '/internal-support',
  },
  {
    name: 'profile_support_general_support',
    icon: QuestionIcon,
    onClick: () => {
      window.location.href = 'https://cosafe.se/';
    },
  },
];

function Support() {
  return (
    <Layout isMessageLayout message="support" to="/sidebar" showBottomTabs>
      <SSidebarWrapper>
        <SSection>
          {supportElements.map((element, key) => (
            <SidebarElement
              key={key}
              name={element.name}
              icon={element.icon}
              to={element.to}
              onClick={element.onClick}
            />
          ))}
        </SSection>
      </SSidebarWrapper>
    </Layout>
  );
}

export default Support;
