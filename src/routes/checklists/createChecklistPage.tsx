import React from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import CreateChecklist from '../../containers/Checklists/CreateChecklist';

function CreateChecklistPage() {
  const location = useLocation();
  const data: any = location.state;

  return (
    <Layout
      isMessageLayout
      message={'checklist_create_checklist'}
      to={data?.fromNew ? '/checklists/new' : '/checklists'}
      showBottomTabs
    >
      <CreateChecklist />
    </Layout>
  );
}

export default CreateChecklistPage;
