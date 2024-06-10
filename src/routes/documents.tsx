import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Documents } from '../containers/Documents/Documents';
import { selectUser, setUser } from '../containers/Login/LoginSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getItem } from '../utils/storage';
import { BrowseFolderPage } from './browseFolder';

export const DocumentsPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const isManager = user?.roles?.includes('DocumentsManager');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(setUser(getItem('user')));
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            isMessageLayout
            message="documents"
            to="/dashboard"
            showBottomTabs
            showDots={isManager}
            dotsCallBack={() => setIsOpen(!isOpen)}
          >
            <Documents
              isHeaderOptionsOpen={isOpen}
              setHeaderOptionsOpen={setIsOpen}
            />
          </Layout>
        }
      />
      <Route path="/:groupDocumentId" element={<BrowseFolderPage />} />
      <Route
        path="/:groupDocumentId/:folderId"
        element={<BrowseFolderPage />}
      />
    </Routes>
  );
};
