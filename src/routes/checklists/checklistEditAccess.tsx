import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import CreateChecklist from '../../containers/Checklists/CreateChecklist';

function ChecklistEditAccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const data: any = location.state;

  return (
    <Layout
      isMessageLayout
      message={'checklist_edit_acces'}
      to={data?.fromList ? '/checklists' : `/checklist/${id}`}
      showBottomTabs
    >
      <CreateChecklist edit id={id} />
    </Layout>
  );
}

export default ChecklistEditAccessPage;
