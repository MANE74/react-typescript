import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { BrowseFolder } from '../containers/BrowseFolder/BrowseFolder';
import {
  selectDocumentGroupById,
  selectFolderById,
} from '../containers/Documents/documentsSlice';
import { selectUser } from '../containers/Login/LoginSlice';

import { useAppSelector } from '../hooks';

export const BrowseFolderPage = () => {
  const navigate = useNavigate();

  const { folderId, groupDocumentId } = useParams();

  const groupFolder = useAppSelector(
    selectDocumentGroupById(+groupDocumentId!)
  );

  const user = useAppSelector(selectUser);
  const isManager = user?.roles?.includes('DocumentsManager');

  const folder = useAppSelector(selectFolderById(+folderId!));

  const handleDots = useCallback(() => {
    navigate('/documents/edit/managOffline');
  }, [folderId, groupDocumentId]);

  return (
    <Layout
      isMessageLayout
      message={folder?.Name || 'documents'}
      to={-1}
      subMessageText={groupFolder?.name}
      dotsCallBack={handleDots}
      showDots={isManager}
      showBottomTabs
    >
      <BrowseFolder />
    </Layout>
  );
};
