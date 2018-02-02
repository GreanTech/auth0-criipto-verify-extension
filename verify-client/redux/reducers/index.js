import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { verifyTenants, verifyLinks, verifyDomains, verifyApplications, checkDomainAvailable } from './verify'
import { auth } from './auth';
import { connections } from './connections';

function lastAction(state = null, action) {
    return action;
}

const state = {
  routing: routerReducer,
  auth,
  verifyTenants,
  verifyLinks,
  checkDomainAvailable,
  verifyDomains,
  verifyApplications,
  connections,
  lastAction,
  form: formReducer
};

export default combineReducers(state);
    