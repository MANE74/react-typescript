import { Layout } from '../components/Layout/Layout';
import { LogNotes } from '../containers/LogNotes/LogNotes';

export const LogNotesPage = () => {
  return (
    <Layout isMessageLayout to="/dashboard" message={'logNotes'} showBottomTabs>
      <LogNotes />
    </Layout>
  );
};
