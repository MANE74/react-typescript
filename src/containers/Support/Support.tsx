import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../utils/translate';
import { ReactComponent as RightArrow } from '../../assets/imgs/general/right-arrow.svg';
import { ReactComponent as Qustion } from '../../assets/imgs/support/support-qustion.svg';
import { useAppSelector } from '../../hooks';
import { selectOrganizationExternalLink } from '../Login/LoginSlice';
import { Layout } from '../../components/Layout/Layout';
import { Page } from '../../components/Page/Page';
import { STab } from '../Sidebar/SidebarElement';
import { SElementContainer } from '../Sidebar/Sidebar';

export const Support = () => {
  const externalLink = useAppSelector(selectOrganizationExternalLink);

  return (
    <Layout isMessageLayout message="support" to="/sidebar" showBottomTabs>
      <Page>
        <SElementContainer>
          {/* hidden for now untill the client provide new tutorials  */}
          {/* <STab as={Link} to={'/video-tutorials'}>
            <Settings />
            <p>{translate('profile_support_video_tutorials')}</p>
            <RightArrow />
          </STab> */}
          <STab as={Link} to={'/internal-support'}>
            <Qustion />
            <p>{translate('profile_support_internal_support')}</p>
            <RightArrow />
          </STab>
          {externalLink && (
            <STab
              as={'a'}
              target="_blank"
              href={externalLink}
              rel="noreferrer noopener"
            >
              <Qustion />
              <p>{translate('profile_support_general_support')}</p>
              <RightArrow />
            </STab>
          )}
        </SElementContainer>
      </Page>
    </Layout>
  );
};
