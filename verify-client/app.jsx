import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './components/Routes';
import {Provider} from 'react-redux';

import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import configureStore from './redux/store';
// import * as auth from './actions/auth';
import { loadCredentials } from './actions/auth';

import axios from 'axios';

// Make axios aware of the base path.
axios.defaults.baseURL = window.config.BASE_URL;

const history = useRouterHistory(createHistory)({
    basename: window.config.BASE_PATH || ''
  });
const store = configureStore([ routerMiddleware(history) ], { });
const reduxHistory = syncHistoryWithStore(history, store);

store.dispatch(loadCredentials());

ReactDOM.render(
  <Provider store={store}>
    {Routes(reduxHistory)}
  </Provider>,
  document.getElementById('app')
);

// Show the developer tools.
if (process.env.NODE_ENV !== 'production') {
  console.log("Trying to launch devTools");
  const showDevTools = require('./showDevTools'); // eslint-disable-line global-require

  showDevTools(store);
}
