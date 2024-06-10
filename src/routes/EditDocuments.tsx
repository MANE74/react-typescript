import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { EditDocuments } from '../containers/EditDocuments/EditDocuments';

export const EditDocumentsPage = () => {
  const { type } = useParams();

  return (
    <Layout
      showBottomTabs
      isMessageLayout
      to="/documents"
      message={
        type === 'createFolder'
          ? 'add_folder_screen_heading'
          : type === 'managOffline'
          ? 'documents_manage_offline_files'
          : type === 'addDocument'
          ? 'add_folder_screen_heading'
          : type === 'editAccess'
          ? 'checklist_edit_acces'
          : '404'
      }
    >
      <EditDocuments />
    </Layout>
  );
};
