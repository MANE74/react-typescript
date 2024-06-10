import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import MemberSettings from '../containers/MemberSettings/MemberSettings';

export const IAmOkMemberSettingsPage = () => {
  const { imOkId } = useParams();
  return (
    <Layout
      isMessageLayout
      message={`groups_groupMember`}
      to={`/muster/${imOkId}`}
      showBottomTabs
    >
      <MemberSettings isIamOkMemberSettings />
    </Layout>
  );
};
