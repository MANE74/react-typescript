import React from 'react';
import { Layout } from '../../components/Layout/Layout';
import Checklists from '../../containers/Checklists/Checklists';

function ChecklistsPage() {
  return (
    <Layout
      isMessageLayout
      message={'home_checklists'}
      to="/dashboard"
      showBottomTabs
    >
      <Checklists />
    </Layout>
  );
}

export default ChecklistsPage;
