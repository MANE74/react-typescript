import React from 'react';
import { Layout } from '../components/Layout/Layout';
import CreateLogNote from '../containers/LogNotes/CreateLogNote';

function CreateLogNotePage() {
  return (
    <Layout isMessageLayout message={'logNotes_create_screen'} to="/log-notes">
      <CreateLogNote />
    </Layout>
  );
}

export default CreateLogNotePage;
