import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import {
  getChecklistName,
  setTempChecklistTasks,
} from '../../containers/Checklists/checklistsSlice';
import NewChecklist from '../../containers/Checklists/NewChecklist';
import { useAppDispatch, useAppSelector } from '../../hooks';

function NewChecklistPage() {
  const checklistName = useAppSelector(getChecklistName);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!checklistName) navigate('/checklists');
  }, [navigate, checklistName]);

  return (
    <Layout
      isMessageLayout
      message={checklistName}
      to="/checklists/create"
      showBottomTabs
      showDots
      dotsCallBack={() => setIsOpen(!isOpen)}
      backBtnCallBack={() => dispatch(setTempChecklistTasks(null))}
    >
      <NewChecklist
        isHeaderOptionsOpen={isOpen}
        setHeaderOptionsOpen={setIsOpen}
      />
    </Layout>
  );
}

export default NewChecklistPage;
