import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import CreateChecklist from '../../containers/Checklists/CreateChecklist';

function StartChecklistPage() {
  const { id } = useParams();

  return (
    <Layout
      isMessageLayout
      message={'header_start_checklist'}
      to={`/checklist/${id}`}
      showBottomTabs
    >
      <CreateChecklist start id={id} />
    </Layout>
  );
}

export default StartChecklistPage;
