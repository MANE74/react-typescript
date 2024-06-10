import React from 'react';
import Checklist from '../../containers/Checklists/Checklist';
import { Layout } from '../../components/Layout/Layout';
import { useLocation } from 'react-router-dom';

function ChecklistPage() {
  const location = useLocation();
  const data: any = location.state;

  return (
    <Layout
      isMessageLayout
      message="checkListInfo_title"
      to={data?.fromOverview ? '/overview' : '/checklists'}
      showBottomTabs
      showDots
    >
      <Checklist />
    </Layout>
  );
}

export default ChecklistPage;
