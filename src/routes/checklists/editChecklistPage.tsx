import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { getChecklistName } from '../../containers/Checklists/checklistsSlice';
import NewChecklist from '../../containers/Checklists/NewChecklist';
import { useAppSelector } from '../../hooks';

function EditChecklistPage() {
  const location = useLocation();
  const data: any = location.state;

  const checklistName = useAppSelector(getChecklistName);
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Layout
      isMessageLayout
      message={checklistName}
      to={
        data?.fromList
          ? '/checklists'
          : data?.fromItem
          ? `/checklist/${id}`
          : '/checklists/create'
      }
      showBottomTabs
      showDots
      dotsCallBack={() => setIsOpen(!isOpen)}
    >
      <NewChecklist
        id={id}
        edit
        isHeaderOptionsOpen={isOpen}
        setHeaderOptionsOpen={setIsOpen}
      />
    </Layout>
  );
}

export default EditChecklistPage;
