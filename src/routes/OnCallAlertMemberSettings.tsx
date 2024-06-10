import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import MemberSettings from '../containers/MemberSettings/MemberSettings';

export const OnCallAlertMemberSettingsPage = () => {
  const { onCallAlertId } = useParams();
  return (
    <Layout
      isMessageLayout
      message={`groups_groupMember`}
      to={`/oncall/${onCallAlertId}`}
      showBottomTabs
    >
      <MemberSettings isOnCallAlertMemberSettings />
    </Layout>
  );
};
