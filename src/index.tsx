import React from 'react';
import ReactDOM from 'react-dom';
import { ConfirmationServiceProvider } from './utils/ConfirmationServiceContext/confirmationContext';
import * as serviceWorker from './serviceWorker';
import App from './containers/App/App';
import { Provider } from 'react-redux';
import { store } from './store';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfirmationServiceProvider>
        <App />
      </ConfirmationServiceProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
